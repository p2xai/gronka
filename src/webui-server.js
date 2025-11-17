import express from 'express';
import path from 'path';
import axios from 'axios';
import { createLogger } from './utils/logger.js';
import { webuiConfig } from './utils/config.js';
import { ConfigurationError } from './utils/errors.js';

// Initialize logger
const logger = createLogger('webui');

// Configuration from centralized config
const {
  webuiPort: WEBUI_PORT,
  webuiHost: WEBUI_HOST,
  mainServerUrl: MAIN_SERVER_URL,
} = webuiConfig;

// Stats auth credentials (optional - only needed if main server requires auth)
const STATS_USERNAME = process.env.STATS_USERNAME || null;
const STATS_PASSWORD = process.env.STATS_PASSWORD || null;

// Build auth header if credentials are provided
function getAuthHeaders() {
  const headers = {};
  if (STATS_USERNAME && STATS_PASSWORD) {
    const credentials = Buffer.from(`${STATS_USERNAME}:${STATS_PASSWORD}`).toString('base64');
    headers.Authorization = `Basic ${credentials}`;
  }
  return headers;
}

const app = express();

// Request logging middleware
app.use((req, res, next) => {
  const startTime = Date.now();
  let logged = false;

  // Log response when finished (most reliable method)
  const logResponse = () => {
    if (logged) return;
    logged = true;
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode || 200;
    logger.info(
      `${req.method} ${req.path} - ${statusCode} - ${duration}ms - ${req.ip || req.connection.remoteAddress}`
    );
  };

  // Intercept response methods as backup (in case finish event doesn't fire)
  const originalSend = res.send;
  const originalSendFile = res.sendFile;
  const originalJson = res.json;

  res.send = function (_data) {
    logResponse();
    return originalSend.apply(this, arguments);
  };

  res.sendFile = function (...args) {
    logResponse();
    return originalSendFile.apply(this, args);
  };

  res.json = function (_data) {
    logResponse();
    return originalJson.apply(this, arguments);
  };

  // Primary logging on response finish (catches all cases)
  res.on('finish', logResponse);

  next();
});

// Get absolute path to public directory
const publicPath = path.resolve(process.cwd(), 'src', 'public');

// Serve static files from public directory
app.use(express.static(publicPath));

// Dashboard route
app.get('/', (req, res) => {
  logger.info('Dashboard page requested');
  res.sendFile(path.join(publicPath, 'index.html'));
});

// Proxy endpoint to fetch stats from main server
app.get('/api/stats', async (req, res) => {
  try {
    logger.debug('Fetching stats from main server');
    const response = await axios.get(`${MAIN_SERVER_URL}/stats`, {
      timeout: 5000,
      headers: getAuthHeaders(),
    });
    res.json(response.data);
  } catch (error) {
    logger.error('Failed to fetch stats from main server:', error);
    res.status(500).json({
      error: 'Failed to fetch stats',
      message: error.message,
    });
  }
});

// Proxy endpoint to fetch health from main server
app.get('/api/health', async (req, res) => {
  try {
    logger.debug('Fetching health from main server');
    const response = await axios.get(`${MAIN_SERVER_URL}/health`, {
      timeout: 5000,
      headers: getAuthHeaders(),
    });
    res.json(response.data);
  } catch (error) {
    logger.error('Failed to fetch health from main server:', error);
    res.status(500).json({
      error: 'Failed to fetch health',
      message: error.message,
    });
  }
});

// Validate configuration
try {
  // Config validation happens during import
  if (!WEBUI_PORT || !MAIN_SERVER_URL) {
    throw new ConfigurationError('Required WebUI configuration missing');
  }
} catch (error) {
  if (error instanceof ConfigurationError) {
    logger.error('Configuration error:', error.message);
  } else {
    logger.error('Failed to load configuration:', error);
  }
  process.exit(1);
}

// Start server
app.listen(WEBUI_PORT, WEBUI_HOST, () => {
  logger.info(`webui server running on http://${WEBUI_HOST}:${WEBUI_PORT}`);
  logger.info(`dashboard: http://${WEBUI_HOST}:${WEBUI_PORT}`);
  logger.info(`main server: ${MAIN_SERVER_URL}`);
});

// Handle errors
app.on('error', error => {
  logger.error('WebUI error:', error);
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully...');
  process.exit(0);
});

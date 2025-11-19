import { Client, GatewayIntentBits, Events } from 'discord.js';
import { createLogger } from './utils/logger.js';
import { botConfig } from './utils/config.js';
import { ConfigurationError } from './utils/errors.js';
import { trackUser, initializeUserTracking } from './utils/user-tracking.js';
import { handleStatsCommand } from './commands/stats.js';
import { handleConfigCommand } from './commands/config.js';
import { handleDownloadCommand, handleDownloadContextMenuCommand } from './commands/download.js';
import { handleOptimizeCommand, handleOptimizeContextMenuCommand } from './commands/optimize.js';
import { handleConvertCommand, handleConvertContextMenu } from './commands/convert.js';
import { handleAdvancedContextMenuCommand } from './commands/convert-advanced.js';
import { handleModalSubmit } from './handlers/modals.js';

// Initialize logger
const logger = createLogger('bot');

// Configuration from centralized config
const {
  discordToken: DISCORD_TOKEN,
  clientId: CLIENT_ID,
  gifStoragePath: GIF_STORAGE_PATH,
  cdnBaseUrl: CDN_BASE_URL,
} = botConfig;

// Store attachment info for modal submissions: customId -> { attachment, attachmentType, adminUser, preDownloadedBuffer }
const modalAttachmentCache = new Map();

// Clean up modal cache entries older than 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of modalAttachmentCache.entries()) {
    if (value.timestamp && now - value.timestamp > 5 * 60 * 1000) {
      modalAttachmentCache.delete(key);
    }
  }
}, 60 * 1000); // Run cleanup every minute

// Create Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages, // Required for DM support
    GatewayIntentBits.MessageContent, // Required to access attachments
  ],
});

// Track bot start time for uptime
let botStartTime = null;

// Event handlers
client.once(Events.ClientReady, async readyClient => {
  botStartTime = Date.now();
  await initializeUserTracking();
  readyClient.user.setPresence({ status: 'dnd' });
  logger.info(`bot logged in as ${readyClient.user.tag}`);
  logger.info(`gif storage: ${GIF_STORAGE_PATH}`);
  logger.info(`cdn url: ${CDN_BASE_URL}`);
});

client.on(Events.InteractionCreate, async interaction => {
  logger.debug(
    `Received interaction: ${interaction.type} from user ${interaction.user.id} (${interaction.user.tag})`
  );
  // Track user interaction
  await trackUser(interaction.user.id);
  if (interaction.isModalSubmit()) {
    await handleModalSubmit(interaction, modalAttachmentCache);
  } else if (interaction.isMessageContextMenuCommand()) {
    // Route to appropriate handler based on command name
    if (interaction.commandName === 'convert to gif (advanced)') {
      await handleAdvancedContextMenuCommand(interaction, modalAttachmentCache);
    } else if (interaction.commandName === 'download') {
      await handleDownloadContextMenuCommand(interaction);
    } else if (interaction.commandName === 'optimize') {
      await handleOptimizeContextMenuCommand(interaction, modalAttachmentCache);
    } else if (interaction.commandName === 'convert to gif') {
      await handleConvertContextMenu(interaction);
    }
  } else if (interaction.isChatInputCommand()) {
    const commandName = interaction.commandName;

    if (commandName === 'stats') {
      await handleStatsCommand(interaction, botStartTime);
    } else if (commandName === 'download') {
      await handleDownloadCommand(interaction);
    } else if (commandName === 'config') {
      await handleConfigCommand(interaction);
    } else if (commandName === 'optimize') {
      await handleOptimizeCommand(interaction);
    } else if (commandName === 'convert') {
      await handleConvertCommand(interaction);
    }
  }
});

client.on(Events.Error, error => {
  logger.error('Discord error:', error);
});

// Validate configuration
try {
  // Config validation happens during import, but check here for clarity
  if (!DISCORD_TOKEN || !CLIENT_ID) {
    throw new ConfigurationError('Required configuration missing');
  }
} catch (error) {
  if (error instanceof ConfigurationError) {
    logger.error('Configuration error:', error.message);
  } else {
    logger.error('Failed to load configuration:', error);
  }
  process.exit(1);
}

// Start bot
logger.info('Starting Discord bot...');
client.login(DISCORD_TOKEN).catch(error => {
  logger.error('an error occurred:', error);
  process.exit(1);
});

// Log shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully...');
  process.exit(0);
});

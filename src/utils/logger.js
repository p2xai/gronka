import fs from 'fs/promises';
import path from 'path';

const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

const LOG_LEVEL_NAMES = {
  0: 'DEBUG',
  1: 'INFO',
  2: 'WARN',
  3: 'ERROR',
};

// Format timestamp to seconds precision (removes milliseconds)
export function formatTimestampSeconds(date = new Date()) {
  return date.toISOString().replace(/\.\d{3}Z$/, 'Z');
}

class Logger {
  constructor(component, logDir = './logs', logLevel = 'INFO', rotation = 'daily') {
    this.component = component;
    this.logDir = path.resolve(process.cwd(), logDir);
    this.rotation = rotation;
    this.currentDate = this.getDateString();
    this.currentLogFile = null;
    this.combinedLogFile = null;

    const levelName = logLevel.toUpperCase();
    this.logLevel = LOG_LEVELS[levelName] !== undefined ? LOG_LEVELS[levelName] : LOG_LEVELS.INFO;

    this.init();
  }

  getDateString() {
    const now = new Date();
    return now.toISOString().split('T')[0];
  }

  async init() {
    try {
      await fs.mkdir(this.logDir, { recursive: true });
      await this.initializeLogFiles();
    } catch (error) {
      console.error(`Failed to initialize logger for ${this.component}:`, error);
    }
  }

  async initializeLogFiles() {
    const dateStr = this.getDateString();

    if (this.rotation === 'daily') {
      this.currentLogFile = path.join(this.logDir, `${this.component}-${dateStr}.log`);
      this.combinedLogFile = path.join(this.logDir, `combined-${dateStr}.log`);
    } else {
      this.currentLogFile = path.join(this.logDir, `${this.component}.log`);
      this.combinedLogFile = path.join(this.logDir, 'combined.log');
    }

    this.currentDate = dateStr;
  }

  async checkRotation() {
    if (this.rotation === 'daily') {
      const today = this.getDateString();
      if (today !== this.currentDate) {
        await this.initializeLogFiles();
      }
    }
  }

  formatMessage(level, message, ...args) {
    const timestamp = formatTimestampSeconds();
    const levelStr = LOG_LEVEL_NAMES[level].padEnd(5);
    const formattedArgs =
      args.length > 0
        ? ' ' +
          args.map(arg => (typeof arg === 'object' ? JSON.stringify(arg) : String(arg))).join(' ')
        : '';
    return `[${timestamp}] [${levelStr}] ${message}${formattedArgs}`;
  }

  async writeToFile(filePath, message) {
    try {
      await fs.appendFile(filePath, message + '\n', 'utf8');
    } catch (error) {
      console.error(`Failed to write to log file ${filePath}:`, error);
    }
  }

  async log(level, message, ...args) {
    if (level < this.logLevel) {
      return;
    }

    await this.checkRotation();

    const formattedMessage = this.formatMessage(level, message, ...args);

    console.log(formattedMessage);

    if (this.currentLogFile) {
      await this.writeToFile(this.currentLogFile, formattedMessage);
    }

    if (this.combinedLogFile) {
      await this.writeToFile(this.combinedLogFile, formattedMessage);
    }
  }

  debug(message, ...args) {
    return this.log(LOG_LEVELS.DEBUG, message, ...args);
  }

  info(message, ...args) {
    return this.log(LOG_LEVELS.INFO, message, ...args);
  }

  warn(message, ...args) {
    return this.log(LOG_LEVELS.WARN, message, ...args);
  }

  error(message, ...args) {
    return this.log(LOG_LEVELS.ERROR, message, ...args);
  }
}

export function createLogger(component) {
  const logDir = process.env.LOG_DIR || './logs';
  const logLevel = process.env.LOG_LEVEL || 'INFO';
  const rotation = process.env.LOG_ROTATION || 'daily';
  return new Logger(component, logDir, logLevel, rotation);
}

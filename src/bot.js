import { Client, GatewayIntentBits, Events, MessageFlags, EmbedBuilder } from 'discord.js';
import axios from 'axios';
import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import { convertToGif, getVideoMetadata, convertImageToGif } from './utils/video-processor.js';
import { gifExists, getGifPath, cleanupTempFiles, getStorageStats } from './utils/storage.js';
import { createLogger } from './utils/logger.js';
import { botConfig } from './utils/config.js';
import { validateUrl, sanitizeFilename, validateFileExtension } from './utils/validation.js';
import { ConfigurationError, NetworkError, ValidationError } from './utils/errors.js';

// Initialize logger
const logger = createLogger('bot');

// Configuration from centralized config
const {
  discordToken: DISCORD_TOKEN,
  clientId: CLIENT_ID,
  adminUserIds: ADMIN_USER_IDS,
  gifStoragePath: GIF_STORAGE_PATH,
  cdnBaseUrl: CDN_BASE_URL,
  maxGifWidth: MAX_GIF_WIDTH,
  maxGifDuration: MAX_GIF_DURATION,
  defaultFps: DEFAULT_FPS,
  maxVideoSize: MAX_VIDEO_SIZE,
  maxImageSize: MAX_IMAGE_SIZE,
  rateLimitCooldown: RATE_LIMIT_COOLDOWN,
} = botConfig;

// Rate limiting: userId -> last use timestamp
const rateLimit = new Map();

// Allowed video content types
const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/quicktime',
  'video/webm',
  'video/x-msvideo', // AVI
  'video/x-matroska', // MKV
];

// Allowed image content types
const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'];

/**
 * Check if user is an admin
 * @param {string} userId - Discord user ID
 * @returns {boolean} True if user is admin
 */
function isAdmin(userId) {
  return ADMIN_USER_IDS.includes(userId);
}

/**
 * Check if user is rate limited
 * @param {string} userId - Discord user ID
 * @returns {boolean} True if user should wait
 */
function checkRateLimit(userId) {
  // Admins bypass rate limiting
  if (isAdmin(userId)) {
    logger.info(`Rate limit bypassed for admin user ${userId}`);
    return false;
  }

  const lastUse = rateLimit.get(userId);
  if (lastUse && Date.now() - lastUse < RATE_LIMIT_COOLDOWN) {
    return true;
  }
  rateLimit.set(userId, Date.now());
  return false;
}

/**
 * Download video from Discord CDN
 * @param {string} url - Video URL
 * @param {boolean} isAdminUser - Whether the user is an admin (allows larger files)
 * @returns {Promise<Buffer>} Video file buffer
 */
async function downloadVideo(url, isAdminUser = false) {
  // Validate URL to prevent SSRF
  const urlValidation = validateUrl(url);
  if (!urlValidation.valid) {
    throw new ValidationError(urlValidation.error);
  }

  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      timeout: 60000, // 60 second timeout
      maxContentLength: isAdminUser ? Infinity : MAX_VIDEO_SIZE,
    });
    return Buffer.from(response.data);
  } catch (error) {
    if (error.response?.status === 413 && !isAdminUser) {
      throw new ValidationError('video file is too large (max 500mb)');
    }
    throw new NetworkError(`failed to download video: ${error.message}`);
  }
}

/**
 * Download image from Discord CDN
 * @param {string} url - Image URL
 * @param {boolean} isAdminUser - Whether the user is an admin (allows larger files)
 * @returns {Promise<Buffer>} Image file buffer
 */
async function downloadImage(url, isAdminUser = false) {
  // Validate URL to prevent SSRF
  const urlValidation = validateUrl(url);
  if (!urlValidation.valid) {
    throw new ValidationError(urlValidation.error);
  }

  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      timeout: 60000, // 60 second timeout
      maxContentLength: isAdminUser ? Infinity : MAX_IMAGE_SIZE,
    });
    return Buffer.from(response.data);
  } catch (error) {
    if (error.response?.status === 413 && !isAdminUser) {
      throw new ValidationError('image file is too large (max 50mb)');
    }
    throw new NetworkError(`failed to download image: ${error.message}`);
  }
}

/**
 * Download file from URL and detect content type
 * @param {string} url - File URL
 * @param {boolean} isAdminUser - Whether the user is an admin (allows larger files)
 * @returns {Promise<{buffer: Buffer, contentType: string, size: number, filename: string}>} File data and metadata
 */
async function downloadFileFromUrl(url, isAdminUser = false) {
  // Validate URL to prevent SSRF
  const urlValidation = validateUrl(url);
  if (!urlValidation.valid) {
    throw new ValidationError(urlValidation.error);
  }

  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      timeout: 60000, // 60 second timeout
      maxContentLength: isAdminUser ? Infinity : Math.max(MAX_VIDEO_SIZE, MAX_IMAGE_SIZE),
      validateStatus: status => status >= 200 && status < 400,
    });

    const buffer = Buffer.from(response.data);
    const contentType = response.headers['content-type'] || '';
    const contentDisposition = response.headers['content-disposition'] || '';

    // Extract filename from Content-Disposition header or URL
    let filename = 'file';
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (filenameMatch && filenameMatch[1]) {
        filename = sanitizeFilename(filenameMatch[1].replace(/['"]/g, ''));
      }
    }
    if (filename === 'file') {
      // Try to extract from URL
      try {
        const urlPath = new URL(url).pathname;
        const urlFilename = path.basename(urlPath);
        if (urlFilename && urlFilename !== '/') {
          filename = sanitizeFilename(urlFilename);
        }
      } catch {
        // Invalid URL, keep default
      }
    }

    return {
      buffer,
      contentType,
      size: buffer.length,
      filename,
    };
  } catch (error) {
    if (error.response?.status === 413 && !isAdminUser) {
      throw new ValidationError('file is too large (max 500mb for videos, 50mb for images)');
    }
    if (error.response?.status === 404) {
      throw new NetworkError('file not found at the provided URL');
    }
    throw new NetworkError(`failed to download file from URL: ${error.message}`);
  }
}

/**
 * Generate SHA-256 hash of buffer
 * @param {Buffer} buffer - Data buffer
 * @returns {string} SHA-256 hash in hex format
 */
function generateHash(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

/**
 * Validate video attachment
 * @param {Attachment} attachment - Discord attachment
 * @param {boolean} isAdminUser - Whether the user is an admin
 * @returns {Object} Validation result with error message if invalid
 */
function validateVideoAttachment(attachment, isAdminUser = false) {
  // Check if it's a video
  if (!attachment.contentType || !ALLOWED_VIDEO_TYPES.includes(attachment.contentType)) {
    return {
      valid: false,
      error: `unsupported video format. supported formats: mp4, mov, webm, avi, mkv`,
    };
  }

  // Check file size (admins bypass size limit)
  if (!isAdminUser && attachment.size > MAX_VIDEO_SIZE) {
    return {
      valid: false,
      error: `video file is too large (max ${MAX_VIDEO_SIZE / (1024 * 1024)}mb)`,
    };
  }

  if (isAdminUser && attachment.size > MAX_VIDEO_SIZE) {
    logger.info(
      `Video size limit bypassed for admin (${(attachment.size / (1024 * 1024)).toFixed(2)}MB > ${MAX_VIDEO_SIZE / (1024 * 1024)}MB)`
    );
  }

  return { valid: true };
}

/**
 * Validate image attachment
 * @param {Attachment} attachment - Discord attachment
 * @param {boolean} isAdminUser - Whether the user is an admin
 * @returns {Object} Validation result with error message if invalid
 */
function validateImageAttachment(attachment, isAdminUser = false) {
  // Check if it's an image
  if (!attachment.contentType || !ALLOWED_IMAGE_TYPES.includes(attachment.contentType)) {
    return {
      valid: false,
      error: `unsupported image format. supported formats: png, jpg, jpeg, webp, gif`,
    };
  }

  // Check file size (admins bypass size limit)
  if (!isAdminUser && attachment.size > MAX_IMAGE_SIZE) {
    return {
      valid: false,
      error: `image file is too large (max ${MAX_IMAGE_SIZE / (1024 * 1024)}mb)`,
    };
  }

  if (isAdminUser && attachment.size > MAX_IMAGE_SIZE) {
    logger.info(
      `Image size limit bypassed for admin (${(attachment.size / (1024 * 1024)).toFixed(2)}MB > ${MAX_IMAGE_SIZE / (1024 * 1024)}MB)`
    );
  }

  return { valid: true };
}

/**
 * Process conversion from attachment to GIF
 * @param {Interaction} interaction - Discord interaction
 * @param {Attachment} attachment - Discord attachment to convert
 * @param {string} attachmentType - Type of attachment ('video' or 'image')
 * @param {boolean} adminUser - Whether the user is an admin
 * @param {Buffer} [preDownloadedBuffer] - Optional pre-downloaded buffer (to avoid double download)
 */
async function processConversion(
  interaction,
  attachment,
  attachmentType,
  adminUser,
  preDownloadedBuffer = null
) {
  const userId = interaction.user.id;
  const tempFiles = [];

  try {
    // Download file (video or image) if not already downloaded
    // Admins bypass size limits in download
    const fileBuffer =
      preDownloadedBuffer ||
      (attachmentType === 'video'
        ? await downloadVideo(attachment.url, adminUser)
        : await downloadImage(attachment.url, adminUser));

    // Generate hash
    const hash = generateHash(fileBuffer);

    // Check if GIF already exists
    const exists = await gifExists(hash, GIF_STORAGE_PATH);
    if (exists) {
      const gifUrl = `${CDN_BASE_URL}/${hash}.gif`;
      logger.info(`GIF already exists (hash: ${hash}) for user ${userId}`);
      await interaction.editReply({
        content: `gif already exists : ${gifUrl}`,
      });
      return;
    }

    logger.info(`Starting ${attachmentType} to GIF conversion (hash: ${hash})`);

    // Validate file extension
    const allowedVideoExtensions = ['.mp4', '.mov', '.webm', '.avi', '.mkv'];
    const allowedImageExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.gif'];
    const allowedExtensions =
      attachmentType === 'video' ? allowedVideoExtensions : allowedImageExtensions;

    let ext = path.extname(attachment.name).toLowerCase();
    if (!ext || !validateFileExtension(attachment.name, allowedExtensions)) {
      // If extension is invalid or missing, use default based on type
      ext = attachmentType === 'video' ? '.mp4' : '.png';
      logger.warn(
        `Invalid or missing file extension for ${attachment.name}, using default: ${ext}`
      );
    }

    // Save file to temp directory
    const tempDir = path.join(process.cwd(), 'temp');
    await fs.mkdir(tempDir, { recursive: true });

    const filePrefix = attachmentType === 'video' ? 'video' : 'image';
    const tempFilePath = path.join(tempDir, `${filePrefix}_${Date.now()}${ext}`);
    await fs.writeFile(tempFilePath, fileBuffer);
    tempFiles.push(tempFilePath);

    // Get video duration to check limits (only for videos, admins bypass this)
    if (attachmentType === 'video' && !adminUser) {
      try {
        const metadata = await getVideoMetadata(tempFilePath);
        const duration = metadata.format.duration;

        if (duration > MAX_GIF_DURATION) {
          await interaction.editReply({
            content: `video is too long (${Math.ceil(duration)}s). maximum duration: ${MAX_GIF_DURATION}s`,
          });
          return;
        }
      } catch (error) {
        logger.warn('Failed to get video metadata:', error.message);
        // Continue anyway
      }
    } else if (attachmentType === 'video' && adminUser) {
      try {
        const metadata = await getVideoMetadata(tempFilePath);
        const duration = metadata.format.duration;
        if (duration > MAX_GIF_DURATION) {
          logger.info(
            `Video duration limit bypassed for admin (${Math.ceil(duration)}s > ${MAX_GIF_DURATION}s)`
          );
        }
      } catch {
        // Ignore metadata errors for admin bypass logging
      }
    }

    // Convert to GIF
    const gifPath = getGifPath(hash, GIF_STORAGE_PATH);

    if (attachmentType === 'video') {
      await convertToGif(tempFilePath, gifPath, {
        width: Math.min(MAX_GIF_WIDTH, 480),
        fps: DEFAULT_FPS,
        quality: 'medium',
      });
    } else {
      await convertImageToGif(tempFilePath, gifPath, {
        width: Math.min(MAX_GIF_WIDTH, 720),
        quality: 'medium',
      });
    }

    // Read the generated GIF to verify it was created
    const gifBuffer = await fs.readFile(gifPath);

    // Generate final URL
    const gifUrl = `${CDN_BASE_URL}/${hash}.gif`;

    logger.info(
      `Successfully created GIF (hash: ${hash}, size: ${(gifBuffer.length / (1024 * 1024)).toFixed(2)}MB) for user ${userId}`
    );

    await interaction.editReply({
      content: `gif created : ${gifUrl}`,
    });
  } catch (error) {
    logger.error(`Conversion failed for user ${userId} (${interaction.user.tag}):`, error);
    await interaction.editReply({
      content: 'an error occured',
    });
  } finally {
    // Clean up temp files
    if (tempFiles.length > 0) {
      await cleanupTempFiles(tempFiles);
    }
  }
}

/**
 * Handle context menu command interaction
 * @param {Interaction} interaction - Discord interaction
 */
async function handleContextMenuCommand(interaction) {
  if (!interaction.isMessageContextMenuCommand()) {
    return;
  }

  if (interaction.commandName !== 'convert to gif') {
    return;
  }

  const userId = interaction.user.id;
  const adminUser = isAdmin(userId);

  logger.info(
    `User ${userId} (${interaction.user.tag}) initiated conversion${adminUser ? ' [ADMIN]' : ''}`
  );

  // Check rate limit (admins bypass this check)
  if (checkRateLimit(userId)) {
    logger.warn(`User ${userId} (${interaction.user.tag}) is rate limited`);
    await interaction.reply({
      content: 'please wait 30 seconds before converting another video or image.',
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  // Get the message that was right-clicked
  const targetMessage = interaction.targetMessage;

  // Find video or image attachment
  const videoAttachment = targetMessage.attachments.find(
    att => att.contentType && ALLOWED_VIDEO_TYPES.includes(att.contentType)
  );

  const imageAttachment = targetMessage.attachments.find(
    att => att.contentType && ALLOWED_IMAGE_TYPES.includes(att.contentType)
  );

  // Determine attachment type and validate
  let attachment = null;
  let attachmentType = null;

  if (videoAttachment) {
    attachment = videoAttachment;
    attachmentType = 'video';
    logger.info(
      `Processing video: ${videoAttachment.name} (${(videoAttachment.size / (1024 * 1024)).toFixed(2)}MB)`
    );
    const validation = validateVideoAttachment(videoAttachment, adminUser);
    if (!validation.valid) {
      logger.warn(`Video validation failed for user ${userId}: ${validation.error}`);
      await interaction.reply({
        content: validation.error,
        flags: MessageFlags.Ephemeral,
      });
      return;
    }
  } else if (imageAttachment) {
    attachment = imageAttachment;
    attachmentType = 'image';
    logger.info(
      `Processing image: ${imageAttachment.name} (${(imageAttachment.size / (1024 * 1024)).toFixed(2)}MB)`
    );
    const validation = validateImageAttachment(imageAttachment, adminUser);
    if (!validation.valid) {
      logger.warn(`Image validation failed for user ${userId}: ${validation.error}`);
      await interaction.reply({
        content: validation.error,
        flags: MessageFlags.Ephemeral,
      });
      return;
    }
  } else {
    logger.warn(`No video or image attachment found for user ${userId}`);
    await interaction.reply({
      content: 'no video or image attachment found in this message.',
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  // Defer reply since conversion takes time
  await interaction.deferReply();

  await processConversion(interaction, attachment, attachmentType, adminUser);
}

/**
 * Format uptime in a human-readable format
 * @param {number} milliseconds - Uptime in milliseconds
 * @returns {string} Formatted uptime string
 */
function formatUptime(milliseconds) {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d ${hours % 24}h ${minutes % 60}m`;
  } else if (hours > 0) {
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
}

/**
 * Handle stats command
 * @param {Interaction} interaction - Discord interaction
 */
async function handleStatsCommand(interaction) {
  try {
    const storageStats = await getStorageStats(GIF_STORAGE_PATH);
    const uptime = botStartTime ? Date.now() - botStartTime : 0;
    const client = interaction.client;
    const guildCount = client.guilds.cache.size;
    const userCount = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);

    const embed = new EmbedBuilder()
      .setTitle('bot statistics')
      .setColor(0x5865f2)
      .setDescription('overview')
      .addFields(
        {
          name: 'bot info',
          value: `**uptime:** \`${formatUptime(uptime)}\`\n**guilds:** \`${guildCount.toLocaleString()}\`\n**users:** \`${userCount.toLocaleString()}\``,
          inline: true,
        },
        {
          name: 'gif storage',
          value: `**total gifs:** \`${storageStats.totalGifs.toLocaleString()}\`\n**disk usage:** \`${storageStats.diskUsageFormatted}\``,
          inline: true,
        },
        {
          name: 'configuration',
          value: `**max width:** \`${MAX_GIF_WIDTH}px\`\n**max duration:** \`${MAX_GIF_DURATION}s\`\n**default fps:** \`${DEFAULT_FPS}\``,
          inline: true,
        }
      )
      .setTimestamp()
      .setFooter({ text: client.user.tag, iconURL: client.user.displayAvatarURL() });

    await interaction.reply({ embeds: [embed] });
  } catch (error) {
    logger.error('Failed to get stats:', error);
    await interaction.reply({
      content: 'an error occurred while fetching statistics.',
      flags: MessageFlags.Ephemeral,
    });
  }
}

/**
 * Handle slash command interaction
 * @param {Interaction} interaction - Discord interaction
 */
async function handleSlashCommand(interaction) {
  if (!interaction.isChatInputCommand()) {
    return;
  }

  const commandName = interaction.commandName;

  if (commandName === 'stats') {
    await handleStatsCommand(interaction);
    return;
  }

  if (commandName !== 'convert') {
    return;
  }

  const userId = interaction.user.id;
  const adminUser = isAdmin(userId);

  logger.info(
    `User ${userId} (${interaction.user.tag}) initiated conversion via slash command${adminUser ? ' [ADMIN]' : ''}`
  );

  // Check rate limit (admins bypass this check)
  if (checkRateLimit(userId)) {
    logger.warn(`User ${userId} (${interaction.user.tag}) is rate limited`);
    await interaction.reply({
      content: 'please wait 30 seconds before converting another video or image.',
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  // Get attachment or URL from command options
  const attachment = interaction.options.getAttachment('file');
  const url = interaction.options.getString('url');

  if (!attachment && !url) {
    logger.warn(`No attachment or URL provided for user ${userId}`);
    await interaction.reply({
      content: 'please provide either a video/image attachment or a URL to a video/image file.',
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  if (attachment && url) {
    logger.warn(`Both attachment and URL provided for user ${userId}`);
    await interaction.reply({
      content: 'please provide either a file attachment or a URL, not both.',
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  let finalAttachment = attachment;
  let attachmentType = null;
  let preDownloadedBuffer = null;

  // If URL is provided, download the file first
  if (url) {
    // Validate URL format and protocol (strict validation)
    const urlValidation = validateUrl(url);
    if (!urlValidation.valid) {
      logger.warn(`Invalid URL for user ${userId}: ${urlValidation.error}`);
      await interaction.reply({
        content: `invalid URL: ${urlValidation.error}`,
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    // Defer reply since downloading may take time
    await interaction.deferReply();

    try {
      logger.info(`Downloading file from URL: ${url}`);
      const fileData = await downloadFileFromUrl(url, adminUser);

      // Store the buffer to avoid double download
      preDownloadedBuffer = fileData.buffer;

      // Create a pseudo-attachment object
      finalAttachment = {
        url: url,
        name: fileData.filename,
        size: fileData.size,
        contentType: fileData.contentType,
      };
    } catch (error) {
      logger.error(`Failed to download file from URL for user ${userId}:`, error);
      await interaction.editReply({
        content: error.message || 'failed to download file from URL.',
      });
      return;
    }
  }

  // Determine attachment type and validate
  if (finalAttachment.contentType && ALLOWED_VIDEO_TYPES.includes(finalAttachment.contentType)) {
    attachmentType = 'video';
    logger.info(
      `Processing video: ${finalAttachment.name} (${(finalAttachment.size / (1024 * 1024)).toFixed(2)}MB)`
    );
    const validation = validateVideoAttachment(finalAttachment, adminUser);
    if (!validation.valid) {
      logger.warn(`Video validation failed for user ${userId}: ${validation.error}`);
      if (url) {
        await interaction.editReply({
          content: validation.error,
        });
      } else {
        await interaction.reply({
          content: validation.error,
          flags: MessageFlags.Ephemeral,
        });
      }
      return;
    }
  } else if (
    finalAttachment.contentType &&
    ALLOWED_IMAGE_TYPES.includes(finalAttachment.contentType)
  ) {
    attachmentType = 'image';
    logger.info(
      `Processing image: ${finalAttachment.name} (${(finalAttachment.size / (1024 * 1024)).toFixed(2)}MB)`
    );
    const validation = validateImageAttachment(finalAttachment, adminUser);
    if (!validation.valid) {
      logger.warn(`Image validation failed for user ${userId}: ${validation.error}`);
      if (url) {
        await interaction.editReply({
          content: validation.error,
        });
      } else {
        await interaction.reply({
          content: validation.error,
          flags: MessageFlags.Ephemeral,
        });
      }
      return;
    }
  } else {
    logger.warn(`Invalid attachment type for user ${userId}`);
    const errorMsg =
      'unsupported file format. please provide a video (mp4, mov, webm, avi, mkv) or image (png, jpg, jpeg, webp, gif).';
    if (url) {
      await interaction.editReply({
        content: errorMsg,
      });
    } else {
      await interaction.reply({
        content: errorMsg,
        flags: MessageFlags.Ephemeral,
      });
    }
    return;
  }

  // Defer reply if not already deferred (for attachment case)
  if (!url) {
    await interaction.deferReply();
  }

  await processConversion(
    interaction,
    finalAttachment,
    attachmentType,
    adminUser,
    preDownloadedBuffer
  );
}

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
client.once(Events.ClientReady, readyClient => {
  botStartTime = Date.now();
  logger.info(`bot logged in as ${readyClient.user.tag}`);
  logger.info(`gif storage: ${GIF_STORAGE_PATH}`);
  logger.info(`cdn url: ${CDN_BASE_URL}`);
});

client.on(Events.InteractionCreate, async interaction => {
  logger.debug(
    `Received interaction: ${interaction.type} from user ${interaction.user.id} (${interaction.user.tag})`
  );
  if (interaction.isMessageContextMenuCommand()) {
    await handleContextMenuCommand(interaction);
  } else if (interaction.isChatInputCommand()) {
    await handleSlashCommand(interaction);
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
  logger.error('an error occured:', error);
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

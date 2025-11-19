import {
  MessageFlags,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} from 'discord.js';
import { createLogger } from '../utils/logger.js';
import { validateUrl } from '../utils/validation.js';
import { checkRateLimit, isAdmin } from '../utils/rate-limit.js';
import {
  ALLOWED_VIDEO_TYPES,
  ALLOWED_IMAGE_TYPES,
  validateVideoAttachment,
  validateImageAttachment,
} from '../utils/attachment-helpers.js';

const logger = createLogger('convert-advanced');

/**
 * Handle advanced context menu command with modal
 * @param {Interaction} interaction - Discord interaction
 * @param {Map} modalAttachmentCache - Cache for modal attachment data
 */
export async function handleAdvancedContextMenuCommand(interaction, modalAttachmentCache) {
  if (!interaction.isMessageContextMenuCommand()) {
    return;
  }

  if (interaction.commandName !== 'convert to gif (advanced)') {
    return;
  }

  const userId = interaction.user.id;
  const adminUser = isAdmin(userId);

  logger.info(
    `User ${userId} (${interaction.user.tag}) initiated advanced conversion${adminUser ? ' [ADMIN]' : ''}`
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

  // Check for URLs in message content if no attachments found
  let url = null;
  if (!videoAttachment && !imageAttachment && targetMessage.content) {
    // Extract URLs from message content
    const urlPattern = /https?:\/\/[^\s<>"{}|\\^`[\]]+/gi;
    const urls = targetMessage.content.match(urlPattern);
    if (urls && urls.length > 0) {
      url = urls[0]; // Use the first URL found
      logger.info(`Found URL in message content: ${url}`);
    }
  }

  // Determine attachment type and validate
  let attachment = null;
  let attachmentType = null;
  let preDownloadedBuffer = null;

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
  } else if (url) {
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

    // For URLs, we'll need to download first to determine type, but we'll do that in modal submit
    // For now, just store the URL
    attachment = {
      url: url,
      name: 'file',
      size: 0,
      contentType: null,
    };
    attachmentType = 'unknown';
  } else {
    logger.warn(`No video or image attachment or URL found for user ${userId}`);
    await interaction.reply({
      content: 'no video or image attachment or URL found in this message.',
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  // Create modal
  const customId = `gif_advanced_${Date.now()}_${userId}`;
  const modal = new ModalBuilder().setCustomId(customId).setTitle('GIF Conversion Options');

  // Start time input (for videos)
  const startTimeInput = new TextInputBuilder()
    .setCustomId('start_time')
    .setLabel('Start Time (seconds)')
    .setStyle(TextInputStyle.Short)
    .setRequired(false)
    .setPlaceholder('0')
    .setMaxLength(10);

  // Duration input
  const durationInput = new TextInputBuilder()
    .setCustomId('duration')
    .setLabel('Duration (seconds)')
    .setStyle(TextInputStyle.Short)
    .setRequired(false)
    .setPlaceholder('max')
    .setMaxLength(10);

  // Quality input
  const qualityInput = new TextInputBuilder()
    .setCustomId('quality')
    .setLabel('Quality (low/medium/high)')
    .setStyle(TextInputStyle.Short)
    .setRequired(false)
    .setPlaceholder('medium')
    .setMaxLength(10);

  // Width input
  const widthInput = new TextInputBuilder()
    .setCustomId('width')
    .setLabel('Width (pixels)')
    .setStyle(TextInputStyle.Short)
    .setRequired(false)
    .setPlaceholder(attachmentType === 'video' ? '480' : '720')
    .setMaxLength(10);

  // FPS input (for videos)
  const fpsInput = new TextInputBuilder()
    .setCustomId('fps')
    .setLabel('FPS (frames per second)')
    .setStyle(TextInputStyle.Short)
    .setRequired(false)
    .setPlaceholder('15')
    .setMaxLength(10);

  // Add inputs to modal (only show FPS for videos)
  const firstRow = new ActionRowBuilder().addComponents(startTimeInput);
  const secondRow = new ActionRowBuilder().addComponents(durationInput);
  const thirdRow = new ActionRowBuilder().addComponents(qualityInput);
  const fourthRow = new ActionRowBuilder().addComponents(widthInput);

  modal.addComponents(firstRow, secondRow, thirdRow, fourthRow);

  if (attachmentType === 'video' || attachmentType === 'unknown') {
    const fifthRow = new ActionRowBuilder().addComponents(fpsInput);
    modal.addComponents(fifthRow);
  }

  // Store attachment info in cache
  modalAttachmentCache.set(customId, {
    attachment,
    attachmentType,
    adminUser,
    preDownloadedBuffer,
    url,
    timestamp: Date.now(),
  });

  // Show modal
  await interaction.showModal(modal);
}

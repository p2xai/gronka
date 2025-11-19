import { MessageFlags } from 'discord.js';
import path from 'path';
import { createLogger } from '../utils/logger.js';
import { botConfig } from '../utils/config.js';
import { downloadFileFromUrl, parseTenorUrl } from '../utils/file-downloader.js';
import {
  ALLOWED_VIDEO_TYPES,
  ALLOWED_IMAGE_TYPES,
  validateVideoAttachment,
  validateImageAttachment,
} from '../utils/attachment-helpers.js';
import { processConversion } from '../commands/convert.js';
import { processOptimization } from '../commands/optimize.js';

const logger = createLogger('modals');

const { maxGifWidth: MAX_GIF_WIDTH, maxGifDuration: MAX_GIF_DURATION } = botConfig;

/**
 * Handle modal submission for advanced GIF conversion and optimization
 * @param {Interaction} interaction - Discord modal submit interaction
 * @param {Map} modalAttachmentCache - Cache for modal attachment data
 */
export async function handleModalSubmit(interaction, modalAttachmentCache) {
  if (!interaction.isModalSubmit()) {
    return;
  }

  const customId = interaction.customId;

  // Handle optimize modal
  if (customId.startsWith('optimize_modal_')) {
    const userId = interaction.user.id;

    // Retrieve cached attachment info
    const cachedData = modalAttachmentCache.get(customId);
    if (!cachedData) {
      logger.warn(`No cached data found for optimize modal ${customId} from user ${userId}`);
      await interaction.reply({
        content: 'modal session expired. please try again.',
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    // Clean up cache entry
    modalAttachmentCache.delete(customId);

    const { attachment, adminUser, preDownloadedBuffer } = cachedData;

    // Parse lossy level
    const lossyValue = interaction.fields.getTextInputValue('lossy_level') || null;
    let lossyLevel = null;

    if (lossyValue && lossyValue.trim() !== '') {
      const parsed = parseInt(lossyValue.trim(), 10);
      if (isNaN(parsed) || parsed < 0 || parsed > 100) {
        await interaction.reply({
          content: 'invalid lossy level. must be a number between 0 and 100.',
          flags: MessageFlags.Ephemeral,
        });
        return;
      }
      lossyLevel = parsed;
    }

    // Defer reply since optimization may take time
    await interaction.deferReply();

    // Process optimization
    await processOptimization(interaction, attachment, adminUser, preDownloadedBuffer, lossyLevel);
    return;
  }

  if (!customId.startsWith('gif_advanced_')) {
    return;
  }

  const userId = interaction.user.id;

  // Retrieve cached attachment info
  const cachedData = modalAttachmentCache.get(customId);
  if (!cachedData) {
    logger.warn(`No cached data found for modal ${customId} from user ${userId}`);
    await interaction.reply({
      content: 'modal session expired. please try again.',
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  // Clean up cache entry
  modalAttachmentCache.delete(customId);

  const { attachment, attachmentType: cachedAttachmentType, adminUser, url } = cachedData;

  // Parse and validate modal fields
  const startTimeValue = interaction.fields.getTextInputValue('start_time') || null;
  const durationValue = interaction.fields.getTextInputValue('duration') || null;
  const qualityValue = interaction.fields.getTextInputValue('quality') || null;
  const widthValue = interaction.fields.getTextInputValue('width') || null;
  const fpsValue = interaction.fields.getTextInputValue('fps') || null;

  // Parse and validate options
  const options = {};

  // Start time
  if (startTimeValue && startTimeValue.trim() !== '') {
    const startTime = parseFloat(startTimeValue.trim());
    if (isNaN(startTime) || startTime < 0) {
      await interaction.reply({
        content: 'invalid start time. must be a number >= 0.',
        flags: MessageFlags.Ephemeral,
      });
      return;
    }
    options.startTime = startTime;
  }

  // Duration
  if (
    durationValue &&
    durationValue.trim() !== '' &&
    durationValue.trim().toLowerCase() !== 'max'
  ) {
    const duration = parseFloat(durationValue.trim());
    if (isNaN(duration) || duration <= 0) {
      await interaction.reply({
        content: 'invalid duration. must be a number > 0.',
        flags: MessageFlags.Ephemeral,
      });
      return;
    }
    if (!adminUser && duration > MAX_GIF_DURATION) {
      await interaction.reply({
        content: `duration exceeds maximum (${MAX_GIF_DURATION}s).`,
        flags: MessageFlags.Ephemeral,
      });
      return;
    }
    options.duration = duration;
  }

  // Quality
  if (qualityValue && qualityValue.trim() !== '') {
    const quality = qualityValue.trim().toLowerCase();
    if (!['low', 'medium', 'high'].includes(quality)) {
      await interaction.reply({
        content: 'invalid quality. must be one of: low, medium, high.',
        flags: MessageFlags.Ephemeral,
      });
      return;
    }
    options.quality = quality;
  }

  // Width
  if (widthValue && widthValue.trim() !== '') {
    const width = parseInt(widthValue.trim(), 10);
    if (isNaN(width) || width < 1 || width > 4096) {
      await interaction.reply({
        content: 'invalid width. must be a number between 1 and 4096.',
        flags: MessageFlags.Ephemeral,
      });
      return;
    }
    if (width > MAX_GIF_WIDTH) {
      await interaction.reply({
        content: `width exceeds maximum (${MAX_GIF_WIDTH}px).`,
        flags: MessageFlags.Ephemeral,
      });
      return;
    }
    options.width = width;
  }

  // FPS
  if (fpsValue && fpsValue.trim() !== '') {
    const fps = parseFloat(fpsValue.trim());
    if (isNaN(fps) || fps < 0.1 || fps > 120) {
      await interaction.reply({
        content: 'invalid fps. must be a number between 0.1 and 120.',
        flags: MessageFlags.Ephemeral,
      });
      return;
    }
    options.fps = fps;
  }

  // Defer reply since conversion may take time
  await interaction.deferReply();

  // Handle URL downloads if needed
  let finalAttachment = attachment;
  let attachmentType = cachedAttachmentType;
  let preDownloadedBuffer = cachedData.preDownloadedBuffer;

  if (url && cachedAttachmentType === 'unknown') {
    try {
      // Check if URL is a Tenor GIF link and parse it
      let actualUrl = url;
      const isTenorUrl = /^https?:\/\/(www\.)?tenor\.com\/view\/.+-gif-\d+/i.test(url);
      if (isTenorUrl) {
        logger.info(`Detected Tenor URL, parsing to extract GIF URL: ${url}`);
        try {
          actualUrl = await parseTenorUrl(url);
          logger.info(`Resolved Tenor URL to: ${actualUrl}`);
        } catch (error) {
          logger.error(`Failed to parse Tenor URL for user ${userId}:`, error);
          await interaction.editReply({
            content: error.message || 'failed to parse Tenor URL.',
          });
          return;
        }
      }

      logger.info(`Downloading file from URL: ${actualUrl}`);
      const fileData = await downloadFileFromUrl(actualUrl, adminUser, interaction.client);

      // Store the buffer to avoid double download
      preDownloadedBuffer = fileData.buffer;

      // Create a pseudo-attachment object
      finalAttachment = {
        url: actualUrl,
        name: fileData.filename,
        size: fileData.size,
        contentType: fileData.contentType,
      };

      // Determine attachment type based on content type
      logger.info(
        `File data from URL: filename=${fileData.filename}, contentType=${fileData.contentType}, size=${fileData.size}`
      );

      if (fileData.contentType && ALLOWED_VIDEO_TYPES.includes(fileData.contentType)) {
        attachmentType = 'video';
        logger.info(
          `Processing video from URL: ${finalAttachment.name} (${(finalAttachment.size / (1024 * 1024)).toFixed(2)}MB)`
        );
        const validation = validateVideoAttachment(finalAttachment, adminUser);
        if (!validation.valid) {
          logger.warn(`Video validation failed for user ${userId}: ${validation.error}`);
          await interaction.editReply({
            content: validation.error,
          });
          return;
        }
      } else if (fileData.contentType && ALLOWED_IMAGE_TYPES.includes(fileData.contentType)) {
        attachmentType = 'image';
        logger.info(
          `Processing image from URL: ${finalAttachment.name} (${(finalAttachment.size / (1024 * 1024)).toFixed(2)}MB)`
        );
        const validation = validateImageAttachment(finalAttachment, adminUser);
        if (!validation.valid) {
          logger.warn(`Image validation failed for user ${userId}: ${validation.error}`);
          await interaction.editReply({
            content: validation.error,
          });
          return;
        }
      } else {
        // Try to infer from filename extension as fallback
        const ext = path.extname(fileData.filename).toLowerCase();
        const videoExts = ['.mp4', '.mov', '.webm', '.avi', '.mkv'];
        const imageExts = ['.png', '.jpg', '.jpeg', '.webp', '.gif'];

        if (videoExts.includes(ext)) {
          logger.info(`Inferred video type from extension ${ext}, proceeding with conversion`);
          attachmentType = 'video';
          const validation = validateVideoAttachment(finalAttachment, adminUser);
          if (!validation.valid) {
            logger.warn(`Video validation failed for user ${userId}: ${validation.error}`);
            await interaction.editReply({
              content: validation.error,
            });
            return;
          }
        } else if (imageExts.includes(ext)) {
          logger.info(`Inferred image type from extension ${ext}, proceeding with conversion`);
          attachmentType = 'image';
          const validation = validateImageAttachment(finalAttachment, adminUser);
          if (!validation.valid) {
            logger.warn(`Image validation failed for user ${userId}: ${validation.error}`);
            await interaction.editReply({
              content: validation.error,
            });
            return;
          }
        } else {
          logger.warn(
            `Invalid attachment type for user ${userId}: contentType=${fileData.contentType}, filename=${fileData.filename}, ext=${ext}`
          );
          await interaction.editReply({
            content: `unsupported file format. received content-type: ${fileData.contentType || 'unknown'}, filename: ${fileData.filename}. please provide a video (mp4, mov, webm, avi, mkv) or image (png, jpg, jpeg, webp, gif).`,
          });
          return;
        }
      }
    } catch (error) {
      logger.error(`Failed to download file from URL for user ${userId}:`, error);
      await interaction.editReply({
        content: error.message || 'failed to download file from URL.',
      });
      return;
    }
  }

  // Process conversion with options
  await processConversion(
    interaction,
    finalAttachment,
    attachmentType,
    adminUser,
    preDownloadedBuffer,
    options
  );
}

import fs from 'fs/promises';
import path from 'path';
import { createLogger } from './logger.js';

const logger = createLogger('storage');

/**
 * Get the storage path for GIFs
 * @param {string} storagePath - Base storage path from env or default
 * @returns {string} Full path to GIF storage directory
 */
function getStoragePath(storagePath) {
  if (path.isAbsolute(storagePath)) {
    return storagePath;
  }
  // Relative path - resolve from project root
  return path.resolve(process.cwd(), storagePath);
}

/**
 * Check if a GIF with the given hash already exists
 * @param {string} hash - MD5 hash of the video
 * @param {string} storagePath - Base storage path
 * @returns {Promise<boolean>} True if GIF exists
 */
export async function gifExists(hash, storagePath) {
  try {
    const gifPath = getGifPath(hash, storagePath);
    await fs.access(gifPath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get the full file path for a GIF by hash
 * @param {string} hash - MD5 hash of the video
 * @param {string} storagePath - Base storage path
 * @returns {string} Full path to GIF file
 */
export function getGifPath(hash, storagePath) {
  const basePath = getStoragePath(storagePath);
  // Ensure hash is safe (alphanumeric only)
  const safeHash = hash.replace(/[^a-f0-9]/gi, '');
  return path.join(basePath, `${safeHash}.gif`);
}

/**
 * Save a GIF buffer to disk
 * @param {Buffer} buffer - GIF file buffer
 * @param {string} hash - MD5 hash of the video
 * @param {string} storagePath - Base storage path
 * @returns {Promise<string>} Path to saved GIF file
 */
export async function saveGif(buffer, hash, storagePath) {
  const basePath = getStoragePath(storagePath);

  // Ensure directory exists
  await fs.mkdir(basePath, { recursive: true });

  const gifPath = getGifPath(hash, storagePath);
  await fs.writeFile(gifPath, buffer);
  logger.debug(`Saved GIF: ${gifPath} (size: ${(buffer.length / (1024 * 1024)).toFixed(2)}MB)`);

  return gifPath;
}

/**
 * Clean up temporary video files
 * @param {string[]} tempFiles - Array of temporary file paths to delete
 * @returns {Promise<void>}
 */
export async function cleanupTempFiles(tempFiles) {
  logger.debug(`Cleaning up ${tempFiles.length} temporary files`);
  const deletePromises = tempFiles.map(async filePath => {
    try {
      await fs.unlink(filePath);
      logger.debug(`Deleted temp file: ${filePath}`);
    } catch (error) {
      // Ignore errors if file doesn't exist
      if (error.code !== 'ENOENT') {
        logger.error(`Failed to delete temp file ${filePath}:`, error.message);
      }
    }
  });

  await Promise.all(deletePromises);
}

/**
 * Format file size in bytes to human-readable string (MB first, then GB)
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted size string (e.g., "1536 MB" or "1.5 GB")
 */
export function formatFileSize(bytes) {
  const mb = bytes / (1024 * 1024);
  if (mb >= 1024) {
    const gb = mb / 1024;
    return `${gb.toFixed(2)} GB`;
  }
  return `${mb.toFixed(2)} MB`;
}

/**
 * Get storage statistics
 * @param {string} storagePath - Base storage path
 * @returns {Promise<{totalGifs: number, diskUsageBytes: number, diskUsageFormatted: string}>}
 */
export async function getStorageStats(storagePath) {
  try {
    logger.debug(`Getting storage stats for: ${storagePath}`);
    const basePath = getStoragePath(storagePath);
    const files = await fs.readdir(basePath);
    const gifFiles = files.filter(f => f.endsWith('.gif'));

    let totalSize = 0;
    for (const file of gifFiles) {
      try {
        const filePath = path.join(basePath, file);
        const stats = await fs.stat(filePath);
        totalSize += stats.size;
      } catch (error) {
        logger.warn(`Failed to stat file ${file}:`, error.message);
      }
    }

    const stats = {
      totalGifs: gifFiles.length,
      diskUsageBytes: totalSize,
      diskUsageFormatted: formatFileSize(totalSize),
    };

    logger.debug(`Storage stats: ${stats.totalGifs} GIFs, ${stats.diskUsageFormatted}`);
    return stats;
  } catch (error) {
    logger.error(`Failed to get storage stats:`, error);
    return {
      totalGifs: 0,
      diskUsageBytes: 0,
      diskUsageFormatted: '0.00 MB',
    };
  }
}

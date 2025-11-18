FROM node:20-slim

# Install FFmpeg and required dependencies
RUN apt-get update && apt-get install -y \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (skip scripts to avoid husky in production)
RUN npm ci --only=production --ignore-scripts

# Copy application code
COPY src/ ./src/

# Create necessary directories
RUN mkdir -p data temp

# Expose server port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV SERVER_PORT=3000
ENV GIF_STORAGE_PATH=./data

# Copy entrypoint script
COPY scripts/docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Use entrypoint script to run both processes
ENTRYPOINT ["docker-entrypoint.sh"]


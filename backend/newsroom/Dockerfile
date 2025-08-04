# Newsroom Backend Dockerfile
FROM node:20-alpine as base

# Install system dependencies
RUN apk add --no-cache \
    libc6-compat \
    curl

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy application code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S newsroom -u 1001 -G nodejs

# Create necessary directories
RUN mkdir -p /app/logs /app/uploads && \
    chown -R newsroom:nodejs /app

# Switch to non-root user
USER newsroom

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
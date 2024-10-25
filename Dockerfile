# Build stage
FROM node:20-alpine AS builder

# Set the working directory
WORKDIR /app

# Install build dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    libc6-compat

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Copy the production environment file
COPY .env.production .env

# Remove any local environment file to avoid conflicts
RUN rm -f .env.local

# Set the environment to production explicitly
ENV NODE_ENV=production

# Build the Next.js application
RUN npm run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

# Install production dependencies only
RUN apk add --no-cache libc6-compat

# Copy built application from builder stage
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/.next/standalone ./

# Expose port 3000
EXPOSE 3001

# Set host and port environment variables
ENV PORT=3001
ENV HOSTNAME="0.0.0.0"

# Start the Next.js application
CMD ["node", "server.js"]

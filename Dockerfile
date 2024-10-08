# Stage 1: Installing dependencies with Bun
FROM oven/bun:latest AS deps

WORKDIR /app

# Copy package and lock files
COPY package.json bun.lockb ./

# Install only production dependencies
RUN bun install --only=production

# Stage 2: Building the Next.js project
FROM oven/bun:latest AS builder

WORKDIR /app

# Copy all files
COPY . .

# Set environment variables for production
ENV NODE_ENV=production

# Copy environment production file (optional if you have it)
COPY .env.production .env

# Remove local environment file to avoid conflicts (optional)
RUN rm -f .env.local

# Use dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Build the Next.js app
RUN bun run build

# Stage 3: Production Image
FROM oven/bun:latest AS runner

WORKDIR /app

# Copy the built app from the builder stage
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

# Expose port 3000
EXPOSE 3000

# Set the PORT and HOSTNAME environment variables
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Run the Next.js app
CMD ["bun", "run", "server.js"]

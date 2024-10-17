# Use the latest stable Node.js slim version for a smaller image
FROM node:20-slim

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install production dependencies
RUN npm install --only=production

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

# Expose port 3000
EXPOSE 3000

# Start the Next.js application and bind it to 0.0.0.0 with port 3000
CMD ["npm", "start", "--", "-p", "3000", "-H", "0.0.0.0"]

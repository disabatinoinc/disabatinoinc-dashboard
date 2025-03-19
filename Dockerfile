# Use the official Node.js image as the base
FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Copy only necessary files from the builder stage
COPY --from=base /app/package*.json ./
COPY --from=base /app/next.config.ts ./
COPY --from=base /app/public ./public
COPY --from=base /app/.next ./.next
COPY --from=base /app/node_modules ./node_modules

# Expose the port
EXPOSE 3010

# Set environment variables
ENV NODE_ENV production

# Start the server
CMD ["npm", "start"]
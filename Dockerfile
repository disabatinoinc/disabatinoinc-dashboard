# Use the official Node.js image as the base
FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Copy env for use at build time
COPY .env .env

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# COPY --from=base /app/.next/standalone ./
# COPY --from=base /app/public ./public
# COPY --from=base /app/.next/static ./public/_next/static

# Copy standalone output (includes server.js and server files)
COPY --from=base /app/.next/standalone ./

# 🔥 Copy static files to correct location
COPY --from=base /app/.next/static ./.next/static

# 🔥 Copy server files (for middleware + edge runtime)
COPY --from=base /app/.next/server ./.next/server

# Optional: if you use public folder
COPY --from=base /app/public ./public

# Expose the port
EXPOSE 3010

# Set environment variables
ENV PORT=3010
ENV NODE_ENV production

# Start the server
CMD ["node", "server.js"]

FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy Prisma schema
COPY prisma ./prisma/

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Environment variables - only set defaults for essential variables
ENV PORT=3000
ENV NODE_ENV=production
ENV DATABASE_CONNECTION
ENV JWT_ACCESS_SECRET
ENV JWT_REFRESH_SECRET
ENV JWT_ACCESS_EXPIRATION
ENV JWT_REFRESH_EXPIRATION
ENV AZURE_STORAGE_CONNECTION_STRING
ENV AZURE_SERVICE_BUS_CONNECTION_STRING
ENV AZURE_SERVICE_BUS_QUEUE_NAME
ENV AZURE_COSMOS_DB_ENDPOINT
ENV AZURE_COSMOS_DB_KEY
ENV AZURE_COSMOS_DB_DATABASE_NAME
ENV AZURE_COSMOS_DB_CONTAINER_NAME

# Expose port
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/src/main"]

FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install ALL dependencies for build
RUN npm ci

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Install only production dependencies for runtime
RUN npm ci --only=production

# Create production database file
RUN touch /app/prisma/dev.db

# Set environment variable for SQLite
ENV DATABASE_URL="file:/app/prisma/dev.db"

# Expose port
EXPOSE 3000

# Start the application
CMD ["sh", "-c", "npx prisma db push && npm run start:prod"]
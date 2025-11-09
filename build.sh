#!/bin/bash

echo "🚀 Building Docker images for production..."

# Verificar que los archivos Dockerfile existen
if [ ! -f "./backend/kata-buzon/Dockerfile" ]; then
    echo "❌ Error: backend/kata-buzon/Dockerfile not found"
    exit 1
fi

if [ ! -f "./frontend/kata-buzon-front/Dockerfile" ]; then
    echo "❌ Error: frontend/kata-buzon-front/Dockerfile not found"
    exit 1
fi

# Build backend
echo "📦 Building backend..."
cd backend/kata-buzon
docker build -t approval-platform-backend:prod .

# Build frontend
echo "🌐 Building frontend..."
cd ../../frontend/kata-buzon-front
docker build -t approval-platform-frontend:prod .

cd ../..

echo "✅ Build completed!"
echo "📝 To run the application: docker-compose up -d"
#!/bin/bash

echo "🚀 Starting production deployment..."

# Verificar que docker-compose.yml existe
if [ ! -f "./docker-compose.yml" ]; then
    echo "❌ Error: docker-compose.yml not found"
    exit 1
fi

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Build new images
echo "🔨 Building new images..."
docker-compose build --no-cache

# Start services
echo "🚀 Starting services..."
docker-compose up -d

# Wait for backend to be healthy
echo "⏳ Waiting for backend to be healthy..."
for i in {1..30}; do
    if curl -f http://localhost:3000/health > /dev/null 2>&1; then
        echo "✅ Backend is healthy!"
        break
    fi
    echo "Waiting for backend... ($i/30)"
    sleep 5
done

# Check if backend is healthy
if ! curl -f http://localhost:3000/health > /dev/null 2>&1; then
    echo "❌ Backend failed to start. Check logs with: docker-compose logs backend"
    exit 1
fi

# Setup database
echo "🗃️ Setting up database..."
docker-compose exec backend npx prisma db push
docker-compose exec backend npx prisma db seed

echo "🎉 Deployment completed!"
echo "🌐 Frontend: http://localhost"
echo "🔧 Backend API: http://localhost:3000"
echo "📊 Health check: http://localhost:3000/health"
#!/bin/bash

echo "🚀 Starting deployment..."

# Load environment variables
if [ -f .env ]; then
    echo "📋 Loading environment variables..."
    echo "📋 .env file contents:"
    cat .env
    export $(cat .env | grep -v '^#' | xargs)
    echo "✅ Environment variables loaded"
else
    echo "❌ .env file not found!"
    exit 1
fi

# Pull the latest images
echo "📥 Pulling latest Docker images..."
docker pull tongnguyen/frontend:latest || echo "⚠️ Failed to pull frontend image"
docker pull tongnguyen/backend:latest || echo "⚠️ Failed to pull backend image"

# Stop and remove existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f docker-compose.prod.yml down || echo "⚠️ No existing containers to stop"

# Start the new containers
echo "🔄 Starting new containers..."
docker-compose -f docker-compose.prod.yml --env-file .env up -d

# Show container status
echo "📊 Container status:"
docker-compose -f docker-compose.prod.yml ps

# Wait for services to start
echo "⏳ Waiting for services to start..."
sleep 30

# Health check
echo "🔍 Running health check..."
if curl -f http://localhost:8080/api/health > /dev/null 2>&1; then
    echo "✅ Backend health check passed!"
else
    echo "❌ Backend health check failed!"
    docker-compose -f docker-compose.prod.yml logs backend
fi

# Clean up unused images
echo "🧹 Cleaning up unused images..."
docker image prune -f

echo "🎉 Deployment completed!"

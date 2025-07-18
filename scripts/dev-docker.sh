#!/bin/bash

echo "🚀 Starting local development with Docker..."

# Copy local environment file
cp .env.local .env

# Build and start containers
docker-compose up --build -d

echo "⏳ Waiting for services to start..."
sleep 30

# Health check
echo "🔍 Running health check..."
if curl -f http://localhost:8080/api/health > /dev/null 2>&1; then
    echo "✅ Backend health check passed!"
    echo "🌐 Frontend: http://localhost:3000"
    echo "🔧 Backend API: http://localhost:8080/api"
    echo "📚 API Docs: http://localhost:8080/api-docs"
    echo "🗄️ MySQL: localhost:3307"
else
    echo "❌ Backend health check failed!"
    docker-compose logs backend
fi

echo "📋 Use 'docker-compose logs -f' to view logs"
echo "🛑 Use 'docker-compose down' to stop services"

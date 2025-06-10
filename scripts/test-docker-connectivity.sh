#!/bin/bash

# Test Docker connectivity between frontend and backend

echo "🔍 Testing Docker container connectivity..."

# Test if containers are running
echo "📋 Checking running containers:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo ""
echo "🌐 Testing API endpoints from host machine:"

# Test backend health from host
echo "Testing backend from host (localhost:8080):"
curl -f http://localhost:8080/api/specialties || echo "❌ Backend not accessible from host"

echo ""
echo "🐳 Testing API endpoints from within frontend container:"

# Get frontend container name
FRONTEND_CONTAINER=$(docker ps --filter "ancestor=tongnguyen/frontend" --format "{{.Names}}" | head -1)

if [ -z "$FRONTEND_CONTAINER" ]; then
    echo "❌ Frontend container not found"
    exit 1
fi

echo "Frontend container: $FRONTEND_CONTAINER"

# Test backend connectivity from frontend container
echo "Testing backend from frontend container (backend:8080):"
docker exec $FRONTEND_CONTAINER sh -c "curl -f http://backend:8080/api/specialties" || echo "❌ Backend not accessible from frontend container"

echo ""
echo "🔍 Testing specific specialty endpoint:"
docker exec $FRONTEND_CONTAINER sh -c "curl -f http://backend:8080/api/specialties/1" || echo "❌ Specialty endpoint not accessible"

echo ""
echo "📊 Network information:"
docker network ls
docker network inspect cnpm_websitedkkhambenh_app-network

echo ""
echo "🔧 Container logs (last 10 lines):"
echo "Backend logs:"
docker logs --tail 10 $(docker ps --filter "ancestor=tongnguyen/backend" --format "{{.Names}}" | head -1)

echo ""
echo "Frontend logs:"
docker logs --tail 10 $FRONTEND_CONTAINER

Write-Host "🚀 Starting local development with Docker..." -ForegroundColor Green

# Copy local environment file
Copy-Item .env.local .env

# Build and start containers
docker-compose up --build -d

Write-Host "⏳ Waiting for services to start..." -ForegroundColor Yellow
Start-Sleep 30

# Health check
Write-Host "🔍 Running health check..." -ForegroundColor Blue
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/api/health" -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Backend health check passed!" -ForegroundColor Green
        Write-Host "🌐 Frontend: http://localhost:3000" -ForegroundColor Cyan
        Write-Host "🔧 Backend API: http://localhost:8080/api" -ForegroundColor Cyan
        Write-Host "📚 API Docs: http://localhost:8080/api-docs" -ForegroundColor Cyan
        Write-Host "🗄️ MySQL: localhost:3307" -ForegroundColor Cyan
    }
} catch {
    Write-Host "❌ Backend health check failed!" -ForegroundColor Red
    docker-compose logs backend
}

Write-Host "📋 Use 'docker-compose logs -f' to view logs" -ForegroundColor Yellow
Write-Host "🛑 Use 'docker-compose down' to stop services" -ForegroundColor Yellow

# Build application for production with error handling

Write-Host "🚀 Building Application for Production" -ForegroundColor Cyan

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
}
catch {
    Write-Host "❌ Node.js not found. Please install Node.js" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📦 Installing dependencies..." -ForegroundColor Blue

# Install backend dependencies
Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
Set-Location "backend"
try {
    npm ci --production=false
    Write-Host "✅ Backend dependencies installed" -ForegroundColor Green
}
catch {
    Write-Host "❌ Failed to install backend dependencies" -ForegroundColor Red
    Set-Location ".."
    exit 1
}

Set-Location ".."

# Install frontend dependencies
Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location "frontend"
try {
    npm ci --legacy-peer-deps
    Write-Host "✅ Frontend dependencies installed" -ForegroundColor Green
}
catch {
    Write-Host "❌ Failed to install frontend dependencies" -ForegroundColor Red
    Set-Location ".."
    exit 1
}

Write-Host ""
Write-Host "🔧 Building frontend..." -ForegroundColor Blue

# Build frontend with error handling
try {
    $env:NODE_ENV = "production"
    $env:NEXT_TELEMETRY_DISABLED = "1"
    
    Write-Host "Building Next.js application..." -ForegroundColor Yellow
    npm run build
    
    Write-Host "✅ Frontend build successful" -ForegroundColor Green
}
catch {
    Write-Host "❌ Frontend build failed" -ForegroundColor Red
    Write-Host "Error details:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Set-Location ".."
    exit 1
}

Set-Location ".."

Write-Host ""
Write-Host "🐳 Building Docker images..." -ForegroundColor Blue

# Build Docker images
try {
    Write-Host "Building Docker images with no cache..." -ForegroundColor Yellow
    docker-compose build --no-cache
    Write-Host "✅ Docker images built successfully" -ForegroundColor Green
}
catch {
    Write-Host "❌ Docker build failed" -ForegroundColor Red
    Write-Host "Error details:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎉 Production build completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "To start the application:" -ForegroundColor Cyan
Write-Host "  docker-compose up -d" -ForegroundColor White
Write-Host ""
Write-Host "To view logs:" -ForegroundColor Cyan
Write-Host "  docker-compose logs -f" -ForegroundColor White

# Test application in development mode

Write-Host "🔧 Testing Application in Development Mode" -ForegroundColor Cyan

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
}
catch {
    Write-Host "❌ Node.js not found. Please install Node.js" -ForegroundColor Red
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Host "✅ npm version: $npmVersion" -ForegroundColor Green
}
catch {
    Write-Host "❌ npm not found" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📦 Installing dependencies..." -ForegroundColor Blue

# Install frontend dependencies
Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location "frontend"
try {
    npm install --legacy-peer-deps
    Write-Host "✅ Frontend dependencies installed" -ForegroundColor Green
}
catch {
    Write-Host "❌ Failed to install frontend dependencies" -ForegroundColor Red
    Set-Location ".."
    exit 1
}

Set-Location ".."

# Install backend dependencies
Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
Set-Location "backend"
try {
    npm install
    Write-Host "✅ Backend dependencies installed" -ForegroundColor Green
}
catch {
    Write-Host "❌ Failed to install backend dependencies" -ForegroundColor Red
    Set-Location ".."
    exit 1
}

Set-Location ".."

Write-Host ""
Write-Host "🧪 Running tests..." -ForegroundColor Blue

# Test frontend build
Write-Host "Testing frontend build..." -ForegroundColor Yellow
Set-Location "frontend"
try {
    npm run build
    Write-Host "✅ Frontend build successful" -ForegroundColor Green
}
catch {
    Write-Host "❌ Frontend build failed" -ForegroundColor Red
    Set-Location ".."
    exit 1
}

Set-Location ".."

# Test backend
Write-Host "Testing backend..." -ForegroundColor Yellow
Set-Location "backend"
try {
    npm test
    Write-Host "✅ Backend tests passed" -ForegroundColor Green
}
catch {
    Write-Host "❌ Backend tests failed" -ForegroundColor Red
    Set-Location ".."
    exit 1
}

Set-Location ".."

Write-Host ""
Write-Host "🚀 Starting development servers..." -ForegroundColor Blue

# Start backend in background
Write-Host "Starting backend server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-Command", "cd backend; npm run dev" -WindowStyle Minimized

# Wait a bit for backend to start
Start-Sleep -Seconds 5

# Test backend health
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/specialties" -Method GET -TimeoutSec 10
    Write-Host "✅ Backend is running and accessible" -ForegroundColor Green
}
catch {
    Write-Host "⚠️ Backend might not be ready yet or there's an issue" -ForegroundColor Yellow
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Gray
}

# Start frontend
Write-Host "Starting frontend server..." -ForegroundColor Yellow
Write-Host "Frontend will be available at: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend API is available at: http://localhost:8080/api" -ForegroundColor Cyan

Set-Location "frontend"
npm run dev

# This will keep running until user stops it

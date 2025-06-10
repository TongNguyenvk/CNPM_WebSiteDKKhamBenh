# Test Docker connectivity between frontend and backend

Write-Host "🔍 Testing Docker container connectivity..." -ForegroundColor Cyan

# Test if containers are running
Write-Host "📋 Checking running containers:" -ForegroundColor Blue
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

Write-Host ""
Write-Host "🌐 Testing API endpoints from host machine:" -ForegroundColor Blue

# Test backend health from host
Write-Host "Testing backend from host (localhost:8080):"
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/api/specialties" -Method GET -TimeoutSec 10
    Write-Host "✅ Backend accessible from host - Status: $($response.StatusCode)" -ForegroundColor Green
}
catch {
    Write-Host "❌ Backend not accessible from host: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "🐳 Testing API endpoints from within frontend container:" -ForegroundColor Blue

# Get frontend container name
$frontendContainer = docker ps --filter "ancestor=tongnguyen/frontend" --format "{{.Names}}" | Select-Object -First 1

if (-not $frontendContainer) {
    Write-Host "❌ Frontend container not found" -ForegroundColor Red
    exit 1
}

Write-Host "Frontend container: $frontendContainer" -ForegroundColor Yellow

# Test backend connectivity from frontend container
Write-Host "Testing backend from frontend container (backend:8080):"
try {
    $result = docker exec $frontendContainer sh -c "curl -f http://backend:8080/api/specialties"
    Write-Host "✅ Backend accessible from frontend container" -ForegroundColor Green
}
catch {
    Write-Host "❌ Backend not accessible from frontend container" -ForegroundColor Red
}

Write-Host ""
Write-Host "🔍 Testing specific specialty endpoint:" -ForegroundColor Blue
try {
    $result = docker exec $frontendContainer sh -c "curl -f http://backend:8080/api/specialties/1"
    Write-Host "✅ Specialty endpoint accessible" -ForegroundColor Green
}
catch {
    Write-Host "❌ Specialty endpoint not accessible" -ForegroundColor Red
}

Write-Host ""
Write-Host "📊 Network information:" -ForegroundColor Blue
docker network ls
docker network inspect cnpm_websitedkkhambenh_app-network

Write-Host ""
Write-Host "🔧 Container logs (last 10 lines):" -ForegroundColor Blue

$backendContainer = docker ps --filter "ancestor=tongnguyen/backend" --format "{{.Names}}" | Select-Object -First 1

if ($backendContainer) {
    Write-Host "Backend logs:" -ForegroundColor Yellow
    docker logs --tail 10 $backendContainer
}

Write-Host ""
Write-Host "Frontend logs:" -ForegroundColor Yellow
docker logs --tail 10 $frontendContainer

Write-Host ""
Write-Host "🔍 Environment variables check:" -ForegroundColor Blue
Write-Host "Frontend environment:" -ForegroundColor Yellow
docker exec $frontendContainer sh -c "env | grep -E '(API_URL|NEXT_PUBLIC)'"

Write-Host ""
Write-Host "Backend environment:" -ForegroundColor Yellow
if ($backendContainer) {
    docker exec $backendContainer sh -c "env | grep -E '(NODE_ENV|PORT|DB_|ALLOWED_ORIGINS)'"
}

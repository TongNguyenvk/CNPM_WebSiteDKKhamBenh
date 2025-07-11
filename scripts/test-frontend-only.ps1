# Test frontend only
Write-Host "Testing Frontend Only..." -ForegroundColor Green

# Set test environment variables
$env:NODE_ENV = "test"
$env:NEXT_PUBLIC_API_URL = "http://localhost:8080"

# Go to frontend directory
Push-Location frontend

try {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm ci --legacy-peer-deps
    
    Write-Host "Running frontend tests..." -ForegroundColor Blue
    npm run test:ci
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Frontend tests passed!" -ForegroundColor Green
    } else {
        Write-Host "Frontend tests failed!" -ForegroundColor Red
    }
}
finally {
    Pop-Location
}

exit $LASTEXITCODE

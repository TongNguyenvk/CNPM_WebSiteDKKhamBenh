# Test backend only
Write-Host "Testing Backend Only..." -ForegroundColor Green

# Set test environment variables
$env:NODE_ENV = "test"
$env:DB_NAME = "test_db"
$env:DB_USERNAME = "root"
$env:DB_PASSWORD = "root"
$env:DB_HOST = "localhost"
$env:DB_PORT = "3306"
$env:JWT_SECRET = "test-jwt-secret"

# Go to backend directory
Push-Location backend

try {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm ci

    Write-Host "Running backend tests..." -ForegroundColor Blue
    npm test

    if ($LASTEXITCODE -eq 0) {
        Write-Host "Backend tests passed!" -ForegroundColor Green
    } else {
        Write-Host "Backend tests failed!" -ForegroundColor Red
    }
}
finally {
    Pop-Location
}

exit $LASTEXITCODE

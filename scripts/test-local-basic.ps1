# Simple PowerShell script to run tests locally
Write-Host "Testing Local Environment..." -ForegroundColor Green

# Set test environment variables
$env:NODE_ENV = "test"
$env:DB_NAME = "test_db"
$env:DB_USERNAME = "root"
$env:DB_PASSWORD = "root"
$env:DB_HOST = "localhost"
$env:DB_PORT = "3306"
$env:JWT_SECRET = "test-jwt-secret"

Write-Host "Test Environment: NODE_ENV=$($env:NODE_ENV)" -ForegroundColor Cyan

# Initialize results
$backendResult = 0
$frontendResult = 0

# Run Backend Tests
Write-Host "`nRunning Backend Tests..." -ForegroundColor Blue
Push-Location backend

Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
npm ci

Write-Host "Running backend tests..." -ForegroundColor Gray
npm test
$backendResult = $LASTEXITCODE

if ($backendResult -eq 0) {
    Write-Host "Backend tests passed!" -ForegroundColor Green
} else {
    Write-Host "Backend tests failed!" -ForegroundColor Red
}

Pop-Location

# Run Frontend Tests
Write-Host "`nRunning Frontend Tests..." -ForegroundColor Blue
Push-Location frontend

Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
npm ci --legacy-peer-deps

Write-Host "Running frontend tests..." -ForegroundColor Gray
npm run test:ci
$frontendResult = $LASTEXITCODE

if ($frontendResult -eq 0) {
    Write-Host "Frontend tests passed!" -ForegroundColor Green
} else {
    Write-Host "Frontend tests failed!" -ForegroundColor Red
}

Pop-Location

# Summary
Write-Host "`nTest Summary:" -ForegroundColor Cyan
if ($backendResult -eq 0) {
    Write-Host "Backend Tests: PASSED" -ForegroundColor Green
} else {
    Write-Host "Backend Tests: FAILED" -ForegroundColor Red
}

if ($frontendResult -eq 0) {
    Write-Host "Frontend Tests: PASSED" -ForegroundColor Green
} else {
    Write-Host "Frontend Tests: FAILED" -ForegroundColor Red
}

# Exit with appropriate code
if ($backendResult -eq 0 -and $frontendResult -eq 0) {
    Write-Host "`nAll tests passed! Ready to push to GitHub." -ForegroundColor Green
    exit 0
} else {
    Write-Host "`nSome tests failed. Please fix before pushing to GitHub." -ForegroundColor Red
    exit 1
}

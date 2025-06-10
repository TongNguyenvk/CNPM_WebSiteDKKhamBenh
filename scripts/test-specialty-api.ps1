# Test Specialty API endpoints

param(
    [string]$BaseUrl = "http://localhost:8080/api",
    [int]$SpecialtyId = 1
)

Write-Host "🔍 Testing Specialty API Endpoints" -ForegroundColor Cyan
Write-Host "Base URL: $BaseUrl" -ForegroundColor Yellow
Write-Host "Testing Specialty ID: $SpecialtyId" -ForegroundColor Yellow
Write-Host ""

# Test 1: Get all specialties
Write-Host "📋 Test 1: Get all specialties" -ForegroundColor Blue
try {
    $response = Invoke-RestMethod -Uri "$BaseUrl/specialties" -Method GET -TimeoutSec 10
    Write-Host "✅ Success: Found $($response.Count) specialties" -ForegroundColor Green
    
    if ($response.Count -gt 0) {
        Write-Host "First specialty: $($response[0].name)" -ForegroundColor Gray
    }
}
catch {
    Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 2: Get specialty by ID
Write-Host "📋 Test 2: Get specialty by ID ($SpecialtyId)" -ForegroundColor Blue
try {
    $specialty = Invoke-RestMethod -Uri "$BaseUrl/specialties/$SpecialtyId" -Method GET -TimeoutSec 10
    Write-Host "✅ Success: Found specialty '$($specialty.name)'" -ForegroundColor Green
    Write-Host "Description length: $($specialty.description.Length) characters" -ForegroundColor Gray
}
catch {
    Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response.StatusCode -eq 404) {
        Write-Host "Specialty with ID $SpecialtyId not found. Try a different ID." -ForegroundColor Yellow
    }
}

Write-Host ""

# Test 3: Get doctors by specialty
Write-Host "📋 Test 3: Get doctors by specialty ($SpecialtyId)" -ForegroundColor Blue
try {
    $doctors = Invoke-RestMethod -Uri "$BaseUrl/doctor/specialty/$SpecialtyId" -Method GET -TimeoutSec 10
    Write-Host "✅ Success: Found $($doctors.Count) doctors" -ForegroundColor Green
    
    if ($doctors.Count -gt 0) {
        foreach ($doctor in $doctors) {
            Write-Host "  - Dr. $($doctor.firstName) $($doctor.lastName)" -ForegroundColor Gray
        }
    } else {
        Write-Host "  No doctors found for this specialty" -ForegroundColor Yellow
    }
}
catch {
    Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 4: Test invalid specialty ID
Write-Host "📋 Test 4: Test invalid specialty ID (999999)" -ForegroundColor Blue
try {
    $response = Invoke-RestMethod -Uri "$BaseUrl/specialties/999999" -Method GET -TimeoutSec 10
    Write-Host "⚠️ Unexpected success for invalid ID" -ForegroundColor Yellow
}
catch {
    if ($_.Exception.Response.StatusCode -eq 404) {
        Write-Host "✅ Correctly returned 404 for invalid ID" -ForegroundColor Green
    } else {
        Write-Host "❌ Unexpected error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""

# Test 5: Test malformed ID
Write-Host "📋 Test 5: Test malformed ID (abc)" -ForegroundColor Blue
try {
    $response = Invoke-RestMethod -Uri "$BaseUrl/specialties/abc" -Method GET -TimeoutSec 10
    Write-Host "⚠️ Unexpected success for malformed ID" -ForegroundColor Yellow
}
catch {
    if ($_.Exception.Response.StatusCode -eq 400) {
        Write-Host "✅ Correctly returned 400 for malformed ID" -ForegroundColor Green
    } else {
        Write-Host "❌ Unexpected error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "🎯 API Testing Complete!" -ForegroundColor Cyan

# Test frontend API configuration
Write-Host ""
Write-Host "🌐 Testing Frontend API Configuration" -ForegroundColor Cyan

# Check if frontend is running
try {
    $frontendResponse = Invoke-WebRequest -Uri "http://localhost:3000" -Method GET -TimeoutSec 5
    Write-Host "✅ Frontend is accessible" -ForegroundColor Green
    
    # Check if we can access specialty page
    try {
        $specialtyPageResponse = Invoke-WebRequest -Uri "http://localhost:3000/patient/specialties" -Method GET -TimeoutSec 10
        Write-Host "✅ Specialty list page is accessible" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Specialty list page not accessible: $($_.Exception.Message)" -ForegroundColor Red
    }
}
catch {
    Write-Host "❌ Frontend not accessible: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "💡 Troubleshooting Tips:" -ForegroundColor Yellow
Write-Host "1. Make sure backend is running on port 8080" -ForegroundColor Gray
Write-Host "2. Make sure frontend is running on port 3000" -ForegroundColor Gray
Write-Host "3. Check Docker containers are running: docker ps" -ForegroundColor Gray
Write-Host "4. Check backend logs: docker logs <backend-container>" -ForegroundColor Gray
Write-Host "5. Check frontend logs: docker logs <frontend-container>" -ForegroundColor Gray

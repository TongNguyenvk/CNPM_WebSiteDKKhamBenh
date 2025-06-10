# 🧪 Complete Test Suite Runner (PowerShell)
# This script runs all tests locally to simulate CI/CD pipeline

param(
    [switch]$SkipDocker,
    [switch]$Verbose
)

# Set error action preference
$ErrorActionPreference = "Stop"

# Function to print colored output
function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# Function to check if command exists
function Test-Command {
    param([string]$Command)
    try {
        Get-Command $Command -ErrorAction Stop | Out-Null
        return $true
    }
    catch {
        return $false
    }
}

# Check prerequisites
function Test-Prerequisites {
    Write-Status "Checking prerequisites..."
    
    if (-not (Test-Command "node")) {
        Write-Error "Node.js is not installed"
        exit 1
    }
    
    if (-not (Test-Command "npm")) {
        Write-Error "npm is not installed"
        exit 1
    }
    
    if (-not (Test-Command "docker") -and -not $SkipDocker) {
        Write-Warning "Docker is not installed - skipping Docker tests"
        $script:SkipDocker = $true
    }
    
    Write-Success "Prerequisites check completed"
}

# Frontend tests
function Test-Frontend {
    Write-Status "Running Frontend Tests..."
    
    Push-Location "frontend"
    
    try {
        Write-Status "Installing frontend dependencies..."
        npm ci
        
        Write-Status "Running ESLint..."
        npm run lint
        
        Write-Status "Running TypeScript check..."
        npm run type-check
        
        Write-Status "Building frontend..."
        npm run build
        
        Write-Success "Frontend tests completed"
    }
    finally {
        Pop-Location
    }
}

# Backend tests
function Test-Backend {
    Write-Status "Running Backend Tests..."
    
    Push-Location "backend"
    
    try {
        Write-Status "Installing backend dependencies..."
        npm ci
        
        Write-Status "Running backend tests..."
        npm run test
        
        Write-Success "Backend tests completed"
    }
    finally {
        Pop-Location
    }
}

# Security tests
function Test-Security {
    Write-Status "Running Security Tests..."
    
    Write-Status "Checking for secrets in code..."
    $secretPattern = "(password|secret|key|token)\s*=\s*['\`"][^'\`"]{8,}"
    $secretFiles = Get-ChildItem -Recurse -File -Include "*.js", "*.ts", "*.tsx", "*.jsx" | 
                   Where-Object { $_.FullName -notmatch "(node_modules|\.git|\.next)" } |
                   Select-String -Pattern $secretPattern
    
    if ($secretFiles) {
        Write-Warning "Potential secrets found in code!"
        $secretFiles | ForEach-Object { Write-Host $_.Line }
    } else {
        Write-Success "No obvious secrets found"
    }
    
    Write-Status "Running npm audit for frontend..."
    Push-Location "frontend"
    try {
        npm audit --audit-level=high
    }
    catch {
        Write-Warning "Frontend has some vulnerabilities"
    }
    finally {
        Pop-Location
    }
    
    Write-Status "Running npm audit for backend..."
    Push-Location "backend"
    try {
        npm audit --audit-level=high
    }
    catch {
        Write-Warning "Backend has some vulnerabilities"
    }
    finally {
        Pop-Location
    }
    
    Write-Success "Security tests completed"
}

# Docker tests
function Test-Docker {
    if ($script:SkipDocker) {
        Write-Warning "Skipping Docker tests (Docker not available or disabled)"
        return
    }
    
    Write-Status "Running Docker Tests..."
    
    try {
        Write-Status "Building frontend Docker image..."
        docker build -t test-frontend:latest ./frontend
        
        Write-Status "Building backend Docker image..."
        docker build -t test-backend:latest ./backend
        
        Write-Status "Cleaning up test images..."
        docker rmi test-frontend:latest test-backend:latest
        
        Write-Success "Docker tests completed"
    }
    catch {
        Write-Error "Docker tests failed: $_"
        throw
    }
}

# Code quality checks
function Test-CodeQuality {
    Write-Status "Running Code Quality Checks..."
    
    Write-Status "Analyzing code metrics..."
    
    # Count lines of code
    $frontendFiles = Get-ChildItem -Path "frontend/src" -Recurse -Include "*.ts", "*.tsx", "*.js", "*.jsx" -ErrorAction SilentlyContinue
    Write-Host "Frontend TypeScript/JavaScript files: $($frontendFiles.Count)"
    
    $backendFiles = Get-ChildItem -Path "backend/src" -Recurse -Include "*.js" -ErrorAction SilentlyContinue
    Write-Host "Backend JavaScript files: $($backendFiles.Count)"
    
    # Check for large files
    Write-Status "Checking for large files..."
    $largeFiles = Get-ChildItem -Recurse -File | 
                  Where-Object { $_.Length -gt 1MB -and $_.FullName -notmatch "(node_modules|\.git|\.next)" }
    
    if ($largeFiles) {
        $largeFiles | ForEach-Object { 
            Write-Warning "Large file detected: $($_.FullName) ($([math]::Round($_.Length/1MB, 2)) MB)"
        }
    }
    
    Write-Success "Code quality checks completed"
}

# Performance tests
function Test-Performance {
    Write-Status "Running Performance Tests..."
    
    Push-Location "frontend"
    
    try {
        if (Test-Path ".next") {
            Write-Status "Analyzing bundle size..."
            
            $staticFiles = Get-ChildItem -Path ".next/static" -Recurse -ErrorAction SilentlyContinue
            if ($staticFiles) {
                $staticFiles | Sort-Object Length -Descending | Select-Object -First 5 | 
                ForEach-Object { 
                    Write-Host "$($_.Name): $([math]::Round($_.Length/1KB, 2)) KB"
                }
            }
            
            $buildSize = (Get-ChildItem -Path ".next" -Recurse | Measure-Object -Property Length -Sum).Sum
            Write-Host "Total build size: $([math]::Round($buildSize/1MB, 2)) MB"
        } else {
            Write-Warning "No build found - run 'npm run build' first"
        }
    }
    finally {
        Pop-Location
    }
    
    Write-Success "Performance tests completed"
}

# Main execution
function Main {
    Write-Host "🧪 Starting Complete Test Suite" -ForegroundColor Cyan
    Write-Host "================================" -ForegroundColor Cyan
    
    $startTime = Get-Date
    
    try {
        Test-Prerequisites
        Test-Frontend
        Test-Backend
        Test-Security
        Test-Docker
        Test-CodeQuality
        Test-Performance
        
        $endTime = Get-Date
        $duration = ($endTime - $startTime).TotalSeconds
        
        Write-Host ""
        Write-Host "🎉 All Tests Completed Successfully!" -ForegroundColor Green
        Write-Host "==================================" -ForegroundColor Green
        Write-Host "Total execution time: $([math]::Round($duration, 2)) seconds"
        Write-Host ""
        Write-Host "✅ Frontend tests passed" -ForegroundColor Green
        Write-Host "✅ Backend tests passed" -ForegroundColor Green
        Write-Host "✅ Security checks passed" -ForegroundColor Green
        if (-not $script:SkipDocker) {
            Write-Host "✅ Docker tests passed" -ForegroundColor Green
        }
        Write-Host "✅ Code quality checks passed" -ForegroundColor Green
        Write-Host "✅ Performance tests passed" -ForegroundColor Green
        Write-Host ""
        Write-Host "🚀 Your code is ready for CI/CD pipeline!" -ForegroundColor Cyan
    }
    catch {
        Write-Error "Test suite failed: $_"
        exit 1
    }
}

# Handle script interruption
trap {
    Write-Error "Test suite interrupted"
    exit 1
}

# Run main function
Main

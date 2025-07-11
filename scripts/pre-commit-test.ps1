# Pre-commit test script - Run this before committing code
Write-Host "🔍 Pre-commit Tests Starting..." -ForegroundColor Green

# Function to check Git status
function Get-GitStatus {
    try {
        $status = git status --porcelain
        return $status
    }
    catch {
        Write-Host "❌ Not in a Git repository" -ForegroundColor Red
        return $null
    }
}

# Function to get staged files
function Get-StagedFiles {
    try {
        $staged = git diff --cached --name-only
        return $staged
    }
    catch {
        return @()
    }
}

# Check if we're in a Git repository
$gitStatus = Get-GitStatus
if ($null -eq $gitStatus) {
    exit 1
}

# Get staged files
$stagedFiles = Get-StagedFiles
if ($stagedFiles.Count -eq 0) {
    Write-Host "⚠️ No staged files found. Stage your changes first with 'git add'" -ForegroundColor Yellow
    exit 1
}

Write-Host "📁 Staged files:" -ForegroundColor Cyan
$stagedFiles | ForEach-Object { Write-Host "  $_" -ForegroundColor Gray }

# Check if we need to run frontend tests
$runFrontendTests = $false
$runBackendTests = $false

foreach ($file in $stagedFiles) {
    if ($file -match "^frontend/") {
        $runFrontendTests = $true
    }
    if ($file -match "^backend/") {
        $runBackendTests = $true
    }
    if ($file -match "^(package\.json|docker-compose.*\.yml|\.github/workflows/)") {
        $runFrontendTests = $true
        $runBackendTests = $true
    }
}

if (-not $runFrontendTests -and -not $runBackendTests) {
    Write-Host "✅ No code changes detected. Skipping tests." -ForegroundColor Green
    exit 0
}

Write-Host "`n🧪 Running tests for changed files..." -ForegroundColor Blue

$testResults = @()

# Run frontend tests if needed
if ($runFrontendTests) {
    Write-Host "`n🎨 Running Frontend Tests..." -ForegroundColor Blue
    Set-Location frontend
    
    try {
        # Quick lint check
        Write-Host "  📝 Linting..." -ForegroundColor Gray
        npm run lint --silent
        if ($LASTEXITCODE -ne 0) {
            $testResults += "Frontend Lint: FAILED"
        } else {
            $testResults += "Frontend Lint: PASSED"
        }
        
        # Type check
        Write-Host "  🔍 Type checking..." -ForegroundColor Gray
        npm run type-check --silent
        if ($LASTEXITCODE -ne 0) {
            $testResults += "Frontend TypeScript: FAILED"
        } else {
            $testResults += "Frontend TypeScript: PASSED"
        }
        
        # Unit tests
        Write-Host "  🧪 Unit tests..." -ForegroundColor Gray
        npm run test:ci --silent
        if ($LASTEXITCODE -ne 0) {
            $testResults += "Frontend Tests: FAILED"
        } else {
            $testResults += "Frontend Tests: PASSED"
        }
    }
    catch {
        $testResults += "Frontend Tests: ERROR - $_"
    }
    
    Set-Location ..
}

# Run backend tests if needed
if ($runBackendTests) {
    Write-Host "`n🔧 Running Backend Tests..." -ForegroundColor Blue
    Set-Location backend
    
    try {
        # Check if database is available
        $dbAvailable = $false
        
        # Try different database configurations
        $dbConfigs = @(
            @{ Host = "localhost"; Port = 3306; Password = "root" },
            @{ Host = "localhost"; Port = 3307; Password = "123456" }
        )
        
        foreach ($config in $dbConfigs) {
            try {
                $tcpClient = New-Object System.Net.Sockets.TcpClient
                $tcpClient.Connect($config.Host, $config.Port)
                $tcpClient.Close()
                
                $env:DB_HOST = $config.Host
                $env:DB_PORT = $config.Port.ToString()
                $env:DB_PASSWORD = $config.Password
                $dbAvailable = $true
                Write-Host "  ✅ Database found on $($config.Host):$($config.Port)" -ForegroundColor Green
                break
            }
            catch {
                # Continue to next config
            }
        }
        
        if ($dbAvailable) {
            # Set test environment
            $env:NODE_ENV = "test"
            $env:DB_NAME = "test_db"
            $env:DB_USERNAME = "root"
            $env:JWT_SECRET = "test-jwt-secret"
            
            Write-Host "  🧪 Running tests..." -ForegroundColor Gray
            npm test --silent
            if ($LASTEXITCODE -ne 0) {
                $testResults += "Backend Tests: FAILED"
            } else {
                $testResults += "Backend Tests: PASSED"
            }
        } else {
            Write-Host "  ⚠️ No database available, running basic checks only..." -ForegroundColor Yellow
            npm run test:legacy --silent
            if ($LASTEXITCODE -ne 0) {
                $testResults += "Backend Basic Tests: FAILED"
            } else {
                $testResults += "Backend Basic Tests: PASSED"
            }
        }
    }
    catch {
        $testResults += "Backend Tests: ERROR - $_"
    }
    
    Set-Location ..
}

# Display results
Write-Host "`n📊 Pre-commit Test Results:" -ForegroundColor Cyan
$allPassed = $true

foreach ($result in $testResults) {
    if ($result -match "FAILED|ERROR") {
        Write-Host "  ❌ $result" -ForegroundColor Red
        $allPassed = $false
    } else {
        Write-Host "  ✅ $result" -ForegroundColor Green
    }
}

# Final result
if ($allPassed) {
    Write-Host "`n🎉 All pre-commit tests passed! You can safely commit." -ForegroundColor Green
    Write-Host "💡 To commit: git commit -m 'your commit message'" -ForegroundColor Cyan
    exit 0
} else {
    Write-Host "`n💥 Some pre-commit tests failed!" -ForegroundColor Red
    Write-Host "🔧 Please fix the issues above before committing." -ForegroundColor Yellow
    Write-Host "💡 You can run 'npm run test:local' for more detailed testing." -ForegroundColor Cyan
    exit 1
}

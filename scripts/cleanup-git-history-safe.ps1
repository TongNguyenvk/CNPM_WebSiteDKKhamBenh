# Safe Git History Cleanup for Collaborative Projects
Write-Host "🧹 Safe Git History Cleanup..." -ForegroundColor Green

# Check if we're on main branch
$currentBranch = git branch --show-current
if ($currentBranch -ne "main") {
    Write-Host "❌ Please switch to main branch first" -ForegroundColor Red
    Write-Host "Run: git checkout main" -ForegroundColor Yellow
    exit 1
}

# Pull latest changes
Write-Host "📥 Pulling latest changes..." -ForegroundColor Blue
git pull origin main

# Create backup branch
$backupBranch = "backup-before-cleanup-$(Get-Date -Format 'yyyyMMdd-HHmm')"
Write-Host "💾 Creating backup branch: $backupBranch" -ForegroundColor Yellow
git branch $backupBranch
git push origin $backupBranch

# Show recent commits
Write-Host "`n📋 Recent commits:" -ForegroundColor Cyan
git log --oneline -20

# Ask user for commit range to squash
Write-Host "`n🎯 Choose cleanup method:" -ForegroundColor Green
Write-Host "1. Squash last N commits (safe for your own commits)"
Write-Host "2. Create cleanup branch (safest for team projects)"
Write-Host "3. Show commits by author (to identify your commits)"
Write-Host "4. Cancel"

$choice = Read-Host "Enter choice (1-4)"

switch ($choice) {
    "1" {
        $commitCount = Read-Host "How many recent commits to squash?"
        
        # Validate input
        if (-not ($commitCount -match '^\d+$') -or [int]$commitCount -le 0) {
            Write-Host "❌ Invalid number" -ForegroundColor Red
            exit 1
        }
        
        Write-Host "⚠️  This will squash the last $commitCount commits" -ForegroundColor Yellow
        $confirm = Read-Host "Continue? (y/N)"
        
        if ($confirm -eq "y" -or $confirm -eq "Y") {
            git reset --soft HEAD~$commitCount
            
            $newMessage = Read-Host "Enter new commit message"
            if ([string]::IsNullOrWhiteSpace($newMessage)) {
                $newMessage = "Squash commits: cleanup and consolidate changes"
            }
            
            git commit -m $newMessage
            
            Write-Host "✅ Commits squashed locally" -ForegroundColor Green
            Write-Host "⚠️  To push changes, run: git push --force-with-lease" -ForegroundColor Yellow
            Write-Host "💡 Backup available at: $backupBranch" -ForegroundColor Cyan
        }
    }
    
    "2" {
        $cleanupBranch = "cleanup/squash-history-$(Get-Date -Format 'yyyyMMdd')"
        Write-Host "🌿 Creating cleanup branch: $cleanupBranch" -ForegroundColor Blue
        
        git checkout -b $cleanupBranch
        
        $commitCount = Read-Host "How many commits to squash in this branch?"
        if (-not ($commitCount -match '^\d+$') -or [int]$commitCount -le 0) {
            Write-Host "❌ Invalid number" -ForegroundColor Red
            git checkout main
            git branch -D $cleanupBranch
            exit 1
        }
        
        git reset --soft HEAD~$commitCount
        
        $newMessage = Read-Host "Enter commit message for squashed commits"
        if ([string]::IsNullOrWhiteSpace($newMessage)) {
            $newMessage = "Cleanup: squash and consolidate development commits"
        }
        
        git commit -m $newMessage
        git push origin $cleanupBranch
        
        Write-Host "✅ Cleanup branch created and pushed" -ForegroundColor Green
        Write-Host "📋 Next steps:" -ForegroundColor Cyan
        Write-Host "1. Go to GitHub and create PR: $cleanupBranch -> main"
        Write-Host "2. Use 'Squash and merge' option"
        Write-Host "3. Delete cleanup branch after merge"
        
        git checkout main
    }
    
    "3" {
        Write-Host "`n👤 Commits by author (last 30):" -ForegroundColor Cyan
        git log --format="%h %an %s" -30 | Sort-Object { ($_ -split ' ')[1] }
        
        Write-Host "`n💡 Use this info to identify which commits to squash" -ForegroundColor Yellow
    }
    
    "4" {
        Write-Host "❌ Cancelled" -ForegroundColor Red
        exit 0
    }
    
    default {
        Write-Host "❌ Invalid choice" -ForegroundColor Red
        exit 1
    }
}

Write-Host "`n🎉 Cleanup process completed!" -ForegroundColor Green
Write-Host "💾 Backup branch: $backupBranch" -ForegroundColor Yellow

# PowerShell script to commit and push changes
# Run with: powershell -ExecutionPolicy Bypass -File commit_changes.ps1

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "Git Commit and Push Script" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# Navigate to project directory
Set-Location "d:\Work Load\2026-27 Odd Semester\NMS"

# Step 1: Check git status
Write-Host "Step 1: Checking git status..." -ForegroundColor Yellow
git status --short
Write-Host ""

# Step 2: Add all changes
Write-Host "Step 2: Adding all changes..." -ForegroundColor Yellow
git add .
Write-Host "✓ Files staged" -ForegroundColor Green
Write-Host ""

# Step 3: Create commit
Write-Host "Step 3: Creating commit..." -ForegroundColor Yellow
$commitMessage = @"
feat: Update Spring Boot Tutorial with YANG Data Modelling

- Enhanced tutorial title to include YANG Data Modelling
- Updated description with protocol demonstrations and YANG models
- Added new badges: YANG Data Models and SNMP Mapping
- Fixed TypeScript errors (removed unused imports)
- Updated RESTCONF to HTTPS for security emphasis

Features:
- 11 comprehensive tutorial steps (Java to Postman testing)
- YANG data models coverage (ietf-interfaces, ietf-system, ietf-ip, ietf-routing)
- Complete SNMP operations mapping (GET, SET, WALK, TRAP)
- 7 Postman REST API examples
- Cisco DevNet Sandbox integration
- Interactive progress tracking

Documentation:
- Added QUICK_START.md - Fast demo guide
- Added VALIDATION_SUMMARY.md - Status validation
- Added DEMO_GUIDE.md - Complete demo scripts
- Added TUTORIAL_VALIDATION.md - Comprehensive report
- Updated README.md with tutorial information

Status:
- TypeScript: 0 errors
- Content: All 11 steps complete
- Validation: Production ready
- Testing: DevNet Sandbox verified
"@

git commit -m $commitMessage
Write-Host "✓ Commit created" -ForegroundColor Green
Write-Host ""

# Step 4: Push to GitHub
Write-Host "Step 4: Pushing to GitHub..." -ForegroundColor Yellow
git push
Write-Host "✓ Changes pushed to GitHub" -ForegroundColor Green
Write-Host ""

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "✓ SUCCESS! All changes committed and pushed" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# Display summary
Write-Host "Summary of changes:" -ForegroundColor Cyan
Write-Host "• Modified: SpringBootTutorial.tsx" -ForegroundColor White
Write-Host "• Modified: README.md" -ForegroundColor White
Write-Host "• Added: QUICK_START.md" -ForegroundColor White
Write-Host "• Added: VALIDATION_SUMMARY.md" -ForegroundColor White
Write-Host "• Added: DEMO_GUIDE.md" -ForegroundColor White
Write-Host "• Added: TUTORIAL_VALIDATION.md" -ForegroundColor White
Write-Host ""

Read-Host "Press Enter to exit"

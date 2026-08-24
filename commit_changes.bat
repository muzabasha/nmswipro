@echo off
echo Starting Git commit process...

cd /d "d:\Work Load\2026-27 Odd Semester\NMS"

echo.
echo Step 1: Adding all changes...
git add .

echo.
echo Step 2: Creating commit...
git commit -m "feat: Update Spring Boot Tutorial with YANG Data Modelling

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
- Testing: DevNet Sandbox verified"

echo.
echo Step 3: Pushing to GitHub...
git push

echo.
echo Done! Changes committed and pushed.
pause

@echo off
echo ==============================================
echo   🚀 Safe Git Update & Push Script (PrimePicks)
echo ==============================================

git add .
git commit -m "Safe auto update"
git pull origin main
git push origin main

echo.
echo ✅ Update and push complete!
pause

@echo off
echo ==============================================
echo 🚀 VIP Number Garage - Push to GitHub
echo ==============================================
cd /d "%~dp0"
echo.
echo 📁 Adding changes to Git...
git add .
echo.
echo 📝 Committing changes...
git commit -m "Update code with bug fixes and eslint configurations"
echo.
echo 📤 Uploading to GitHub...
git push origin main
echo.
echo ==============================================
echo 🎉 Done! Your code has been uploaded to GitHub.
echo ==============================================
pause

@echo off
echo ==============================================
echo 📦 VIP Number Garage - Rebuilding Website Files
echo ==============================================
cd /d "%~dp0"
echo.
echo 🔧 Compiling website with live server IP...
npm run build
echo.
echo ==============================================
echo 🎉 Done! The new files are compiled in the "dist" folder.
echo.
echo Next steps:
echo 1. Open FileZilla.
echo 2. Upload the new "assets" folder and "index.html" file from your local "dist" folder to "/var/www/html" on the Remote Site.
echo ==============================================
pause

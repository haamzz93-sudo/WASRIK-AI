@echo off
TITLE WasrikAgent AI - Frontend Web UI (Port 5173)
COLOR 0A
cd /d "%~dp0frontend"
echo Menjalankan Vite Development Server di http://localhost:5173 ...
call npm run dev
pause

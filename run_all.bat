@echo off
TITLE WasrikAgent AI - Orchestrator
COLOR 0E
echo ==============================================================================
echo       WASRIKAGENT AI - MENJALANKAN BACKEND FASTAPI & FRONTEND REACT
echo ==============================================================================
start "Wasrik Backend (FastAPI :8000)" cmd /k "%~dp0run_backend.bat"
start "Wasrik Frontend (Vite :5173)" cmd /k "%~dp0run_frontend.bat"

echo.
echo Layanan sedang dibuka di jendela terpisah:
echo - Backend API  : http://localhost:8000
echo - Swagger Docs : http://localhost:8000/docs
echo - Frontend UI  : http://localhost:5173
echo.
pause

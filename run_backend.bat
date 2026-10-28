@echo off
TITLE WasrikAgent AI - Backend FastAPI (Port 8000)
COLOR 0B
cd /d "%~dp0backend"
set MYSQL_HOST=127.0.0.1
set MYSQL_PORT=3307
set MYSQL_USER=root
set MYSQL_PASSWORD=
set MYSQL_DATABASE=wasrik_db

echo Menjalankan FastAPI Server di http://localhost:8000 ...
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
pause

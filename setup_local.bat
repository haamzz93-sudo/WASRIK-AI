@echo off
TITLE WasrikAgent AI - 1-Click Local Environment Setup
COLOR 0A

echo ==============================================================================
echo       WASRIKAGENT AI: SISTEM INTELIJEN KEPATUHAN PEMBERI KERJA JKN
echo                  BPJS KESEHATAN HEALTHKATHON 2026
echo ==============================================================================
echo [1/3] Menyiapkan Python Virtual Environment untuk Backend FastAPI...
cd /d "%~dp0backend"
if not exist "venv" (
    python -m venv venv
    echo Virtual environment 'venv' berhasil dibuat.
)
call venv\Scripts\activate.bat
python -m pip install --upgrade pip
pip install -r requirements.txt
echo Dependensi Backend Python berhasil diinstal.

echo.
echo [2/3] Menyiapkan Dependensi Frontend React + Vite + Tailwind...
cd /d "%~dp0frontend"
call npm install
echo Dependensi Frontend Node.js berhasil diinstal.

echo.
echo [3/3] Instalasi selesai 100%%!
echo Anda sekarang dapat menjalankan proyek dengan menjalankan:
echo    - run_all.bat      (Menjalankan backend & frontend bersamaan)
echo    - run_backend.bat  (Menjalankan server FastAPI di port 8000)
echo    - run_frontend.bat (Menjalankan web UI di port 5173)
echo ==============================================================================
pause

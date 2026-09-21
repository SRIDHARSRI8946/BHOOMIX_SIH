@echo off
title BhoomiX System Launcher
echo ===================================================
echo     BHOOMIX LAND RECORD VERIFICATION SYSTEM
echo ===================================================
echo Starting FastAPI Backend on Port 5000...
start "BhoomiX Backend" cmd /k "cd /d %~dp0backend && python -m uvicorn app.main:app --host 0.0.0.0 --port 5000 --reload"
echo Starting Vite Frontend on Port 3000...
start "BhoomiX Frontend" cmd /k "cd /d %~dp0client && npm run dev"
echo.
echo Both servers are launching:
echo  - Frontend: http://localhost:3000
echo  - Backend:  http://127.0.0.1:5000
echo ===================================================
timeout /t 3 >nul
start http://localhost:3000

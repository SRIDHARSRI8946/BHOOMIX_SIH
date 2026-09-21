@echo off
title BhoomiX - Reset Document Data
echo ===================================================
echo   Resetting Uploaded Document Records in BhoomiX
echo ===================================================
cd /d %~dp0backend
python reset_documents.py
echo.
echo Document reset complete!
pause

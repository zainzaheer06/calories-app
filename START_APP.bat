@echo off
echo ========================================
echo   Calorie Tracker App - Quick Start
echo ========================================
echo.

echo Starting Backend (Flask)...
start cmd /k "python run.py"

timeout /t 3 /nobreak >nul

echo.
echo Starting Frontend (Expo)...
start cmd /k "cd CalorieMobileApp && npm start"

echo.
echo ========================================
echo   Both servers are starting!
echo ========================================
echo.
echo Backend: http://localhost:5000
echo Frontend: Check the Expo terminal
echo.
echo Press 'a' in Expo terminal for Android
echo Press 'i' in Expo terminal for iOS
echo.
pause

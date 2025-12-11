@echo off
echo ========================================
echo Starting ngrok tunnel for Flask backend
echo ========================================
echo.
echo Backend is running on port 5000
echo Starting ngrok...
echo.
ngrok http 5000

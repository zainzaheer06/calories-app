@echo off
echo Setting up ADB port forwarding for Flask...
echo This will forward port 5000 from your PC to your Android device
echo.

adb reverse tcp:5000 tcp:5000

if %errorlevel% == 0 (
    echo Success! Your Android device can now access Flask at http://localhost:5000
    echo.
    echo Now update your API URL in the app to: http://localhost:5000
) else (
    echo Failed! Make sure:
    echo 1. Your phone is connected via USB
    echo 2. USB debugging is enabled
    echo 3. ADB is installed (comes with Android Studio)
)

pause

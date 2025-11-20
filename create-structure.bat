@echo off
echo 🚀 Creating React Native CalorieTracker directory structure...
echo.

REM Create directories
echo 📁 Creating directories...
mkdir src\components\common 2>nul
mkdir src\components\food 2>nul
mkdir src\components\camera 2>nul
mkdir src\screens\auth 2>nul
mkdir src\screens\main 2>nul
mkdir src\screens\analytics 2>nul
mkdir src\services 2>nul
mkdir src\context 2>nul
mkdir src\navigation 2>nul
mkdir src\utils 2>nul
mkdir src\assets\images 2>nul
mkdir src\assets\icons 2>nul

REM Create root files
echo 📄 Creating root files...
type nul > package.json
type nul > babel.config.js
type nul > metro.config.js
type nul > index.js
type nul > App.js

REM Create common components
echo 🔧 Creating common components...
type nul > src\components\common\Button.js
type nul > src\components\common\Input.js
type nul > src\components\common\LoadingSpinner.js
type nul > src\components\common\Card.js

REM Create food components
echo 🍎 Creating food components...
type nul > src\components\food\FoodCard.js
type nul > src\components\food\NutritionChart.js
type nul > src\components\food\FoodSearchBar.js
type nul > src\components\food\CalorieProgress.js
type nul > src\components\food\FoodAnalysisModal.js

REM Create camera components
echo 📸 Creating camera components...
type nul > src\components\camera\CameraView.js
type nul > src\components\camera\ImagePreview.js

REM Create auth screens
echo 🔐 Creating auth screens...
type nul > src\screens\auth\LoginScreen.js
type nul > src\screens\auth\RegisterScreen.js
type nul > src\screens\auth\ProfileSetupScreen.js

REM Create main screens
echo 🖥️  Creating main screens...
type nul > src\screens\main\HomeScreen.js
type nul > src\screens\main\CameraScreen.js
type nul > src\screens\main\SearchScreen.js
type nul > src\screens\main\LogScreen.js
type nul > src\screens\main\ProfileScreen.js

REM Create analytics screens
echo 📊 Creating analytics screens...
type nul > src\screens\analytics\AnalyticsScreen.js
type nul > src\screens\analytics\ProgressScreen.js

REM Create services
echo 🌐 Creating services...
type nul > src\services\api.js
type nul > src\services\auth.js
type nul > src\services\food.js
type nul > src\services\camera.js
type nul > src\services\storage.js

REM Create context
echo ⚡ Creating context...
type nul > src\context\AuthContext.js
type nul > src\context\FoodContext.js

REM Create navigation
echo 🧭 Creating navigation...
type nul > src\navigation\AppNavigator.js
type nul > src\navigation\AuthNavigator.js
type nul > src\navigation\MainTabNavigator.js

REM Create utils
echo 🛠️  Creating utils...
type nul > src\utils\constants.js
type nul > src\utils\helpers.js
type nul > src\utils\validation.js
type nul > src\utils\permissions.js

REM Create .gitignore
echo ⚙️  Creating config files...
(
echo # Dependencies
echo node_modules/
echo npm-debug.log*
echo yarn-debug.log*
echo yarn-error.log*
echo.
echo # React Native
echo .expo/
echo .expo-shared/
echo web-build/
echo.
echo # iOS
echo ios/build/
echo ios/Pods/
echo ios/*.xcworkspace
echo *.pbxuser
echo *.mode1v3
echo *.mode2v3
echo *.perspectivev3
echo xcuserdata
echo *.xccheckout
echo *.moved-aside
echo DerivedData
echo *.hmap
echo *.ipa
echo ios/.xcode.env.local
echo.
echo # Android
echo android/app/build/
echo android/build/
echo android/.gradle
echo android/captures/
echo android/gradlew
echo android/gradlew.bat
echo android/local.properties
echo *.keystore
echo !debug.keystore
echo.
echo # Misc
echo .DS_Store
echo *.tgz
echo *.log
echo .vscode/
echo .idea/
echo.
echo # Environment
echo .env
echo .env.local
echo .env.production
) > .gitignore

REM Create README.md
(
echo # CalorieTracker React Native App
echo.
echo A comprehensive calorie tracking app with AI-powered food recognition.
echo.
echo ## Features
echo - 📸 AI-powered food recognition using camera
echo - 🍎 Manual food search and logging
echo - 📊 Nutrition analytics and progress tracking
echo - 👤 User authentication and profile management
echo - 🎯 Goal setting and achievement tracking
echo.
echo ## Setup
echo 1. npm install
echo 2. cd ios ^&^& pod install ^&^& cd .. ^(iOS only^)
echo 3. Update API_BASE_URL in src/utils/constants.js
echo 4. npm run android or npm run ios
echo.
echo ## Backend
echo This app requires the Flask backend to be running on your local machine or server.
echo.
echo ## Tech Stack
echo - React Native 0.72
echo - React Navigation 6
echo - React Context for state management
echo - Axios for API calls
echo - Vision Camera for food scanning
echo - Vector Icons for UI icons
) > README.md

REM Create app.json
(
echo {
echo   "name": "CalorieTracker",
echo   "displayName": "Calorie Tracker",
echo   "version": "1.0.0"
echo }
) > app.json

echo.
echo 🎉 SUCCESS! React Native CalorieTracker structure created!
echo.
echo 📋 Next steps:
echo 1. Copy the file contents from the artifacts into respective files
echo 2. Run: npm install
echo 3. For iOS: cd ios ^&^& pod install ^&^& cd ..
echo 4. Update API_BASE_URL in src/utils/constants.js
echo 5. Run: npm run android ^(or npm run ios^)
echo.
echo 📁 Structure created successfully!
echo ✅ Ready for development!
pause
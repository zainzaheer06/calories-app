# 🍎 Calorie Tracker Mobile App

React Native + Expo mobile application for tracking calories and nutrition, connected to the Flask backend.

## 📱 Features

- ✅ User Registration & Login
- ✅ JWT Authentication
- ✅ Home Dashboard with daily calorie tracking
- ✅ Manual food logging
- ✅ Profile management
- ✅ Weekly & Monthly analytics
- ✅ Macronutrient tracking
- ✅ Goal progress monitoring

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- Flask backend running

### Installation

1. **Navigate to the mobile app directory:**
```bash
cd CalorieMobileApp
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure API URL:**

Edit `src/services/api.js` and update the API_URL:

```javascript
// For Android Emulator
const API_URL = 'http://10.0.2.2:5000/api';

// For iOS Simulator
const API_URL = 'http://localhost:5000/api';

// For Physical Device (use your computer's IP)
const API_URL = 'http://192.168.100.48:5000/api';
```

To find your computer's IP:
- **Windows:** `ipconfig` (look for IPv4 Address)
- **Mac/Linux:** `ifconfig` or `ip addr`

4. **Start the Flask backend:**
```bash
# In the backend directory
python run.py
```

5. **Start the Expo development server:**
```bash
npm start
```

6. **Run on device/emulator:**
- Press `a` for Android
- Press `i` for iOS
- Scan QR code with Expo Go app on your phone

## 📂 Project Structure

```
CalorieMobileApp/
├── App.js                      # Main app component
├── app.json                    # Expo configuration
├── package.json                # Dependencies
├── babel.config.js             # Babel configuration
└── src/
    ├── context/
    │   └── AuthContext.js      # Authentication context
    ├── services/
    │   └── api.js              # API service layer
    └── screens/
        ├── LoginScreen.js      # Login screen
        ├── RegisterScreen.js   # Registration screen
        ├── HomeScreen.js       # Home dashboard
        ├── ProfileScreen.js    # User profile
        ├── AddFoodScreen.js    # Add food manually
        └── AnalyticsScreen.js  # Analytics & insights
```

## 🔧 Configuration

### Backend Connection

Make sure your Flask backend is running and accessible:

1. Start the Flask server:
```bash
python run.py
```

2. Test the connection:
```bash
curl http://localhost:5000/api/health
```

3. If using a physical device, ensure:
   - Your phone and computer are on the same WiFi network
   - Your firewall allows connections on port 5000
   - You've updated the API_URL in `src/services/api.js`

### Environment Setup

The app uses these environment configurations:
- Development: Expo development server
- Production: Build with `expo build`

## 📱 Screens

### 1. Login Screen
- Email and password authentication
- Link to registration
- JWT token storage

### 2. Register Screen
- Complete user profile setup
- Physical stats (age, weight, height)
- Activity level selection
- Goal setting
- Password validation

### 3. Home Screen
- Daily calorie summary
- Progress bar
- Macronutrient breakdown
- Today's meals list
- Pull to refresh

### 4. Add Food Screen
- Manual food entry
- Serving size input
- Calorie and macro tracking
- Meal type selection

### 5. Profile Screen
- User information display
- Physical stats
- Goals overview
- Logout functionality

### 6. Analytics Screen
- Weekly/Monthly toggle
- Total and average calories
- Macronutrient breakdown
- Daily breakdown chart

## 🔐 Authentication Flow

1. User registers or logs in
2. Backend returns JWT token
3. Token stored in AsyncStorage
4. Token included in all API requests
5. Auto-login on app restart if token valid

## 🌐 API Integration

The app connects to these backend endpoints:

### Auth
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Food
- `POST /api/food/log` - Add food log
- `GET /api/food/logs` - Get food logs
- `DELETE /api/food/logs/:id` - Delete food log

### Analytics
- `GET /api/analytics/daily` - Daily summary
- `GET /api/analytics/weekly` - Weekly summary
- `GET /api/analytics/monthly` - Monthly summary

## 🐛 Troubleshooting

### Cannot connect to backend

**Problem:** App shows network error

**Solutions:**
1. Check Flask server is running: `http://localhost:5000/api/health`
2. Verify API_URL in `src/services/api.js`
3. For physical device, use computer's IP address
4. Check firewall settings
5. Ensure same WiFi network

### Registration fails

**Problem:** "Invalid email format" or password errors

**Solutions:**
1. Use valid email format
2. Password must be 8+ characters
3. Password must contain uppercase, lowercase, and number
4. Check backend logs for detailed errors

### App crashes on startup

**Solutions:**
1. Clear Expo cache: `expo start -c`
2. Reinstall dependencies: `rm -rf node_modules && npm install`
3. Check for missing dependencies

## 📦 Dependencies

- **expo** - Expo framework
- **react-navigation** - Navigation
- **axios** - HTTP client
- **@react-native-async-storage/async-storage** - Local storage
- **@react-native-picker/picker** - Dropdown picker

## 🚀 Building for Production

### Android
```bash
expo build:android
```

### iOS
```bash
expo build:ios
```

## 📝 Testing

### Test User Credentials
After registration, you can test with:
- Email: test@example.com
- Password: Password123!

### API Testing
Test backend connection:
```bash
curl -X POST http://YOUR_IP:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Password123!"}'
```

## 🎨 Customization

### Colors
Edit the color scheme in each screen's StyleSheet:
- Primary: `#4CAF50` (Green)
- Background: `#f5f5f5` (Light Gray)
- Text: `#333` (Dark Gray)

### Features to Add
- [ ] Image-based food recognition
- [ ] Barcode scanning
- [ ] Custom food database
- [ ] Meal planning
- [ ] Water tracking
- [ ] Exercise logging
- [ ] Social features
- [ ] Dark mode

## 📄 License

This project is for educational purposes.

## 🤝 Support

For issues:
1. Check this README
2. Verify backend is running
3. Check console logs
4. Review API responses

---

**Happy Tracking! 🎉**

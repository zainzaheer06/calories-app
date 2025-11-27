# 🚀 START THE APP - Quick Guide

## ✅ Prerequisites Completed:
- ✅ Expo CLI installed globally
- ✅ Dependencies installed (npm install)
- ✅ Flask backend running on port 5000

---

## 📱 STEP 1: Update API URL

**IMPORTANT:** Before starting, update the API URL with your computer's IP address.

### Find Your IP Address:

**Windows:**
```bash
ipconfig
```
Look for "IPv4 Address" under your WiFi/Ethernet adapter
Example: `192.168.100.48`

**Mac/Linux:**
```bash
ifconfig
# or
ip addr show
```

### Update the API URL:

Open: `src/services/api.js`

Change line 7:
```javascript
const API_URL = 'http://YOUR_IP_HERE:5000/api';
```

Example:
```javascript
const API_URL = 'http://192.168.100.48:5000/api';
```

---

## 🚀 STEP 2: Start the App

In the `CalorieMobileApp` directory, run:

```bash
npm start
```

Or:
```bash
expo start
```

This will:
- Start the Metro bundler
- Show a QR code
- Open Expo DevTools in browser

---

## 📱 STEP 3: Run on Device

### Option A: Physical Device (Recommended)

1. **Install Expo Go:**
   - iOS: Download from App Store
   - Android: Download from Play Store

2. **Connect:**
   - Make sure phone and computer are on **same WiFi**
   - Open Expo Go app
   - Scan the QR code shown in terminal

3. **Wait for app to load** (first time takes 1-2 minutes)

### Option B: Emulator

**Android Emulator:**
- Press `a` in the terminal
- Or click "Run on Android device/emulator" in Expo DevTools

**iOS Simulator (Mac only):**
- Press `i` in the terminal
- Or click "Run on iOS simulator" in Expo DevTools

---

## 🧪 STEP 4: Test the App

### 1. Register a New User:
```
Name: Test User
Email: test@example.com
Password: Password123!
Age: 25
Weight: 70 kg
Height: 175 cm
Gender: Male
Activity: Moderate
Goal: Maintain Weight
```

### 2. Login:
```
Email: test@example.com
Password: Password123!
```

### 3. Add Food:
```
Food Name: Grilled Chicken Breast
Serving Size: 150
Calories: 165
Protein: 31
Carbs: 0
Fats: 3.6
Meal Type: Lunch
```

### 4. Explore:
- View Home dashboard
- Check Analytics
- View Profile
- Logout and login again

---

## 🔧 Troubleshooting

### "Network Error" or "Cannot connect to backend"

**Solution 1:** Verify Backend is Running
```bash
# In another terminal, test:
curl http://localhost:5000/api/health
```
Should return: `{"status":"healthy","message":"Calorie Detection API is running"}`

**Solution 2:** Check API URL
- Make sure you updated `src/services/api.js`
- Use your computer's IP, not `localhost`
- Format: `http://192.168.X.X:5000/api`

**Solution 3:** Same WiFi Network
- Phone and computer must be on same WiFi
- Corporate/school WiFi may block connections
- Try mobile hotspot if needed

**Solution 4:** Firewall
- Allow port 5000 in Windows Firewall
- Temporarily disable firewall to test

### "Invalid email format"

**Solution:**
- Backend validates email strictly
- Use format: `name@domain.com`
- Example: `test@example.com`

### "Password must contain..."

**Solution:**
Password requirements:
- Minimum 8 characters
- At least one UPPERCASE letter
- At least one lowercase letter
- At least one number

Valid examples:
- `Password123!`
- `MyPass2024`
- `Test1234`

### App won't start

**Solution 1:** Clear cache
```bash
expo start -c
```

**Solution 2:** Reinstall dependencies
```bash
rm -rf node_modules
npm install
```

**Solution 3:** Check Expo version
```bash
expo --version
```

---

## 📊 Expected Behavior

### On First Launch:
1. Shows Login screen
2. Can navigate to Register
3. After registration, automatically logged in
4. Shows Home dashboard

### Home Screen:
- Displays daily calorie summary
- Shows progress bar
- Lists today's meals
- Pull down to refresh

### Add Food:
- Fill form
- Tap "Log Food"
- Success message
- Navigates to Home
- New food appears in list

### Analytics:
- Toggle between Week/Month
- Shows calorie totals
- Displays macros
- Daily breakdown

---

## 🎯 Quick Commands

```bash
# Start app
npm start

# Start with cache cleared
expo start -c

# Run on Android
npm run android

# Run on iOS (Mac only)
npm run ios

# Stop app
Ctrl + C
```

---

## ✅ Success Checklist

Before starting:
- [ ] Flask backend running (`python run.py`)
- [ ] API URL updated in `src/services/api.js`
- [ ] Dependencies installed (`npm install`)
- [ ] Expo Go app installed on phone (if using physical device)
- [ ] Phone and computer on same WiFi

After starting:
- [ ] QR code appears in terminal
- [ ] Expo DevTools opens in browser
- [ ] App loads on device
- [ ] Can register new user
- [ ] Can login
- [ ] Can add food
- [ ] Data appears on Home screen

---

## 🎉 You're Ready!

Run this command to start:
```bash
npm start
```

Then scan the QR code with Expo Go app!

---

## 📞 Need Help?

1. Check this guide
2. Review SETUP.md
3. Check README.md
4. Verify backend logs
5. Check Expo console for errors

---

**Happy Tracking! 🍎**

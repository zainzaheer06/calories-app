# 🚀 Quick Setup Guide

## Step-by-Step Setup

### 1. Install Node.js and npm
Download from: https://nodejs.org/

Verify installation:
```bash
node --version
npm --version
```

### 2. Install Expo CLI
```bash
npm install -g expo-cli
```

### 3. Install Dependencies
```bash
cd CalorieMobileApp
npm install
```

### 4. Configure Backend Connection

**Find your computer's IP address:**

Windows:
```bash
ipconfig
```
Look for "IPv4 Address" (e.g., 192.168.100.48)

Mac/Linux:
```bash
ifconfig
# or
ip addr show
```

**Update API URL:**

Edit `src/services/api.js`:
```javascript
const API_URL = 'http://YOUR_IP_HERE:5000/api';
// Example: 'http://192.168.100.48:5000/api'
```

### 5. Start Flask Backend

In the backend directory:
```bash
python run.py
```

Verify it's running:
```bash
curl http://localhost:5000/api/health
```

### 6. Start Mobile App
```bash
npm start
```

### 7. Run on Device

**Option A: Physical Device**
1. Install "Expo Go" app from App Store/Play Store
2. Scan the QR code shown in terminal
3. Make sure phone and computer are on same WiFi

**Option B: Emulator**
- Press `a` for Android emulator
- Press `i` for iOS simulator

## 📱 Testing the App

### Test Registration
1. Open the app
2. Tap "Sign Up"
3. Fill in the form:
   - Name: Test User
   - Email: test@example.com
   - Password: Password123! (must have uppercase, lowercase, number)
   - Age: 25
   - Weight: 70 kg
   - Height: 175 cm
   - Gender: Male
   - Activity: Moderate
   - Goal: Maintain
4. Tap "Create Account"

### Test Login
1. Email: test@example.com
2. Password: Password123!
3. Tap "Login"

### Test Adding Food
1. Go to "Add Food" tab
2. Enter:
   - Food Name: Grilled Chicken
   - Serving Size: 150
   - Calories: 165
   - Protein: 31
   - Carbs: 0
   - Fats: 3.6
   - Meal Type: Lunch
3. Tap "Log Food"

## 🔧 Common Issues

### "Network Error" or "Cannot connect"

**Solution 1:** Check Backend
```bash
# Test backend is running
curl http://localhost:5000/api/health
```

**Solution 2:** Update API URL
- Use your computer's IP address, not localhost
- Format: `http://192.168.X.X:5000/api`

**Solution 3:** Check Firewall
- Allow port 5000 in firewall
- Disable firewall temporarily to test

**Solution 4:** Same Network
- Ensure phone and computer on same WiFi

### "Invalid email format"

**Solution:**
- Backend uses strict email validation
- Use format: name@domain.com
- Check backend is running latest code

### "Password must contain..."

**Solution:**
Password requirements:
- Minimum 8 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)

Example valid passwords:
- Password123!
- MyPass2024
- Test1234

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

## 📊 App Structure

```
Login/Register → Home Dashboard → Add Food
                      ↓
                  Analytics
                      ↓
                   Profile
```

## 🎯 Next Steps

After successful setup:

1. **Explore Features:**
   - View daily calorie summary
   - Add multiple meals
   - Check analytics
   - Update profile

2. **Customize:**
   - Change colors in StyleSheet
   - Add new features
   - Modify layouts

3. **Deploy:**
   - Build for Android: `expo build:android`
   - Build for iOS: `expo build:ios`

## 📞 Need Help?

1. Check README.md for detailed documentation
2. Verify backend logs for errors
3. Check Expo console for warnings
4. Test API endpoints with curl/Postman

## ✅ Checklist

- [ ] Node.js installed
- [ ] Expo CLI installed
- [ ] Dependencies installed (`npm install`)
- [ ] Backend running on port 5000
- [ ] API URL configured with correct IP
- [ ] Phone and computer on same WiFi
- [ ] Expo Go app installed (for physical device)
- [ ] Test user registered successfully

---

**You're all set! Start tracking your calories! 🎉**

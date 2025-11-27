# 🔧 JWT Token Error - FIXED

## Error: "signature verification failed" (422)

This error means your JWT token is invalid or expired.

## ✅ INSTANT FIX

### Option 1: Clear App Data (Fastest)
**On your phone/emulator:**
1. Close the app completely
2. Clear app data or reinstall
3. Open app again
4. Login fresh

### Option 2: Manual Token Clear
**In Expo app, shake device and:**
1. Open Dev Menu
2. Tap "Debug Remote JS"
3. In browser console, run:
```javascript
AsyncStorage.removeItem('token')
```
4. Reload app

### Option 3: Logout and Login Again
1. If you can access the app
2. Go to Profile
3. Tap Logout
4. Login again

---

## 🔄 What I Fixed in Code

### 1. Auto-Clear Invalid Tokens
- ✅ App now automatically detects invalid tokens
- ✅ Clears them automatically
- ✅ Redirects to login

### 2. Better Error Handling
- ✅ Catches 422 errors
- ✅ Catches 401 errors
- ✅ Clears bad tokens
- ✅ Shows login screen

---

## 🚀 Quick Solution

**Just restart the app and login again:**

1. **Stop Expo** (Ctrl+C)
2. **Restart:**
```bash
cd CalorieMobileApp
npm start
```
3. **Press 'a' or 'i'**
4. **Login again**

---

## 🔍 Why This Happened

### Common Causes:
1. **Backend restarted** - New JWT secret generated
2. **Token expired** - Old token no longer valid
3. **Database reset** - User data changed
4. **Secret key changed** - JWT_SECRET_KEY in .env changed

---

## ✅ Prevention

The code now automatically:
- Detects invalid tokens
- Clears them
- Shows login screen
- No more 422 errors!

---

## 🎯 Test After Fix

1. Restart app
2. Login
3. Use app normally
4. No more 422 errors!

---

**FIXED! Just restart and login again!** ✅

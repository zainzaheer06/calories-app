# ⚡ QUICK REFERENCE CARD

## 🚀 START EVERYTHING

### Backend:
```bash
python run.py
```
✅ Running on: http://localhost:5000

### Mobile App:
```bash
cd CalorieMobileApp
npm start
```
✅ Scan QR code with Expo Go app

---

## 📱 IMPORTANT: Update API URL First!

**File:** `CalorieMobileApp/src/services/api.js`

**Line 7:** Change to your computer's IP
```javascript
const API_URL = 'http://192.168.100.48:5000/api';
```

**Find your IP:**
- Windows: `ipconfig`
- Mac/Linux: `ifconfig`

---

## 🧪 TEST CREDENTIALS

```
Email: test@example.com
Password: Password123!
```

---

## 📊 PROJECT STRUCTURE

```
Backend:  25 API endpoints, 3 models, SQLite DB
Mobile:   6 screens, JWT auth, React Native + Expo
```

---

## 🔧 COMMON COMMANDS

### Backend:
```bash
python run.py              # Start server
python init_db.py          # Reset database
python test_basic.py       # Test backend
```

### Mobile:
```bash
npm start                  # Start app
expo start -c              # Clear cache
npm run android            # Android emulator
npm run ios                # iOS simulator
```

---

## 🐛 TROUBLESHOOTING

### "Cannot connect to backend"
1. Check backend is running: `curl http://localhost:5000/api/health`
2. Update API URL in `src/services/api.js`
3. Use computer's IP, not localhost
4. Same WiFi network
5. Allow port 5000 in firewall

### "Invalid email/password"
- Email: `name@domain.com`
- Password: 8+ chars, uppercase, lowercase, number
- Example: `Password123!`

### App won't start
```bash
expo start -c              # Clear cache
rm -rf node_modules        # Reinstall
npm install
```

---

## 📚 DOCUMENTATION

- `FINAL_SUMMARY.md` - Complete overview
- `CalorieMobileApp/START_APP.md` - Mobile quick start
- `SETUP_GUIDE.md` - Backend setup
- `API_REFERENCE.md` - API docs

---

## ✅ CHECKLIST

Before starting:
- [ ] Backend running (port 5000)
- [ ] API URL updated
- [ ] npm install completed
- [ ] Expo Go installed on phone
- [ ] Same WiFi network

---

## 🎯 QUICK TEST

1. Start backend: `python run.py`
2. Start mobile: `cd CalorieMobileApp && npm start`
3. Scan QR code
4. Register: test@example.com / Password123!
5. Add food: Chicken / 150g / 165 cal
6. Check home dashboard

---

## 📞 HELP

Issue? Check:
1. This card
2. START_APP.md
3. Backend logs
4. Expo console

---

**Ready? Run: `python run.py` and `npm start`! 🚀**

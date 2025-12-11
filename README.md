# 🍎 Calorie Tracker App

A full-stack calorie tracking application with AI-powered food recognition, built with React Native (Expo) and Flask.

---

## 📱 APK Download

**Latest Build:** https://expo.dev/accounts/ali1028/projects/calorie-mobile-app/builds/21c0640f-3ca0-4797-bd14-5f9d00fe5298

Download the APK directly to your Android phone and install.

---

## 🚀 Quick Start

### **Backend (Flask API)**

1. Start backend server:
```bash
python app.py
```
Server runs on: `http://localhost:5000`

2. Start ngrok tunnel:
```bash
START_NGROK.bat
```
Or manually: `ngrok http 5000`

### **Frontend (React Native)**

1. Start Expo:
```bash
cd CalorieMobileApp
npx expo start
```

2. Scan QR code with Expo Go app

---

## 🔧 Configuration

### **Backend URL**

Update in `CalorieMobileApp/src/services/api.js`:
```javascript
const API_URL = 'https://your-ngrok-url.ngrok-free.app';
```

### **Environment Variables**

Create `.env` file:
```
OPENAI_API_KEY=your_openai_key
SECRET_KEY=your_secret_key
```

---

## 📦 Features

- ✅ User authentication (login/register)
- ✅ AI-powered food recognition
- ✅ Camera scanner for food items
- ✅ Calorie tracking & analytics
- ✅ Multi-language support (English/Arabic)
- ✅ Profile & goal management
- ✅ Daily nutrition tracking

---

## 🛠️ Tech Stack

**Frontend:**
- React Native (Expo)
- React Navigation
- Axios
- i18next (internationalization)

**Backend:**
- Flask (Python)
- SQLAlchemy
- OpenAI API
- JWT Authentication

---

## 📂 Project Structure

```
calories-app/
├── app.py                 # Flask backend
├── CalorieMobileApp/      # React Native app
│   ├── src/
│   │   ├── screens/       # App screens
│   │   ├── components/    # Reusable components
│   │   ├── services/      # API services
│   │   └── i18n/          # Translations
│   └── App.js
├── routes/                # API routes
├── models/                # Database models
└── services/              # Backend services
```

---

## 🔐 Default Test User

```
Email: test@example.com
Password: test123
```

---

## 📞 Support

For issues or questions, check the build logs at:
https://expo.dev/accounts/ali1028/projects/calorie-mobile-app

---

**Built with ❤️ using React Native & Flask**

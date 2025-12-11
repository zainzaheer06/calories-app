# 📊 User Data Storage Guide

## 🗄️ Where User Information is Stored

### **1. Backend Database (Server Side)**

**Location:** `instance/calorie_app.db`

**Full Path:** `C:\Users\ALI DESKTOP\cal\calories-app\instance\calorie_app.db`

**Database Type:** SQLite

**Stored Information:**
```
User Table:
├── id                    (Unique user ID)
├── email                 (Login email - unique)
├── password_hash         (Encrypted password - bcrypt)
├── name                  (User's full name)
├── age                   (User's age)
├── weight                (Weight in kg)
├── height                (Height in cm)
├── gender                (male/female)
├── activity_level        (sedentary/light/moderate/very_active/extra_active)
├── goal_type             (lose_weight/maintain/gain_weight)
├── daily_calorie_goal    (Target calories per day)
├── created_at            (Registration timestamp)
└── updated_at            (Last update timestamp)

Related Tables:
├── food_logs             (All food entries with calories)
└── custom_foods          (User's custom food items)
```

---

### **2. Mobile App Storage (Client Side)**

**Location:** AsyncStorage (Phone's secure storage)

**Stored Data:**
```javascript
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",  // JWT authentication token
  "user": {                                // Cached user profile
    "id": 1,
    "email": "user@example.com",
    "name": "User Name",
    "age": 25,
    "weight": 70,
    "height": 175,
    "gender": "male",
    "activity_level": "moderate",
    "goal_type": "maintain",
    "daily_calorie_goal": 2500
  }
}
```

**Storage Path on Android:**
```
/data/data/com.calorietracker.app/files/AsyncStorage/
```

---

## 🔍 How to View User Data

### **Method 1: Run Python Script (Easiest)**

```bash
python view_users_simple.py
```

**Output:**
```
📊 REGISTERED USERS IN DATABASE
================================

👤 USER DETAILS:
  id: 1
  email: test@example.com
  name: Test User
  age: 25
  weight: 70.0 kg
  height: 175.0 cm
  gender: male
  goal_type: maintain
  daily_calorie_goal: 2594
  created_at: 2025-11-21 12:21:56
```

---

### **Method 2: DB Browser for SQLite**

1. **Download:** https://sqlitebrowser.org/
2. **Install** the application
3. **Open Database:**
   - File → Open Database
   - Navigate to: `instance/calorie_app.db`
4. **Browse Data:**
   - Click "Browse Data" tab
   - Select "user" table
   - View all user records

---

### **Method 3: Direct SQL Query**

```bash
sqlite3 instance/calorie_app.db "SELECT id, email, name, age, weight, height FROM user;"
```

---

## 🔐 Security Features

### **Password Storage:**
- ✅ Passwords are **never stored in plain text**
- ✅ Uses **bcrypt hashing** (industry standard)
- ✅ Each password has unique salt
- ✅ Impossible to reverse-engineer original password

### **Token Authentication:**
- ✅ JWT tokens expire after 30 days
- ✅ Tokens stored securely in AsyncStorage
- ✅ Automatic token refresh on app restart

### **Data Encryption:**
- ✅ HTTPS communication (via ngrok)
- ✅ Encrypted database on phone
- ✅ Secure API endpoints

---

## 📈 Current Database Statistics

**Total Users:** 4

**Users:**
1. test@example.com - Test User (Male, 25, Maintain weight)
2. test@test.com - Test User (Male, 25, Gain weight)
3. test1@test.com - test1 (Female, Lose weight)
4. test2@test.com - Test2 (Male, 19, Gain weight)

---

## 🗑️ How to Delete User Data

### **Delete Specific User:**

```python
# delete_user.py
from flask import Flask
from database import db
from models.user import User
from config import Config

app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)

with app.app_context():
    user = User.query.filter_by(email='user@example.com').first()
    if user:
        db.session.delete(user)
        db.session.commit()
        print(f"Deleted user: {user.email}")
```

### **Clear All Data:**

```bash
# Delete database file
rm instance/calorie_app.db

# Restart app to create fresh database
python app.py
```

---

## 📊 Database Backup

### **Backup Database:**

```bash
# Copy database file
copy instance\calorie_app.db instance\calorie_app_backup.db
```

### **Restore Database:**

```bash
# Restore from backup
copy instance\calorie_app_backup.db instance\calorie_app.db
```

---

## 🔄 Data Flow

```
Mobile App (APK)
    ↓
    ↓ Login/Register Request
    ↓
Ngrok Tunnel (HTTPS)
    ↓
    ↓ Forward Request
    ↓
Flask Backend (app.py)
    ↓
    ↓ Query/Update
    ↓
SQLite Database (calorie_app.db)
    ↓
    ↓ Return Data
    ↓
Mobile App (Store in AsyncStorage)
```

---

## 📱 APK User Data

**Important:** APK mein koi user data hardcoded nahi hai!

- ✅ APK sirf app code hai
- ✅ User data server pe store hota hai
- ✅ Phone pe sirf token aur cached profile
- ✅ Uninstall karne se sirf local cache delete hota hai
- ✅ Server data safe rehta hai

---

## 🛠️ Useful Commands

```bash
# View all users
python view_users_simple.py

# Check database size
dir instance\calorie_app.db

# Count users
sqlite3 instance/calorie_app.db "SELECT COUNT(*) FROM user;"

# View recent registrations
sqlite3 instance/calorie_app.db "SELECT email, created_at FROM user ORDER BY created_at DESC LIMIT 5;"
```

---

**Database Location:** `instance/calorie_app.db`  
**View Script:** `view_users_simple.py`  
**Security:** Passwords encrypted with bcrypt  
**Backup:** Copy database file regularly

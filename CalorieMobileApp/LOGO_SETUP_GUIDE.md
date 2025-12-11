# 🎨 Logo Setup Guide - Calorie Tracker App

## 📁 Required Logo Files

Place your logo images in the `assets/` folder with these exact names:

### **1. App Icon (Required)**
**File:** `assets/icon.png`
- **Size:** 1024x1024 pixels
- **Format:** PNG with transparency
- **Purpose:** Main app icon (shows on home screen)

### **2. Adaptive Icon (Android)**
**File:** `assets/adaptive-icon.png`
- **Size:** 1024x1024 pixels
- **Format:** PNG with transparency
- **Purpose:** Android adaptive icon (foreground layer)
- **Note:** Center your logo in a 512x512 safe zone

### **3. Splash Screen (Optional)**
**File:** `assets/splash.png`
- **Size:** 1242x2436 pixels (or larger)
- **Format:** PNG
- **Purpose:** Loading screen when app starts

---

## 🎨 Logo Design Recommendations

### **App Icon:**
```
✅ Simple and recognizable
✅ Works well at small sizes
✅ Clear on both light and dark backgrounds
✅ No text (or minimal text)
✅ Centered design
```

### **Color Scheme:**
```
Primary: #4CAF50 (Green - matches app theme)
Secondary: #FFFFFF (White)
Accent: #FF9800 (Orange)
```

### **Design Ideas:**
- 🍎 Apple icon with calorie counter
- 📊 Plate with nutrition chart
- 🥗 Healthy food symbol
- 💪 Fitness + nutrition combination

---

## 🛠️ How to Add Your Logo

### **Step 1: Prepare Your Images**

Create 3 PNG files:
1. `icon.png` (1024x1024)
2. `adaptive-icon.png` (1024x1024)
3. `splash.png` (1242x2436)

### **Step 2: Place Files**

Copy files to:
```
CalorieMobileApp/
└── assets/
    ├── icon.png
    ├── adaptive-icon.png
    └── splash.png
```

### **Step 3: Rebuild APK**

```bash
cd CalorieMobileApp
eas build -p android --profile preview
```

---

## 🎯 Quick Logo Creation Tools

### **Free Online Tools:**

1. **Canva** (Easiest)
   - https://www.canva.com
   - Templates: "App Icon"
   - Export: PNG, 1024x1024

2. **Figma** (Professional)
   - https://www.figma.com
   - Free design tool
   - Export at exact sizes

3. **Icon Kitchen** (Android Specific)
   - https://icon.kitchen
   - Automatic adaptive icon generation

4. **App Icon Generator**
   - https://appicon.co
   - Upload one image, get all sizes

---

## 📐 Image Size Requirements

| File | Size | Purpose |
|------|------|---------|
| icon.png | 1024x1024 | App icon (all platforms) |
| adaptive-icon.png | 1024x1024 | Android adaptive icon |
| splash.png | 1242x2436 | Splash screen |

---

## 🎨 Sample Logo Concept

```
┌─────────────────────┐
│                     │
│    🍎               │
│   ╱ ╲              │
│  ╱   ╲             │
│ ╱ 500 ╲            │
│╱  cal  ╲           │
│─────────            │
│                     │
│  Calorie Tracker    │
│                     │
└─────────────────────┘
```

---

## ✅ Current Configuration

Your `app.json` is already configured:

```json
{
  "expo": {
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "backgroundColor": "#4CAF50"
    },
    "android": {
      "icon": "./assets/icon.png",
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#4CAF50"
      }
    }
  }
}
```

---

## 🚀 Testing Your Logo

### **Before Building APK:**

```bash
# Start Expo
cd CalorieMobileApp
npx expo start

# Check if logo loads correctly
# Look for any warnings about missing assets
```

### **After Building APK:**

1. Install APK on phone
2. Check home screen icon
3. Check splash screen on app launch
4. Verify icon looks good at different sizes

---

## 🔧 Troubleshooting

### **"Asset not found" error:**
```bash
# Make sure files exist
ls assets/

# Should show:
# icon.png
# adaptive-icon.png
# splash.png
```

### **Icon looks blurry:**
- Use higher resolution (1024x1024 minimum)
- Export as PNG, not JPG
- Don't use compressed images

### **Adaptive icon cut off:**
- Keep important content in center 512x512 area
- Android crops circular/rounded shapes

---

## 📦 Default Placeholder

If you don't have a logo yet, Expo will use default icon.

**To use default temporarily:**
- Remove icon paths from app.json
- Expo generates basic icon automatically

---

## 🎨 Need Help Designing?

**I can help you:**
1. Suggest logo concepts
2. Recommend color schemes
3. Guide you through design tools
4. Optimize images for app

**Just tell me:**
- What style you want (modern, minimal, colorful)
- Any specific elements (food, fitness, health)
- Preferred colors

---

## 📝 Quick Checklist

- [ ] Create icon.png (1024x1024)
- [ ] Create adaptive-icon.png (1024x1024)
- [ ] Create splash.png (1242x2436)
- [ ] Place files in `assets/` folder
- [ ] Test with `npx expo start`
- [ ] Rebuild APK with `eas build`
- [ ] Install and verify on phone

---

**Current Status:** ✅ Configuration ready, just add your logo files!

**Next Step:** Place your logo images in `CalorieMobileApp/assets/` folder

# 🚀 Google Play Store Publishing Guide

## Prerequisites

- ✅ Google Play Developer Account ($25 one-time)
- ✅ Production-ready app
- ✅ App assets (icon, screenshots, description)
- ✅ Privacy policy URL
- ✅ Backend deployed on cloud (not ngrok)

---

## Step 1: Create Google Play Developer Account

1. Go to: https://play.google.com/console/signup
2. Pay $25 registration fee (one-time)
3. Complete developer profile
4. Accept Developer Distribution Agreement
5. Wait 24-48 hours for approval

---

## Step 2: Prepare App for Production

### A. Deploy Backend to Cloud

**⚠️ Important:** Ngrok URLs change frequently. Deploy backend permanently.

**Options:**
1. **Heroku** (Free tier available)
2. **Railway.app** (Free tier)
3. **Render.com** (Free tier)
4. **PythonAnywhere** (Free tier)
5. **AWS/Google Cloud** (Paid)

**Example: Deploy to Render.com**
```bash
# 1. Create account: https://render.com
# 2. Connect GitHub repo
# 3. Create new Web Service
# 4. Select Python
# 5. Build command: pip install -r requirements.txt
# 6. Start command: python app.py
# 7. Deploy!
```

### B. Update API URL

Update `CalorieMobileApp/src/services/api.js`:
```javascript
// Replace ngrok URL with permanent URL
const API_URL = 'https://your-app.onrender.com';
```

### C. Update App Version

Update `CalorieMobileApp/app.json`:
```json
{
  "expo": {
    "version": "1.0.0",
    "android": {
      "versionCode": 1
    }
  }
}
```

---

## Step 3: Build Production AAB

### A. Update eas.json

```json
{
  "build": {
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  }
}
```

### B. Build Command

```bash
cd CalorieMobileApp
eas build -p android --profile production
```

**Wait 15-20 minutes for build to complete.**

### C. Download AAB

- Download link will appear in terminal
- Or go to: https://expo.dev/accounts/ali1028/projects/calorie-mobile-app/builds
- Download the `.aab` file

---

## Step 4: Prepare App Assets

### Required Assets:

1. **App Icon**
   - Size: 512x512 pixels
   - Format: PNG (32-bit)
   - No transparency

2. **Feature Graphic**
   - Size: 1024x500 pixels
   - Format: PNG or JPEG
   - Showcases app

3. **Screenshots** (Minimum 2, Maximum 8)
   - Phone: 320-3840 pixels
   - Tablet: 1200-7680 pixels
   - Format: PNG or JPEG

4. **App Description**
   - Short description (80 characters)
   - Full description (4000 characters)

5. **Privacy Policy**
   - Required if app collects user data
   - Host on website or GitHub Pages

---

## Step 5: Create App on Play Console

### A. Create New App

1. Go to: https://play.google.com/console
2. Click "Create app"
3. Fill details:
   - App name: "Calorie Tracker"
   - Default language: English
   - App type: App
   - Free or Paid: Free
4. Accept declarations
5. Click "Create app"

### B. Set Up App

**Dashboard → Set up your app**

Complete these sections:

1. **App access**
   - All functionality available without restrictions
   - Or provide test credentials

2. **Ads**
   - Select: No, my app does not contain ads

3. **Content rating**
   - Complete questionnaire
   - Get rating (Everyone, Teen, etc.)

4. **Target audience**
   - Select age groups
   - Comply with policies

5. **News apps**
   - Select: No

6. **COVID-19 contact tracing**
   - Select: No

7. **Data safety**
   - Describe data collection
   - Privacy policy URL required

8. **Government apps**
   - Select: No

---

## Step 6: Store Listing

**Dashboard → Store presence → Main store listing**

Fill all required fields:

### App Details:
```
App name: Calorie Tracker
Short description: Track your daily calories and nutrition with AI-powered food recognition

Full description:
Calorie Tracker is your personal nutrition companion that helps you:

✅ Track daily calorie intake
✅ AI-powered food recognition
✅ Scan food with camera
✅ Set personalized goals
✅ Monitor nutrition breakdown
✅ Multi-language support (English/Arabic)
✅ Beautiful, intuitive interface

Features:
• Smart food logging
• Calorie calculator
• Nutrition analytics
• Goal tracking
• Profile management
• Camera scanner

Perfect for anyone looking to maintain a healthy lifestyle!
```

### Graphics:
- Upload app icon (512x512)
- Upload feature graphic (1024x500)
- Upload screenshots (minimum 2)

### Categorization:
- App category: Health & Fitness
- Tags: nutrition, calorie, health, fitness

### Contact Details:
- Email: your-email@example.com
- Website: (optional)
- Phone: (optional)

### Privacy Policy:
- URL: https://your-privacy-policy-url.com

---

## Step 7: Release

### A. Create Release

1. **Dashboard → Production → Create new release**

2. **Upload AAB**
   - Click "Upload"
   - Select downloaded `.aab` file

3. **Release Name**
   - Example: "1.0.0 - Initial Release"

4. **Release Notes**
   ```
   Initial release of Calorie Tracker!
   
   Features:
   • Track daily calories
   • AI food recognition
   • Camera scanner
   • Nutrition analytics
   • Multi-language support
   • Profile & goal management
   ```

5. **Review and Roll Out**
   - Review all details
   - Click "Save"
   - Click "Review release"
   - Click "Start rollout to Production"

---

## Step 8: Review Process

### Timeline:
- **Review time:** 1-7 days (usually 2-3 days)
- **Status:** Check in Play Console

### Possible Outcomes:

1. **Approved ✅**
   - App goes live
   - Available on Play Store
   - Users can download

2. **Rejected ❌**
   - Review rejection reasons
   - Fix issues
   - Resubmit

### Common Rejection Reasons:
- Missing privacy policy
- Incomplete store listing
- Policy violations
- Technical issues
- Missing permissions explanation

---

## Step 9: Post-Launch

### Monitor:
- User reviews
- Crash reports
- Download statistics
- User feedback

### Update Process:
1. Fix bugs/add features
2. Increment version code
3. Build new AAB
4. Create new release
5. Submit for review

---

## 💰 Costs Summary

| Item | Cost |
|------|------|
| Google Play Developer Account | $25 (one-time) |
| Backend Hosting | Free - $10/month |
| Domain (optional) | $10-15/year |
| **Total Initial** | **$25** |

---

## 📋 Checklist

Before submitting:

- [ ] Backend deployed to cloud (not ngrok)
- [ ] API URL updated in app
- [ ] Production AAB built
- [ ] App icon ready (512x512)
- [ ] Feature graphic ready (1024x500)
- [ ] Screenshots ready (minimum 2)
- [ ] App description written
- [ ] Privacy policy created & hosted
- [ ] Google Play account created ($25 paid)
- [ ] All store listing fields filled
- [ ] Content rating completed
- [ ] Data safety form completed
- [ ] Release notes written

---

## 🚀 Quick Commands

```bash
# Build production AAB
cd CalorieMobileApp
eas build -p android --profile production

# Check build status
eas build:list

# Download AAB
# Use link from terminal or expo.dev
```

---

## 📞 Need Help?

- Play Console Help: https://support.google.com/googleplay/android-developer
- EAS Build Docs: https://docs.expo.dev/build/introduction/
- Expo Forums: https://forums.expo.dev/

---

**Ready to publish? Follow steps 1-9 and your app will be live on Play Store!** 🎉

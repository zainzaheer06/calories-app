# 🍎 Apple App Store Publishing Guide

## Prerequisites

- ❌ Apple Developer Account ($99/year) - **REQUIRED**
- ❌ Mac computer (or use EAS Build cloud)
- ✅ Production-ready app
- ✅ App assets (icon, screenshots, description)
- ✅ Privacy policy URL
- ✅ Backend deployed on cloud

---

## Step 1: Apple Developer Account

### Cost: $99/year (mandatory)

1. Go to: https://developer.apple.com/programs/
2. Click "Enroll"
3. Sign in with Apple ID
4. Choose account type:
   - Individual ($99/year)
   - Organization ($99/year + D-U-N-S number)
5. Pay $99
6. Wait 24-48 hours for approval

---

## Step 2: App Store Connect Setup

1. Go to: https://appstoreconnect.apple.com
2. Sign in with Apple ID
3. Click "My Apps"
4. Click "+" → "New App"

### Fill Details:
```
Platform: iOS
Name: Calorie Tracker
Primary Language: English (U.S.)
Bundle ID: com.calorietracker.app
SKU: calorietracker001
User Access: Full Access
```

---

## Step 3: Build iOS App

### A. Update app.json

```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.calorietracker.app",
      "buildNumber": "1",
      "supportsTablet": true
    }
  }
}
```

### B. Build Command

```bash
cd CalorieMobileApp
eas build -p ios --profile production
```

**Note:** EAS will ask for Apple credentials during first build.

### C. Download IPA

- Wait 15-20 minutes
- Download `.ipa` file from expo.dev

---

## Step 4: Upload to App Store Connect

### Option A: EAS Submit (Easiest)

```bash
eas submit -p ios
```

### Option B: Transporter App

1. Download Transporter from Mac App Store
2. Open Transporter
3. Drag & drop `.ipa` file
4. Click "Deliver"

---

## Step 5: App Information

### General Information:
```
Name: Calorie Tracker
Subtitle: Track Your Nutrition
Category: Health & Fitness
Secondary Category: Food & Drink
```

### Privacy Policy:
- URL: https://your-privacy-policy-url.com

### App Review Information:
```
Contact: your-email@example.com
Phone: +1234567890
Demo Account (if needed):
  Email: demo@example.com
  Password: demo123
```

---

## Step 6: Pricing and Availability

```
Price: Free
Availability: All countries
```

---

## Step 7: App Store Listing

### Description:
```
Calorie Tracker is your personal nutrition companion that helps you maintain a healthy lifestyle.

FEATURES:
• Track daily calorie intake
• AI-powered food recognition
• Scan food with camera
• Set personalized goals
• Monitor nutrition breakdown
• Multi-language support
• Beautiful interface

Perfect for anyone looking to stay healthy!
```

### Keywords:
```
calorie,nutrition,health,fitness,diet,food,tracker,weight
```

### Screenshots:
- iPhone 6.7": 1290x2796 (minimum 3)
- iPhone 6.5": 1242x2688 (minimum 3)
- iPhone 5.5": 1242x2208 (optional)
- iPad Pro: 2048x2732 (if supporting iPad)

### App Preview Video (Optional):
- 15-30 seconds
- Shows app features

---

## Step 8: Build Selection

1. Go to "App Store" tab
2. Click "+" next to "Build"
3. Select uploaded build
4. Click "Done"

---

## Step 9: Content Rights

### Age Rating:
- Complete questionnaire
- Likely rating: 4+ or 9+

### Export Compliance:
- Does your app use encryption? → No (or Yes if using HTTPS)

---

## Step 10: Submit for Review

1. Review all information
2. Click "Add for Review"
3. Click "Submit to App Review"

---

## Review Process

### Timeline:
- **Review time:** 1-7 days (usually 24-48 hours)
- **Status:** Check in App Store Connect

### Possible Outcomes:

1. **Approved ✅**
   - App goes live
   - Available on App Store

2. **Rejected ❌**
   - Review rejection reasons
   - Fix issues
   - Resubmit

### Common Rejection Reasons:
- Missing privacy policy
- Incomplete metadata
- Guideline violations
- Crashes or bugs
- Missing features described

---

## 💰 Costs Summary

| Item | Cost |
|------|------|
| Apple Developer Account | $99/year |
| Backend Hosting | Free - $10/month |
| Domain (optional) | $10-15/year |
| **Total First Year** | **$99-124** |
| **Annual Renewal** | **$99** |

---

## 📋 Checklist

- [ ] Apple Developer Account ($99 paid)
- [ ] Backend deployed to cloud
- [ ] API URL updated
- [ ] iOS build created (.ipa)
- [ ] App uploaded to App Store Connect
- [ ] App icon ready (1024x1024)
- [ ] Screenshots ready (all sizes)
- [ ] App description written
- [ ] Privacy policy created
- [ ] Keywords selected
- [ ] Age rating completed
- [ ] Build selected
- [ ] Submitted for review

---

## 🚀 Quick Commands

```bash
# Build iOS app
cd CalorieMobileApp
eas build -p ios --profile production

# Submit to App Store
eas submit -p ios

# Check build status
eas build:list
```

---

## ⚠️ Important Notes

1. **Annual Fee:** $99 every year (mandatory)
2. **Mac Not Required:** EAS Build works from Windows
3. **Review Stricter:** Apple reviews more strictly than Google
4. **TestFlight:** Use for beta testing before release

---

**iOS publishing is more expensive and complex than Android, but reaches premium users!** 🍎

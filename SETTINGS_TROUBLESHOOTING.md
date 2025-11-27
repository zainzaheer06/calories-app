# 🔧 Settings Screen Troubleshooting

## Issue: Settings Page Not Showing

If the Settings screen is not appearing when you tap the button, follow these steps:

## ✅ Quick Fix Steps

### 1. Restart Expo App
The most common issue is that the app needs to be restarted after adding new screens.

**In your Expo terminal:**
- Press `r` to reload the app
- Or press `Ctrl+C` to stop, then run `npm start` again

### 2. Clear Metro Cache
Sometimes the bundler cache needs to be cleared.

```bash
cd CalorieMobileApp
npm start -- --clear
```

Or:
```bash
cd CalorieMobileApp
npx expo start -c
```

### 3. Check Console for Errors
Look at your terminal and Expo app console for any error messages.

**Common errors:**
- "Cannot find module" → Need to restart
- "Navigation error" → Check navigation setup
- "Component not found" → File path issue

### 4. Verify File Exists
Make sure the SettingsScreen.js file exists:
```
CalorieMobileApp/src/screens/SettingsScreen.js
```

### 5. Test Navigation Manually
Add console.log to see if button is working:

In ProfileScreen.js, update the button:
```javascript
<TouchableOpacity 
  style={styles.settingsButton} 
  onPress={() => {
    console.log('Settings button pressed!');
    navigation.navigate('Settings');
  }}
>
  <Text style={styles.settingsText}>⚙️ Edit Profile & Goals</Text>
</TouchableOpacity>
```

## 🔍 Verification Checklist

✅ **File exists:** `CalorieMobileApp/src/screens/SettingsScreen.js`
✅ **Imported in App.js:** `import SettingsScreen from './src/screens/SettingsScreen';`
✅ **Added to MainStack:** `<Stack.Screen name="Settings" component={SettingsScreen} />`
✅ **Button in ProfileScreen:** `navigation.navigate('Settings')`
✅ **Expo app restarted:** Press `r` or restart completely

## 🎯 Step-by-Step Test

### Test 1: Check if button appears
1. Open app
2. Go to Profile tab
3. Look for blue "⚙️ Edit Profile & Goals" button
4. **If button is missing:** ProfileScreen.js not updated

### Test 2: Check if button responds
1. Tap the "⚙️ Edit Profile & Goals" button
2. Watch console for logs
3. **If no response:** Navigation issue

### Test 3: Check if Settings screen loads
1. Tap button
2. Settings screen should appear
3. **If error appears:** Check error message
4. **If nothing happens:** Restart app

## 🐛 Common Issues & Solutions

### Issue 1: "Cannot read property 'navigate' of undefined"
**Solution:** Navigation not available in ProfileScreen
```javascript
// Make sure this is at the top of ProfileScreen.js
import { useNavigation } from '@react-navigation/native';

// Inside component
const navigation = useNavigation();
```

### Issue 2: "The action 'NAVIGATE' with payload {name: 'Settings'} was not handled"
**Solution:** Settings screen not registered in navigation
- Check App.js has Settings screen in MainStack
- Restart Expo app

### Issue 3: Button doesn't appear
**Solution:** ProfileScreen.js not updated
- Check if button code is added before logout button
- Verify styles are defined

### Issue 4: Screen is blank
**Solution:** SettingsScreen.js has errors
- Check console for errors
- Verify all imports are correct

### Issue 5: "Invariant Violation: Element type is invalid"
**Solution:** Import/export mismatch
```javascript
// SettingsScreen.js should have:
export default function SettingsScreen({ navigation }) {
  // ...
}

// App.js should have:
import SettingsScreen from './src/screens/SettingsScreen';
```

## 🔄 Complete Reset Steps

If nothing works, try a complete reset:

### 1. Stop everything
```bash
# Press Ctrl+C in all terminals
```

### 2. Clear all caches
```bash
cd CalorieMobileApp
rm -rf node_modules
rm -rf .expo
npm install
```

### 3. Start fresh
```bash
npx expo start -c
```

### 4. Reload app
- Press `r` in terminal
- Or shake device and tap "Reload"

## 📱 Device-Specific Issues

### iOS Simulator:
- Press `Cmd+R` to reload
- Press `Cmd+D` for dev menu

### Android Emulator:
- Press `R` twice to reload
- Press `Cmd+M` (Mac) or `Ctrl+M` (Windows) for dev menu

### Physical Device:
- Shake device for dev menu
- Tap "Reload" in dev menu

## 🎯 Expected Behavior

When working correctly:

1. **Profile Screen:**
   - Shows user info
   - Blue "⚙️ Edit Profile & Goals" button visible
   - Button above red "Logout" button

2. **Tap Button:**
   - Screen transitions to Settings
   - Settings screen loads with form

3. **Settings Screen:**
   - Green header "Settings"
   - Three sections visible
   - All form fields editable
   - "Save Changes" button at bottom

## 📞 Still Not Working?

If Settings screen still doesn't show after trying all steps:

1. **Check file structure:**
```
CalorieMobileApp/
  src/
    screens/
      SettingsScreen.js  ← File must exist here
      ProfileScreen.js
      HomeScreen.js
      ...
```

2. **Verify imports in App.js:**
```javascript
import SettingsScreen from './src/screens/SettingsScreen';
```

3. **Check navigation stack:**
```javascript
<Stack.Screen name="Settings" component={SettingsScreen} />
```

4. **Test with simple screen:**
Replace SettingsScreen content temporarily:
```javascript
export default function SettingsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings Screen Works!</Text>
    </View>
  );
}
```

If this simple version works, the issue is in the form code.

## ✅ Success Indicators

You'll know it's working when:
- ✅ Button appears on Profile screen
- ✅ Tapping button navigates to Settings
- ✅ Settings form loads completely
- ✅ Can edit fields
- ✅ Can save changes
- ✅ Back button returns to Profile

---

**Most likely solution: Just restart your Expo app!** 🔄

Press `r` in the terminal or restart the app completely.

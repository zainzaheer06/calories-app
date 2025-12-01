# 🌍 i18n Implementation Guide

## ✅ Setup Complete!

Your app now supports **English** and **Urdu** languages!

## 📁 File Structure

```
CalorieMobileApp/
├── src/
│   ├── i18n/
│   │   ├── index.js          # i18n configuration
│   │   └── locales/
│   │       ├── en.json        # English translations
│   │       └── ur.json        # Urdu translations
```

## 🔧 How to Use in Your Screens

### 1. Import useTranslation Hook

```javascript
import { useTranslation } from 'react-i18next';
```

### 2. Use in Component

```javascript
export default function MyScreen() {
  const { t, i18n } = useTranslation();
  
  return (
    <View>
      <Text>{t('home.welcome')}</Text>
      <Text>{t('home.todayCalories')}</Text>
    </View>
  );
}
```

### 3. Change Language

```javascript
// Change to Urdu
i18n.changeLanguage('ur');

// Change to English
i18n.changeLanguage('en');

// Get current language
const currentLang = i18n.language;
```

## 📝 Example: Login Screen with i18n

```javascript
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';

export default function LoginScreen() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View>
      <Text>{t('auth.login')}</Text>
      
      <TextInput
        placeholder={t('auth.email')}
        value={email}
        onChangeText={setEmail}
      />
      
      <TextInput
        placeholder={t('auth.password')}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <TouchableOpacity onPress={handleLogin}>
        <Text>{t('auth.login')}</Text>
      </TouchableOpacity>
      
      <Text>{t('auth.dontHaveAccount')}</Text>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text>{t('auth.register')}</Text>
      </TouchableOpacity>
    </View>
  );
}
```

## 🎨 Language Switcher Component

Create a language switcher in Settings:

```javascript
import { useTranslation } from 'react-i18next';
import { Picker } from '@react-native-picker/picker';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  
  return (
    <Picker
      selectedValue={i18n.language}
      onValueChange={(lang) => i18n.changeLanguage(lang)}
    >
      <Picker.Item label="English" value="en" />
      <Picker.Item label="اردو" value="ur" />
    </Picker>
  );
}
```

## 📚 Available Translation Keys

### Common
- `common.save` - Save
- `common.cancel` - Cancel
- `common.delete` - Delete
- `common.edit` - Edit
- `common.back` - Back
- `common.loading` - Loading...
- `common.error` - Error
- `common.success` - Success

### Auth
- `auth.login` - Login
- `auth.register` - Register
- `auth.email` - Email
- `auth.password` - Password
- `auth.logout` - Logout

### Home
- `home.title` - Home
- `home.welcome` - Welcome
- `home.todayCalories` - Today's Calories
- `home.calorieGoal` - Calorie Goal

### Scanner
- `scanner.title` - Food Scanner
- `scanner.takePhoto` - Take Photo
- `scanner.analyzing` - Analyzing food...
- `scanner.saveToLog` - Save to Food Log

### Profile
- `profile.title` - Profile
- `profile.editProfile` - Edit Profile & Goals
- `profile.age` - Age
- `profile.weight` - Weight
- `profile.height` - Height

### Settings
- `settings.title` - Settings
- `settings.language` - Language
- `settings.saveChanges` - Save Changes

## 🔄 How to Add New Translations

1. Open `src/i18n/locales/en.json`
2. Add your new key:
```json
{
  "mySection": {
    "myKey": "My English Text"
  }
}
```

3. Open `src/i18n/locales/ur.json`
4. Add Urdu translation:
```json
{
  "mySection": {
    "myKey": "میرا اردو متن"
  }
}
```

5. Use in your component:
```javascript
<Text>{t('mySection.myKey')}</Text>
```

## 🌐 Supported Languages

- ✅ English (en)
- ✅ Urdu (ur)

## 📱 Device Language Detection

The app automatically detects your device language and uses it if available. Otherwise, it falls back to English.

## 🎯 Next Steps

1. Update all screens to use `t()` function
2. Add language switcher in Settings screen
3. Test both languages thoroughly
4. Add more languages if needed (Arabic, Hindi, etc.)

## 💡 Tips

- Always use translation keys instead of hardcoded text
- Keep translation keys organized by feature/screen
- Test RTL (Right-to-Left) layout for Urdu
- Use meaningful key names

## 🚀 Ready to Use!

Your app is now multilingual! Start replacing hardcoded text with `t('key')` in your screens.

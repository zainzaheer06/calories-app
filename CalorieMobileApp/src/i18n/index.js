import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { I18nManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from './locales/en.json';
import ar from './locales/ar.json';

const LANGUAGE_KEY = '@app_language';

const resources = {
  en: { translation: en },
  ar: { translation: ar },
};

// Language detector plugin
const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: async (callback) => {
    try {
      // Try to get saved language from AsyncStorage
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
      if (savedLanguage) {
        console.log('Loaded saved language:', savedLanguage);
        return callback(savedLanguage);
      }
      
      // If no saved language, use English as default
      console.log('No saved language, using English');
      callback('en');
    } catch (error) {
      console.log('Error loading language:', error);
      callback('en');
    }
  },
  init: () => {},
  cacheUserLanguage: async (language) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_KEY, language);
      console.log('Language saved:', language);
    } catch (error) {
      console.log('Error saving language:', error);
    }
  },
};

// Initialize i18n
i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    compatibilityJSON: 'v3',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

// Set RTL based on initial language
i18n.on('initialized', (options) => {
  const currentLang = i18n.language;
  const isRTL = currentLang === 'ar';
  I18nManager.allowRTL(true);
  if (I18nManager.isRTL !== isRTL) {
    I18nManager.forceRTL(isRTL);
  }
  console.log('i18n initialized with language:', currentLang, 'RTL:', isRTL);
});

// Listen for language changes
i18n.on('languageChanged', async (lng) => {
  console.log('Language changed to:', lng);
  const isRTL = lng === 'ar';
  
  // Save language preference
  try {
    await AsyncStorage.setItem(LANGUAGE_KEY, lng);
  } catch (error) {
    console.log('Error saving language preference:', error);
  }
  
  // Update RTL
  if (I18nManager.isRTL !== isRTL) {
    I18nManager.forceRTL(isRTL);
    console.log('RTL changed to:', isRTL, '- App needs restart');
  }
});

export default i18n;

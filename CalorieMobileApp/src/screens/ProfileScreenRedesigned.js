import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, I18nManager } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import StickyHeader from '../components/StickyHeader';
import { colors, typography, spacing, borderRadius, shadows } from '../styles/theme';

export default function ProfileScreen() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const navigation = useNavigation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  const changeLanguage = async (lang) => {
    const isRTL = lang === 'ar' || lang === 'ur';
    const currentRTL = I18nManager.isRTL;

    // Change language first
    i18n.changeLanguage(lang);
    setCurrentLanguage(lang);

    // Get language name
    const langNames = {
      en: 'English',
      ar: 'العربية',
      ur: 'اردو'
    };

    // If RTL setting needs to change, show alert
    if (isRTL !== currentRTL) {
      Alert.alert(
        t('success'),
        `${t('languageChanged')} ${langNames[lang]}. Please restart the app for RTL support.`,
        [
          {
            text: 'OK',
            onPress: () => {
              I18nManager.forceRTL(isRTL);
              // User needs to manually restart the app
            },
          },
        ]
      );
    } else {
      Alert.alert(t('success'), `${t('languageChanged')} ${langNames[lang]}`);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      t('logout'),
      'Are you sure you want to logout?',
      [
        { text: t('cancel'), style: 'cancel' },
        { text: t('logout'), onPress: logout, style: 'destructive' },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StickyHeader 
        title={t('profile')}
        subtitle={user?.email}
      />
      <ScrollView style={styles.scrollContainer}>
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.name?.charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={styles.userName}>{user?.name}</Text>
        </View>

        {/* Language Picker */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('language')}</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={currentLanguage}
              onValueChange={(value) => changeLanguage(value)}
              style={styles.picker}
            >
              <Picker.Item label="🇬🇧 English" value="en" />
              <Picker.Item label="🇸🇦 العربية" value="ar" />
              <Picker.Item label="🇵🇰 اردو" value="ur" />
            </Picker>
          </View>
        </View>

        {/* Physical Stats */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('physicalStats')}</Text>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>{t('age')}</Text>
            <Text style={styles.statValue}>{user?.age || t('notSet')}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>{t('weight')}</Text>
            <Text style={styles.statValue}>{user?.weight ? `${user.weight} kg` : t('notSet')}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>{t('height')}</Text>
            <Text style={styles.statValue}>{user?.height ? `${user.height} cm` : t('notSet')}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>{t('gender')}</Text>
            <Text style={styles.statValue}>{user?.gender || t('notSet')}</Text>
          </View>
        </View>

        {/* Goals */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('goalsActivity')}</Text>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>{t('activityLevel')}</Text>
            <Text style={styles.statValue}>{user?.activity_level || t('notSet')}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>{t('goalType')}</Text>
            <Text style={styles.statValue}>{user?.goal_type || t('notSet')}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>{t('dailyCalorieGoal')}</Text>
            <Text style={styles.statValue}>{user?.daily_calorie_goal || t('notSet')} cal</Text>
          </View>
        </View>

        {/* Buttons */}
        <TouchableOpacity 
          style={styles.editButton} 
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={styles.editButtonText}>{t('editProfileGoals')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>{t('logout')}</Text>
        </TouchableOpacity>

        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  avatarSection: {
    backgroundColor: colors.gray50,
    padding: spacing.xl,
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatarText: {
    fontSize: typography['3xl'],
    fontWeight: typography.bold,
    color: colors.textOnPrimary,
  },
  userName: {
    fontSize: typography.xl,
    fontWeight: typography.bold,
    color: colors.textPrimary,
  },
  card: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.base,
    marginTop: spacing.base,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.base,
  },
  cardTitle: {
    fontSize: typography.lg,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  statLabel: {
    fontSize: typography.base,
    color: colors.textSecondary,
  },
  statValue: {
    fontSize: typography.base,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
  },
  pickerContainer: {
    backgroundColor: colors.gray50,
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: borderRadius.base,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  editButton: {
    backgroundColor: colors.primary,
    marginHorizontal: spacing.base,
    marginTop: spacing.base,
    padding: spacing.base,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    ...shadows.base,
  },
  editButtonText: {
    color: colors.textOnPrimary,
    fontSize: typography.base,
    fontWeight: typography.semibold,
  },
  logoutButton: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.base,
    marginTop: spacing.md,
    padding: spacing.base,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.error,
    ...shadows.sm,
  },
  logoutButtonText: {
    color: colors.error,
    fontSize: typography.base,
    fontWeight: typography.semibold,
  },
});

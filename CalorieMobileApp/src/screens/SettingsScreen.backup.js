import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import StickyHeader from '../components/StickyHeader';
import { colors, typography, spacing, borderRadius, shadows } from '../styles/theme';

export default function SettingsScreen({ navigation }) {
  const { t, i18n } = useTranslation();
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    weight: '',
    height: '',
    gender: 'male',
    activity_level: 'moderate',
    goal_type: 'maintain',
    daily_calorie_goal: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        age: user.age?.toString() || '',
        weight: user.weight?.toString() || '',
        height: user.height?.toString() || '',
        gender: user.gender || 'male',
        activity_level: user.activity_level || 'moderate',
        goal_type: user.goal_type || 'maintain',
        daily_calorie_goal: user.daily_calorie_goal?.toString() || '',
      });
    }
  }, [user]);

  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setCurrentLanguage(lang);
    const langName = lang === 'en' ? 'English' : 'العربية';
    Alert.alert(t('success'), `${t('languageChanged')} ${langName}`);
  };

  const handleSave = async () => {
    if (!formData.name) {
      Alert.alert(t('error'), t('nameRequired'));
      return;
    }

    setLoading(true);
    try {
      const updateData = {
        name: formData.name,
        age: formData.age ? parseInt(formData.age) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        height: formData.height ? parseFloat(formData.height) : null,
        gender: formData.gender,
        activity_level: formData.activity_level,
        goal_type: formData.goal_type,
        daily_calorie_goal: formData.daily_calorie_goal ? parseInt(formData.daily_calorie_goal) : null,
      };

      const response = await authAPI.updateProfile(updateData);
      
      if (response.user) {
        updateUser(response.user);
      }

      Alert.alert(t('success'), t('profileUpdateSuccess'));
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert(t('error'), error.response?.data?.error || t('profileUpdateError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StickyHeader 
        title={t('settings')}
        subtitle={t('editProfileGoals')}
      />
      <ScrollView style={styles.scrollContainer}>
        {/* Language */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🌐 {t('language')}</Text>
          <View style={styles.languageButtons}>
            <TouchableOpacity
              style={[styles.langButton, currentLanguage === 'en' && styles.langButtonActive]}
              onPress={() => changeLanguage('en')}
            >
              <Text style={[styles.langButtonText, currentLanguage === 'en' && styles.langButtonTextActive]}>
                🇬🇧 English
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.langButton, currentLanguage === 'ar' && styles.langButtonActive]}
              onPress={() => changeLanguage('ar')}
            >
              <Text style={[styles.langButtonText, currentLanguage === 'ar' && styles.langButtonTextActive]}>
                🇸🇦 العربية
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Personal Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('personalInfo')}</Text>
          
          <Text style={styles.label}>{t('name')} *</Text>
          <TextInput
            style={styles.input}
            placeholder={t('name')}
            value={formData.name}
            onChangeText={(value) => updateField('name', value)}
          />

          <Text style={styles.label}>{t('age')}</Text>
          <TextInput
            style={styles.input}
            placeholder="25"
            value={formData.age}
            onChangeText={(value) => updateField('age', value)}
            keyboardType="number-pad"
          />

          <Text style={styles.label}>{t('gender')}</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.gender}
              onValueChange={(value) => updateField('gender', value)}
              style={styles.picker}
            >
              <Picker.Item label={t('male')} value="male" />
              <Picker.Item label={t('female')} value="female" />
              <Picker.Item label={t('other')} value="other" />
            </Picker>
          </View>
        </View>

        {/* Physical Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('physicalStats')}</Text>
          
          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <Text style={styles.label}>{t('weight')} (kg)</Text>
              <TextInput
                style={styles.input}
                placeholder="70"
                value={formData.weight}
                onChangeText={(value) => updateField('weight', value)}
                keyboardType="decimal-pad"
              />
            </View>
            <View style={styles.halfWidth}>
              <Text style={styles.label}>{t('height')} (cm)</Text>
              <TextInput
                style={styles.input}
                placeholder="175"
                value={formData.height}
                onChangeText={(value) => updateField('height', value)}
                keyboardType="decimal-pad"
              />
            </View>
          </View>
        </View>

        {/* Goals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('goalsActivity')}</Text>
          
          <Text style={styles.label}>{t('activityLevel')}</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.activity_level}
              onValueChange={(value) => updateField('activity_level', value)}
              style={styles.picker}
            >
              <Picker.Item label={t('sedentary')} value="sedentary" />
              <Picker.Item label={t('lightlyActive')} value="lightly_active" />
              <Picker.Item label={t('moderatelyActive')} value="moderate" />
              <Picker.Item label={t('veryActive')} value="very_active" />
              <Picker.Item label={t('extraActive')} value="extra_active" />
            </Picker>
          </View>

          <Text style={styles.label}>{t('goalType')}</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.goal_type}
              onValueChange={(value) => updateField('goal_type', value)}
              style={styles.picker}
            >
              <Picker.Item label={t('loseWeight')} value="lose_weight" />
              <Picker.Item label={t('maintainWeight')} value="maintain" />
              <Picker.Item label={t('gainWeight')} value="gain_weight" />
            </Picker>
          </View>

          <Text style={styles.label}>{t('dailyCalorieGoal')}</Text>
          <TextInput
            style={styles.input}
            placeholder="2000"
            value={formData.daily_calorie_goal}
            onChangeText={(value) => updateField('daily_calorie_goal', value)}
            keyboardType="number-pad"
          />
          <Text style={styles.hint}>{t('autoCalculateHint')}</Text>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.saveButtonText}>{t('saveChanges')}</Text>
          )}
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
  section: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.base,
    marginTop: spacing.base,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.base,
  },
  sectionTitle: {
    fontSize: typography.lg,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.sm,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    marginTop: spacing.md,
  },
  input: {
    backgroundColor: colors.gray50,
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: borderRadius.base,
    padding: spacing.md,
    fontSize: typography.base,
    color: colors.textPrimary,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
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
  hint: {
    fontSize: typography.xs,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    fontStyle: 'italic',
  },
  languageButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  langButton: {
    flex: 1,
    backgroundColor: colors.gray100,
    padding: spacing.base,
    borderRadius: borderRadius.base,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.gray300,
  },
  langButtonActive: {
    backgroundColor: colors.primaryLight + '20',
    borderColor: colors.primary,
  },
  langButtonText: {
    fontSize: typography.base,
    fontWeight: typography.semibold,
    color: colors.textSecondary,
  },
  langButtonTextActive: {
    color: colors.primary,
  },
  saveButton: {
    backgroundColor: colors.primary,
    marginHorizontal: spacing.base,
    marginTop: spacing.base,
    padding: spacing.base,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    ...shadows.base,
  },
  saveButtonDisabled: {
    backgroundColor: colors.gray400,
  },
  saveButtonText: {
    color: colors.textOnPrimary,
    fontSize: typography.base,
    fontWeight: typography.semibold,
  },
});

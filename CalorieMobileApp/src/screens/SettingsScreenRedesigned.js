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
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import StickyHeader from '../components/StickyHeader';
import { colors, typography, spacing, borderRadius, shadows } from '../styles/theme';

export default function SettingsScreen({ navigation }) {
  const { t } = useTranslation();
  const { user, updateUser } = useAuth();
  
  // Check if navigation exists
  if (!navigation) {
    console.warn('Navigation prop is missing in SettingsScreen');
  }
  const [loading, setLoading] = useState(false);
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

  const handleSave = async () => {
    // Validation
    if (!formData.name || formData.name.trim() === '') {
      Alert.alert('Error', 'Name is required');
      return;
    }

    // Validate age if provided
    if (formData.age && (parseInt(formData.age) < 13 || parseInt(formData.age) > 120)) {
      Alert.alert('Error', 'Age must be between 13 and 120');
      return;
    }

    // Validate weight if provided
    if (formData.weight && (parseFloat(formData.weight) < 20 || parseFloat(formData.weight) > 500)) {
      Alert.alert('Error', 'Weight must be between 20 and 500 kg');
      return;
    }

    // Validate height if provided
    if (formData.height && (parseFloat(formData.height) < 100 || parseFloat(formData.height) > 250)) {
      Alert.alert('Error', 'Height must be between 100 and 250 cm');
      return;
    }

    // Validate calorie goal if provided
    if (formData.daily_calorie_goal && (parseInt(formData.daily_calorie_goal) < 800 || parseInt(formData.daily_calorie_goal) > 5000)) {
      Alert.alert('Error', 'Daily calorie goal must be between 800 and 5000');
      return;
    }

    setLoading(true);
    try {
      const updateData = {
        name: formData.name.trim(),
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
        Alert.alert('Success', 'Profile updated successfully!', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        Alert.alert('Error', 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to update profile. Please try again.';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <StickyHeader 
        title={t('settings')}
        subtitle={t('editProfileGoals')}
      />
      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Personal Info */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="person" size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>{t('personalInfo')}</Text>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              <Ionicons name="person-outline" size={14} color={colors.textSecondary} /> {t('name')} *
            </Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                placeholderTextColor={colors.gray400}
                value={formData.name}
                onChangeText={(value) => updateField('name', value)}
                maxLength={50}
                autoCapitalize="words"
              />
            </View>
          </View>

          <Text style={styles.label}>{t('Age')}</Text>
          <TextInput
            style={styles.input}
            placeholder="25"
            value={formData.age}
            onChangeText={(value) => updateField('Age', value)}
            keyboardType="number-pad"
          />

          <Text style={styles.label}>{t('Gender')}</Text>
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
          <View style={styles.sectionHeader}>
            <Ionicons name="fitness" size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>{t('physicalStats')}</Text>
          </View>
          
          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <Text style={styles.label}>
                <Ionicons name="scale-outline" size={14} color={colors.textSecondary} /> {t('weight')}
              </Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="70"
                  placeholderTextColor={colors.gray400}
                  value={formData.weight}
                  onChangeText={(value) => {
                    const numericValue = value.replace(/[^0-9.]/g, '');
                    const parts = numericValue.split('.');
                    if (parts.length > 2) return;
                    updateField('weight', numericValue);
                  }}
                  keyboardType="decimal-pad"
                  maxLength={6}
                />
                <Text style={styles.inputUnit}>kg</Text>
              </View>
            </View>
            <View style={styles.halfWidth}>
              <Text style={styles.label}>
                <Ionicons name="resize-outline" size={14} color={colors.textSecondary} /> {t('height')}
              </Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="175"
                  placeholderTextColor={colors.gray400}
                  value={formData.height}
                  onChangeText={(value) => {
                    const numericValue = value.replace(/[^0-9.]/g, '');
                    const parts = numericValue.split('.');
                    if (parts.length > 2) return;
                    updateField('height', numericValue);
                  }}
                  keyboardType="decimal-pad"
                  maxLength={6}
                />
                <Text style={styles.inputUnit}>cm</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Goals */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="trophy" size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>{t('goalsActivity')}</Text>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              <Ionicons name="walk-outline" size={14} color={colors.textSecondary} /> {t('activityLevel')}
            </Text>
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
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              <Ionicons name="flag-outline" size={14} color={colors.textSecondary} /> {t('goalType')}
            </Text>
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
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              <Ionicons name="flame-outline" size={14} color={colors.textSecondary} /> {t('dailyCalorieGoal')}
            </Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="2000"
                placeholderTextColor={colors.gray400}
                value={formData.daily_calorie_goal}
                onChangeText={(value) => {
                  const numericValue = value.replace(/[^0-9]/g, '');
                  updateField('daily_calorie_goal', numericValue);
                }}
                keyboardType="number-pad"
                maxLength={4}
              />
              <Text style={styles.inputUnit}>cal</Text>
            </View>
            <View style={styles.hintContainer}>
              <Ionicons name="information-circle-outline" size={16} color={colors.info} />
              <Text style={styles.hint}>{t('Leave empty to auto-calculate based on your stats')}</Text>
            </View>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} size="small" />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={20} color={colors.white} />
              <Text style={styles.saveButtonText}>{t('saveChanges')}</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </KeyboardAvoidingView>
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: colors.primaryLight + '30',
  },
  sectionTitle: {
    fontSize: typography.lg,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginLeft: spacing.sm,
  },
  inputGroup: {
    marginBottom: spacing.base,
  },
  label: {
    fontSize: typography.sm,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray50,
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: borderRadius.base,
    paddingHorizontal: spacing.md,
  },
  input: {
    flex: 1,
    padding: spacing.md,
    fontSize: typography.base,
    color: colors.textPrimary,
  },
  inputUnit: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    fontWeight: typography.semibold,
    paddingLeft: spacing.sm,
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
  hintContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    backgroundColor: colors.info + '10',
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  hint: {
    fontSize: typography.xs,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
    flex: 1,
    lineHeight: typography.lineHeights.normal * typography.xs,
  },
  saveButton: {
    backgroundColor: colors.primary,
    marginHorizontal: spacing.base,
    marginTop: spacing.lg,
    padding: spacing.base,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    ...shadows.lg,
    minHeight: 50,
  },
  saveButtonDisabled: {
    backgroundColor: colors.gray400,
    opacity: 0.6,
  },
  saveButtonText: {
    color: colors.textOnPrimary,
    fontSize: typography.base,
    fontWeight: typography.bold,
    marginLeft: spacing.sm,
  },
});

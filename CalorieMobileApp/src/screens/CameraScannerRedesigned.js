import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import * as ImagePicker from 'expo-image-picker';
import { foodAPI } from '../services/api';
import StickyHeader from '../components/StickyHeader';
import { colors, typography, spacing, borderRadius, shadows } from '../styles/theme';

export default function ImprovedCameraScannerScreen({ navigation }) {
  const { t, i18n } = useTranslation();
  const [image, setImage] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Camera permission is needed to scan food.');
      return false;
    }
    return true;
  };

  const takePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
        setResult(null);
        setRetryCount(0);
        await analyzeImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open camera.');
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
        setResult(null);
        setRetryCount(0);
        await analyzeImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image.');
    }
  };

  const analyzeImage = async (imageUri, isRetry = false) => {
    try {
      setAnalyzing(true);

      const formData = new FormData();
      const uriParts = imageUri.split('.');
      const fileType = uriParts[uriParts.length - 1];

      formData.append('image', {
        uri: imageUri,
        name: `photo.${fileType}`,
        type: `image/${fileType}`,
      });

      // Add language parameter for Arabic response
      const currentLang = i18n.language;
      
      const response = await foodAPI.analyzeFoodImage(formData);
      
      if (response && response.total_calories) {
        setResult(response);
        setRetryCount(0);
      } else {
        throw new Error('Invalid response');
      }

    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.is_food === false) {
        Alert.alert(
          'Not Food Related',
          'This doesn\'t look like food. Please take a photo of your meal.',
          [
            { text: 'Take Another Photo', onPress: () => {
              setImage(null);
              setResult(null);
              takePhoto();
            }},
            { text: 'Cancel', style: 'cancel', onPress: () => {
              setImage(null);
              setResult(null);
            }}
          ]
        );
        setAnalyzing(false);
        return;
      }
      
      if (!isRetry && retryCount < 2) {
        setRetryCount(retryCount + 1);
        setTimeout(() => analyzeImage(imageUri, true), 1000);
      } else {
        Alert.alert(
          'Analysis Failed',
          'Unable to analyze the image. Please try with a clearer photo.',
          [
            { text: 'Try Again', onPress: () => analyzeImage(imageUri) },
            { text: 'Cancel', style: 'cancel' }
          ]
        );
      }
    } finally {
      setAnalyzing(false);
    }
  };

  const saveToLog = async () => {
    if (!result) return;

    try {
      const foodData = {
        food_name: result.labels?.join(', ') || 'Scanned Food',
        serving_size: 100,
        servings_consumed: 1,
        calories: result.total_calories,
        proteins: result.total_protein || 0,
        carbs: result.total_carbs || 0,
        fats: result.total_fats || 0,
        meal_type: 'snack',
        consumed_at: new Date().toISOString(),
      };

      await foodAPI.addFoodLog(foodData);
      
      Alert.alert(
        'Success',
        'Food logged successfully!',
        [{ text: 'OK', onPress: () => navigation.navigate('Home') }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to save food log.');
    }
  };

  return (
    <View style={styles.container}>
      <StickyHeader 
        title={t('foodScanner')}
        subtitle={t('aiPoweredNutrition')}
        showBackButton={true}
      />
      
      {analyzing && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>
              {retryCount > 0 ? `${t('retrying')}... (${retryCount}/2)` : t('analyzingFood')}
            </Text>
          </View>
        </View>
      )}

      <ScrollView style={styles.scrollContainer}>
        {/* Action Buttons */}
        {!image && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.primaryButton} onPress={takePhoto}>
              <Ionicons name="camera" size={24} color={colors.white} />
              <Text style={styles.primaryButtonText}>{t('takePhoto')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={pickImage}>
              <Ionicons name="images" size={24} color={colors.primary} />
              <Text style={styles.secondaryButtonText}>{t('chooseFromGallery')}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Image Preview */}
        {image && (
          <View style={styles.card}>
            <Image source={{ uri: image }} style={styles.image} />
            {!analyzing && !result && (
              <TouchableOpacity style={styles.retryButton} onPress={() => analyzeImage(image)}>
                <Text style={styles.retryButtonText}>Analyze Again</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Results */}
        {result && !analyzing && (
          <>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{t('nutritionInformation')}</Text>
              <View style={styles.nutritionGrid}>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>{Math.round(result.total_calories)}</Text>
                  <Text style={styles.nutritionLabel}>Calories</Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>{Math.round(result.total_protein || 0)}g</Text>
                  <Text style={styles.nutritionLabel}>Protein</Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>{Math.round(result.total_carbs || 0)}g</Text>
                  <Text style={styles.nutritionLabel}>Carbs</Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>{Math.round(result.total_fats || 0)}g</Text>
                  <Text style={styles.nutritionLabel}>Fats</Text>
                </View>
              </View>
            </View>

            {result.labels && result.labels.length > 0 && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>{t('detectedItems')}</Text>
                <View style={styles.labelsContainer}>
                  {result.labels.map((label, index) => (
                    <View key={index} style={styles.labelChip}>
                      <Text style={styles.labelText}>{label}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            <View style={styles.actionContainer}>
              <TouchableOpacity style={styles.primaryButton} onPress={saveToLog}>
                <Ionicons name="checkmark-circle" size={24} color={colors.white} />
                <Text style={styles.primaryButtonText}>{t('saveToFoodLog')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton} onPress={takePhoto}>
                <Ionicons name="camera" size={24} color={colors.primary} />
                <Text style={styles.secondaryButtonText}>{t('scanAnotherMeal')}</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Tips */}
        {!image && !analyzing && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{t('tipsForBestResults')}</Text>
            <View style={styles.tipItem}>
              <Ionicons name="sunny" size={20} color={colors.primary} />
              <Text style={styles.tipText}>{t('useGoodLighting')}</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="arrow-down" size={20} color={colors.primary} />
              <Text style={styles.tipText}>{t('takePhotoFromAbove')}</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="eye" size={20} color={colors.primary} />
              <Text style={styles.tipText}>{t('keepFoodClearlyVisible')}</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="image" size={20} color={colors.primary} />
              <Text style={styles.tipText}>{t('avoidShadowsAndBlur')}</Text>
            </View>
          </View>
        )}
        
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
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingCard: {
    backgroundColor: colors.white,
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    ...shadows.lg,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.base,
    color: colors.textPrimary,
  },
  buttonContainer: {
    padding: spacing.base,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.base,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    ...shadows.base,
  },
  primaryButtonText: {
    color: colors.textOnPrimary,
    fontSize: typography.base,
    fontWeight: typography.semibold,
    marginLeft: spacing.sm,
  },
  secondaryButton: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.base,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.primary,
    ...shadows.sm,
  },
  secondaryButtonText: {
    color: colors.primary,
    fontSize: typography.base,
    fontWeight: typography.semibold,
    marginLeft: spacing.sm,
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
  image: {
    width: '100%',
    height: 300,
    borderRadius: borderRadius.base,
    marginBottom: spacing.md,
  },
  retryButton: {
    backgroundColor: colors.secondary,
    padding: spacing.md,
    borderRadius: borderRadius.base,
    alignItems: 'center',
  },
  retryButtonText: {
    color: colors.textOnPrimary,
    fontSize: typography.base,
    fontWeight: typography.semibold,
  },
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  nutritionItem: {
    width: '48%',
    backgroundColor: colors.gray50,
    padding: spacing.base,
    borderRadius: borderRadius.base,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  nutritionValue: {
    fontSize: typography.xl,
    fontWeight: typography.bold,
    color: colors.primary,
  },
  nutritionLabel: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  labelsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  labelChip: {
    backgroundColor: colors.primaryLight + '20',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  labelText: {
    color: colors.primary,
    fontSize: typography.sm,
    fontWeight: typography.semibold,
  },
  actionContainer: {
    padding: spacing.base,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  tipText: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    marginLeft: spacing.md,
    flex: 1,
  },
});

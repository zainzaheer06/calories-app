import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { foodAPI } from '../services/api';
import Button from '../components/Button';
import Card from '../components/Card';
import LoadingOverlay from '../components/LoadingOverlay';
import NutritionSummaryCard from '../components/NutritionSummaryCard';
import CalorieBreakdownCard from '../components/CalorieBreakdownCard';

export default function ImprovedCameraScannerScreen({ navigation }) {
  const [image, setImage] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Camera permission is needed to scan food.',
        [{ text: 'OK' }]
      );
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
      console.error('Camera error:', error);
      Alert.alert('Error', 'Failed to open camera. Please try again.');
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
      console.error('Gallery error:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
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

      const response = await foodAPI.analyzeFoodImage(formData);
      
      if (response && response.total_calories) {
        setResult(response);
        setRetryCount(0);
      } else {
        throw new Error('Invalid response from server');
      }

    } catch (error) {
      console.error('Analysis error:', error);
      
      // Check if it's a "not food" error
      if (error.response?.status === 400 && error.response?.data?.is_food === false) {
        Alert.alert(
          'Not Food Related',
          'Sorry, this picture is not food related. Please take a photo of your meal.',
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
      
      // Auto-retry logic for other errors
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
        'Success! 🎉',
        'Food logged successfully!',
        [{ text: 'OK', onPress: () => navigation.navigate('Home') }]
      );
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert('Error', 'Failed to save food log. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LoadingOverlay 
        visible={analyzing} 
        message={retryCount > 0 ? `Retrying... (${retryCount}/2)` : 'Analyzing food...'}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with Back Button */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.title}>AI Food Scanner</Text>
            <Text style={styles.subtitle}>Take a photo to analyze calories instantly</Text>
          </View>
        </View>

        {/* Action Buttons */}
        {!image && (
          <View style={styles.buttonContainer}>
            <Button
              title="Take Photo"
              onPress={takePhoto}
              variant="primary"
              style={styles.actionButton}
            />
            <Button
              title="Choose Photo"
              onPress={pickImage}
              variant="secondary"
              style={styles.actionButton}
            />
          </View>
        )}

        {/* Image Preview */}
        {image && (
          <Card style={styles.imageCard}>
            <Image source={{ uri: image }} style={styles.image} />
            {!analyzing && !result && (
              <Button
                title="Analyze Again"
                onPress={() => analyzeImage(image)}
                variant="outline"
                style={styles.retryButton}
              />
            )}
          </Card>
        )}

        {/* Results */}
        {result && !analyzing && (
          <>
            <NutritionSummaryCard
              calories={result.total_calories}
              protein={result.total_protein}
              carbs={result.total_carbs}
              fats={result.total_fats}
            />

            <CalorieBreakdownCard breakdown={result.breakdown} />

            {result.labels && result.labels.length > 0 && (
              <Card>
                <Text style={styles.labelsTitle}>Detected Items</Text>
                <View style={styles.labelsContainer}>
                  {result.labels.map((label, index) => (
                    <View key={index} style={styles.labelChip}>
                      <Text style={styles.labelText}>{label}</Text>
                    </View>
                  ))}
                </View>
              </Card>
            )}

            <View style={styles.actionContainer}>
              <Button
                title="Save to Food Log"
                icon="💾"
                onPress={saveToLog}
                variant="primary"
              />
              <Button
                title="Scan Another"
                icon="📸"
                onPress={takePhoto}
                variant="outline"
                style={styles.scanAgainButton}
              />
            </View>
          </>
        )}

        {/* Instructions */}
        {!image && !analyzing && (
          <Card style={styles.instructionsCard}>
            <Text style={styles.instructionsTitle}>Tips for Best Results</Text>
            <View style={styles.tipItem}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={styles.tipText}>Use good lighting</Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={styles.tipText}>Take photo from above</Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={styles.tipText}>Keep food clearly visible</Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={styles.tipText}>Avoid shadows and blur</Text>
            </View>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#4CAF50',
    padding: 24,
    paddingTop: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  buttonContainer: {
    padding: 16,
    gap: 12,
  },
  actionButton: {
    marginBottom: 0,
  },
  imageCard: {
    padding: 0,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  retryButton: {
    margin: 16,
  },
  labelsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  labelsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  labelChip: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  labelText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '600',
  },
  actionContainer: {
    padding: 16,
    gap: 12,
  },
  scanAgainButton: {
    marginTop: 0,
  },
  instructionsCard: {
    marginBottom: 24,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipIcon: {
    fontSize: 16,
    color: '#4CAF50',
    marginRight: 12,
    fontWeight: 'bold',
  },
  tipText: {
    fontSize: 14,
    color: '#666',
  },
});

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { foodAPI } from '../services/api';

export default function CameraScannerScreen({ navigation }) {
  const [image, setImage] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

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
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
        setResult(null);
        await analyzeImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert('Error', 'Failed to open camera');
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
        setResult(null);
        await analyzeImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Gallery error:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const analyzeImage = async (imageUri) => {
    try {
      setAnalyzing(true);

      // Create FormData
      const formData = new FormData();
      
      // Get file extension
      const uriParts = imageUri.split('.');
      const fileType = uriParts[uriParts.length - 1];

      formData.append('image', {
        uri: imageUri,
        name: `photo.${fileType}`,
        type: `image/${fileType}`,
      });

      // Upload and analyze
      const response = await foodAPI.analyzeFoodImage(formData);
      setResult(response);

    } catch (error) {
      console.error('Analysis error:', error);
      Alert.alert('Error', error.response?.data?.error || 'Failed to analyze image');
    } finally {
      setAnalyzing(false);
    }
  };

  const saveToLog = async () => {
    if (!result) return;

    try {
      const foodData = {
        food_name: result.labels.join(', '),
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
      Alert.alert('Success', 'Food logged successfully!', [
        { text: 'OK', onPress: () => navigation.navigate('Home') }
      ]);
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert('Error', 'Failed to save food log');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📸 AI Food Scanner</Text>
        <Text style={styles.subtitle}>Take a photo to analyze calories</Text>
      </View>

      {/* Camera Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cameraButton} onPress={takePhoto}>
          <Text style={styles.buttonIcon}>📷</Text>
          <Text style={styles.buttonText}>Take Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.galleryButton} onPress={pickImage}>
          <Text style={styles.buttonIcon}>🖼️</Text>
          <Text style={styles.buttonText}>Choose from Gallery</Text>
        </TouchableOpacity>
      </View>

      {/* Image Preview */}
      {image && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: image }} style={styles.image} />
        </View>
      )}

      {/* Analyzing Indicator */}
      {analyzing && (
        <View style={styles.analyzingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.analyzingText}>Analyzing food...</Text>
        </View>
      )}

      {/* Results */}
      {result && !analyzing && (
        <View style={styles.resultsContainer}>
          <View style={styles.calorieCard}>
            <Text style={styles.calorieNumber}>{Math.round(result.total_calories)}</Text>
            <Text style={styles.calorieLabel}>Total Calories</Text>
          </View>

          <View style={styles.detectedCard}>
            <Text style={styles.cardTitle}>🍽️ Detected Foods</Text>
            {result.breakdown && result.breakdown.map((item, index) => (
              <View key={index} style={styles.foodItem}>
                <Text style={styles.foodName}>{item.name}</Text>
                <Text style={styles.foodCalories}>{Math.round(item.calories)} cal</Text>
              </View>
            ))}
          </View>

          {result.labels && result.labels.length > 0 && (
            <View style={styles.labelsCard}>
              <Text style={styles.cardTitle}>🏷️ Labels</Text>
              <View style={styles.labelsContainer}>
                {result.labels.map((label, index) => (
                  <View key={index} style={styles.labelChip}>
                    <Text style={styles.labelText}>{label}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          <TouchableOpacity style={styles.saveButton} onPress={saveToLog}>
            <Text style={styles.saveButtonText}>💾 Save to Food Log</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Instructions */}
      {!image && !analyzing && (
        <View style={styles.instructionsCard}>
          <Text style={styles.instructionsTitle}>How it works:</Text>
          <Text style={styles.instructionText}>1. Take a photo of your food</Text>
          <Text style={styles.instructionText}>2. AI analyzes the image</Text>
          <Text style={styles.instructionText}>3. Get instant calorie estimates</Text>
          <Text style={styles.instructionText}>4. Save to your food log</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4CAF50',
    padding: 30,
    paddingTop: 60,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 15,
    gap: 10,
  },
  cameraButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  galleryButton: {
    flex: 1,
    backgroundColor: '#2196F3',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  imageContainer: {
    margin: 15,
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  analyzingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  analyzingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
  },
  resultsContainer: {
    padding: 15,
  },
  calorieCard: {
    backgroundColor: '#4CAF50',
    padding: 30,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  calorieNumber: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#fff',
  },
  calorieLabel: {
    fontSize: 16,
    color: '#fff',
    marginTop: 5,
  },
  detectedCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  foodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  foodName: {
    fontSize: 16,
    color: '#333',
    textTransform: 'capitalize',
  },
  foodCalories: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  labelsCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  labelsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  labelChip: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  labelText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  instructionsCard: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 25,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  instructionText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    paddingLeft: 10,
  },
});

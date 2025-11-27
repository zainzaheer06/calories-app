import React, { useState } from 'react';
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
import { foodAPI } from '../services/api';

export default function AddFoodScreen({ navigation }) {
  const [formData, setFormData] = useState({
    food_name: '',
    serving_size: '',
    calories: '',
    proteins: '',
    carbs: '',
    fats: '',
    meal_type: 'lunch',
  });
  const [loading, setLoading] = useState(false);

  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleAddFood = async () => {
    if (!formData.food_name || !formData.serving_size || !formData.calories) {
      Alert.alert('Error', 'Please fill in required fields (name, serving size, calories)');
      return;
    }

    setLoading(true);
    try {
      const foodData = {
        food_name: formData.food_name,
        serving_size: parseFloat(formData.serving_size),
        servings_consumed: 1.0,
        calories: parseFloat(formData.calories),
        proteins: formData.proteins ? parseFloat(formData.proteins) : 0,
        carbs: formData.carbs ? parseFloat(formData.carbs) : 0,
        fats: formData.fats ? parseFloat(formData.fats) : 0,
        meal_type: formData.meal_type,
        consumed_at: new Date().toISOString(),
      };

      console.log('Logging food:', foodData);
      await foodAPI.addFoodLog(foodData);
      
      Alert.alert('Success', 'Food logged successfully!', [
        { text: 'OK', onPress: () => {
          setFormData({
            food_name: '',
            serving_size: '',
            calories: '',
            proteins: '',
            carbs: '',
            fats: '',
            meal_type: 'lunch',
          });
          navigation.navigate('Home');
        }}
      ]);
    } catch (error) {
      console.error('Error logging food:', error);
      console.error('Error response:', error.response?.data);
      Alert.alert('Error', error.response?.data?.error || 'Failed to log food');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Add Food</Text>
        <Text style={styles.subtitle}>Log your meal manually or use camera</Text>
      </View>

      {/* Camera Scanner Button */}
      <TouchableOpacity 
        style={styles.cameraButton}
        onPress={() => navigation.navigate('ImprovedCameraScanner')}
      >
        <Text style={styles.cameraButtonIcon}>📷</Text>
        <Text style={styles.cameraButtonText}>Scan Food with AI Camera</Text>
      </TouchableOpacity>

      <View style={styles.form}>
        <Text style={styles.label}>Food Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Grilled Chicken Breast"
          value={formData.food_name}
          onChangeText={(value) => updateField('food_name', value)}
        />

        <Text style={styles.label}>Serving Size (grams) *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., 150"
          value={formData.serving_size}
          onChangeText={(value) => updateField('serving_size', value)}
          keyboardType="decimal-pad"
        />

        <Text style={styles.label}>Calories *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., 165"
          value={formData.calories}
          onChangeText={(value) => updateField('calories', value)}
          keyboardType="decimal-pad"
        />

        <Text style={styles.sectionTitle}>Macronutrients (optional)</Text>

        <View style={styles.row}>
          <View style={styles.thirdWidth}>
            <Text style={styles.label}>Protein (g)</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              value={formData.proteins}
              onChangeText={(value) => updateField('proteins', value)}
              keyboardType="decimal-pad"
            />
          </View>

          <View style={styles.thirdWidth}>
            <Text style={styles.label}>Carbs (g)</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              value={formData.carbs}
              onChangeText={(value) => updateField('carbs', value)}
              keyboardType="decimal-pad"
            />
          </View>

          <View style={styles.thirdWidth}>
            <Text style={styles.label}>Fats (g)</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              value={formData.fats}
              onChangeText={(value) => updateField('fats', value)}
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        <Text style={styles.label}>Meal Type</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.meal_type}
            onValueChange={(value) => updateField('meal_type', value)}
            style={styles.picker}
          >
            <Picker.Item label="Breakfast" value="breakfast" />
            <Picker.Item label="Lunch" value="lunch" />
            <Picker.Item label="Dinner" value="dinner" />
            <Picker.Item label="Snack" value="snack" />
          </Picker>
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleAddFood}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Log Food</Text>
          )}
        </TouchableOpacity>
      </View>
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
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  form: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  thirdWidth: {
    width: '31%',
  },
  pickerContainer: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  button: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonDisabled: {
    backgroundColor: '#a5d6a7',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cameraButton: {
    backgroundColor: '#2196F3',
    marginHorizontal: 15,
    marginTop: 15,
    padding: 16,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  cameraButtonIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  cameraButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

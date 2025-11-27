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
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

export default function SettingsScreen({ navigation }) {
  const { user, updateUser } = useAuth();
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
    if (!formData.name) {
      Alert.alert('Error', 'Name is required');
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

      console.log('Updating profile:', updateData);
      const response = await authAPI.updateProfile(updateData);
      
      // Update user in context
      if (response.user) {
        updateUser(response.user);
      }

      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      console.error('Error response:', error.response?.data);
      Alert.alert('Error', error.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Edit your profile and goals</Text>
      </View>

      {/* Personal Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>

        <Text style={styles.label}>Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Your name"
          value={formData.name}
          onChangeText={(value) => updateField('name', value)}
        />

        <Text style={styles.label}>Age</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., 25"
          value={formData.age}
          onChangeText={(value) => updateField('age', value)}
          keyboardType="number-pad"
        />

        <Text style={styles.label}>Gender</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.gender}
            onValueChange={(value) => updateField('gender', value)}
            style={styles.picker}
          >
            <Picker.Item label="Male" value="male" />
            <Picker.Item label="Female" value="female" />
            <Picker.Item label="Other" value="other" />
          </Picker>
        </View>
      </View>

      {/* Physical Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Physical Stats</Text>

        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <Text style={styles.label}>Weight (kg)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 70"
              value={formData.weight}
              onChangeText={(value) => updateField('weight', value)}
              keyboardType="decimal-pad"
            />
          </View>

          <View style={styles.halfWidth}>
            <Text style={styles.label}>Height (cm)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 175"
              value={formData.height}
              onChangeText={(value) => updateField('height', value)}
              keyboardType="decimal-pad"
            />
          </View>
        </View>
      </View>

      {/* Goals */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Goals & Activity</Text>

        <Text style={styles.label}>Activity Level</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.activity_level}
            onValueChange={(value) => updateField('activity_level', value)}
            style={styles.picker}
          >
            <Picker.Item label="Sedentary (little or no exercise)" value="sedentary" />
            <Picker.Item label="Lightly Active (1-3 days/week)" value="lightly_active" />
            <Picker.Item label="Moderately Active (3-5 days/week)" value="moderate" />
            <Picker.Item label="Very Active (6-7 days/week)" value="very_active" />
            <Picker.Item label="Extra Active (athlete)" value="extra_active" />
          </Picker>
        </View>

        <Text style={styles.label}>Goal Type</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.goal_type}
            onValueChange={(value) => updateField('goal_type', value)}
            style={styles.picker}
          >
            <Picker.Item label="Lose Weight" value="lose_weight" />
            <Picker.Item label="Maintain Weight" value="maintain" />
            <Picker.Item label="Gain Weight" value="gain_weight" />
          </Picker>
        </View>

        <Text style={styles.label}>Daily Calorie Goal</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., 2000"
          value={formData.daily_calorie_goal}
          onChangeText={(value) => updateField('daily_calorie_goal', value)}
          keyboardType="number-pad"
        />
        <Text style={styles.hint}>
          Leave empty to auto-calculate based on your stats
        </Text>
      </View>

      {/* Save Button */}
      <TouchableOpacity
        style={[styles.saveButton, loading && styles.saveButtonDisabled]}
        onPress={handleSave}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveButtonText}>Save Changes</Text>
        )}
      </TouchableOpacity>

      {/* Info Card */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Tip</Text>
        <Text style={styles.infoText}>
          Your daily calorie goal will be automatically calculated based on your age, weight, height, gender, and activity level if you don't set a custom value.
        </Text>
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
  section: {
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
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
  halfWidth: {
    width: '48%',
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
  hint: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    fontStyle: 'italic',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    marginHorizontal: 15,
    marginVertical: 10,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  saveButtonDisabled: {
    backgroundColor: '#a5d6a7',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoCard: {
    backgroundColor: '#E3F2FD',
    margin: 15,
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
});

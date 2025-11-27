import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from './Card';

export default function NutritionSummaryCard({ 
  calories = 0, 
  protein = 0, 
  carbs = 0, 
  fats = 0 
}) {
  const macros = [
    { name: 'Protein', value: protein, unit: 'g', color: '#FF6B6B', icon: '🥩' },
    { name: 'Carbs', value: carbs, unit: 'g', color: '#4ECDC4', icon: '🍞' },
    { name: 'Fats', value: fats, unit: 'g', color: '#FFE66D', icon: '🥑' },
  ];

  return (
    <Card>
      <Text style={styles.title}>📊 Nutrition Summary</Text>
      
      <View style={styles.calorieSection}>
        <Text style={styles.calorieValue}>{Math.round(calories)}</Text>
        <Text style={styles.calorieLabel}>Total Calories</Text>
      </View>

      <View style={styles.macrosContainer}>
        {macros.map((macro, index) => (
          <View key={index} style={styles.macroItem}>
            <Text style={styles.macroIcon}>{macro.icon}</Text>
            <Text style={styles.macroValue}>
              {Math.round(macro.value)}
              <Text style={styles.macroUnit}>{macro.unit}</Text>
            </Text>
            <Text style={styles.macroName}>{macro.name}</Text>
            <View style={[styles.macroBar, { backgroundColor: macro.color }]} />
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
  },
  calorieSection: {
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    marginBottom: 20,
  },
  calorieValue: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  calorieLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  macrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  macroItem: {
    alignItems: 'center',
    flex: 1,
  },
  macroIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  macroValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  macroUnit: {
    fontSize: 12,
    fontWeight: '400',
    color: '#999',
  },
  macroName: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  macroBar: {
    width: '80%',
    height: 4,
    borderRadius: 2,
    marginTop: 8,
  },
});

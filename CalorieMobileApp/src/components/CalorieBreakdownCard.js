import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from './Card';

export default function CalorieBreakdownCard({ breakdown = [] }) {
  const totalCalories = breakdown.reduce((sum, item) => sum + item.calories, 0);

  return (
    <Card>
      <View style={styles.header}>
        <Text style={styles.title}>🍽️ Food Breakdown</Text>
        <View style={styles.totalBadge}>
          <Text style={styles.totalText}>{Math.round(totalCalories)} cal</Text>
        </View>
      </View>

      {breakdown.length === 0 ? (
        <Text style={styles.emptyText}>No food items detected</Text>
      ) : (
        breakdown.map((item, index) => (
          <View key={index} style={styles.foodItem}>
            <View style={styles.foodInfo}>
              <View style={styles.dot} />
              <Text style={styles.foodName}>{item.name}</Text>
            </View>
            <View style={styles.calorieContainer}>
              <Text style={styles.calorieValue}>{Math.round(item.calories)}</Text>
              <Text style={styles.calorieUnit}>cal</Text>
            </View>
          </View>
        ))
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  totalBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  totalText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '700',
  },
  foodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  foodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 12,
  },
  foodName: {
    fontSize: 16,
    color: '#333',
    textTransform: 'capitalize',
    flex: 1,
  },
  calorieContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  calorieValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4CAF50',
  },
  calorieUnit: {
    fontSize: 12,
    color: '#999',
    marginLeft: 2,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    paddingVertical: 20,
  },
});

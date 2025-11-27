import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { foodAPI } from '../services/api';
import { Ionicons } from '@expo/vector-icons';

export default function AllMealsScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [foodLogs, setFoodLogs] = useState([]);
  const [dailyTotals, setDailyTotals] = useState(null);

  useEffect(() => {
    loadMeals();
  }, []);

  const loadMeals = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await foodAPI.getFoodLogs(today, 100);
      setFoodLogs(response.food_logs || []);
      setDailyTotals(response.daily_totals);
    } catch (error) {
      console.error('Error loading meals:', error);
      Alert.alert('Error', 'Failed to load meals');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadMeals();
  };

  const handleDeleteMeal = async (logId) => {
    Alert.alert(
      'Delete Meal',
      'Are you sure you want to delete this meal?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await foodAPI.deleteFoodLog(logId);
              loadMeals();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete meal');
            }
          },
        },
      ]
    );
  };

  const groupMealsByType = () => {
    const grouped = {
      breakfast: [],
      lunch: [],
      dinner: [],
      snack: [],
    };

    foodLogs.forEach((log) => {
      const type = log.meal_type || 'snack';
      if (grouped[type]) {
        grouped[type].push(log);
      }
    });

    return grouped;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  const groupedMeals = groupMealsByType();
  const mealTypes = [
    { key: 'breakfast', label: 'Breakfast' },
    { key: 'lunch', label: 'Lunch' },
    { key: 'dinner', label: 'Dinner' },
    { key: 'snack', label: 'Snacks' },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Meals</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Daily Summary */}
        {dailyTotals && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Today's Summary</Text>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>
                  {Math.round(dailyTotals.total_calories)}
                </Text>
                <Text style={styles.summaryLabel}>Calories</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>
                  {Math.round(dailyTotals.total_proteins)}g
                </Text>
                <Text style={styles.summaryLabel}>Protein</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>
                  {Math.round(dailyTotals.total_carbs)}g
                </Text>
                <Text style={styles.summaryLabel}>Carbs</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>
                  {Math.round(dailyTotals.total_fats)}g
                </Text>
                <Text style={styles.summaryLabel}>Fats</Text>
              </View>
            </View>
          </View>
        )}

        {/* Meals by Type */}
        {mealTypes.map(({ key, label }) => {
          const meals = groupedMeals[key];
          if (meals.length === 0) return null;

          return (
            <View key={key} style={styles.mealSection}>
              <View style={styles.mealTypeHeader}>
                <Text style={styles.mealTypeTitle}>
                  {label} ({meals.length})
                </Text>
              </View>

              {meals.map((log) => (
                <View key={log.id} style={styles.mealCard}>
                  <View style={styles.mealContent}>
                    <View style={styles.mealInfo}>
                      <Text style={styles.mealName}>{log.food_name}</Text>
                      <Text style={styles.mealDetails}>
                        {log.serving_size}g • {Math.round(log.total_calories)}{' '}
                        cal
                      </Text>
                      <View style={styles.macrosRow}>
                        <Text style={styles.macroText}>
                          P: {Math.round(log.proteins || 0)}g
                        </Text>
                        <Text style={styles.macroText}>
                          C: {Math.round(log.carbs || 0)}g
                        </Text>
                        <Text style={styles.macroText}>
                          F: {Math.round(log.fats || 0)}g
                        </Text>
                      </View>
                    </View>
                    <View style={styles.mealActions}>
                      <Text style={styles.caloriesBadge}>
                        {Math.round(log.total_calories)}
                      </Text>
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDeleteMeal(log.id)}
                      >
                        <Ionicons name="trash-outline" size={20} color="#f44336" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          );
        })}

        {foodLogs.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No meals logged today</Text>
            <Text style={styles.emptySubtext}>
              Start tracking your meals to see them here
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 15,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  placeholder: {
    width: 34,
  },
  scrollView: {
    flex: 1,
  },
  summaryCard: {
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
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  mealSection: {
    marginBottom: 10,
  },
  mealTypeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#4CAF50',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  mealTypeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  mealCard: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginVertical: 5,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  mealContent: {
    flexDirection: 'row',
    padding: 15,
  },
  mealInfo: {
    flex: 1,
  },
  mealName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  mealDetails: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
  },
  macrosRow: {
    flexDirection: 'row',
    gap: 12,
  },
  macroText: {
    fontSize: 12,
    color: '#888',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  mealActions: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  caloriesBadge: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 10,
  },
  deleteButton: {
    padding: 5,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
});

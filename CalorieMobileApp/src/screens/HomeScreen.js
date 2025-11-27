import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { foodAPI, analyticsAPI } from '../services/api';
import { useNavigation } from '@react-navigation/native';
import FloatingCameraButton from '../components/FloatingCameraButton';
import ProgressCircle from '../components/ProgressCircle';

export default function HomeScreen() {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dailySummary, setDailySummary] = useState(null);
  const [foodLogs, setFoodLogs] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const [summaryRes, logsRes] = await Promise.all([
        analyticsAPI.getDailySummary(today),
        foodAPI.getFoodLogs(today, 100), // Increased limit to 100
      ]);
      
      // The API returns data directly, not nested in 'summary'
      setDailySummary(summaryRes.totals || summaryRes);
      setFoodLogs(logsRes.food_logs || []);
      
      console.log('Loaded food logs:', logsRes.food_logs?.length);
      console.log('Daily summary:', summaryRes);
    } catch (error) {
      console.error('Error loading data:', error);
      console.error('Error details:', error.response?.data);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleAIAnalysis = async () => {
    try {
      setAiLoading(true);
      const today = new Date().toISOString().split('T')[0];
      const response = await analyticsAPI.getAIInsights(today);
      setAiAnalysis(response.insights);
    } catch (error) {
      console.error('Error getting AI insights:', error);
      setAiAnalysis('Unable to get AI insights at this time. Please try again later.');
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  const caloriesConsumed = dailySummary?.calories || 0;
  const caloriesGoal = user?.daily_calorie_goal || 2000;
  const caloriesRemaining = caloriesGoal - caloriesConsumed;
  const progress = Math.min((caloriesConsumed / caloriesGoal) * 100, 100);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, {user?.name || 'User'}! 👋</Text>
        <Text style={styles.date}>{new Date().toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}</Text>
      </View>

      {/* Calorie Summary Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Today's Calories</Text>
        
        <View style={styles.progressContainer}>
          <ProgressCircle 
            current={caloriesConsumed} 
            goal={caloriesGoal}
            size={180}
          />
        </View>

        <View style={styles.calorieStats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{caloriesGoal}</Text>
            <Text style={styles.statLabel}>Goal</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, caloriesRemaining < 0 && styles.overLimit]}>
              {Math.abs(Math.round(caloriesRemaining))}
            </Text>
            <Text style={styles.statLabel}>
              {caloriesRemaining >= 0 ? 'Remaining' : 'Over'}
            </Text>
          </View>
        </View>
      </View>

      {/* Macros Card */}
      {dailySummary && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Macronutrients</Text>
          <View style={styles.macrosContainer}>
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{Math.round(dailySummary.proteins || 0)}g</Text>
              <Text style={styles.macroLabel}>Protein</Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{Math.round(dailySummary.carbs || 0)}g</Text>
              <Text style={styles.macroLabel}>Carbs</Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{Math.round(dailySummary.fats || 0)}g</Text>
              <Text style={styles.macroLabel}>Fats</Text>
            </View>
          </View>
        </View>
      )}

      {/* Camera Scanner Button - Centered */}
      <TouchableOpacity 
        style={styles.cameraButton}
        onPress={() => navigation.navigate('ImprovedCameraScanner')}
      >
        <Text style={styles.cameraButtonIcon}>📷</Text>
        <Text style={styles.cameraButtonText}>Scan Food with Camera</Text>
      </TouchableOpacity>

      {/* AI Analysis Button */}
      <TouchableOpacity 
        style={styles.aiButton}
        onPress={handleAIAnalysis}
        disabled={aiLoading}
      >
        {aiLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Text style={styles.aiButtonIcon}>🤖</Text>
            <Text style={styles.aiButtonText}>Get AI Nutrition Insights</Text>
          </>
        )}
      </TouchableOpacity>

      {/* AI Analysis Result */}
      {aiAnalysis && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>AI Nutrition Insights 🤖</Text>
          <Text style={styles.aiAnalysisText}>{aiAnalysis}</Text>
        </View>
      )}

      {/* Recent Meals */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Today's Meals ({foodLogs.length})</Text>
        {foodLogs.length === 0 ? (
          <Text style={styles.emptyText}>No meals logged yet today</Text>
        ) : (
          foodLogs.map((log) => (
            <View key={log.id} style={styles.mealItem}>
              <View style={styles.mealInfo}>
                <Text style={styles.mealName}>{log.food_name}</Text>
                <Text style={styles.mealDetails}>
                  {log.meal_type} • {Math.round(log.total_calories)} cal
                </Text>
              </View>
              <Text style={styles.mealCalories}>{Math.round(log.total_calories)}</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
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
    padding: 20,
    paddingTop: 50,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  date: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  card: {
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
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  progressContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  calorieStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  overLimit: {
    color: '#f44336',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  macrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  macroItem: {
    alignItems: 'center',
  },
  macroValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  macroLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  mealItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  mealInfo: {
    flex: 1,
  },
  mealName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  mealDetails: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  mealCalories: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    paddingVertical: 20,
  },
  aiButton: {
    backgroundColor: '#4CAF50',
    marginHorizontal: 15,
    marginVertical: 10,
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
  aiButtonIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  aiButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  aiAnalysisText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 22,
  },
  cameraButton: {
    backgroundColor: '#2196F3',
    marginHorizontal: 15,
    marginVertical: 10,
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

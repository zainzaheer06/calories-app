import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { analyticsAPI } from '../services/api';

export default function AnalyticsScreen() {
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('week'); // 'week' or 'month'
  const [data, setData] = useState(null);

  useEffect(() => {
    loadData();
  }, [period]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (period === 'week') {
        const response = await analyticsAPI.getWeeklySummary();
        console.log('Weekly response:', response);
        // Transform the response to match expected format
        setData({
          total_calories: response.weekly_totals?.calories || 0,
          average_daily_calories: response.weekly_averages?.avg_calories || 0,
          log_count: response.days_logged || 0,
          average_daily_nutrients: {
            proteins: response.weekly_averages?.avg_proteins || 0,
            carbs: response.weekly_averages?.avg_carbs || 0,
            fats: response.weekly_averages?.avg_fats || 0,
          },
          daily_breakdown: response.daily_data || []
        });
      } else {
        const now = new Date();
        const response = await analyticsAPI.getMonthlySummary(now.getFullYear(), now.getMonth() + 1);
        console.log('Monthly response:', response);
        // Transform the response to match expected format
        setData({
          total_calories: response.monthly_stats?.total_calories || 0,
          average_daily_calories: response.monthly_stats?.avg_daily_calories || 0,
          log_count: response.monthly_stats?.total_foods_logged || 0,
          average_daily_nutrients: {
            proteins: 0, // Monthly doesn't return this
            carbs: 0,
            fats: 0,
          },
          daily_breakdown: response.daily_data || []
        });
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
      console.error('Error details:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Analytics</Text>
        <View style={styles.periodSelector}>
          <TouchableOpacity
            style={[styles.periodButton, period === 'week' && styles.periodButtonActive]}
            onPress={() => setPeriod('week')}
          >
            <Text style={[styles.periodText, period === 'week' && styles.periodTextActive]}>
              Week
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.periodButton, period === 'month' && styles.periodButtonActive]}
            onPress={() => setPeriod('month')}
          >
            <Text style={[styles.periodText, period === 'month' && styles.periodTextActive]}>
              Month
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {data && (
        <>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Calories</Text>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Total:</Text>
              <Text style={styles.statValue}>{Math.round(data.total_calories)} cal</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Daily Average:</Text>
              <Text style={styles.statValue}>{Math.round(data.average_daily_calories)} cal</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Logs:</Text>
              <Text style={styles.statValue}>{data.log_count}</Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Average Daily Macros</Text>
            <View style={styles.macrosContainer}>
              <View style={styles.macroItem}>
                <Text style={styles.macroValue}>
                  {Math.round(data.average_daily_nutrients?.proteins || 0)}g
                </Text>
                <Text style={styles.macroLabel}>Protein</Text>
              </View>
              <View style={styles.macroItem}>
                <Text style={styles.macroValue}>
                  {Math.round(data.average_daily_nutrients?.carbs || 0)}g
                </Text>
                <Text style={styles.macroLabel}>Carbs</Text>
              </View>
              <View style={styles.macroItem}>
                <Text style={styles.macroValue}>
                  {Math.round(data.average_daily_nutrients?.fats || 0)}g
                </Text>
                <Text style={styles.macroLabel}>Fats</Text>
              </View>
            </View>
          </View>

          {period === 'week' && data.daily_breakdown && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Daily Breakdown</Text>
              {data.daily_breakdown.map((day, index) => (
                <View key={index} style={styles.dayRow}>
                  <Text style={styles.dayDate}>
                    {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </Text>
                  <Text style={styles.dayCalories}>{Math.round(day.calories)} cal</Text>
                </View>
              ))}
            </View>
          )}
        </>
      )}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
    padding: 4,
  },
  periodButton: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  periodButtonActive: {
    backgroundColor: '#fff',
  },
  periodText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  periodTextActive: {
    color: '#4CAF50',
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
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  statLabel: {
    fontSize: 16,
    color: '#666',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  macrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
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
  dayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dayDate: {
    fontSize: 14,
    color: '#666',
  },
  dayCalories: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
});

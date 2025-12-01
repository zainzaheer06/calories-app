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
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { foodAPI, analyticsAPI } from '../services/api';
import { useNavigation } from '@react-navigation/native';
import ProgressCircle from '../components/ProgressCircle';
import StickyHeader from '../components/StickyHeader';
import { colors, typography, spacing, borderRadius, shadows } from '../styles/theme';

export default function HomeScreen() {
  const { t } = useTranslation();
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
        foodAPI.getFoodLogs(today, 100),
      ]);
      
      setDailySummary(summaryRes.totals || summaryRes);
      setFoodLogs(logsRes.food_logs || []);
    } catch (error) {
      console.error('Error loading data:', error);
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
      setAiAnalysis('Unable to get AI insights at this time.');
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const caloriesConsumed = dailySummary?.calories || 0;
  const caloriesGoal = user?.daily_calorie_goal || 2000;
  const caloriesRemaining = caloriesGoal - caloriesConsumed;

  return (
    <View style={styles.container}>
      <StickyHeader 
        title={`${t('hello')}, ${user?.name || 'User'}!`}
        subtitle={new Date().toLocaleDateString('en-US', { 
          weekday: 'long', 
          month: 'short', 
          day: 'numeric' 
        })}
      />
      <ScrollView
        style={styles.scrollContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Calorie Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('todaysCalories')}</Text>
          
          <View style={styles.progressContainer}>
            <ProgressCircle 
              current={caloriesConsumed} 
              goal={caloriesGoal}
              size={160}
            />
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{Math.round(caloriesGoal)}</Text>
              <Text style={styles.statLabel}>{t('goal')}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statValue, caloriesRemaining < 0 && styles.overLimit]}>
                {Math.abs(Math.round(caloriesRemaining))}
              </Text>
              <Text style={styles.statLabel}>
                {caloriesRemaining >= 0 ? t('remaining') : t('over')}
              </Text>
            </View>
          </View>
        </View>

        {/* Macros Card */}
        {dailySummary && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{t('macronutrients')}</Text>
            <View style={styles.macrosRow}>
              <View style={styles.macroBox}>
                <Text style={styles.macroValue}>{Math.round(dailySummary.proteins || 0)}g</Text>
                <Text style={styles.macroLabel}>{t('protein')}</Text>
              </View>
              <View style={styles.macroBox}>
                <Text style={styles.macroValue}>{Math.round(dailySummary.carbs || 0)}g</Text>
                <Text style={styles.macroLabel}>{t('carbs')}</Text>
              </View>
              <View style={styles.macroBox}>
                <Text style={styles.macroValue}>{Math.round(dailySummary.fats || 0)}g</Text>
                <Text style={styles.macroLabel}>{t('fats')}</Text>
              </View>
            </View>
          </View>
        )}

        {/* AI Button */}
        <TouchableOpacity 
          style={styles.aiButton}
          onPress={handleAIAnalysis}
          disabled={aiLoading}
        >
          {aiLoading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.aiButtonText}>{t('getAIInsights')}</Text>
          )}
        </TouchableOpacity>

        {/* AI Analysis */}
        {aiAnalysis && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{t('aiNutritionInsights')}</Text>
            <Text style={styles.aiText}>{aiAnalysis}</Text>
          </View>
        )}

        {/* Meals */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{t('todaysMeals')} ({foodLogs.length})</Text>
            {foodLogs.length > 3 && (
              <TouchableOpacity onPress={() => navigation.navigate('AllMeals')}>
                <Text style={styles.viewAllText}>{t('viewAll')}</Text>
              </TouchableOpacity>
            )}
          </View>
          {foodLogs.length === 0 ? (
            <Text style={styles.emptyText}>{t('noMealsLogged')}</Text>
          ) : (
            foodLogs.slice(0, 3).map((log) => (
              <View key={log.id} style={styles.mealItem}>
                <View style={styles.mealInfo}>
                  <Text style={styles.mealName} numberOfLines={1}>{log.food_name}</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  progressContainer: {
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: typography.xl,
    fontWeight: typography.bold,
    color: colors.textPrimary,
  },
  overLimit: {
    color: colors.error,
  },
  statLabel: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  macrosRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  macroBox: {
    alignItems: 'center',
  },
  macroValue: {
    fontSize: typography.lg,
    fontWeight: typography.bold,
    color: colors.primary,
  },
  macroLabel: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  aiButton: {
    backgroundColor: colors.primary,
    marginHorizontal: spacing.base,
    marginTop: spacing.base,
    padding: spacing.base,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    ...shadows.base,
  },
  aiButtonText: {
    color: colors.textOnPrimary,
    fontSize: typography.base,
    fontWeight: typography.semibold,
  },
  aiText: {
    fontSize: typography.sm,
    color: colors.textPrimary,
    lineHeight: typography.lineHeights.relaxed * typography.sm,
  },
  viewAllText: {
    fontSize: typography.sm,
    fontWeight: typography.semibold,
    color: colors.primary,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: typography.sm,
    paddingVertical: spacing.lg,
  },
  mealItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  mealInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  mealName: {
    fontSize: typography.base,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
  },
  mealDetails: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  mealCalories: {
    fontSize: typography.base,
    fontWeight: typography.bold,
    color: colors.primary,
  },
});

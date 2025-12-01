import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors, typography } from '../styles/theme';

export default function ProgressCircle({ 
  current, 
  goal, 
  size = 200, 
  strokeWidth = 12 
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = Math.min((current / goal) * 100, 100);
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const getColor = () => {
    if (progress < 50) return colors.primary;
    if (progress < 90) return colors.warning;
    if (progress <= 100) return colors.primary;
    return colors.error;
  };

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        {/* Background Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.gray200}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getColor()}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={styles.textContainer}>
        <Text style={[styles.currentText, { color: getColor() }]}>
          {Math.round(current)}
        </Text>
        <Text style={styles.labelText}>of {goal}</Text>
        <Text style={styles.unitText}>calories</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  currentText: {
    fontSize: typography['3xl'],
    fontWeight: typography.bold,
  },
  labelText: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    marginTop: 4,
  },
  unitText: {
    fontSize: typography.xs,
    color: colors.textSecondary,
  },
});

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

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
    if (progress < 50) return '#4CAF50';
    if (progress < 90) return '#FF9800';
    if (progress <= 100) return '#4CAF50';
    return '#f44336';
  };

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        {/* Background Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E0E0E0"
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
    fontSize: 48,
    fontWeight: 'bold',
  },
  labelText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  unitText: {
    fontSize: 12,
    color: '#999',
  },
});

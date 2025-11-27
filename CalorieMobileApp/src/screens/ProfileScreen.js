import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: logout, style: 'destructive' },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user?.name?.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Physical Stats</Text>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Age:</Text>
          <Text style={styles.statValue}>{user?.age || 'Not set'}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Weight:</Text>
          <Text style={styles.statValue}>{user?.weight ? `${user.weight} kg` : 'Not set'}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Height:</Text>
          <Text style={styles.statValue}>{user?.height ? `${user.height} cm` : 'Not set'}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Gender:</Text>
          <Text style={styles.statValue}>{user?.gender || 'Not set'}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Goals</Text>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Activity Level:</Text>
          <Text style={styles.statValue}>{user?.activity_level || 'Not set'}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Goal Type:</Text>
          <Text style={styles.statValue}>{user?.goal_type || 'Not set'}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Daily Calorie Goal:</Text>
          <Text style={styles.statValue}>{user?.daily_calorie_goal || 'Not set'} cal</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
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
    padding: 30,
    paddingTop: 60,
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  email: {
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
  logoutButton: {
    backgroundColor: '#f44336',
    margin: 15,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

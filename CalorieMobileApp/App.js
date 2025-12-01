import React, { useState, useEffect } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// i18n
import './src/i18n';

// Screens
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreenRedesigned';
import ProfileScreen from './src/screens/ProfileScreenRedesigned';
import AddFoodScreen from './src/screens/AddFoodScreen';
import AnalyticsScreen from './src/screens/AnalyticsScreen';
import SettingsScreen from './src/screens/SettingsScreenRedesigned';
import AllMealsScreen from './src/screens/AllMealsScreen';
import CameraScannerScreen from './src/screens/CameraScannerRedesigned';
import ImprovedCameraScannerScreen from './src/screens/ImprovedCameraScannerScreen';
import LiveCameraScreen from './src/screens/LiveCameraScreen';

// Context
import { AuthProvider, useAuth } from './src/context/AuthContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen}
      />
      <Stack.Screen name="AllMeals" component={AllMealsScreen} />
      <Stack.Screen name="CameraScanner" component={CameraScannerScreen} />
      <Stack.Screen name="ImprovedCameraScanner" component={ImprovedCameraScannerScreen} />
      <Stack.Screen name="LiveCamera" component={LiveCameraScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function MainTabs() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: '#4CAF50',
          tabBarInactiveTintColor: '#999',
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#fff',
            borderTopWidth: 1,
            borderTopColor: '#e0e0e0',
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'AddFood') {
              iconName = focused ? 'restaurant' : 'restaurant-outline';
            } else if (route.name === 'CameraPlaceholder') {
              return null; // No icon for placeholder
            } else if (route.name === 'Analytics') {
              iconName = focused ? 'stats-chart' : 'stats-chart-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ tabBarLabel: 'Home' }}
        />
        <Tab.Screen 
          name="AddFood" 
          component={AddFoodScreen}
          options={{ tabBarLabel: 'Add Food' }}
        />
        
        {/* Placeholder for Camera FAB - Creates space in center */}
        <Tab.Screen 
          name="CameraPlaceholder" 
          component={View}
          options={{ 
            tabBarLabel: '',
            tabBarButton: () => <View style={{ width: 70 }} />,
          }}
        />
        
        <Tab.Screen 
          name="Analytics" 
          component={AnalyticsScreen}
          options={{ tabBarLabel: 'Analytics' }}
        />
        <Tab.Screen 
          name="Profile" 
          component={ProfileScreen}
          options={{ tabBarLabel: 'Profile' }}
        />
      </Tab.Navigator>

      {/* Floating Camera Button (FAB) */}
      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 30,
          left: '50%',
          marginLeft: -35,
          width: 70,
          height: 70,
          borderRadius: 35,
          backgroundColor: '#4CAF50',
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
          borderWidth: 4,
          borderColor: '#fff',
        }}
        onPress={() => navigation.navigate('ImprovedCameraScanner')}
        activeOpacity={0.8}
      >
        <Ionicons name="camera" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// API Configuration
// Using ngrok tunnel (works from anywhere, bypasses firewall issues)
const API_URL = 'https://overapt-unpumped-franklin.ngrok-free.dev';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
    'User-Agent': 'CalorieApp/1.0',
  },
});

// Add token to requests
api.interceptors.request.use(
  async (config) => {
    console.log('Making request to:', config.baseURL + config.url);
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.status);
    return response;
  },
  (error) => {
    console.error('Response error:', error.message);
    if (error.response) {
      console.error('Error status:', error.response.status);
      console.error('Error data:', error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (userData) => {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  },
  
  login: async (credentials) => {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
  },
  
  getProfile: async () => {
    const response = await api.get('/api/auth/profile');
    return response.data;
  },
  
  updateProfile: async (profileData) => {
    const response = await api.put('/api/auth/profile', profileData);
    return response.data;
  },
  
  changePassword: async (passwordData) => {
    const response = await api.put('/api/auth/change-password', passwordData);
    return response.data;
  },
};

// User API
export const userAPI = {
  getProfile: async () => {
    const response = await api.get('/api/user/profile');
    return response.data;
  },
  
  updateProfile: async (profileData) => {
    const response = await api.put('/api/user/profile', profileData);
    return response.data;
  },
  
  updateGoals: async (goalsData) => {
    const response = await api.put('/api/user/goals', goalsData);
    return response.data;
  },
  
  getCustomFoods: async (params = {}) => {
    const response = await api.get('/api/user/custom-foods', { params });
    return response.data;
  },
  
  getPreferences: async () => {
    const response = await api.get('/api/user/preferences');
    return response.data;
  },
  
  deleteAccount: async () => {
    const response = await api.delete('/api/user/delete-account', {
      data: { confirm_deletion: true }
    });
    return response.data;
  },
};

// Food API
export const foodAPI = {
  addFoodLog: async (foodData) => {
    const response = await api.post('/api/food/log', foodData);
    return response.data;
  },
  
  getFoodLogs: async (date, limit = 100) => {
    const response = await api.get('/api/food/logs', {
      params: { date, limit }
    });
    return response.data;
  },
  
  deleteFoodLog: async (logId) => {
    const response = await api.delete(`/api/food/logs/${logId}`);
    return response.data;
  },
  
  getCustomFoods: async () => {
    const response = await api.get('/api/food/custom');
    return response.data;
  },
  
  addCustomFood: async (foodData) => {
    const response = await api.post('/api/food/custom', foodData);
    return response.data;
  },
  
  analyzeFoodImage: async (formData) => {
    const response = await api.post('/api/food/analyze-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

// Analytics API
export const analyticsAPI = {
  getDailySummary: async (date) => {
    const response = await api.get(`/api/analytics/daily/${date}`);
    return response.data;
  },
  
  getWeeklySummary: async () => {
    const response = await api.get('/api/analytics/weekly');
    return response.data;
  },
  
  getMonthlySummary: async (year, month) => {
    const response = await api.get('/api/analytics/monthly', {
      params: { year, month }
    });
    return response.data;
  },
  
  getProgress: async (days = 30) => {
    const response = await api.get('/api/analytics/progress', {
      params: { period: days }
    });
    return response.data;
  },
  
  getAIInsights: async (date) => {
    const response = await api.get(`/api/analytics/ai-insights/${date}`);
    return response.data;
  },
  
  analyzeFoodImage: async (formData) => {
    const response = await api.post('/api/food/analyze-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default api;

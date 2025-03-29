import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_URL = 'http://localhost:3000/api/v1';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access (e.g., clear token and redirect to login)
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('user_data');
      // You might want to trigger a navigation to login here
    }
    return Promise.reject(error);
  }
);

export default api; 
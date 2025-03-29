import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
    name: string;
  };
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post('/login', credentials);
    await AsyncStorage.setItem('token', response.data.token);
    return response.data;
  },

  async register(data: RegisterData): Promise<void> {
    await api.post('/register', data);
  },

  async logout(): Promise<void> {
    await AsyncStorage.removeItem('token');
  },

  async getProfile() {
    const response = await api.get('/user/profile');
    return response.data;
  },

  async updateProfile(name: string) {
    const response = await api.put('/user/profile', { name });
    return response.data;
  },
}; 
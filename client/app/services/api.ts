import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config';

const api = axios.create({
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

// Types
export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Record {
  id: string;
  bed_id: string;
  bed?: Bed;
  date: string;
  height: number;
  humidity: number;
  notes: string;
  photo_url: string;
  visual_status: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface Bed {
  ID: number;
  user_id: number;
  user?: User;
  name: string;
  plant_type: string;
  sowing_date: string;
  substrate_type: string;
  expected_harvest: string;
  status: 'active' | 'harvested' | 'failed';
  records?: Record[];
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
}

export interface CreateBedRequest {
  name: string;
  plant_type: string;
  sowing_date: string;
  substrate_type: string;
  expected_harvest: string;
}

export interface Plant {
  id: string;
  name: string;
  description: string;
  growingTime: number;
  temperature: {
    min: number;
    max: number;
  };
  moisture: {
    min: number;
    max: number;
  };
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface CreateRecordRequest {
  bed_id: string;
  date: string;
  height: number;
  humidity: number;
  notes: string;
  photo_url: string;
  visual_status: string;
}

// Auth endpoints
export const auth = {
  register: (email: string, password: string, name: string) =>
    api.post<{ message: string }>('/api/v1/register', { email, password, name }),
  login: (email: string, password: string) =>
    api.post<{ token: string; user: User }>('/api/v1/login', { email, password }),
};

// User endpoints
export const user = {
  getProfile: () => api.get<User>('/api/v1/user/profile'),
  updateProfile: (data: Partial<User>) =>
    api.put<User>('/api/v1/user/profile', data),
};

// Beds endpoints
export const beds = {
  getAll: async () => {
    const response = await api.get<Bed[]>('/api/v1/beds');
    console.log('API Response:', response);
    return response;
  },
  getById: (id: string) => api.get<Bed>(`/api/v1/beds/${id}`),
  create: (data: CreateBedRequest) => api.post<Bed>('/api/v1/beds', data),
  update: (id: string, data: Partial<Bed>) => api.put<Bed>(`/api/v1/beds/${id}`, data),
  delete: (id: string) => api.delete(`/api/v1/beds/${id}`),
};

// Records endpoints
export const records = {
  create: (bedId: string, data: Omit<CreateRecordRequest, 'bed_id'>) =>
    api.post<Record>(`/api/v1/beds/${bedId}/records`, data),
  getByBedId: (bedId: number) =>
    api.get<Record[]>(`/api/v1/beds/${bedId}/records`),
  update: (id: string, data: Partial<Record>) =>
    api.put<Record>(`/api/v1/records/${id}`, data),
  delete: (id: string) => api.delete(`/api/v1/records/${id}`),
};

// Plants endpoints
export const plants = {
  getAll: () => api.get<Plant[]>('/api/v1/plants'),
  getById: (id: string) => api.get<Plant>(`/api/v1/plants/${id}`),
};

// Notifications endpoints
export const notifications = {
  getAll: () => api.get<Notification[]>('/api/v1/notifications'),
  markAsRead: (id: string) =>
    api.put(`/api/v1/notifications/${id}/read`),
}; 
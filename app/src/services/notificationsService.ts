import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config/api';

interface Notification {
  id: string;
  // Add notification fields based on your API
}

export const notificationsService = {
  getNotifications: async (): Promise<Notification[]> => {
    const token = await AsyncStorage.getItem('auth_token');
    const response = await axios.get(`${API_URL}/notifications`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  markAsRead: async (id: string): Promise<void> => {
    const token = await AsyncStorage.getItem('auth_token');
    await axios.put(`${API_URL}/notifications/${id}/read`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
}; 
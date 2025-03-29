import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config/api';

interface Plant {
  id: string;
  name: string;
  // Add other plant fields based on your API
}

export const plantsService = {
  getPlants: async (): Promise<Plant[]> => {
    const token = await AsyncStorage.getItem('auth_token');
    const response = await axios.get(`${API_URL}/plants`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  getPlant: async (id: string): Promise<Plant> => {
    const token = await AsyncStorage.getItem('auth_token');
    const response = await axios.get(`${API_URL}/plants/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
}; 
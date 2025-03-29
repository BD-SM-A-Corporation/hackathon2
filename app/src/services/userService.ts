import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:3000/api/v1'; // Replace with your actual API URL

interface UserProfile {
  id: string;
  name: string;
  email: string;
  // Add any other profile fields your API returns
}

interface UpdateProfileData {
  name?: string;
  email?: string;
  // Add any other fields that can be updated
}

export const userService = {
  getProfile: async (): Promise<UserProfile> => {
    const token = await AsyncStorage.getItem('auth_token');
    const response = await axios.get(`${API_URL}/user/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  updateProfile: async (data: UpdateProfileData): Promise<UserProfile> => {
    const token = await AsyncStorage.getItem('auth_token');
    const response = await axios.put(`${API_URL}/user/profile`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
}; 
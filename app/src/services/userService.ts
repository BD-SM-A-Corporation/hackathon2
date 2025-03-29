import api from '../config/api';
import { User } from '../types/models';

interface UpdateProfileData {
  name: string;
}

export const userService = {
  getProfile: async (): Promise<User> => {
    const response = await api.get('/user/profile');
    return response.data;
  },

  updateProfile: async (data: UpdateProfileData): Promise<User> => {
    const response = await api.put('/user/profile', data);
    return response.data;
  },
}; 
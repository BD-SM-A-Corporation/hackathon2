import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:3000/api/v1';

interface Bed {
  id: string;
  name: string;
  // Add other bed fields based on your API
}

interface CreateBedData {
  name: string;
  // Add other required fields
}

interface UpdateBedData {
  name?: string;
  // Add other updatable fields
}

interface Record {
  id: string;
  bedId: string;
  // Add other record fields
}

interface CreateRecordData {
  // Add required fields for creating a record
}

interface UpdateRecordData {
  // Add updatable fields for records
}

export const bedsService = {
  // Bed operations
  createBed: async (data: CreateBedData): Promise<Bed> => {
    const token = await AsyncStorage.getItem('auth_token');
    const response = await axios.post(`${API_URL}/beds`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  getBeds: async (): Promise<Bed[]> => {
    const token = await AsyncStorage.getItem('auth_token');
    const response = await axios.get(`${API_URL}/beds`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  getBed: async (id: string): Promise<Bed> => {
    const token = await AsyncStorage.getItem('auth_token');
    const response = await axios.get(`${API_URL}/beds/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  updateBed: async (id: string, data: UpdateBedData): Promise<Bed> => {
    const token = await AsyncStorage.getItem('auth_token');
    const response = await axios.put(`${API_URL}/beds/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  deleteBed: async (id: string): Promise<void> => {
    const token = await AsyncStorage.getItem('auth_token');
    await axios.delete(`${API_URL}/beds/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Record operations
  createRecord: async (bedId: string, data: CreateRecordData): Promise<Record> => {
    const token = await AsyncStorage.getItem('auth_token');
    const response = await axios.post(`${API_URL}/beds/${bedId}/records`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  getBedRecords: async (bedId: string): Promise<Record[]> => {
    const token = await AsyncStorage.getItem('auth_token');
    const response = await axios.get(`${API_URL}/beds/${bedId}/records`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  updateRecord: async (id: string, data: UpdateRecordData): Promise<Record> => {
    const token = await AsyncStorage.getItem('auth_token');
    const response = await axios.put(`${API_URL}/records/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  deleteRecord: async (id: string): Promise<void> => {
    const token = await AsyncStorage.getItem('auth_token');
    await axios.delete(`${API_URL}/records/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
}; 
import { api } from './api';
import { Bed } from '../types/models';

export interface CreateBedData {
  name: string;
  plant_type: string;
  sowing_date: string;
  substrate_type: string;
  expected_harvest: string;
}

export interface UpdateBedData {
  name?: string;
  plant_type?: string;
  sowing_date?: string;
  substrate_type?: string;
  expected_harvest?: string;
  status?: 'active' | 'harvested' | 'failed';
}

export const bedService = {
  createBed: async (data: CreateBedData): Promise<Bed> => {
    const response = await api.post('/beds', data);
    return response.data;
  },

  getBeds: async (): Promise<Bed[]> => {
    const response = await api.get('/beds');
    return response.data;
  },

  getBed: async (id: number): Promise<Bed> => {
    const response = await api.get(`/beds/${id}`);
    return response.data;
  },

  updateBed: async (id: number, data: UpdateBedData): Promise<Bed> => {
    const response = await api.put(`/beds/${id}`, data);
    return response.data;
  },

  deleteBed: async (id: number): Promise<void> => {
    await api.delete(`/beds/${id}`);
  },
}; 
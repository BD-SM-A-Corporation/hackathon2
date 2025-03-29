import { api } from './api';
import { PlantLibrary } from '../types/models';

export const plantService = {
  async getPlants(): Promise<PlantLibrary[]> {
    const response = await api.get('/plants');
    return response.data;
  },

  async getPlant(id: number): Promise<PlantLibrary> {
    const response = await api.get(`/plants/${id}`);
    return response.data;
  },
}; 
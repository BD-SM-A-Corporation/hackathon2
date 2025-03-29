import { api } from './api';
import { Record } from '../types/models';

export interface CreateRecordData {
  height: number;
  humidity: number;
  notes: string;
  photo_url: string;
  visual_status: string;
}

export interface UpdateRecordData {
  height?: number;
  humidity?: number;
  notes?: string;
  photo_url?: string;
  visual_status?: string;
}

export const recordService = {
  async createRecord(bedId: number, data: CreateRecordData): Promise<Record> {
    const response = await api.post(`/beds/${bedId}/records`, data);
    return response.data;
  },

  async getBedRecords(bedId: number): Promise<Record[]> {
    const response = await api.get(`/beds/${bedId}/records`);
    return response.data;
  },

  async updateRecord(id: number, data: UpdateRecordData): Promise<Record> {
    const response = await api.put(`/records/${id}`, data);
    return response.data;
  },

  async deleteRecord(id: number): Promise<void> {
    await api.delete(`/records/${id}`);
  },
}; 
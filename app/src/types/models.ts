export interface User {
  id: number;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Bed {
  id: number;
  user_id: number;
  user?: User;
  name: string;
  plant_type: string;
  sowing_date: string;
  substrate_type: string;
  expected_harvest: string;
  status: 'active' | 'harvested' | 'failed';
  records?: Record[];
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Record {
  id: number;
  bed_id: number;
  bed?: Bed;
  date: string;
  height: number;
  humidity: number;
  notes: string;
  photo_url: string;
  visual_status: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface PlantLibrary {
  id: number;
  name: string;
  description: string;
  growing_time: number;
  optimal_temp: number;
  optimal_humidity: number;
  light_needs: string;
  tips: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Notification {
  id: number;
  user_id: number;
  user?: User;
  bed_id: number;
  bed?: Bed;
  type: 'watering' | 'checkup' | 'harvest';
  message: string;
  due_date: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
} 
export interface MicrogreenBatch {
  id: string;
  name: string;
  type: string;
  sowingDate: Date;
  substrate: string;
  expectedHarvestDate: Date;
  status: 'active' | 'completed' | 'cancelled';
}

export interface PhenologyEntry {
  id: string;
  batchId: string;
  date: Date;
  height: number;
  notes: string;
  humidity: number;
  photos: string[];
}

export interface MicrogreenType {
  id: string;
  name: string;
  description: string;
  growingTime: number;
  optimalTemperature: {
    min: number;
    max: number;
  };
  optimalHumidity: {
    min: number;
    max: number;
  };
  lightRequirements: string;
} 
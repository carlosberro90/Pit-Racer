export interface Bike {
  id: string;
  brand: string;
  model: string;
  year: number;
  odometer: number;
  tankCapacity: number; // In Liters
  color?: string;
  nickname?: string;
  fuelType?: string;
  photoUrl?: string;
}

export interface FuelLog {
  id: string;
  bikeId: string;
  date: string;
  liters: number;
  pricePerLiterUsd: number;
  totalUsd: number;
  odometer: number;
  isFullTank: boolean;
  notes?: string;
}

export type TaskCategory = 'engine' | 'transmission' | 'brakes' | 'tires' | 'general' | 'electrical';

export interface MaintenanceTask {
  id: string;
  bikeId: string;
  title: string;
  category: TaskCategory;
  intervalKm: number;
  lastServicedKm: number;
  intervalDays?: number;
  lastServicedDate?: string;
  colorHex: string;
  iconName: 'oil' | 'spark' | 'chain' | 'sprocket' | 'disc' | 'valve' | 'tire' | 'battery' | 'wrench';
  notes?: string;
}

export interface MaintenanceLogEntry {
  id: string;
  bikeId: string;
  taskId: string;
  taskTitle: string;
  date: string;
  odometer: number;
  costUsd: number;
  workshopName?: string;
  notes?: string;
  receiptImage?: string;
}

export interface GpsPoint {
  lat: number;
  lng: number;
  timestamp: number;
  speedKmh?: number;
}

export interface GpsTrip {
  id: string;
  bikeId: string;
  date: string;
  durationSeconds: number;
  distanceKm: number;
  avgSpeedKmh: number;
  maxSpeedKmh: number;
  points: GpsPoint[];
}

export interface ProgrammedRoute {
  id: string;
  bikeId: string;
  name: string;
  origin: string;
  destination: string;
  distanceKm: number;
  estimatedMinutes: number;
  scheduledDate?: string;
  scheduledTime?: string;
  stops?: string[];
  roadType?: 'curvas' | 'autopista' | 'mixta' | 'offroad';
  estimatedFuelLiters?: number;
  notes?: string;
  createdAt: string;
}

export interface Mechanic {
  id: string;
  name: string;
  rating: string;
  numericRating: number;
  distance: string;
  address: string;
  phone: string;
  is24h: boolean;
  specialties: string[];
  reviewCount: number;
  verified: boolean;
  services: { name: string; estimatedPriceUsd: string }[];
  description: string;
}

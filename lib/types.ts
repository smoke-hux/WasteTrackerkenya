export interface User {
  id: number;
  email: string;
  role: 'resident' | 'collector';
  fullName: string;
  phone?: string;
  location?: string;
  isActive?: boolean;
  lastLoginAt?: string;
  createdAt?: string;
}

export interface ResidentDashboardData {
  totalCollected: number;
  totalEarnings: number;
  co2Saved: number;
  recyclingRate: number;
  activePickups: any[];
  recentCollections: any[];
}

export interface CollectorDashboardData {
  todayJobs: number;
  todayWeight: number;
  todayEarnings: number;
  availableJobs: any[];
  activeJob: any;
}

export interface WasteTypeOption {
  id: string;
  label: string;
  icon: string;
  color: string;
}

export const WASTE_TYPES: WasteTypeOption[] = [
  { id: 'organic', label: 'Organic', icon: 'leaf', color: 'text-green-500' },
  { id: 'plastic', label: 'Plastic', icon: 'wine-bottle', color: 'text-blue-500' },
  { id: 'paper', label: 'Paper', icon: 'newspaper', color: 'text-yellow-500' },
  { id: 'metal', label: 'Metal', icon: 'cog', color: 'text-gray-500' },
  { id: 'glass', label: 'Glass', icon: 'wine-glass', color: 'text-purple-500' },
  { id: 'electronic', label: 'Electronic', icon: 'computer', color: 'text-indigo-500' },
];

export const DUMPING_WASTE_TYPES = [
  { id: 'household', label: 'Household' },
  { id: 'construction', label: 'Construction' },
  { id: 'electronic', label: 'Electronic' },
  { id: 'hazardous', label: 'Hazardous' },
];

export const URGENCY_LEVELS = [
  { id: 'low', label: 'Low - Can wait a few days', color: 'yellow' },
  { id: 'medium', label: 'Medium - Needs attention soon', color: 'orange' },
  { id: 'high', label: 'High - Immediate action required', color: 'red' },
];

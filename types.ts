export interface Tenant {
  id: string;
  name: string;
  mobile: string;
  rent: number;
  joiningDate: string;
  roomId: string;
}

export interface Room {
  id: string;
  number: string;
  floorId: string;
  capacity: number;
  tenants: string[]; // Array of Tenant IDs
}

export interface Floor {
  id: string;
  name: string; // e.g., "Ground Floor", "1st Floor"
  rooms: string[]; // Array of Room IDs
}

export interface AppSettings {
  hostelName: string;
  address: string;
  upiId: string;
  contactNumber: string;
  signatureText?: string;
  customQrCode?: string; // Base64 string for custom QR image
}

export interface AppData {
  floors: Floor[];
  rooms: Room[];
  tenants: Tenant[];
  settings: AppSettings;
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  ROOMS = 'ROOMS',
  TENANTS = 'TENANTS',
  SETTINGS = 'SETTINGS'
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}
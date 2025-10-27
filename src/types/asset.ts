export type AssetStatus = 'healthy' | 'warning' | 'critical' | 'offline';
export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';
export type UserRole = 'technician' | 'manager' | 'executive';

export interface Asset {
  id: string;
  name: string;
  type: string;
  status: AssetStatus;
  healthScore: number;
  location: { x: number; y: number; z: number };
  temperature: number;
  vibration: number;
  pressure: number;
  lastMaintenance: Date;
  nextMaintenance: Date;
  alerts: number;
}

export interface Alert {
  id: string;
  assetId: string;
  assetName: string;
  severity: AlertSeverity;
  title: string;
  description: string;
  timestamp: Date;
  acknowledged: boolean;
}

export interface KPI {
  label: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'neutral';
}

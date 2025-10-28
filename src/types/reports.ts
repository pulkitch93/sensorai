export type ReportType = 'site-scorecard' | 'executive-brief' | 'asset-health' | 'maintenance-summary' | 'energy-report' | 'custom';
export type ReportStatus = 'draft' | 'active' | 'archived';
export type DeliveryChannel = 'email' | 'slack' | 'teams';
export type ExportFormat = 'pdf' | 'csv' | 'png' | 'xlsx';
export type ReportFrequency = 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly';

export interface ReportKPI {
  id: string;
  name: string;
  category: string;
  unit: string;
  selected: boolean;
}

export interface Report {
  id: string;
  name: string;
  type: ReportType;
  status: ReportStatus;
  description: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  configuration: {
    kpis: string[];
    timeRange: {
      type: 'last-7-days' | 'last-30-days' | 'last-quarter' | 'custom';
      startDate?: Date;
      endDate?: Date;
    };
    groupings: string[];
    layout: 'compact' | 'detailed' | 'executive';
    filters?: {
      assets?: string[];
      sites?: string[];
      categories?: string[];
    };
  };
  schedule?: {
    enabled: boolean;
    frequency: ReportFrequency;
    dayOfWeek?: number; // 0-6 for weekly
    dayOfMonth?: number; // 1-31 for monthly
    time: string; // HH:MM format
    timezone: string;
    recipients: string[];
    channels: DeliveryChannel[];
  };
  sharing?: {
    enabled: boolean;
    publicUrl?: string;
    token: string;
    expiresAt?: Date;
    requiresAuth: boolean;
  };
}

export interface ReportDelivery {
  id: string;
  reportId: string;
  reportName: string;
  scheduledAt: Date;
  deliveredAt?: Date;
  status: 'pending' | 'sending' | 'delivered' | 'failed';
  channel: DeliveryChannel;
  recipients: string[];
  format: ExportFormat;
  errorMessage?: string;
}

export interface ExecutiveBrief {
  id: string;
  generatedAt: Date;
  period: {
    startDate: Date;
    endDate: Date;
  };
  highlights: {
    savingsAchieved: number;
    risksMitigated: number;
    downtimePrevented: number;
    efficiencyGain: number;
  };
  topAlerts: {
    id: string;
    title: string;
    severity: string;
    impact: string;
  }[];
  recommendations: {
    id: string;
    title: string;
    priority: string;
    estimatedSavings: number;
  }[];
}

export interface ReportMetrics {
  totalReports: number;
  activeSchedules: number;
  deliveriesThisMonth: number;
  successRate: number;
  sharedReports: number;
}

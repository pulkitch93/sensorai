export interface Site {
  id: string;
  name: string;
  region: string;
  location: string;
  assetCount: number;
  status: 'healthy' | 'warning' | 'critical';
}

export interface PortfolioKPI {
  label: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  target?: string | number;
  unit?: string;
}

export interface ROIMetric {
  label: string;
  value: number;
  unit: string;
  trend: 'up' | 'down';
}

export interface BenchmarkData {
  siteId: string;
  siteName: string;
  metric: string;
  value: number;
  industry: number;
  internal: number;
  percentile: number;
}

export interface RiskHeatmapData {
  siteId: string;
  siteName: string;
  region: string;
  riskScore: number;
  criticalAssets: number;
  alerts: number;
}

export interface WaterfallItem {
  label: string;
  value: number;
  type: 'positive' | 'negative' | 'total';
}

export type FilterOption = {
  value: string;
  label: string;
};

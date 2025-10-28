import { Site, PortfolioKPI, ROIMetric, BenchmarkData, RiskHeatmapData, WaterfallItem } from '@/types/portfolio';

export const mockSites: Site[] = [
  {
    id: 'site-1',
    name: 'Detroit Manufacturing',
    region: 'North America',
    location: 'Detroit, MI',
    assetCount: 145,
    status: 'healthy',
  },
  {
    id: 'site-2',
    name: 'Austin Assembly',
    region: 'North America',
    location: 'Austin, TX',
    assetCount: 98,
    status: 'warning',
  },
  {
    id: 'site-3',
    name: 'Berlin Production',
    region: 'Europe',
    location: 'Berlin, Germany',
    assetCount: 167,
    status: 'critical',
  },
  {
    id: 'site-4',
    name: 'Shanghai Plant',
    region: 'Asia Pacific',
    location: 'Shanghai, China',
    assetCount: 203,
    status: 'healthy',
  },
  {
    id: 'site-5',
    name: 'Tokyo Facility',
    region: 'Asia Pacific',
    location: 'Tokyo, Japan',
    assetCount: 134,
    status: 'healthy',
  },
];

export const portfolioKPIs: PortfolioKPI[] = [
  { label: 'Enterprise Uptime', value: '96.2%', change: 1.8, trend: 'up', target: '98%', unit: '%' },
  { label: 'MTBF', value: '1,247', change: 8.3, trend: 'up', target: '1,500', unit: 'hrs' },
  { label: 'MTTR', value: '1.8', change: -15.2, trend: 'up', target: '1.5', unit: 'hrs' },
  { label: 'Planned vs Unplanned', value: '78%', change: 12.5, trend: 'up', target: '85%', unit: '%' },
  { label: 'Prescription Adoption', value: '68%', change: 5.2, trend: 'up', target: '80%', unit: '%' },
  { label: 'Forecasted Downtime', value: '247', change: -8.3, trend: 'up', target: '180', unit: 'hrs' },
  { label: 'Parts Spend', value: '$2.4M', change: -5.1, trend: 'up', target: '$2.0M', unit: '' },
  { label: 'Energy Cost Trend', value: '$1.8M', change: -3.2, trend: 'up', target: '$1.5M', unit: '' },
  { label: 'SLA Compliance', value: '94.5%', change: 2.1, trend: 'up', target: '98%', unit: '%' },
  { label: 'Carbon Intensity', value: '3.2', change: -4.8, trend: 'up', target: '2.8', unit: 'kg/unit' },
];

export const roiMetrics: ROIMetric[] = [
  { label: 'Avoided Downtime', value: 1847, unit: 'hours', trend: 'up' },
  { label: 'Avoided Scrap', value: 284000, unit: 'units', trend: 'up' },
  { label: 'Energy Savings', value: 340000, unit: 'USD', trend: 'up' },
  { label: 'Total Savings', value: 4200000, unit: 'USD', trend: 'up' },
  { label: 'Payback Period', value: 8.4, unit: 'months', trend: 'down' },
];

export const benchmarkData: BenchmarkData[] = [
  { siteId: 'site-1', siteName: 'Detroit', metric: 'MTBF', value: 1320, industry: 1100, internal: 1247, percentile: 72 },
  { siteId: 'site-2', siteName: 'Austin', metric: 'MTBF', value: 1180, industry: 1100, internal: 1247, percentile: 58 },
  { siteId: 'site-3', siteName: 'Berlin', metric: 'MTBF', value: 980, industry: 1100, internal: 1247, percentile: 34 },
  { siteId: 'site-4', siteName: 'Shanghai', metric: 'MTBF', value: 1450, industry: 1100, internal: 1247, percentile: 88 },
  { siteId: 'site-5', siteName: 'Tokyo', metric: 'MTBF', value: 1305, industry: 1100, internal: 1247, percentile: 70 },
];

export const riskHeatmapData: RiskHeatmapData[] = [
  { siteId: 'site-1', siteName: 'Detroit', region: 'North America', riskScore: 28, criticalAssets: 3, alerts: 12 },
  { siteId: 'site-2', siteName: 'Austin', region: 'North America', riskScore: 45, criticalAssets: 5, alerts: 23 },
  { siteId: 'site-3', siteName: 'Berlin', region: 'Europe', riskScore: 72, criticalAssets: 9, alerts: 41 },
  { siteId: 'site-4', siteName: 'Shanghai', region: 'Asia Pacific', riskScore: 18, criticalAssets: 2, alerts: 7 },
  { siteId: 'site-5', siteName: 'Tokyo', region: 'Asia Pacific', riskScore: 31, criticalAssets: 4, alerts: 15 },
];

export const savingsWaterfall: WaterfallItem[] = [
  { label: 'Baseline', value: 0, type: 'total' },
  { label: 'Avoided Downtime', value: 1850000, type: 'positive' },
  { label: 'Reduced Scrap', value: 780000, type: 'positive' },
  { label: 'Energy Savings', value: 340000, type: 'positive' },
  { label: 'Parts Optimization', value: 620000, type: 'positive' },
  { label: 'Labor Efficiency', value: 410000, type: 'positive' },
  { label: 'Implementation Cost', value: -800000, type: 'negative' },
  { label: 'Total Savings', value: 4200000, type: 'total' },
];

export const regions = ['All Regions', 'North America', 'Europe', 'Asia Pacific'];
export const assetClasses = ['All Classes', 'Press', 'Mill', 'Conveyor', 'Compressor', 'Robot', 'Booth'];
export const criticality = ['All Levels', 'Critical', 'High', 'Medium', 'Low'];

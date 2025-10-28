import { Report, ReportDelivery, ExecutiveBrief, ReportMetrics, ReportKPI } from "@/types/reports";

export const mockAvailableKPIs: ReportKPI[] = [
  { id: "uptime", name: "Overall Uptime", category: "Performance", unit: "%", selected: true },
  { id: "mtbf", name: "MTBF", category: "Reliability", unit: "hours", selected: true },
  { id: "mttr", name: "MTTR", category: "Maintenance", unit: "hours", selected: true },
  { id: "energy", name: "Energy Efficiency", category: "Sustainability", unit: "%", selected: true },
  { id: "cost", name: "Maintenance Cost", category: "Financial", unit: "$", selected: false },
  { id: "alerts", name: "Active Alerts", category: "Operations", unit: "count", selected: true },
  { id: "utilization", name: "Asset Utilization", category: "Performance", unit: "%", selected: false },
  { id: "oee", name: "OEE", category: "Performance", unit: "%", selected: false },
];

export const mockReports: Report[] = [
  {
    id: "report-1",
    name: "Weekly Site Scorecard",
    type: "site-scorecard",
    status: "active",
    description: "Comprehensive weekly performance report for all sites",
    createdBy: "Sarah Johnson",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-02-10"),
    configuration: {
      kpis: ["uptime", "mtbf", "mttr", "energy", "alerts"],
      timeRange: {
        type: "last-7-days",
      },
      groupings: ["site", "asset-type"],
      layout: "detailed",
      filters: {
        sites: ["Site A", "Site B", "Site C"],
      },
    },
    schedule: {
      enabled: true,
      frequency: "weekly",
      dayOfWeek: 1, // Monday
      time: "08:00",
      timezone: "America/New_York",
      recipients: ["operations@company.com", "management@company.com"],
      channels: ["email", "slack"],
    },
    sharing: {
      enabled: true,
      publicUrl: "https://reports.company.com/weekly-scorecard",
      token: "wsc-a3b2c1d4e5f6",
      expiresAt: new Date("2025-12-31"),
      requiresAuth: false,
    },
  },
  {
    id: "report-2",
    name: "Executive Brief - Monthly",
    type: "executive-brief",
    status: "active",
    description: "High-level monthly summary with savings and risk highlights",
    createdBy: "Mike Chen",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-02-08"),
    configuration: {
      kpis: ["uptime", "cost", "alerts"],
      timeRange: {
        type: "last-30-days",
      },
      groupings: ["site"],
      layout: "executive",
    },
    schedule: {
      enabled: true,
      frequency: "monthly",
      dayOfMonth: 1,
      time: "09:00",
      timezone: "America/New_York",
      recipients: ["executives@company.com"],
      channels: ["email"],
    },
  },
  {
    id: "report-3",
    name: "Asset Health Dashboard",
    type: "asset-health",
    status: "active",
    description: "Real-time asset health metrics and predictive insights",
    createdBy: "Tom Wilson",
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-09"),
    configuration: {
      kpis: ["uptime", "mtbf", "alerts", "utilization"],
      timeRange: {
        type: "last-30-days",
      },
      groupings: ["asset-type", "criticality"],
      layout: "detailed",
    },
    schedule: {
      enabled: false,
      frequency: "daily",
      time: "06:00",
      timezone: "America/New_York",
      recipients: [],
      channels: [],
    },
    sharing: {
      enabled: true,
      publicUrl: "https://reports.company.com/asset-health",
      token: "ah-7x8y9z0a1b2c",
      requiresAuth: true,
    },
  },
  {
    id: "report-4",
    name: "Energy Consumption Report",
    type: "energy-report",
    status: "draft",
    description: "Detailed energy usage patterns and efficiency metrics",
    createdBy: "Rachel Kim",
    createdAt: new Date("2024-02-08"),
    updatedAt: new Date("2024-02-10"),
    configuration: {
      kpis: ["energy", "cost"],
      timeRange: {
        type: "last-quarter",
      },
      groupings: ["site", "time-of-day"],
      layout: "compact",
    },
  },
];

export const mockReportDeliveries: ReportDelivery[] = [
  {
    id: "del-1",
    reportId: "report-1",
    reportName: "Weekly Site Scorecard",
    scheduledAt: new Date("2024-02-12T08:00:00"),
    deliveredAt: new Date("2024-02-12T08:02:15"),
    status: "delivered",
    channel: "email",
    recipients: ["operations@company.com", "management@company.com"],
    format: "pdf",
  },
  {
    id: "del-2",
    reportId: "report-1",
    reportName: "Weekly Site Scorecard",
    scheduledAt: new Date("2024-02-12T08:00:00"),
    deliveredAt: new Date("2024-02-12T08:02:18"),
    status: "delivered",
    channel: "slack",
    recipients: ["#operations-reports"],
    format: "pdf",
  },
  {
    id: "del-3",
    reportId: "report-2",
    reportName: "Executive Brief - Monthly",
    scheduledAt: new Date("2024-02-01T09:00:00"),
    deliveredAt: new Date("2024-02-01T09:01:05"),
    status: "delivered",
    channel: "email",
    recipients: ["executives@company.com"],
    format: "pdf",
  },
  {
    id: "del-4",
    reportId: "report-1",
    reportName: "Weekly Site Scorecard",
    scheduledAt: new Date("2024-02-05T08:00:00"),
    status: "failed",
    channel: "teams",
    recipients: ["Operations Team"],
    format: "pdf",
    errorMessage: "Teams webhook URL not configured",
  },
  {
    id: "del-5",
    reportId: "report-1",
    reportName: "Weekly Site Scorecard",
    scheduledAt: new Date("2024-02-19T08:00:00"),
    status: "pending",
    channel: "email",
    recipients: ["operations@company.com"],
    format: "pdf",
  },
];

export const mockExecutiveBrief: ExecutiveBrief = {
  id: "brief-1",
  generatedAt: new Date("2024-02-01T09:00:00"),
  period: {
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-01-31"),
  },
  highlights: {
    savingsAchieved: 127500,
    risksMitigated: 8,
    downtimePrevented: 156,
    efficiencyGain: 12.3,
  },
  topAlerts: [
    {
      id: "alert-1",
      title: "Bearing wear detected on Turbine A1",
      severity: "high",
      impact: "Potential 48hr downtime avoided",
    },
    {
      id: "alert-2",
      title: "Cooling system efficiency drop",
      severity: "medium",
      impact: "Energy costs increase of $2,400/month",
    },
    {
      id: "alert-3",
      title: "Vibration threshold exceeded on Pump C2",
      severity: "high",
      impact: "Critical failure risk within 72 hours",
    },
  ],
  recommendations: [
    {
      id: "rec-1",
      title: "Implement predictive maintenance on 5 high-risk assets",
      priority: "high",
      estimatedSavings: 85000,
    },
    {
      id: "rec-2",
      title: "Upgrade cooling system controls",
      priority: "medium",
      estimatedSavings: 28800,
    },
    {
      id: "rec-3",
      title: "Optimize production schedules based on energy pricing",
      priority: "low",
      estimatedSavings: 15600,
    },
  ],
};

export const mockReportMetrics: ReportMetrics = {
  totalReports: 12,
  activeSchedules: 8,
  deliveriesThisMonth: 34,
  successRate: 97.1,
  sharedReports: 5,
};

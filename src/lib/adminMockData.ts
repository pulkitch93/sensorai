import { 
  UserAccount, 
  RolePermission, 
  AuditLogEntry, 
  ApprovalRequest,
  APIKey,
  Webhook,
  DataRetentionPolicy,
  ImpersonationSession,
  AdminMetrics
} from '@/types/admin';

export const userAccounts: UserAccount[] = [
  {
    id: 'user-1',
    email: 'john.smith@company.com',
    name: 'John Smith',
    role: 'admin',
    siteAccess: ['all'],
    assetClassAccess: ['all'],
    active: true,
    lastLogin: new Date('2025-01-28T08:30:00'),
    createdAt: new Date('2024-01-15'),
    createdBy: 'system'
  },
  {
    id: 'user-2',
    email: 'sarah.chen@company.com',
    name: 'Sarah Chen',
    role: 'executive',
    siteAccess: ['all'],
    assetClassAccess: ['all'],
    active: true,
    lastLogin: new Date('2025-01-28T07:45:00'),
    createdAt: new Date('2024-02-01'),
    createdBy: 'user-1'
  },
  {
    id: 'user-3',
    email: 'mike.rodriguez@company.com',
    name: 'Mike Rodriguez',
    role: 'manager',
    siteAccess: ['site-north', 'site-central'],
    assetClassAccess: ['pumps', 'compressors', 'motors'],
    active: true,
    lastLogin: new Date('2025-01-28T09:15:00'),
    createdAt: new Date('2024-03-10'),
    createdBy: 'user-1'
  },
  {
    id: 'user-4',
    email: 'lisa.wang@company.com',
    name: 'Lisa Wang',
    role: 'engineer',
    siteAccess: ['site-north'],
    assetClassAccess: ['pumps', 'motors', 'hvac'],
    active: true,
    lastLogin: new Date('2025-01-28T08:00:00'),
    createdAt: new Date('2024-04-22'),
    createdBy: 'user-3'
  },
  {
    id: 'user-5',
    email: 'david.park@company.com',
    name: 'David Park',
    role: 'technician',
    siteAccess: ['site-north'],
    assetClassAccess: ['pumps', 'motors'],
    active: true,
    lastLogin: new Date('2025-01-28T06:30:00'),
    createdAt: new Date('2024-06-15'),
    createdBy: 'user-3'
  }
];

export const rolePermissions: RolePermission[] = [
  {
    id: 'perm-1',
    role: 'admin',
    resource: 'all',
    actions: ['view', 'edit', 'delete', 'approve', 'create'],
    siteScope: ['all'],
    assetClassScope: ['all']
  },
  {
    id: 'perm-2',
    role: 'executive',
    resource: 'dashboards',
    actions: ['view'],
    siteScope: ['all'],
    assetClassScope: ['all']
  },
  {
    id: 'perm-3',
    role: 'executive',
    resource: 'reports',
    actions: ['view', 'create'],
    siteScope: ['all'],
    assetClassScope: ['all']
  },
  {
    id: 'perm-4',
    role: 'manager',
    resource: 'prescriptions',
    actions: ['view', 'create', 'approve'],
    siteScope: ['assigned'],
    assetClassScope: ['assigned']
  },
  {
    id: 'perm-5',
    role: 'manager',
    resource: 'alerts',
    actions: ['view', 'edit'],
    siteScope: ['assigned'],
    assetClassScope: ['assigned']
  },
  {
    id: 'perm-6',
    role: 'engineer',
    resource: 'analytics',
    actions: ['view', 'create'],
    siteScope: ['assigned'],
    assetClassScope: ['assigned']
  },
  {
    id: 'perm-7',
    role: 'engineer',
    resource: 'thresholds',
    actions: ['view', 'edit'],
    siteScope: ['assigned'],
    assetClassScope: ['assigned']
  },
  {
    id: 'perm-8',
    role: 'technician',
    resource: 'work-orders',
    actions: ['view', 'edit'],
    siteScope: ['assigned'],
    assetClassScope: ['assigned']
  },
  {
    id: 'perm-9',
    role: 'technician',
    resource: 'sensors',
    actions: ['view'],
    siteScope: ['assigned'],
    assetClassScope: ['assigned']
  }
];

export const auditLogs: AuditLogEntry[] = [
  {
    id: 'audit-1',
    timestamp: new Date('2025-01-28T09:15:23'),
    userId: 'user-4',
    userName: 'Lisa Wang',
    userRole: 'engineer',
    eventType: 'threshold',
    action: 'Modified vibration threshold',
    resource: 'Asset-1',
    resourceId: 'asset-1',
    changes: {
      vibrationThreshold: { old: 2.5, new: 2.8 }
    },
    ipAddress: '192.168.1.45',
    success: true
  },
  {
    id: 'audit-2',
    timestamp: new Date('2025-01-28T08:42:15'),
    userId: 'user-3',
    userName: 'Mike Rodriguez',
    userRole: 'manager',
    eventType: 'prescription',
    action: 'Approved maintenance prescription',
    resource: 'Prescription-PRE-2024-042',
    resourceId: 'pre-042',
    ipAddress: '192.168.1.32',
    success: true
  },
  {
    id: 'audit-3',
    timestamp: new Date('2025-01-28T07:30:12'),
    userId: 'user-1',
    userName: 'John Smith',
    userRole: 'admin',
    eventType: 'impersonation',
    action: 'Started role impersonation',
    resource: 'technician',
    changes: {
      impersonatedRole: { old: null, new: 'technician' }
    },
    ipAddress: '192.168.1.10',
    success: true
  },
  {
    id: 'audit-4',
    timestamp: new Date('2025-01-28T06:15:45'),
    userId: 'user-5',
    userName: 'David Park',
    userRole: 'technician',
    eventType: 'override',
    action: 'Attempted to override RUL prediction',
    resource: 'Asset-3',
    resourceId: 'asset-3',
    ipAddress: '192.168.1.67',
    success: false,
    errorMessage: 'Insufficient permissions'
  },
  {
    id: 'audit-5',
    timestamp: new Date('2025-01-27T15:22:33'),
    userId: 'user-1',
    userName: 'John Smith',
    userRole: 'admin',
    eventType: 'model-change',
    action: 'Updated ML model version',
    resource: 'RUL Prediction Model',
    resourceId: 'model-rul-v3',
    changes: {
      modelVersion: { old: 'v2.1', new: 'v3.0' },
      accuracy: { old: 0.87, new: 0.92 }
    },
    ipAddress: '192.168.1.10',
    success: true
  }
];

export const approvalRequests: ApprovalRequest[] = [
  {
    id: 'approval-1',
    type: 'threshold-change',
    title: 'Increase Critical Temperature Threshold',
    description: 'Requesting increase of critical temperature threshold from 85°C to 90°C for all compressors based on updated manufacturer specifications.',
    requestedBy: 'Lisa Wang',
    requestedByRole: 'engineer',
    requestedAt: new Date('2025-01-28T08:00:00'),
    status: 'pending',
    requiresRoles: ['manager', 'admin'],
    metadata: {
      assetClass: 'compressors',
      currentThreshold: 85,
      proposedThreshold: 90,
      affectedAssets: 12
    }
  },
  {
    id: 'approval-2',
    type: 'prescription',
    title: 'New Bearing Replacement Procedure',
    description: 'Submit new AI-generated prescription for bearing replacement with updated safety protocols and reduced downtime.',
    requestedBy: 'Mike Rodriguez',
    requestedByRole: 'manager',
    requestedAt: new Date('2025-01-27T14:30:00'),
    status: 'approved',
    reviewedBy: 'John Smith',
    reviewedAt: new Date('2025-01-27T16:45:00'),
    reviewNotes: 'Approved. Procedure looks comprehensive and safety protocols are thorough.',
    requiresRoles: ['admin'],
    metadata: {
      prescriptionId: 'pre-045',
      estimatedSavings: 15000,
      downtimeReduction: '35%'
    }
  },
  {
    id: 'approval-3',
    type: 'model-update',
    title: 'Deploy Updated Anomaly Detection Model',
    description: 'Request to deploy new anomaly detection model v4.2 with improved accuracy and reduced false positive rate.',
    requestedBy: 'Lisa Wang',
    requestedByRole: 'engineer',
    requestedAt: new Date('2025-01-26T11:00:00'),
    status: 'rejected',
    reviewedBy: 'Sarah Chen',
    reviewedAt: new Date('2025-01-26T15:30:00'),
    reviewNotes: 'Model requires additional validation on historical data. Please run extended test suite.',
    requiresRoles: ['executive', 'admin'],
    metadata: {
      modelVersion: 'v4.2',
      currentAccuracy: 0.87,
      proposedAccuracy: 0.91,
      falsePositiveReduction: '22%'
    }
  }
];

export const apiKeys: APIKey[] = [
  {
    id: 'key-1',
    name: 'Production API Key',
    description: 'Main API key for production integrations',
    key: 'pdm_prod_sk_7x9k2m4n8p1q5r...',
    scope: ['read:assets', 'read:analytics', 'write:alerts'],
    createdBy: 'John Smith',
    createdAt: new Date('2024-06-15'),
    lastUsed: new Date('2025-01-28T09:30:00'),
    expiresAt: new Date('2025-06-15'),
    active: true,
    usageCount: 45892
  },
  {
    id: 'key-2',
    name: 'CMMS Integration',
    description: 'API key for SAP PM integration',
    key: 'pdm_cmms_sk_3b5c7d9e1f2g...',
    scope: ['read:prescriptions', 'write:work-orders', 'read:assets'],
    createdBy: 'Mike Rodriguez',
    createdAt: new Date('2024-09-01'),
    lastUsed: new Date('2025-01-28T08:15:00'),
    expiresAt: new Date('2025-09-01'),
    active: true,
    usageCount: 12453
  },
  {
    id: 'key-3',
    name: 'Analytics Dashboard',
    description: 'Read-only key for executive dashboard',
    key: 'pdm_dash_sk_4h6j8k0l2m...',
    scope: ['read:analytics', 'read:reports'],
    createdBy: 'Sarah Chen',
    createdAt: new Date('2024-11-20'),
    lastUsed: new Date('2025-01-28T07:00:00'),
    active: true,
    usageCount: 8234
  }
];

export const webhooks: Webhook[] = [
  {
    id: 'webhook-1',
    name: 'Critical Alert Notifications',
    url: 'https://alerts.company.com/webhook/critical',
    events: ['alert.critical', 'alert.high'],
    active: true,
    secret: 'whsec_7k9m2n4p8q1r5s...',
    createdBy: 'John Smith',
    createdAt: new Date('2024-07-10'),
    lastTriggered: new Date('2025-01-28T09:22:00'),
    successCount: 342,
    failureCount: 3
  },
  {
    id: 'webhook-2',
    name: 'Work Order Creation',
    url: 'https://cmms.company.com/api/work-orders',
    events: ['prescription.approved', 'prescription.completed'],
    active: true,
    secret: 'whsec_3c5d7e9f1g2h...',
    createdBy: 'Mike Rodriguez',
    createdAt: new Date('2024-09-05'),
    lastTriggered: new Date('2025-01-27T16:45:00'),
    successCount: 156,
    failureCount: 8
  },
  {
    id: 'webhook-3',
    name: 'Slack Notifications',
    url: 'https://hooks.slack.com/services/T00/B00/XXX',
    events: ['approval.pending', 'threshold.exceeded', 'model.updated'],
    active: true,
    secret: 'whsec_4h6j8k0l2m3n...',
    createdBy: 'Sarah Chen',
    createdAt: new Date('2024-08-22'),
    lastTriggered: new Date('2025-01-28T08:00:00'),
    successCount: 521,
    failureCount: 12
  }
];

export const dataRetentionPolicies: DataRetentionPolicy[] = [
  {
    id: 'policy-1',
    category: 'sensor-data',
    retentionDays: 730,
    archiveEnabled: true,
    archiveLocation: 's3://pdm-archive/sensor-data',
    autoDelete: true,
    piiScrubbing: false,
    lastApplied: new Date('2025-01-27')
  },
  {
    id: 'policy-2',
    category: 'audit-logs',
    retentionDays: 2555,
    archiveEnabled: true,
    archiveLocation: 's3://pdm-archive/audit-logs',
    autoDelete: false,
    piiScrubbing: true,
    lastApplied: new Date('2025-01-27')
  },
  {
    id: 'policy-3',
    category: 'alerts',
    retentionDays: 365,
    archiveEnabled: true,
    archiveLocation: 's3://pdm-archive/alerts',
    autoDelete: true,
    piiScrubbing: false,
    lastApplied: new Date('2025-01-27')
  },
  {
    id: 'policy-4',
    category: 'analytics',
    retentionDays: 1095,
    archiveEnabled: true,
    archiveLocation: 's3://pdm-archive/analytics',
    autoDelete: false,
    piiScrubbing: false,
    lastApplied: new Date('2025-01-27')
  },
  {
    id: 'policy-5',
    category: 'reports',
    retentionDays: 1825,
    archiveEnabled: true,
    archiveLocation: 's3://pdm-archive/reports',
    autoDelete: false,
    piiScrubbing: true,
    lastApplied: new Date('2025-01-27')
  }
];

export const impersonationSessions: ImpersonationSession[] = [
  {
    id: 'imp-1',
    adminUserId: 'user-1',
    adminUserName: 'John Smith',
    impersonatedRole: 'technician',
    startedAt: new Date('2025-01-28T07:30:12'),
    endedAt: new Date('2025-01-28T08:15:45'),
    active: false,
    reason: 'Testing technician workflow for new sensor installation',
    actionsPerformed: []
  },
  {
    id: 'imp-2',
    adminUserId: 'user-1',
    adminUserName: 'John Smith',
    impersonatedRole: 'engineer',
    startedAt: new Date('2025-01-27T14:00:00'),
    endedAt: new Date('2025-01-27T15:30:00'),
    active: false,
    reason: 'Validating threshold adjustment permissions',
    actionsPerformed: []
  }
];

export const adminMetrics: AdminMetrics = {
  totalUsers: 5,
  activeUsers: 5,
  pendingApprovals: 1,
  auditLogCount: 1243,
  activeAPIKeys: 3,
  activeWebhooks: 3,
  impersonationSessions: 2
};

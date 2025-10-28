export type UserRole = 'technician' | 'engineer' | 'manager' | 'executive' | 'admin';
export type PermissionAction = 'view' | 'edit' | 'delete' | 'approve' | 'create';
export type AuditEventType = 'prescription' | 'threshold' | 'override' | 'model-change' | 'role-change' | 'impersonation' | 'api-key' | 'webhook';

export interface RolePermission {
  id: string;
  role: UserRole;
  resource: string;
  actions: PermissionAction[];
  siteScope: string[];
  assetClassScope: string[];
}

export interface UserAccount {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  siteAccess: string[];
  assetClassAccess: string[];
  active: boolean;
  lastLogin: Date;
  createdAt: Date;
  createdBy: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  userId: string;
  userName: string;
  userRole: UserRole;
  eventType: AuditEventType;
  action: string;
  resource: string;
  resourceId?: string;
  changes?: Record<string, { old: any; new: any }>;
  ipAddress: string;
  success: boolean;
  errorMessage?: string;
  impersonatedBy?: string;
}

export interface ApprovalRequest {
  id: string;
  type: 'prescription' | 'threshold-change' | 'model-update' | 'override';
  title: string;
  description: string;
  requestedBy: string;
  requestedByRole: UserRole;
  requestedAt: Date;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: Date;
  reviewNotes?: string;
  requiresRoles: UserRole[];
  metadata: Record<string, any>;
}

export interface APIKey {
  id: string;
  name: string;
  description: string;
  key: string;
  scope: string[];
  createdBy: string;
  createdAt: Date;
  lastUsed?: Date;
  expiresAt?: Date;
  active: boolean;
  usageCount: number;
}

export interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  active: boolean;
  secret: string;
  createdBy: string;
  createdAt: Date;
  lastTriggered?: Date;
  successCount: number;
  failureCount: number;
}

export interface DataRetentionPolicy {
  id: string;
  category: 'sensor-data' | 'audit-logs' | 'alerts' | 'analytics' | 'reports';
  retentionDays: number;
  archiveEnabled: boolean;
  archiveLocation?: string;
  autoDelete: boolean;
  piiScrubbing: boolean;
  lastApplied: Date;
}

export interface ImpersonationSession {
  id: string;
  adminUserId: string;
  adminUserName: string;
  impersonatedRole: UserRole;
  startedAt: Date;
  endedAt?: Date;
  active: boolean;
  reason: string;
  actionsPerformed: AuditLogEntry[];
}

export interface AdminMetrics {
  totalUsers: number;
  activeUsers: number;
  pendingApprovals: number;
  auditLogCount: number;
  activeAPIKeys: number;
  activeWebhooks: number;
  impersonationSessions: number;
}

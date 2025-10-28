export type RuleType = 
  | 'threshold' 
  | 'rate-of-change' 
  | 'multivariate-anomaly' 
  | 'sequence-pattern' 
  | 'energy-exception';

export type AlertAction = 
  | 'open-prescription' 
  | 'create-work-order' 
  | 'notify-teams' 
  | 'escalate-expert' 
  | 'trigger-ai-runbook';

export interface AlertRule {
  id: string;
  name: string;
  type: RuleType;
  enabled: boolean;
  assetIds: string[];
  parameters: {
    threshold?: number;
    duration?: number;
    sensitivity?: 'low' | 'medium' | 'high';
    tags?: string[];
  };
  actions: AlertAction[];
  suppressionWindow?: number; // minutes
  createdAt: Date;
  lastTriggered?: Date;
}

export interface EnhancedAlert {
  id: string;
  assetId: string;
  assetName: string;
  ruleId: string;
  ruleName: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  timestamp: Date;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
  resolved: boolean;
  resolvedAt?: Date;
  businessImpact: 'low' | 'medium' | 'high' | 'critical';
  safetyRisk: boolean;
  tags: string[];
  duplicateCount: number;
  relatedAlerts: string[];
  estimatedDowntime?: number; // hours
  estimatedCost?: number;
  autoRecovery: boolean;
}

export interface AlertStats {
  total: number;
  acknowledged: number;
  unacknowledged: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  avgResponseTime: number; // minutes
  avgResolutionTime: number; // minutes
}

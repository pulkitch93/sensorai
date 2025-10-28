export interface ComponentHealth {
  id: string;
  name: string;
  type: string;
  healthScore: number;
  confidence: number;
  status: 'healthy' | 'warning' | 'critical';
  lastInspection: Date;
  nextInspection: Date;
  sensors: string[];
}

export interface BOMItem {
  id: string;
  partNumber: string;
  description: string;
  quantity: number;
  supplier: string;
  leadTime: number;
  cost: number;
  inStock: boolean;
}

export interface WorkOrder {
  id: string;
  type: 'preventive' | 'corrective' | 'predictive';
  status: 'open' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  assignee: string;
  createdAt: Date;
  completedAt?: Date;
  estimatedHours: number;
  actualHours?: number;
  parts: string[];
  cost: number;
  notes: string;
}

export interface OperatorNote {
  id: string;
  author: string;
  timestamp: Date;
  content: string;
  category: 'observation' | 'issue' | 'fix' | 'general';
}

export interface FailurePattern {
  id: string;
  name: string;
  matchConfidence: number;
  symptoms: string[];
  rootCauses: string[];
  historicalOccurrences: number;
  lastOccurrence?: Date;
}

export interface RULForecast {
  daysRemaining: number;
  confidence: number;
  confidenceBands: {
    lower: number;
    upper: number;
  };
  failureProbability: {
    day: number;
    probability: number;
  }[];
}

export interface PrescriptiveInsight {
  id: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  rootCause: string;
  confidence: number;
  recommendedActions: {
    action: string;
    impact: string;
    effort: string;
    requiredParts: string[];
    estimatedDowntime: string;
    safetyNotes: string[];
  }[];
  estimatedSavings: number;
  riskIfIgnored: string;
}

export interface RiskFeature {
  feature: string;
  importance: number;
  currentValue: number;
  normalRange: string;
  contribution: 'positive' | 'negative';
}

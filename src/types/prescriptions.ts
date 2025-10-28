export type PrescriptionStatus = 'draft' | 'approved' | 'active' | 'archived';
export type PrescriptionSource = 'expert' | 'ai-generated' | 'hybrid';
export type WorkflowStatus = 'pending' | 'in-progress' | 'completed' | 'failed';
export type CMMSSystem = 'SAP PM' | 'IBM Maximo' | 'ServiceNow' | 'MaintainX' | 'UpKeep' | 'Fiix';

export interface PrescriptionStep {
  id: string;
  order: number;
  description: string;
  expectedTime: number; // minutes
  tools: string[];
  safety: string[];
  parts: string[];
  completed?: boolean;
  notes?: string;
}

export interface Prescription {
  id: string;
  title: string;
  description: string;
  status: PrescriptionStatus;
  source: PrescriptionSource;
  assetType: string;
  category: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  steps: PrescriptionStep[];
  requiresApproval: boolean;
  approvedBy?: string;
  approvedAt?: Date;
  effectivenessRating?: number;
  usageCount: number;
  successRate: number;
  estimatedDuration: number; // minutes
  cmmsLinked?: CMMSSystem[];
}

export interface WorkflowExecution {
  id: string;
  prescriptionId: string;
  prescriptionTitle: string;
  assetId: string;
  assetName: string;
  status: WorkflowStatus;
  startedAt: Date;
  completedAt?: Date;
  executedBy: string;
  currentStep: number;
  totalSteps: number;
  feedbackRating?: number;
  feedbackNotes?: string;
  syncedToCMMS?: boolean;
  cmmsWorkOrderId?: string;
}

export interface PrescriptionFeedback {
  id: string;
  prescriptionId: string;
  workflowId: string;
  technicianId: string;
  technicianName: string;
  rating: number; // 1-5
  effectiveness: number; // 1-5
  clarity: number; // 1-5
  notes: string;
  suggestedImprovements: string;
  createdAt: Date;
}

export interface CMMSAdapter {
  system: CMMSSystem;
  connected: boolean;
  lastSync?: Date;
  workOrdersSynced: number;
  status: 'active' | 'error' | 'disconnected';
}

export interface PrescriptionMetrics {
  totalPrescriptions: number;
  activeWorkflows: number;
  completedWorkflows: number;
  averageEffectivenessRating: number;
  adoptionRate: number;
  successRate: number;
  averageCompletionTime: number;
  cmmsIntegrations: number;
}

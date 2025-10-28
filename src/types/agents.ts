export type AgentType = 
  | 'diagnostics'
  | 'work-order-copilot'
  | 'benchmarking-analyst'
  | 'roi-advisor'
  | 'sensor-setup'
  | 'alert-triage'
  | 'reliability-copilot'
  | 'executive-briefing';

export type AgentStatus = 'idle' | 'running' | 'completed' | 'failed' | 'awaiting-approval';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface AgentTool {
  name: string;
  description: string;
  parameters: Record<string, any>;
  enabled: boolean;
}

export interface AgentGuardrail {
  id: string;
  type: 'threshold' | 'approval-required' | 'data-validation' | 'rate-limit';
  description: string;
  config: Record<string, any>;
  enabled: boolean;
}

export interface AgentConfig {
  id: string;
  type: AgentType;
  name: string;
  description: string;
  systemPrompt: string;
  tools: AgentTool[];
  guardrails: AgentGuardrail[];
  requiresHumanApproval: boolean;
  autoTrigger: boolean;
  triggerSchedule?: string;
  enabled: boolean;
}

export interface AgentExecution {
  id: string;
  agentId: string;
  agentType: AgentType;
  agentName: string;
  status: AgentStatus;
  startedAt: Date;
  completedAt?: Date;
  triggeredBy: 'manual' | 'schedule' | 'event';
  inputs: Record<string, any>;
  outputs?: Record<string, any>;
  reasoning?: string;
  toolCalls: ToolCall[];
  guardrailChecks: GuardrailCheck[];
  requiresApproval: boolean;
  approvalStatus?: ApprovalStatus;
  approvedBy?: string;
  approvedAt?: Date;
  error?: string;
  auditLogId: string;
}

export interface ToolCall {
  id: string;
  toolName: string;
  timestamp: Date;
  parameters: Record<string, any>;
  result: any;
  success: boolean;
  error?: string;
}

export interface GuardrailCheck {
  id: string;
  guardrailId: string;
  timestamp: Date;
  passed: boolean;
  message: string;
  details?: Record<string, any>;
}

export interface AgentMetrics {
  totalExecutions: number;
  successRate: number;
  averageExecutionTime: number;
  activeAgents: number;
  pendingApprovals: number;
  automationsRunToday: number;
}

export interface HumanApprovalRequest {
  id: string;
  executionId: string;
  agentName: string;
  agentType: AgentType;
  requestedAt: Date;
  status: ApprovalStatus;
  inputs: Record<string, any>;
  proposedOutputs: Record<string, any>;
  reasoning: string;
  impact: string;
  reviewedBy?: string;
  reviewedAt?: Date;
  reviewNotes?: string;
}

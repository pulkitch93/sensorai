export type MessageRole = 'user' | 'assistant' | 'system';
export type EscalationStatus = 'pending' | 'assigned' | 'in-progress' | 'resolved';
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  citations?: Citation[];
  troubleshootingSteps?: TroubleshootingStep[];
}

export interface Citation {
  type: 'kb-article' | 'asset-history' | 'diagnostic-chart' | 'playbook';
  title: string;
  url?: string;
  excerpt?: string;
  assetId?: string;
}

export interface TroubleshootingStep {
  id: string;
  order: number;
  description: string;
  completed: boolean;
  expectedOutcome: string;
  references: string[];
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  category: string;
  content: string;
  tags: string[];
  lastUpdated: Date;
  views: number;
  helpfulCount: number;
  relatedArticles: string[];
}

export interface SMETicket {
  id: string;
  status: EscalationStatus;
  priority: TicketPriority;
  subject: string;
  description: string;
  chatTranscript: ChatMessage[];
  createdAt: Date;
  assignedTo?: string;
  slaDeadline: Date;
  resolvedAt?: Date;
  resolution?: string;
}

export interface SupportMetrics {
  avgResponseTime: number; // minutes
  resolutionRate: number; // percentage
  activeSMETickets: number;
  kbArticles: number;
  chatSessionsToday: number;
}

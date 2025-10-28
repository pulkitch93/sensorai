import { KnowledgeArticle, SMETicket, SupportMetrics, Citation, TroubleshootingStep } from '@/types/support';

export const knowledgeArticles: KnowledgeArticle[] = [
  {
    id: 'kb-001',
    title: 'Understanding Vibration Alerts on Rotating Equipment',
    category: 'Diagnostics',
    content: 'High vibration readings often indicate bearing wear, misalignment, or imbalance. To diagnose: 1) Check vibration frequency patterns, 2) Compare against baseline readings, 3) Inspect mounting and alignment, 4) Review lubrication schedules.',
    tags: ['vibration', 'bearings', 'rotating-equipment', 'predictive-maintenance'],
    lastUpdated: new Date('2025-01-15'),
    views: 342,
    helpfulCount: 287,
    relatedArticles: ['kb-002', 'kb-005']
  },
  {
    id: 'kb-002',
    title: 'Bearing Failure Patterns and Early Detection',
    category: 'Failure Analysis',
    content: 'Bearing failures typically progress through four stages: 1) Microscopic wear (detected by ultrasound), 2) Detectable vibration increase, 3) Audible noise, 4) Catastrophic failure. Early detection can prevent 85% of unplanned downtime.',
    tags: ['bearings', 'failure-patterns', 'early-warning', 'condition-monitoring'],
    lastUpdated: new Date('2025-01-20'),
    views: 428,
    helpfulCount: 395,
    relatedArticles: ['kb-001', 'kb-003']
  },
  {
    id: 'kb-003',
    title: 'Temperature Monitoring Best Practices',
    category: 'Sensor Configuration',
    content: 'Optimal temperature sensor placement: 1) Mount as close to heat source as possible, 2) Avoid direct sunlight or reflective surfaces, 3) Set sampling rates based on thermal mass (faster for small components), 4) Establish baseline during normal operations.',
    tags: ['temperature', 'sensors', 'best-practices', 'configuration'],
    lastUpdated: new Date('2025-01-18'),
    views: 256,
    helpfulCount: 221,
    relatedArticles: ['kb-001', 'kb-007']
  },
  {
    id: 'kb-004',
    title: 'Interpreting RUL (Remaining Useful Life) Predictions',
    category: 'Analytics',
    content: 'RUL confidence bands indicate prediction uncertainty. Narrow bands (high confidence) suggest stable degradation patterns. Wide bands indicate: 1) Insufficient historical data, 2) Irregular operating conditions, 3) Multiple failure modes active. Always consider confidence when planning maintenance.',
    tags: ['rul', 'predictive-analytics', 'maintenance-planning', 'confidence-intervals'],
    lastUpdated: new Date('2025-01-22'),
    views: 512,
    helpfulCount: 467,
    relatedArticles: ['kb-006', 'kb-008']
  },
  {
    id: 'kb-005',
    title: 'Calibrating Vibration Sensors in the Field',
    category: 'Sensor Configuration',
    content: 'Field calibration steps: 1) Verify mounting torque (5-10 lb-ft for most accelerometers), 2) Perform bump test to check resonance, 3) Compare readings with reference sensor, 4) Document baseline at known operating condition, 5) Set alarm thresholds at 2x normal and 3x normal.',
    tags: ['vibration', 'calibration', 'sensors', 'field-service'],
    lastUpdated: new Date('2025-01-10'),
    views: 189,
    helpfulCount: 156,
    relatedArticles: ['kb-001', 'kb-003']
  },
  {
    id: 'kb-006',
    title: 'Creating Effective Maintenance Prescriptions',
    category: 'Prescriptions',
    content: 'Effective prescriptions include: 1) Clear root cause identification, 2) Step-by-step procedures with safety notes, 3) Required tools and parts list, 4) Estimated downtime and effort, 5) Verification steps to confirm fix. Track success rates and refine based on feedback.',
    tags: ['prescriptions', 'maintenance', 'procedures', 'best-practices'],
    lastUpdated: new Date('2025-01-25'),
    views: 294,
    helpfulCount: 271,
    relatedArticles: ['kb-002', 'kb-004']
  },
  {
    id: 'kb-007',
    title: 'Gateway Connectivity Troubleshooting',
    category: 'Infrastructure',
    content: 'Common gateway issues: 1) Check network connectivity and firewall rules, 2) Verify MQTT broker connection and credentials, 3) Confirm sensor registration in gateway config, 4) Check buffer levels (>80% indicates transmission issues), 5) Review gateway logs for error messages.',
    tags: ['gateways', 'connectivity', 'troubleshooting', 'infrastructure'],
    lastUpdated: new Date('2025-01-12'),
    views: 167,
    helpfulCount: 143,
    relatedArticles: ['kb-003', 'kb-005']
  },
  {
    id: 'kb-008',
    title: 'Portfolio-Level Risk Assessment',
    category: 'Analytics',
    content: 'Portfolio risk calculation: 1) Aggregate failure probabilities across assets, 2) Weight by business impact and replacement cost, 3) Consider interdependencies (critical path assets), 4) Factor in maintenance backlog and resource constraints. Update risk scores weekly.',
    tags: ['portfolio', 'risk-assessment', 'analytics', 'business-impact'],
    lastUpdated: new Date('2025-01-28'),
    views: 381,
    helpfulCount: 349,
    relatedArticles: ['kb-004', 'kb-006']
  }
];

export const smeTickets: SMETicket[] = [
  {
    id: 'ticket-001',
    status: 'in-progress',
    priority: 'high',
    subject: 'Unusual vibration pattern on Pump-3B',
    description: 'AI assistant suggested bearing replacement, but historical data shows recent bearing change. Need expert analysis of vibration spectrum.',
    chatTranscript: [],
    createdAt: new Date('2025-01-28T09:15:00'),
    assignedTo: 'Dr. Sarah Chen',
    slaDeadline: new Date('2025-01-28T17:15:00'),
  },
  {
    id: 'ticket-002',
    status: 'pending',
    priority: 'medium',
    subject: 'Gateway buffering excessive data',
    description: 'Gateway-A shows 85% buffer usage despite good network connectivity. Need guidance on tuning transmission parameters.',
    chatTranscript: [],
    createdAt: new Date('2025-01-28T11:30:00'),
    assignedTo: undefined,
    slaDeadline: new Date('2025-01-29T11:30:00'),
  },
  {
    id: 'ticket-003',
    status: 'resolved',
    priority: 'critical',
    subject: 'False positives on temperature alerts',
    description: 'Multiple temperature sensors showing spikes that don\'t correlate with actual equipment temperature.',
    chatTranscript: [],
    createdAt: new Date('2025-01-27T14:20:00'),
    assignedTo: 'James Rodriguez',
    slaDeadline: new Date('2025-01-27T18:20:00'),
    resolvedAt: new Date('2025-01-27T16:45:00'),
    resolution: 'Sensor calibration drift identified. Recalibrated all affected sensors and updated baseline thresholds. Implemented weekly calibration checks.'
  }
];

export const supportMetrics: SupportMetrics = {
  avgResponseTime: 2.3,
  resolutionRate: 89.4,
  activeSMETickets: 2,
  kbArticles: 247,
  chatSessionsToday: 43
};

// AI response templates based on keywords
export const aiResponseTemplates: Record<string, { content: string; citations: Citation[]; troubleshootingSteps: TroubleshootingStep[] }> = {
  vibration: {
    content: "I've analyzed the vibration patterns and compared them against your asset history. Based on the diagnostics, I'm seeing elevated vibration levels that suggest bearing wear.",
    citations: [
      {
        type: 'kb-article' as const,
        title: 'Understanding Vibration Alerts on Rotating Equipment',
        url: '/kb/kb-001',
        excerpt: 'High vibration readings often indicate bearing wear, misalignment, or imbalance...'
      },
      {
        type: 'asset-history' as const,
        title: 'Asset-1 Maintenance History',
        assetId: 'asset-1',
        excerpt: 'Last bearing replacement: 180 days ago. Current vibration: 2.3x baseline.'
      },
      {
        type: 'diagnostic-chart' as const,
        title: 'Vibration Trend Analysis',
        excerpt: 'Showing 40% increase over past 30 days with frequency peaks at bearing fault frequencies.'
      }
    ],
    troubleshootingSteps: [
      {
        id: 'step-1',
        order: 1,
        description: 'Verify vibration sensor mounting and calibration',
        completed: false,
        expectedOutcome: 'Sensor should be firmly mounted with proper torque',
        references: ['kb-005']
      },
      {
        id: 'step-2',
        order: 2,
        description: 'Check bearing lubrication levels and quality',
        completed: false,
        expectedOutcome: 'Oil level within normal range, no contamination visible',
        references: ['kb-002']
      },
      {
        id: 'step-3',
        order: 3,
        description: 'Inspect alignment and check for loose mounting bolts',
        completed: false,
        expectedOutcome: 'All bolts torqued to spec, alignment within tolerance',
        references: ['kb-001']
      }
    ]
  },
  temperature: {
    content: "I've reviewed the temperature trends and sensor data. The elevated readings correlate with increased load conditions, which is within normal operating parameters.",
    citations: [
      {
        type: 'kb-article' as const,
        title: 'Temperature Monitoring Best Practices',
        url: '/kb/kb-003',
        excerpt: 'Optimal temperature sensor placement and baseline establishment during normal operations...'
      },
      {
        type: 'diagnostic-chart' as const,
        title: 'Temperature vs Load Correlation',
        excerpt: 'Temperature increases proportionally with load, consistent with thermal model.'
      }
    ],
    troubleshootingSteps: [
      {
        id: 'step-1',
        order: 1,
        description: 'Verify temperature sensor calibration',
        completed: false,
        expectedOutcome: 'Reading should match reference thermometer within ±2°C',
        references: ['kb-003']
      },
      {
        id: 'step-2',
        order: 2,
        description: 'Check cooling system operation',
        completed: false,
        expectedOutcome: 'Fans running at correct speed, air flow unobstructed',
        references: []
      }
    ]
  },
  rul: {
    content: "The Remaining Useful Life prediction shows 45 days with 75% confidence. This is based on current degradation patterns and historical failure data for similar assets.",
    citations: [
      {
        type: 'kb-article' as const,
        title: 'Interpreting RUL Predictions',
        url: '/kb/kb-004',
        excerpt: 'RUL confidence bands indicate prediction uncertainty. Consider confidence when planning maintenance...'
      },
      {
        type: 'asset-history' as const,
        title: 'Similar Failure Patterns',
        excerpt: 'Found 12 similar degradation patterns in fleet history with average failure at 52 days.'
      }
    ],
    troubleshootingSteps: []
  },
  gateway: {
    content: "I see the gateway is experiencing connectivity issues. The buffer is at 78% capacity, suggesting intermittent network problems.",
    citations: [
      {
        type: 'kb-article' as const,
        title: 'Gateway Connectivity Troubleshooting',
        url: '/kb/kb-007',
        excerpt: 'Common gateway issues and resolution steps for network connectivity...'
      }
    ],
    troubleshootingSteps: [
      {
        id: 'step-1',
        order: 1,
        description: 'Check network connectivity and ping gateway IP',
        completed: false,
        expectedOutcome: 'Ping response time <50ms with 0% packet loss',
        references: ['kb-007']
      },
      {
        id: 'step-2',
        order: 2,
        description: 'Verify MQTT broker connection',
        completed: false,
        expectedOutcome: 'Gateway shows connected status in broker logs',
        references: ['kb-007']
      },
      {
        id: 'step-3',
        order: 3,
        description: 'Clear gateway buffer and monitor',
        completed: false,
        expectedOutcome: 'Buffer usage drops below 50% and remains stable',
        references: ['kb-007']
      }
    ]
  },
  default: {
    content: "I can help you with that. Let me search the knowledge base and asset history for relevant information.",
    citations: [
      {
        type: 'kb-article' as const,
        title: 'Getting Started with Predictive Maintenance',
        url: '/kb/general',
        excerpt: 'Overview of the platform capabilities and best practices...'
      }
    ],
    troubleshootingSteps: []
  }
};

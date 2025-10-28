import { AgentConfig, AgentExecution, AgentMetrics, HumanApprovalRequest } from '@/types/agents';

export const agentConfigs: AgentConfig[] = [
  {
    id: 'agent-diag',
    type: 'diagnostics',
    name: 'Diagnostics Agent',
    description: 'Analyzes telemetry data and generates root cause hypotheses',
    systemPrompt: `You are an expert diagnostics agent for predictive maintenance. Analyze recent telemetry data, run spectral and statistical tests, and generate concise root cause hypotheses with risk ratings.

Your analysis should include:
1. Anomaly detection across multiple sensor streams
2. Frequency domain analysis for rotating equipment
3. Statistical trend analysis
4. Root cause hypothesis with confidence score
5. Risk rating (low, medium, high, critical)

Always provide clear, actionable insights backed by data.`,
    tools: [
      {
        name: 'get_telemetry',
        description: 'Retrieve recent telemetry data for specified asset and time range',
        parameters: { assetId: 'string', timeRange: 'string', metrics: 'array' },
        enabled: true
      },
      {
        name: 'run_spectral_analysis',
        description: 'Perform FFT and spectral analysis on vibration data',
        parameters: { data: 'array', sampleRate: 'number' },
        enabled: true
      },
      {
        name: 'calculate_statistics',
        description: 'Compute statistical metrics and trends',
        parameters: { data: 'array', metrics: 'array' },
        enabled: true
      }
    ],
    guardrails: [
      {
        id: 'gr-1',
        type: 'threshold',
        description: 'Require approval for critical risk ratings',
        config: { riskLevel: 'critical' },
        enabled: true
      }
    ],
    requiresHumanApproval: false,
    autoTrigger: true,
    triggerSchedule: '*/15 * * * *',
    enabled: true
  },
  {
    id: 'agent-wo',
    type: 'work-order-copilot',
    name: 'Work Order Copilot',
    description: 'Converts prescriptions into CMMS work orders',
    systemPrompt: `You are a work order copilot that converts maintenance prescriptions into structured CMMS work orders. 

For each prescription:
1. Extract key information (asset, procedures, parts, estimated time)
2. Check parts availability in inventory
3. Propose optimal scheduling slots based on asset criticality and resource availability
4. Generate a summary for team communication (Slack/Teams)
5. Create properly formatted CMMS work order

Always verify parts availability before scheduling.`,
    tools: [
      {
        name: 'check_parts_inventory',
        description: 'Verify availability of required parts',
        parameters: { partNumbers: 'array' },
        enabled: true
      },
      {
        name: 'get_schedule_availability',
        description: 'Find available scheduling slots',
        parameters: { assetId: 'string', estimatedHours: 'number', priority: 'string' },
        enabled: true
      },
      {
        name: 'create_cmms_work_order',
        description: 'Create work order in CMMS system',
        parameters: { workOrderData: 'object' },
        enabled: true
      },
      {
        name: 'send_team_notification',
        description: 'Send notification to Slack or Teams',
        parameters: { channel: 'string', message: 'string' },
        enabled: true
      }
    ],
    guardrails: [
      {
        id: 'gr-2',
        type: 'approval-required',
        description: 'Require approval for work orders exceeding 8 hours downtime',
        config: { downtimeThreshold: 8 },
        enabled: true
      }
    ],
    requiresHumanApproval: true,
    autoTrigger: false,
    enabled: true
  },
  {
    id: 'agent-bench',
    type: 'benchmarking-analyst',
    name: 'Benchmarking Analyst',
    description: 'Compares asset KPIs to industry standards',
    systemPrompt: `You are a benchmarking analyst that compares asset performance to peer cohorts and industry standards.

Your analysis should include:
1. KPI comparison across similar assets in fleet
2. Industry standard benchmarking
3. Performance gap analysis
4. Ranked list of improvement opportunities
5. Estimated ROI for each improvement

Focus on actionable insights that drive performance improvements.`,
    tools: [
      {
        name: 'get_asset_kpis',
        description: 'Retrieve KPIs for specified assets',
        parameters: { assetIds: 'array', metrics: 'array', timeRange: 'string' },
        enabled: true
      },
      {
        name: 'get_industry_benchmarks',
        description: 'Get industry standard benchmarks for asset class',
        parameters: { assetClass: 'string', metrics: 'array' },
        enabled: true
      },
      {
        name: 'calculate_performance_gaps',
        description: 'Analyze performance gaps and rank opportunities',
        parameters: { currentKpis: 'object', benchmarks: 'object' },
        enabled: true
      }
    ],
    guardrails: [],
    requiresHumanApproval: false,
    autoTrigger: true,
    triggerSchedule: '0 0 1 * *',
    enabled: true
  },
  {
    id: 'agent-roi',
    type: 'roi-advisor',
    name: 'ROI Advisor',
    description: 'Calculates maintenance ROI and recommends high-value actions',
    systemPrompt: `You are an ROI advisor that calculates avoided downtime, energy savings, and maintenance cost deltas.

For each analysis:
1. Calculate avoided downtime costs
2. Estimate energy savings from optimizations
3. Compute maintenance cost reductions
4. Factor in implementation costs
5. Rank top 3 high-ROI actions
6. Provide clear ROI calculations with assumptions

Always show your math and assumptions clearly.`,
    tools: [
      {
        name: 'calculate_downtime_cost',
        description: 'Calculate cost of avoided downtime',
        parameters: { assetId: 'string', hoursAvoided: 'number' },
        enabled: true
      },
      {
        name: 'estimate_energy_savings',
        description: 'Estimate energy cost savings',
        parameters: { optimizations: 'array', energyRate: 'number' },
        enabled: true
      },
      {
        name: 'get_maintenance_costs',
        description: 'Get historical maintenance costs',
        parameters: { assetId: 'string', timeRange: 'string' },
        enabled: true
      }
    ],
    guardrails: [],
    requiresHumanApproval: false,
    autoTrigger: true,
    triggerSchedule: '0 9 * * 1',
    enabled: true
  },
  {
    id: 'agent-sensor',
    type: 'sensor-setup',
    name: 'Sensor Setup Assistant',
    description: 'Guides sensor installation and calibration',
    systemPrompt: `You are a sensor setup assistant that guides technicians through sensor installation and calibration.

Your guidance should include:
1. Step-by-step installation instructions
2. Signal quality verification checks
3. Auto-calibration procedures
4. Default sampling rate recommendations
5. Downsampling rules based on asset criticality
6. Troubleshooting common issues

Adapt your guidance based on sensor type and asset class.`,
    tools: [
      {
        name: 'verify_signal_quality',
        description: 'Check sensor signal quality metrics',
        parameters: { sensorId: 'string', readings: 'array' },
        enabled: true
      },
      {
        name: 'auto_calibrate',
        description: 'Run auto-calibration routine',
        parameters: { sensorId: 'string', referenceValue: 'number' },
        enabled: true
      },
      {
        name: 'set_sampling_config',
        description: 'Configure sampling and downsampling rules',
        parameters: { sensorId: 'string', sampleRate: 'number', downsampleRatio: 'number' },
        enabled: true
      }
    ],
    guardrails: [
      {
        id: 'gr-3',
        type: 'data-validation',
        description: 'Validate signal quality before completing setup',
        config: { minSignalQuality: 85 },
        enabled: true
      }
    ],
    requiresHumanApproval: false,
    autoTrigger: false,
    enabled: true
  },
  {
    id: 'agent-triage',
    type: 'alert-triage',
    name: 'Alert Triage Agent',
    description: 'Deduplicates and prioritizes alerts',
    systemPrompt: `You are an alert triage agent that deduplicates, suppresses flapping alerts, groups related incidents, and assigns ownership.

Your triage process should:
1. Identify duplicate alerts across time windows
2. Detect and suppress flapping (rapid on/off) alerts
3. Group related alerts by root cause
4. Assign to appropriate team member based on skills and shift
5. Set priority based on asset criticality and business impact

Reduce alert fatigue while ensuring critical issues get immediate attention.`,
    tools: [
      {
        name: 'get_recent_alerts',
        description: 'Retrieve recent alerts for pattern analysis',
        parameters: { timeRange: 'string', includeResolved: 'boolean' },
        enabled: true
      },
      {
        name: 'find_similar_alerts',
        description: 'Find similar or duplicate alerts',
        parameters: { alertId: 'string', similarityThreshold: 'number' },
        enabled: true
      },
      {
        name: 'get_team_availability',
        description: 'Check team member availability and skills',
        parameters: { requiredSkills: 'array', shift: 'string' },
        enabled: true
      },
      {
        name: 'assign_alert',
        description: 'Assign alert to team member',
        parameters: { alertId: 'string', assigneeId: 'string' },
        enabled: true
      }
    ],
    guardrails: [
      {
        id: 'gr-4',
        type: 'rate-limit',
        description: 'Prevent alert suppression overload',
        config: { maxSuppressionsPerHour: 50 },
        enabled: true
      }
    ],
    requiresHumanApproval: false,
    autoTrigger: true,
    triggerSchedule: '*/5 * * * *',
    enabled: true
  },
  {
    id: 'agent-reliability',
    type: 'reliability-copilot',
    name: 'Reliability Engineer Copilot',
    description: 'Generates what-if scenarios and threshold recommendations',
    systemPrompt: `You are a reliability engineer copilot that generates what-if scenarios and recommends threshold changes.

For each analysis:
1. Current threshold performance (false positives/negatives)
2. What-if scenarios for threshold adjustments
3. Expected impact on alert accuracy
4. Trade-offs between sensitivity and noise
5. Recommended threshold changes with justification

Always quantify expected impacts with confidence intervals.`,
    tools: [
      {
        name: 'get_threshold_performance',
        description: 'Analyze current threshold performance metrics',
        parameters: { assetId: 'string', metric: 'string', timeRange: 'string' },
        enabled: true
      },
      {
        name: 'simulate_threshold_change',
        description: 'Simulate impact of threshold change on historical data',
        parameters: { currentThreshold: 'number', proposedThreshold: 'number', historicalData: 'array' },
        enabled: true
      },
      {
        name: 'calculate_alert_accuracy',
        description: 'Calculate false positive and false negative rates',
        parameters: { alerts: 'array', actualFailures: 'array' },
        enabled: true
      }
    ],
    guardrails: [
      {
        id: 'gr-5',
        type: 'approval-required',
        description: 'Require approval for threshold changes affecting critical assets',
        config: { criticalityLevel: 'high' },
        enabled: true
      }
    ],
    requiresHumanApproval: true,
    autoTrigger: false,
    enabled: true
  },
  {
    id: 'agent-exec',
    type: 'executive-briefing',
    name: 'Executive Briefing Agent',
    description: 'Creates quarterly executive narratives',
    systemPrompt: `You are an executive briefing agent that creates comprehensive quarterly reports on reliability, cost, and sustainability.

Your briefings should include:
1. Executive summary (1-2 paragraphs)
2. Key metrics with quarter-over-quarter trends
3. Major achievements and challenges
4. Cost savings and ROI
5. Sustainability impact (energy, emissions)
6. Strategic recommendations for next quarter
7. Data visualizations and charts

Write in clear, business-focused language suitable for C-level executives.`,
    tools: [
      {
        name: 'get_quarterly_metrics',
        description: 'Retrieve all KPIs for quarter',
        parameters: { quarter: 'string', year: 'number' },
        enabled: true
      },
      {
        name: 'calculate_yoy_trends',
        description: 'Calculate year-over-year trends',
        parameters: { currentQuarter: 'object', previousYear: 'object' },
        enabled: true
      },
      {
        name: 'generate_visualizations',
        description: 'Create charts and graphs for report',
        parameters: { data: 'object', chartTypes: 'array' },
        enabled: true
      },
      {
        name: 'calculate_sustainability_metrics',
        description: 'Calculate energy and emissions metrics',
        parameters: { timeRange: 'string' },
        enabled: true
      }
    ],
    guardrails: [],
    requiresHumanApproval: true,
    autoTrigger: true,
    triggerSchedule: '0 9 1 1,4,7,10 *',
    enabled: true
  }
];

export const agentExecutions: AgentExecution[] = [
  {
    id: 'exec-1',
    agentId: 'agent-diag',
    agentType: 'diagnostics',
    agentName: 'Diagnostics Agent',
    status: 'completed',
    startedAt: new Date('2025-01-28T09:15:00'),
    completedAt: new Date('2025-01-28T09:16:23'),
    triggeredBy: 'schedule',
    inputs: {
      assetId: 'asset-1',
      timeRange: '24h',
      metrics: ['vibration', 'temperature', 'pressure']
    },
    outputs: {
      rootCause: 'Bearing degradation detected in motor assembly',
      confidence: 0.87,
      riskRating: 'high',
      recommendation: 'Schedule bearing replacement within 7 days',
      supportingData: {
        vibrationIncrease: '42%',
        frequencyPeaks: [1800, 3600],
        temperatureAnomaly: true
      }
    },
    reasoning: 'Analysis of vibration FFT shows distinct bearing fault frequencies at 1x and 2x rotation speed. Temperature trending upward 15% over past week. Statistical confidence 87% based on similar failure patterns in historical data.',
    toolCalls: [
      {
        id: 'tc-1',
        toolName: 'get_telemetry',
        timestamp: new Date('2025-01-28T09:15:12'),
        parameters: { assetId: 'asset-1', timeRange: '24h' },
        result: { dataPoints: 1440, metrics: ['vibration', 'temperature'] },
        success: true
      },
      {
        id: 'tc-2',
        toolName: 'run_spectral_analysis',
        timestamp: new Date('2025-01-28T09:15:45'),
        parameters: { data: 'array', sampleRate: 1000 },
        result: { peakFrequencies: [1800, 3600], confidence: 0.92 },
        success: true
      }
    ],
    guardrailChecks: [],
    requiresApproval: false,
    auditLogId: 'audit-diag-1'
  },
  {
    id: 'exec-2',
    agentId: 'agent-wo',
    agentType: 'work-order-copilot',
    agentName: 'Work Order Copilot',
    status: 'awaiting-approval',
    startedAt: new Date('2025-01-28T10:30:00'),
    triggeredBy: 'manual',
    inputs: {
      prescriptionId: 'pre-045',
      assetId: 'asset-3',
      priority: 'high'
    },
    outputs: {
      workOrderNumber: 'WO-2025-0234',
      scheduledSlots: [
        { start: '2025-02-01T08:00:00', end: '2025-02-01T12:00:00', tech: 'David Park' },
        { start: '2025-02-02T08:00:00', end: '2025-02-02T12:00:00', tech: 'Lisa Wang' }
      ],
      partsRequired: ['BRG-2301', 'SEAL-445', 'GREASE-120'],
      partsAvailable: true,
      estimatedDowntime: '4 hours',
      slackMessage: '🔧 Work Order WO-2025-0234 created for Asset-3 bearing replacement. Scheduled for Feb 1-2. All parts in stock.'
    },
    reasoning: 'All required parts (BRG-2301, SEAL-445, GREASE-120) are in stock. Optimal scheduling slots found with minimal production impact. Asset criticality: high, downtime window: 4hrs. Team notification prepared for Slack #maintenance channel.',
    toolCalls: [
      {
        id: 'tc-3',
        toolName: 'check_parts_inventory',
        timestamp: new Date('2025-01-28T10:30:15'),
        parameters: { partNumbers: ['BRG-2301', 'SEAL-445', 'GREASE-120'] },
        result: { allAvailable: true, quantities: [3, 5, 8] },
        success: true
      },
      {
        id: 'tc-4',
        toolName: 'get_schedule_availability',
        timestamp: new Date('2025-01-28T10:30:45'),
        parameters: { assetId: 'asset-3', estimatedHours: 4 },
        result: { availableSlots: 3 },
        success: true
      }
    ],
    guardrailChecks: [
      {
        id: 'gc-1',
        guardrailId: 'gr-2',
        timestamp: new Date('2025-01-28T10:31:00'),
        passed: false,
        message: 'Work order requires approval - downtime under threshold but asset is critical',
        details: { estimatedDowntime: 4, threshold: 8, assetCriticality: 'high' }
      }
    ],
    requiresApproval: true,
    approvalStatus: 'pending',
    auditLogId: 'audit-wo-1'
  },
  {
    id: 'exec-3',
    agentId: 'agent-triage',
    agentType: 'alert-triage',
    agentName: 'Alert Triage Agent',
    status: 'completed',
    startedAt: new Date('2025-01-28T11:00:00'),
    completedAt: new Date('2025-01-28T11:00:45'),
    triggeredBy: 'schedule',
    inputs: {
      newAlerts: 15,
      timeWindow: '5m'
    },
    outputs: {
      alertsProcessed: 15,
      duplicatesRemoved: 4,
      flappingSuppressed: 2,
      groupsCreated: 3,
      assignmentsMade: 9,
      summary: 'Processed 15 alerts: removed 4 duplicates, suppressed 2 flapping alerts, created 3 incident groups, assigned 9 alerts to team'
    },
    reasoning: 'Identified 4 duplicate temperature alerts for Asset-2. Detected flapping vibration sensor on Asset-7 (5 on/off cycles in 10min). Grouped 3 related compressor alerts into single incident. Assigned based on shift calendar and technician specializations.',
    toolCalls: [
      {
        id: 'tc-5',
        toolName: 'get_recent_alerts',
        timestamp: new Date('2025-01-28T11:00:05'),
        parameters: { timeRange: '5m' },
        result: { alertCount: 15 },
        success: true
      },
      {
        id: 'tc-6',
        toolName: 'find_similar_alerts',
        timestamp: new Date('2025-01-28T11:00:20'),
        parameters: { similarityThreshold: 0.85 },
        result: { duplicatePairs: 4 },
        success: true
      }
    ],
    guardrailChecks: [
      {
        id: 'gc-2',
        guardrailId: 'gr-4',
        timestamp: new Date('2025-01-28T11:00:40'),
        passed: true,
        message: 'Rate limit check passed: 6 suppressions in last hour (limit: 50)',
        details: { currentCount: 6, limit: 50 }
      }
    ],
    requiresApproval: false,
    auditLogId: 'audit-triage-1'
  }
];

export const humanApprovalRequests: HumanApprovalRequest[] = [
  {
    id: 'approval-1',
    executionId: 'exec-2',
    agentName: 'Work Order Copilot',
    agentType: 'work-order-copilot',
    requestedAt: new Date('2025-01-28T10:31:00'),
    status: 'pending',
    inputs: {
      prescriptionId: 'pre-045',
      assetId: 'asset-3'
    },
    proposedOutputs: {
      workOrderNumber: 'WO-2025-0234',
      scheduledDate: '2025-02-01',
      estimatedDowntime: '4 hours'
    },
    reasoning: 'All parts available, optimal scheduling window identified, minimal production impact expected.',
    impact: 'High-criticality asset will be offline for 4 hours. Estimated cost savings: $12,000 in avoided downtime.'
  }
];

export const agentMetrics: AgentMetrics = {
  totalExecutions: 1247,
  successRate: 94.3,
  averageExecutionTime: 45,
  activeAgents: 8,
  pendingApprovals: 1,
  automationsRunToday: 89
};

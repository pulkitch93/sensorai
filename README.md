# Asset Intelligence (AI) Platform

A comprehensive AI-powered industrial asset management and predictive maintenance platform built with React, TypeScript, and modern web technologies.

**URL**: https://lovable.dev/projects/45069a01-d8c5-4ded-b576-0cc208be62e3

## Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Modules & Features](#modules--features)
  - [Home / Marketing Page](#home--marketing-page)
  - [Plant Operations Dashboard](#plant-operations-dashboard)
  - [Digital Twin](#digital-twin)
  - [Asset Detail](#asset-detail)
  - [Alerts Management](#alerts-management)
  - [Analytics & Diagnostics Lab](#analytics--diagnostics-lab)
  - [Portfolio & Executive Overview](#portfolio--executive-overview)
  - [Prescriptions & Workflows](#prescriptions--workflows)
  - [AI Agents & Automations](#ai-agents--automations)
  - [Sensor Hub & Integrations](#sensor-hub--integrations)
  - [Reports & Analytics](#reports--analytics)
  - [24x7 Expert Support](#24x7-expert-support)
  - [Admin & Governance](#admin--governance)
- [Getting Started](#getting-started)
- [Deployment](#deployment)

---

## Overview

The Asset Intelligence Platform transforms industrial operations with AI-powered predictive maintenance and real-time asset intelligence. It provides comprehensive monitoring, analytics, and automation capabilities for managing industrial assets across multiple sites and facilities.

### Key Value Propositions

- **45% Reduction in Downtime** - Predictive alerts prevent unexpected failures
- **30% Lower Maintenance Costs** - Optimized maintenance scheduling
- **98% Prediction Accuracy** - Advanced ML models for failure prediction

---

## Technology Stack

| Category | Technologies |
|----------|-------------|
| **Frontend Framework** | React 18, TypeScript |
| **Build Tool** | Vite |
| **Styling** | Tailwind CSS, CSS Variables |
| **UI Components** | shadcn/ui, Radix UI Primitives |
| **3D Visualization** | Three.js |
| **Charts** | Recharts |
| **State Management** | React Query (TanStack Query) |
| **Routing** | React Router v6 |
| **Forms** | React Hook Form, Zod |
| **Date Handling** | date-fns |
| **Notifications** | Sonner |

---

## Modules & Features

### Home / Marketing Page

**Route:** `/`

The landing page showcases the platform's capabilities to potential users.

#### Features:
- **Hero Section**: Compelling headline with clear value proposition and CTA buttons
- **Feature Grid**: Six key capabilities displayed with icons and descriptions:
  - AI-Powered Insights - Machine learning for failure prediction
  - Real-Time Monitoring - Track asset health across the portfolio
  - Advanced Analytics - Deep performance data analysis
  - Predictive Maintenance - Intelligent predictive alerts
  - Automated Workflows - AI agents for routine tasks
  - Portfolio Optimization - Data-driven ROI maximization
- **Statistics Section**: Key metrics (downtime reduction, cost savings, prediction accuracy)
- **Call-to-Action Section**: Drives users to the main application
- **Footer**: Developer attribution with LinkedIn link

---

### Plant Operations Dashboard

**Route:** `/dashboard`

The central command center for monitoring plant-wide operations.

#### Features:
- **Role-Based View Switching**: Toggle between Executive, Engineer, and Operator views
- **KPI Dashboard Grid**: Real-time key performance indicators including:
  - Asset health scores
  - Active alerts count
  - Maintenance metrics
  - Operational efficiency
- **Quick Navigation Cards**: One-click access to major modules:
  - Portfolio Overview
  - Digital Twin visualization
  - Active Alerts
  - Asset Detail & Health
  - Analytics Lab
- **Assets at Risk Panel**: 
  - List of critical and warning-status assets
  - Health scores and alert counts
  - Direct navigation to asset details
- **Status Badges**: Visual indicators for asset health states

---

### Digital Twin

**Route:** `/digital-twin`

Interactive 3D visualization of the plant floor with real-time sensor overlays.

#### Features:
- **3D Plant Visualization**: 
  - Interactive Three.js-based 3D scene
  - Clickable asset nodes with status colors
  - Orbital camera controls for navigation
- **Layer Controls**:
  - Toggle sensor overlay layers (vibration, acoustics, thermal, energy, flow, pressure)
  - Opacity slider for overlay transparency
- **Timeline Scrubber**:
  - Historical data playback (7-day history)
  - Play/pause controls
  - Jump to any point in time
- **Asset Selection Panel**:
  - Detailed asset information on click
  - Health score with progress bar
  - Real-time sensor readings (temperature, vibration, pressure)
  - Quick link to full asset details
- **Status Legend**: Color-coded health status reference
- **AR View Button**: Placeholder for augmented reality integration
- **Fullscreen Mode**: Expanded visualization option

---

### Asset Detail

**Route:** `/asset/:id`

Comprehensive single-asset view with deep diagnostics and historical data.

#### Features:

**Overview Tab:**
- **Real-Time KPI Cards**: Health score, temperature, vibration, power draw
- **Live Telemetry Chart**: 
  - Auto-updating line chart (3-second refresh)
  - Multiple sensor data streams (temperature, vibration, pressure)
  - 30-point rolling window
- **Asset Information**: ID, make/model, criticality, commissioning date, operating hours
- **Maintenance Schedule**: Last and next maintenance dates with countdown

**Health & Components Tab:**
- **Component Health Cards**: Individual health status for each asset component
- **Explainability Card**: 
  - SHAP-style feature importance visualization
  - Risk factor breakdown with contribution percentages
  - Confidence intervals

**Predictive Analytics Tab:**
- **Remaining Useful Life (RUL) Chart**:
  - Time-series forecast with confidence bounds
  - P10/P50/P90 prediction intervals
  - Threshold indicators
- **Failure Patterns Card**:
  - Historical failure mode analysis
  - Pattern recognition results
  - Frequency and impact metrics

**Prescriptive Insights Tab:**
- **Prescriptive Action Cards**:
  - AI-generated maintenance recommendations
  - Impact assessment
  - Action buttons for workflow initiation

**History & Records Tab:**
- **Work Orders**: Maintenance history with status tracking
- **Operator Notes**: Shift notes and observations
- **Bill of Materials (BOM)**: Parts and components list
- **Historical Alerts**: Past alert records with resolution status

---

### Alerts Management

**Route:** `/alerts`

Centralized alert queue with real-time updates and bulk operations.

#### Features:
- **Real-Time Updates**: 
  - Simulated <5 second alert latency
  - Live update indicator with timestamp
  - Toast notifications for new alerts
- **Alert Statistics Bar**:
  - Total, acknowledged, resolved, critical counts
  - Visual breakdown of alert states
- **Advanced Filtering**:
  - Severity filter (Critical, High, Medium, Low)
  - Status filter (Unacknowledged, Acknowledged, Resolved)
  - Sort options (Timestamp, Severity, Business Impact)
- **Bulk Operations**:
  - Select all/deselect all
  - Bulk acknowledge
  - Bulk resolve
- **Alert Queue Cards**:
  - Severity badge with color coding
  - Asset information and timestamp
  - Root cause analysis (ML-generated)
  - Business impact assessment
  - Quick action buttons:
    - Acknowledge
    - Create Prescription
    - Create Work Order
    - Notify Team
    - Escalate to Expert
    - Trigger AI Runbook
- **Rule Templates Dialog**:
  - View and manage alert rules
  - Enable/disable rules
  - Rule configuration

---

### Analytics & Diagnostics Lab

**Route:** `/analytics`

Advanced analytics workbench for data scientists and reliability engineers.

#### Features:

**Model Cards Summary:**
- Deployed ML model status
- Performance metrics (Accuracy, F1 Score, ROC AUC)
- Deployment status badges

**Time-Series Explorer Tab:**
- **Multi-Tag Selection**: Browse and select sensor tags
- **Interactive Charting**: 
  - Zoom and pan capabilities
  - Adjustable time ranges
  - Statistical overlays (mean, std dev, trends)
- **Signal Processing**: Filtering and smoothing options

**Advanced Diagnostics Tab:**
- **Vibration Diagnostics**: 
  - Spectral analysis with FFT
  - Peak identification
  - ISO 10816 classification
- **Acoustic Diagnostics**: Sound pattern analysis
- **Thermal Diagnostics**: Temperature profiling and hotspot detection
- **Energy Diagnostics**: Power consumption analysis

**Anomaly Detection Tab:**
- **Model Selection**: Multiple algorithm options (Isolation Forest, Autoencoder, etc.)
- **Backtest Results**:
  - Historical performance metrics
  - Confusion matrix
  - Alert counts and timing analysis
- **Configuration Studio**: Threshold and sensitivity tuning

**Benchmarking Tab:**
- **Cross-Asset Comparison**: Performance benchmarks across similar assets
- **Industry Standards**: Comparison against industry benchmarks
- **Fleet Analytics**: Portfolio-wide performance distribution

---

### Portfolio & Executive Overview

**Route:** `/portfolio`

Enterprise-wide visibility for executives and portfolio managers.

#### Features:

**Global Filters:**
- Region selector
- Site selector
- Asset class filter
- Criticality level filter
- Date range picker
- Export options (CSV, PDF)

**Overview Tab:**
- **Enterprise KPIs Grid**:
  - Availability percentage
  - Mean Time Between Failures (MTBF)
  - Planned Maintenance Percentage (PMP)
  - Cost per unit of production
  - Energy efficiency metrics
- **Risk Heatmap**:
  - Asset class vs criticality matrix
  - Color-coded risk levels
  - Drill-down capability

**ROI & Impact Tab:**
- **ROI Metrics Cards**:
  - Cost avoidance
  - Energy savings
  - Productivity gains
  - Parts optimization
  - Labor efficiency
- **Waterfall Chart**:
  - Savings breakdown by category
  - Cumulative impact visualization

**Site Comparison Tab:**
- **Benchmark Chart**: Side-by-side site performance comparison
- **Site Cards**:
  - Site name and location
  - Health status badge
  - Asset count and regional information
  - Click-through for site details

---

### Prescriptions & Workflows

**Route:** `/prescriptions`

Expert-validated maintenance procedures with workflow execution tracking.

#### Features:

**Metrics Dashboard:**
- Total prescriptions count
- Active workflows
- Success rate percentage
- Average effectiveness rating

**Library Tab:**
- **Search & Filter**: Find prescriptions by title or description
- **Prescription Cards**:
  - Title and description
  - Source badge (Expert, AI-Generated, Hybrid)
  - Status indicator (Draft, Approved, Active, Archived)
  - Usage statistics and success rate
  - Estimated duration
  - CMMS integration status
  - View and Execute buttons

**Workflows Tab:**
- **Active Workflow Cards**:
  - Progress tracking (current step / total steps)
  - Assigned technician
  - Status indicator
  - CMMS sync status
  - Continue and View buttons

**CMMS Tab:**
- **Integration Cards** for major CMMS systems:
  - SAP PM
  - IBM Maximo
  - ServiceNow
  - MaintainX
  - UpKeep
  - Fiix
- **Connection Status**: Active, Error, Disconnected
- **Sync Information**: Last sync time, work orders synced
- **Connect/Sync Buttons**

**Metrics Tab:**
- **Closed Loop Metrics**:
  - Adoption rate
  - Average completion time
  - Completed workflows count
- **Feedback Loop Information**: Continuous improvement tracking

---

### AI Agents & Automations

**Route:** `/agents`

Intelligent automation with tool access, guardrails, and human oversight.

#### Features:

**Agent Types:**
- Diagnostics Agent
- Work Order Copilot
- Benchmarking Analyst
- ROI Advisor
- Sensor Setup Agent
- Alert Triage Agent
- Reliability Copilot
- Executive Briefing Agent

**Metrics Dashboard:**
- Total executions
- Success rate
- Pending approvals
- Runs today

**AI Agents Tab:**
- **Agent Cards**:
  - Agent name and type
  - Description and capabilities
  - Tool access list
  - Guardrail indicators
  - Auto-trigger status
  - Success rate
  - Last run timestamp
  - Run and Configure buttons

**Execution History Tab:**
- **Recent Executions List**:
  - Agent name
  - Status badge (Completed, Failed, Awaiting Approval)
  - Timestamp
- **Execution Details Panel**:
  - Full execution timeline
  - Tool calls with parameters and results
  - Guardrail check results
  - Reasoning explanation
  - Input/output data

**Approvals Tab:**
- **Human-in-the-Loop Approval Queue**:
  - Agent name and type
  - Proposed action details
  - Impact assessment
  - Reasoning explanation
  - Approve/Reject buttons
  - Review notes field

**Audit Trail Tab:**
- **Complete Audit Log**:
  - All agent executions
  - Audit log IDs
  - Trigger source (Manual, Schedule, Event)
  - Tool usage count
  - Approval status
  - Decision reasoning

---

### Sensor Hub & Integrations

**Route:** `/sensors`

Device management, gateway configuration, and data mapping.

#### Features:

**Metrics Dashboard:**
- Online sensors count
- Warning/Offline sensors
- Active gateways
- Average latency

**Sensors Tab:**
- **Search & Filter**: Find sensors by name or asset
- **Sensor Cards**:
  - Sensor name and type
  - Status badge (Online, Offline, Warning, Error)
  - Asset location information
  - Configuration details:
    - Sampling frequency
    - Reporting interval
    - Engineering unit
    - Accuracy
  - Connectivity info:
    - Gateway and protocol
    - Signal strength
    - Battery level
    - Firmware version
  - Data mapping configuration
  - Configure and View Data buttons

**Gateways Tab:**
- **Gateway Cards**:
  - Gateway name and protocol (MQTT, OPC UA, Modbus TCP/RTU, REST API)
  - Status badge (Healthy, Degraded, Offline)
  - Health metrics:
    - CPU usage
    - Memory usage
    - Disk usage
    - Network latency
    - Buffer usage
  - Connected sensors count
  - Configure button

**Live Data Tab:**
- **Telemetry Stream Dashboard**:
  - Total data points collected
  - Real-time streaming preview
  - Sub-second latency monitoring

**Sensor Setup Wizard:**
- Multi-step guided sensor onboarding:
  - Device information entry
  - Location assignment
  - Configuration settings
  - Gateway mapping
  - Verification and testing

---

### Reports & Analytics

**Route:** `/reports`

Build, schedule, and share insightful reports.

#### Features:

**Metrics Dashboard:**
- Total reports
- Active schedules
- Deliveries this month (with success rate)
- Shared reports

**Reports Tab:**
- **Search & Filter**: Find reports by name or description
- **Report Cards**:
  - Report name and type
  - Description
  - Status badge (Draft, Active, Archived)
  - Configuration summary:
    - Selected KPIs
    - Time range
    - Layout style
  - Schedule information:
    - Frequency
    - Next delivery
    - Recipients
  - Action buttons: Edit, Share, Export, Schedule

**Report Types Supported:**
- Site Scorecard
- Executive Brief
- Asset Health Report
- Maintenance Summary
- Energy Report
- Custom Reports

**Export Formats:**
- PDF
- CSV
- PNG
- XLSX

**Delivery Channels:**
- Email
- Slack
- Microsoft Teams

**Executive Brief Tab:**
- **AI-Generated Executive Summary**:
  - Period highlights
  - Savings achieved
  - Risks mitigated
  - Downtime prevented
  - Efficiency gains
- **Top Alerts Summary**: Critical alerts requiring attention
- **Recommendations**: Prioritized action items with estimated savings
- **Export Button**: One-click PDF generation

**Delivery History Tab:**
- **Audit Trail**:
  - Scheduled deliveries
  - Delivery status (Pending, Sending, Delivered, Failed)
  - Channel and format
  - Recipients
  - Error messages (if any)

---

### 24x7 Expert Support

**Route:** `/support`

AI-powered assistance with subject matter expert (SME) escalation.

#### Features:

**Metrics Dashboard:**
- Average response time
- Resolution rate
- Active SME tickets
- Sessions today

**AI Assistant Tab:**
- **Chat Interface**:
  - Natural language queries
  - Context-aware responses
  - Asset-specific troubleshooting
  - Citation links to KB articles
  - Troubleshooting step lists
  - Escalate to SME button
- **Quick Tips Panel**: Usage guidance
- **Common Queries Panel**: Pre-built query shortcuts

**Knowledge Base Tab:**
- **Article Browser**:
  - Category organization
  - Search functionality
  - View counts and helpful ratings
- **Article Cards**:
  - Title and category
  - Tags
  - Last updated date
  - Related articles links

**SME Escalation Tab:**
- **Escalation Form**:
  - Auto-populated chat transcript
  - Priority selection (Low, Medium, High, Critical)
  - Subject and description fields
  - SLA deadline tracking
- **Active Tickets Panel**:
  - Ticket status (Pending, Assigned, In-Progress, Resolved)
  - Assigned SME
  - Resolution notes

---

### Admin & Governance

**Route:** `/admin`

Role-based access control, audit logs, and system governance.

#### Features:

**Metrics Dashboard:**
- Total users (with active count)
- Pending approvals
- Audit log entries
- Active API keys

**Users & Roles Tab:**
- **User Management Table**:
  - User listing with avatars
  - Role badges
  - Status indicators
  - Last active timestamp
  - Edit/Disable actions
- **Add User Button**
- **Role Filter**

**Permissions Tab:**
- **Role Permissions Matrix**:
  - Role-based resource access
  - Action permissions (Read, Write, Delete, Execute)
  - Site scope restrictions
  - Asset class scope restrictions

**Approvals Tab:**
- **Approval Request Cards**:
  - Request type and status
  - Title and description
  - Requester information
  - Approve/Reject buttons
  - Review notes

**Audit Log Tab:**
- **Comprehensive Audit Trail**:
  - Timestamp
  - User and action
  - Resource affected
  - IP address
  - User agent
  - Status (Success, Failure, Denied)
- **Filters**: By user, action type, date range
- **Export**: Download audit logs

**Impersonation Tab:**
- **Role Impersonation**:
  - Test permissions as different roles
  - Session tracking
  - Automatic timeout
- **Active Sessions**: View and terminate sessions

**API & Webhooks Tab:**
- **API Key Management**:
  - Create new keys
  - View permissions
  - Expiration management
  - Revoke keys
- **Webhooks**:
  - Webhook configuration
  - Event subscriptions
  - Success/failure counts
  - Test and disable options

**Data Governance Tab:**
- **Data Retention Policies**:
  - Category-based retention rules
  - Archive settings
  - Auto-delete configuration
  - PII scrubbing options
  - Last applied dates

---

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:5173`

---

## Deployment

Simply open [Lovable](https://lovable.dev/projects/45069a01-d8c5-4ded-b576-0cc208be62e3) and click on Share -> Publish.

### Custom Domain

To connect a custom domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

---

## Author

Designed and developed by [Pulkit Chaudhary](https://www.linkedin.com/in/pulkit-chaudhary)

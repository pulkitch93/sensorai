# API Documentation

This document outlines the API specifications for the Asset Intelligence Platform backend integration with Supabase.

---

## Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Database Schema](#database-schema)
  - [Core Tables](#core-tables)
  - [Analytics Tables](#analytics-tables)
  - [Workflow Tables](#workflow-tables)
  - [Support Tables](#support-tables)
  - [Admin Tables](#admin-tables)
- [Row Level Security Policies](#row-level-security-policies)
- [Edge Functions](#edge-functions)
- [Real-time Subscriptions](#real-time-subscriptions)
- [API Contracts](#api-contracts)

---

## Overview

The Asset Intelligence Platform uses Supabase as its backend, providing:

- **PostgreSQL Database**: Structured data storage with RLS
- **Authentication**: Email/password and OAuth providers
- **Edge Functions**: Serverless compute for AI and integrations
- **Real-time**: Live updates for alerts and telemetry
- **Storage**: File storage for documents and images

### Base URL

```
https://<project-ref>.supabase.co
```

### API Versioning

All API endpoints are versioned. Current version: `v1`

---

## Authentication

### Supported Methods

| Method | Description |
|--------|-------------|
| Email/Password | Standard email and password authentication |
| Magic Link | Passwordless email authentication |
| OAuth | Google, Microsoft, GitHub providers |

### Authentication Flow

```typescript
// Sign Up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'secure-password',
  options: {
    emailRedirectTo: `${window.location.origin}/`,
    data: {
      first_name: 'John',
      last_name: 'Doe'
    }
  }
});

// Sign In
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'secure-password'
});

// Sign Out
await supabase.auth.signOut();

// Session Management
supabase.auth.onAuthStateChange((event, session) => {
  // Handle auth state changes
});
```

---

## Database Schema

### Core Tables

#### `profiles`

User profile information linked to auth.users.

```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  department TEXT,
  job_title TEXT,
  phone TEXT,
  timezone TEXT DEFAULT 'UTC',
  notification_preferences JSONB DEFAULT '{"email": true, "push": true, "slack": false}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

#### `user_roles`

Role-based access control (stored separately for security).

```sql
CREATE TYPE public.app_role AS ENUM (
  'admin',
  'executive', 
  'reliability_engineer',
  'maintenance_technician',
  'operator',
  'viewer'
);

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  site_scope TEXT[] DEFAULT '{}',
  asset_class_scope TEXT[] DEFAULT '{}',
  granted_by UUID REFERENCES auth.users(id),
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
      AND (expires_at IS NULL OR expires_at > NOW())
  )
$$;
```

#### `sites`

Physical locations/facilities.

```sql
CREATE TABLE public.sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  region TEXT NOT NULL,
  timezone TEXT DEFAULT 'UTC',
  status TEXT CHECK (status IN ('healthy', 'warning', 'critical', 'offline')) DEFAULT 'healthy',
  asset_count INTEGER DEFAULT 0,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;
```

#### `assets`

Industrial equipment and machinery.

```sql
CREATE TYPE public.asset_status AS ENUM ('healthy', 'warning', 'critical', 'offline');
CREATE TYPE public.asset_criticality AS ENUM ('low', 'medium', 'high', 'critical');

CREATE TABLE public.assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID REFERENCES public.sites(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  make TEXT,
  model TEXT,
  serial_number TEXT,
  status asset_status DEFAULT 'healthy',
  criticality asset_criticality DEFAULT 'medium',
  health_score INTEGER CHECK (health_score >= 0 AND health_score <= 100),
  
  -- Current sensor readings (denormalized for quick access)
  temperature DECIMAL(5, 2),
  vibration DECIMAL(5, 3),
  pressure DECIMAL(6, 2),
  
  -- Maintenance tracking
  last_maintenance TIMESTAMPTZ,
  next_maintenance TIMESTAMPTZ,
  operating_hours INTEGER DEFAULT 0,
  commissioning_date DATE,
  
  -- Location within site
  location_x DECIMAL(10, 4),
  location_y DECIMAL(10, 4),
  location_z DECIMAL(10, 4),
  
  -- Metadata
  specifications JSONB DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;

-- Indexes for common queries
CREATE INDEX idx_assets_site_id ON public.assets(site_id);
CREATE INDEX idx_assets_status ON public.assets(status);
CREATE INDEX idx_assets_criticality ON public.assets(criticality);
CREATE INDEX idx_assets_health_score ON public.assets(health_score);
```

#### `asset_components`

Sub-components of assets.

```sql
CREATE TABLE public.asset_components (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID REFERENCES public.assets(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  health_score INTEGER CHECK (health_score >= 0 AND health_score <= 100),
  status asset_status DEFAULT 'healthy',
  remaining_useful_life_days INTEGER,
  last_replaced TIMESTAMPTZ,
  specifications JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.asset_components ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_asset_components_asset_id ON public.asset_components(asset_id);
```

### Sensor & Telemetry Tables

#### `gateways`

Edge devices that collect sensor data.

```sql
CREATE TYPE public.gateway_protocol AS ENUM ('MQTT', 'OPC UA', 'Modbus TCP', 'Modbus RTU', 'REST API');
CREATE TYPE public.gateway_status AS ENUM ('healthy', 'degraded', 'offline');

CREATE TABLE public.gateways (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID REFERENCES public.sites(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  protocol gateway_protocol NOT NULL,
  status gateway_status DEFAULT 'healthy',
  ip_address INET,
  port INTEGER,
  
  -- Health metrics
  cpu_usage DECIMAL(5, 2),
  memory_usage DECIMAL(5, 2),
  disk_usage DECIMAL(5, 2),
  network_latency_ms INTEGER,
  buffer_usage DECIMAL(5, 2),
  buffered_messages INTEGER DEFAULT 0,
  uptime_hours INTEGER DEFAULT 0,
  
  -- Configuration
  mqtt_topics TEXT[],
  opcua_nodes TEXT[],
  modbus_mapping JSONB,
  
  firmware_version TEXT,
  last_seen TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.gateways ENABLE ROW LEVEL SECURITY;
```

#### `sensors`

Individual sensor devices.

```sql
CREATE TYPE public.sensor_status AS ENUM ('online', 'offline', 'warning', 'error');
CREATE TYPE public.sensor_type AS ENUM (
  'temperature', 'vibration', 'pressure', 'flow', 
  'acoustic', 'current', 'voltage', 'energy'
);

CREATE TABLE public.sensors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gateway_id UUID REFERENCES public.gateways(id) ON DELETE SET NULL,
  asset_id UUID REFERENCES public.assets(id) ON DELETE CASCADE NOT NULL,
  component_id UUID REFERENCES public.asset_components(id) ON DELETE SET NULL,
  
  name TEXT NOT NULL,
  type sensor_type NOT NULL,
  status sensor_status DEFAULT 'offline',
  device_id TEXT UNIQUE,
  
  -- Configuration
  sampling_frequency_hz INTEGER DEFAULT 1,
  reporting_interval_seconds INTEGER DEFAULT 60,
  engineering_unit TEXT NOT NULL,
  min_value DECIMAL(12, 4),
  max_value DECIMAL(12, 4),
  accuracy DECIMAL(5, 4),
  
  -- Calibration
  calibration_date DATE,
  next_calibration_date DATE,
  calibration_offset DECIMAL(12, 6) DEFAULT 0,
  calibration_scale DECIMAL(12, 6) DEFAULT 1,
  
  -- Connectivity
  protocol gateway_protocol,
  address TEXT,
  signal_strength INTEGER CHECK (signal_strength >= 0 AND signal_strength <= 100),
  battery_level INTEGER CHECK (battery_level >= 0 AND battery_level <= 100),
  firmware_version TEXT,
  last_seen TIMESTAMPTZ,
  
  -- Data mapping
  tag_name TEXT NOT NULL,
  description TEXT,
  resampling_rule TEXT CHECK (resampling_rule IN ('average', 'max', 'min', 'last', 'sum')),
  alert_threshold_high DECIMAL(12, 4),
  alert_threshold_low DECIMAL(12, 4),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.sensors ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_sensors_asset_id ON public.sensors(asset_id);
CREATE INDEX idx_sensors_gateway_id ON public.sensors(gateway_id);
CREATE INDEX idx_sensors_status ON public.sensors(status);
```

#### `telemetry`

Time-series sensor data (consider TimescaleDB extension for production).

```sql
CREATE TABLE public.telemetry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sensor_id UUID REFERENCES public.sensors(id) ON DELETE CASCADE NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  value DECIMAL(18, 6) NOT NULL,
  unit TEXT NOT NULL,
  quality TEXT CHECK (quality IN ('good', 'bad', 'uncertain')) DEFAULT 'good',
  
  -- Metadata
  raw_value DECIMAL(18, 6),
  processed BOOLEAN DEFAULT FALSE,
  anomaly_score DECIMAL(5, 4)
);

-- Partitioning by time for performance
CREATE INDEX idx_telemetry_sensor_timestamp ON public.telemetry(sensor_id, timestamp DESC);
CREATE INDEX idx_telemetry_timestamp ON public.telemetry(timestamp DESC);

-- Consider enabling TimescaleDB for production:
-- SELECT create_hypertable('telemetry', 'timestamp');
```

### Alert Tables

#### `alerts`

System-generated alerts.

```sql
CREATE TYPE public.alert_severity AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE public.alert_category AS ENUM (
  'threshold', 'anomaly', 'pattern', 'predictive', 
  'connectivity', 'system', 'maintenance'
);

CREATE TABLE public.alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID REFERENCES public.assets(id) ON DELETE CASCADE NOT NULL,
  sensor_id UUID REFERENCES public.sensors(id) ON DELETE SET NULL,
  
  title TEXT NOT NULL,
  description TEXT,
  severity alert_severity NOT NULL,
  category alert_category NOT NULL,
  
  -- ML-generated insights
  root_cause_analysis TEXT,
  confidence_score DECIMAL(5, 4),
  business_impact TEXT CHECK (business_impact IN ('low', 'medium', 'high', 'critical')),
  
  -- Status tracking
  acknowledged BOOLEAN DEFAULT FALSE,
  acknowledged_by UUID REFERENCES auth.users(id),
  acknowledged_at TIMESTAMPTZ,
  resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMPTZ,
  resolution_notes TEXT,
  
  -- Timing
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  duration_minutes INTEGER,
  
  -- Metrics
  affected_value DECIMAL(18, 6),
  threshold_value DECIMAL(18, 6),
  
  -- Related entities
  related_alerts UUID[],
  related_work_orders UUID[],
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_alerts_asset_id ON public.alerts(asset_id);
CREATE INDEX idx_alerts_severity ON public.alerts(severity);
CREATE INDEX idx_alerts_acknowledged ON public.alerts(acknowledged);
CREATE INDEX idx_alerts_timestamp ON public.alerts(timestamp DESC);
```

#### `alert_rules`

Configurable alerting rules.

```sql
CREATE TABLE public.alert_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  enabled BOOLEAN DEFAULT TRUE,
  
  -- Targeting
  asset_types TEXT[],
  sensor_types sensor_type[],
  site_ids UUID[],
  
  -- Conditions
  condition_type TEXT CHECK (condition_type IN (
    'threshold_high', 'threshold_low', 'rate_of_change',
    'anomaly_score', 'pattern_match', 'time_based'
  )) NOT NULL,
  condition_config JSONB NOT NULL,
  -- Example: {"threshold": 100, "duration_minutes": 5}
  
  -- Actions
  severity alert_severity NOT NULL,
  notification_channels TEXT[] DEFAULT '{}',
  auto_acknowledge_minutes INTEGER,
  
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.alert_rules ENABLE ROW LEVEL SECURITY;
```

### Workflow Tables

#### `prescriptions`

Maintenance procedures and workflows.

```sql
CREATE TYPE public.prescription_status AS ENUM ('draft', 'approved', 'active', 'archived');
CREATE TYPE public.prescription_source AS ENUM ('expert', 'ai-generated', 'hybrid');

CREATE TABLE public.prescriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  status prescription_status DEFAULT 'draft',
  source prescription_source DEFAULT 'expert',
  
  -- Targeting
  asset_type TEXT NOT NULL,
  category TEXT NOT NULL,
  
  -- Steps (JSONB array)
  steps JSONB NOT NULL DEFAULT '[]',
  -- Example: [{"order": 1, "description": "...", "tools": [...], "safety": [...], "expectedTime": 15}]
  
  -- Approval workflow
  requires_approval BOOLEAN DEFAULT TRUE,
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMPTZ,
  
  -- Metrics
  effectiveness_rating DECIMAL(3, 2),
  usage_count INTEGER DEFAULT 0,
  success_rate DECIMAL(5, 2),
  estimated_duration_minutes INTEGER,
  
  -- CMMS integration
  cmms_linked TEXT[],
  
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;
```

#### `workflow_executions`

Tracking of prescription executions.

```sql
CREATE TYPE public.workflow_status AS ENUM ('pending', 'in-progress', 'completed', 'failed', 'cancelled');

CREATE TABLE public.workflow_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prescription_id UUID REFERENCES public.prescriptions(id) ON DELETE SET NULL NOT NULL,
  asset_id UUID REFERENCES public.assets(id) ON DELETE CASCADE NOT NULL,
  
  status workflow_status DEFAULT 'pending',
  current_step INTEGER DEFAULT 0,
  total_steps INTEGER NOT NULL,
  
  -- Step completion tracking
  step_completions JSONB DEFAULT '[]',
  -- Example: [{"step": 1, "completed_at": "...", "notes": "..."}]
  
  -- Timing
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  
  -- Assignment
  executed_by UUID REFERENCES auth.users(id) NOT NULL,
  
  -- Feedback
  feedback_rating INTEGER CHECK (feedback_rating >= 1 AND feedback_rating <= 5),
  feedback_notes TEXT,
  
  -- CMMS sync
  synced_to_cmms BOOLEAN DEFAULT FALSE,
  cmms_work_order_id TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.workflow_executions ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_workflow_executions_asset_id ON public.workflow_executions(asset_id);
CREATE INDEX idx_workflow_executions_status ON public.workflow_executions(status);
```

#### `work_orders`

Maintenance work orders.

```sql
CREATE TYPE public.work_order_status AS ENUM (
  'open', 'assigned', 'in-progress', 'on-hold', 
  'completed', 'cancelled', 'verified'
);
CREATE TYPE public.work_order_priority AS ENUM ('low', 'medium', 'high', 'emergency');

CREATE TABLE public.work_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID REFERENCES public.assets(id) ON DELETE CASCADE NOT NULL,
  alert_id UUID REFERENCES public.alerts(id) ON DELETE SET NULL,
  workflow_id UUID REFERENCES public.workflow_executions(id) ON DELETE SET NULL,
  
  title TEXT NOT NULL,
  description TEXT,
  status work_order_status DEFAULT 'open',
  priority work_order_priority DEFAULT 'medium',
  
  -- Assignment
  assigned_to UUID REFERENCES auth.users(id),
  assigned_at TIMESTAMPTZ,
  
  -- Timing
  due_date TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  
  -- Execution details
  actual_duration_minutes INTEGER,
  parts_used JSONB DEFAULT '[]',
  labor_hours DECIMAL(6, 2),
  
  -- Resolution
  resolution_notes TEXT,
  root_cause TEXT,
  
  -- CMMS integration
  external_id TEXT,
  external_system TEXT,
  
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.work_orders ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_work_orders_asset_id ON public.work_orders(asset_id);
CREATE INDEX idx_work_orders_status ON public.work_orders(status);
CREATE INDEX idx_work_orders_assigned_to ON public.work_orders(assigned_to);
```

### AI Agent Tables

#### `agent_configs`

AI agent configurations.

```sql
CREATE TYPE public.agent_type AS ENUM (
  'diagnostics', 'work-order-copilot', 'benchmarking-analyst',
  'roi-advisor', 'sensor-setup', 'alert-triage',
  'reliability-copilot', 'executive-briefing'
);

CREATE TABLE public.agent_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type agent_type NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  system_prompt TEXT NOT NULL,
  
  -- Tools and guardrails (JSONB)
  tools JSONB DEFAULT '[]',
  guardrails JSONB DEFAULT '[]',
  
  -- Execution settings
  requires_human_approval BOOLEAN DEFAULT TRUE,
  auto_trigger BOOLEAN DEFAULT FALSE,
  trigger_schedule TEXT, -- Cron expression
  
  enabled BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.agent_configs ENABLE ROW LEVEL SECURITY;
```

#### `agent_executions`

AI agent execution history.

```sql
CREATE TYPE public.agent_status AS ENUM (
  'idle', 'running', 'completed', 'failed', 'awaiting-approval'
);
CREATE TYPE public.approval_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE public.agent_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES public.agent_configs(id) ON DELETE SET NULL NOT NULL,
  
  status agent_status DEFAULT 'running',
  triggered_by TEXT CHECK (triggered_by IN ('manual', 'schedule', 'event')) NOT NULL,
  
  -- Input/Output
  inputs JSONB DEFAULT '{}',
  outputs JSONB,
  reasoning TEXT,
  error TEXT,
  
  -- Tool calls log
  tool_calls JSONB DEFAULT '[]',
  guardrail_checks JSONB DEFAULT '[]',
  
  -- Approval workflow
  requires_approval BOOLEAN DEFAULT FALSE,
  approval_status approval_status,
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMPTZ,
  
  -- Timing
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  
  -- Audit
  audit_log_id UUID,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.agent_executions ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_agent_executions_agent_id ON public.agent_executions(agent_id);
CREATE INDEX idx_agent_executions_status ON public.agent_executions(status);
```

### Analytics Tables

#### `ml_models`

ML model registry.

```sql
CREATE TYPE public.model_status AS ENUM ('training', 'staged', 'deployed', 'archived');

CREATE TABLE public.ml_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  version TEXT NOT NULL,
  model_type TEXT NOT NULL, -- 'isolation-forest', 'autoencoder', etc.
  
  status model_status DEFAULT 'training',
  
  -- Training info
  training_config JSONB DEFAULT '{}',
  training_data_start TIMESTAMPTZ,
  training_data_end TIMESTAMPTZ,
  training_samples INTEGER,
  
  -- Performance metrics
  accuracy DECIMAL(5, 4),
  precision_score DECIMAL(5, 4),
  recall DECIMAL(5, 4),
  f1_score DECIMAL(5, 4),
  roc_auc DECIMAL(5, 4),
  false_positive_rate DECIMAL(5, 4),
  
  -- Deployment info
  deployed_at TIMESTAMPTZ,
  deployed_by UUID REFERENCES auth.users(id),
  endpoint_url TEXT,
  
  -- Targeting
  asset_types TEXT[],
  sensor_types sensor_type[],
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(name, version)
);

ALTER TABLE public.ml_models ENABLE ROW LEVEL SECURITY;
```

#### `predictions`

ML model predictions.

```sql
CREATE TABLE public.predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id UUID REFERENCES public.ml_models(id) ON DELETE SET NULL NOT NULL,
  asset_id UUID REFERENCES public.assets(id) ON DELETE CASCADE NOT NULL,
  component_id UUID REFERENCES public.asset_components(id) ON DELETE SET NULL,
  
  -- Prediction details
  prediction_type TEXT NOT NULL, -- 'rul', 'anomaly', 'failure_mode'
  predicted_value DECIMAL(18, 6),
  confidence DECIMAL(5, 4),
  
  -- For RUL predictions
  rul_days INTEGER,
  rul_p10 INTEGER,
  rul_p50 INTEGER,
  rul_p90 INTEGER,
  
  -- For anomaly predictions
  anomaly_score DECIMAL(5, 4),
  is_anomaly BOOLEAN,
  
  -- Explainability
  feature_importance JSONB,
  contributing_factors TEXT[],
  
  prediction_timestamp TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_predictions_asset_id ON public.predictions(asset_id);
CREATE INDEX idx_predictions_timestamp ON public.predictions(prediction_timestamp DESC);
```

### Support Tables

#### `chat_sessions`

Support chat sessions.

```sql
CREATE TABLE public.chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  status TEXT CHECK (status IN ('active', 'resolved', 'escalated')) DEFAULT 'active',
  
  -- Context
  related_asset_id UUID REFERENCES public.assets(id) ON DELETE SET NULL,
  related_alert_id UUID REFERENCES public.alerts(id) ON DELETE SET NULL,
  
  -- Resolution
  resolved_at TIMESTAMPTZ,
  resolution_summary TEXT,
  
  -- Metrics
  message_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
```

#### `chat_messages`

Chat message history.

```sql
CREATE TYPE public.message_role AS ENUM ('user', 'assistant', 'system');

CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.chat_sessions(id) ON DELETE CASCADE NOT NULL,
  
  role message_role NOT NULL,
  content TEXT NOT NULL,
  
  -- AI-specific fields
  citations JSONB DEFAULT '[]',
  troubleshooting_steps JSONB DEFAULT '[]',
  
  -- Token usage (for AI messages)
  tokens_used INTEGER,
  model_used TEXT,
  
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_chat_messages_session_id ON public.chat_messages(session_id);
```

#### `knowledge_articles`

Knowledge base articles.

```sql
CREATE TABLE public.knowledge_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  content TEXT NOT NULL,
  
  tags TEXT[] DEFAULT '{}',
  related_articles UUID[] DEFAULT '{}',
  
  -- Metrics
  views INTEGER DEFAULT 0,
  helpful_count INTEGER DEFAULT 0,
  
  -- Publishing
  published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  
  -- Versioning
  version INTEGER DEFAULT 1,
  
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.knowledge_articles ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_knowledge_articles_category ON public.knowledge_articles(category);
CREATE INDEX idx_knowledge_articles_tags ON public.knowledge_articles USING GIN(tags);

-- Full-text search
ALTER TABLE public.knowledge_articles ADD COLUMN search_vector tsvector;
CREATE INDEX idx_knowledge_articles_search ON public.knowledge_articles USING GIN(search_vector);

CREATE OR REPLACE FUNCTION update_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := to_tsvector('english', COALESCE(NEW.title, '') || ' ' || COALESCE(NEW.content, ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER knowledge_articles_search_update
  BEFORE INSERT OR UPDATE ON public.knowledge_articles
  FOR EACH ROW EXECUTE FUNCTION update_search_vector();
```

#### `sme_tickets`

SME escalation tickets.

```sql
CREATE TYPE public.ticket_status AS ENUM ('pending', 'assigned', 'in-progress', 'resolved');
CREATE TYPE public.ticket_priority AS ENUM ('low', 'medium', 'high', 'critical');

CREATE TABLE public.sme_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.chat_sessions(id) ON DELETE SET NULL,
  
  status ticket_status DEFAULT 'pending',
  priority ticket_priority DEFAULT 'medium',
  
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  
  -- Assignment
  assigned_to UUID REFERENCES auth.users(id),
  
  -- SLA tracking
  sla_deadline TIMESTAMPTZ NOT NULL,
  
  -- Resolution
  resolved_at TIMESTAMPTZ,
  resolution TEXT,
  
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.sme_tickets ENABLE ROW LEVEL SECURITY;
```

### Reports Tables

#### `reports`

Report definitions.

```sql
CREATE TYPE public.report_type AS ENUM (
  'site-scorecard', 'executive-brief', 'asset-health',
  'maintenance-summary', 'energy-report', 'custom'
);
CREATE TYPE public.report_status AS ENUM ('draft', 'active', 'archived');

CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type report_type NOT NULL,
  status report_status DEFAULT 'draft',
  description TEXT,
  
  -- Configuration
  configuration JSONB NOT NULL DEFAULT '{}',
  -- Example: {"kpis": [...], "timeRange": {...}, "filters": {...}}
  
  -- Schedule (optional)
  schedule JSONB,
  -- Example: {"enabled": true, "frequency": "weekly", "channels": ["email"]}
  
  -- Sharing
  sharing JSONB,
  -- Example: {"enabled": true, "publicUrl": "...", "requiresAuth": true}
  
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
```

#### `report_deliveries`

Report delivery history.

```sql
CREATE TABLE public.report_deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID REFERENCES public.reports(id) ON DELETE CASCADE NOT NULL,
  
  status TEXT CHECK (status IN ('pending', 'sending', 'delivered', 'failed')) DEFAULT 'pending',
  channel TEXT NOT NULL, -- 'email', 'slack', 'teams'
  format TEXT NOT NULL, -- 'pdf', 'csv', 'xlsx'
  
  recipients TEXT[] NOT NULL,
  
  scheduled_at TIMESTAMPTZ NOT NULL,
  delivered_at TIMESTAMPTZ,
  
  error_message TEXT,
  
  -- Generated content
  content_url TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.report_deliveries ENABLE ROW LEVEL SECURITY;
```

### Admin Tables

#### `audit_logs`

System audit trail.

```sql
CREATE TYPE public.audit_event AS ENUM (
  'user.login', 'user.logout', 'user.created', 'user.updated', 'user.deleted',
  'role.granted', 'role.revoked',
  'asset.created', 'asset.updated', 'asset.deleted',
  'alert.acknowledged', 'alert.resolved',
  'agent.executed', 'agent.approved', 'agent.rejected',
  'prescription.created', 'prescription.approved',
  'report.generated', 'report.shared',
  'api.key_created', 'api.key_revoked',
  'config.changed', 'security.violation'
);

CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event audit_event NOT NULL,
  
  -- Actor
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  impersonated_by UUID REFERENCES auth.users(id),
  
  -- Target
  resource_type TEXT,
  resource_id UUID,
  
  -- Details
  action TEXT NOT NULL,
  details JSONB DEFAULT '{}',
  previous_state JSONB,
  new_state JSONB,
  
  -- Context
  ip_address INET,
  user_agent TEXT,
  
  -- Status
  status TEXT CHECK (status IN ('success', 'failure', 'denied')) DEFAULT 'success',
  error_message TEXT,
  
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- No RLS - admin access only via security definer functions
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_event ON public.audit_logs(event);
CREATE INDEX idx_audit_logs_timestamp ON public.audit_logs(timestamp DESC);
CREATE INDEX idx_audit_logs_resource ON public.audit_logs(resource_type, resource_id);
```

#### `api_keys`

API key management.

```sql
CREATE TABLE public.api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  
  -- Key hash (never store plain key)
  key_hash TEXT NOT NULL,
  key_prefix TEXT NOT NULL, -- First 8 chars for identification
  
  -- Permissions
  permissions TEXT[] DEFAULT '{}',
  rate_limit_per_minute INTEGER DEFAULT 60,
  
  -- Ownership
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  
  -- Status
  active BOOLEAN DEFAULT TRUE,
  expires_at TIMESTAMPTZ,
  last_used TIMESTAMPTZ,
  usage_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
```

#### `webhooks`

Webhook configurations.

```sql
CREATE TABLE public.webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  
  -- Events to subscribe to
  events TEXT[] NOT NULL,
  
  -- Authentication
  secret TEXT, -- For signature verification
  headers JSONB DEFAULT '{}',
  
  -- Status
  active BOOLEAN DEFAULT TRUE,
  
  -- Metrics
  success_count INTEGER DEFAULT 0,
  failure_count INTEGER DEFAULT 0,
  last_triggered TIMESTAMPTZ,
  last_response_status INTEGER,
  
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.webhooks ENABLE ROW LEVEL SECURITY;
```

---

## Row Level Security Policies

### User Profile Policies

```sql
-- Users can view their own profile
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
```

### Asset Policies

```sql
-- All authenticated users can view assets
CREATE POLICY "Authenticated users can view assets"
ON public.assets FOR SELECT
TO authenticated
USING (TRUE);

-- Only engineers and admins can modify assets
CREATE POLICY "Engineers can modify assets"
ON public.assets FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') OR
  public.has_role(auth.uid(), 'reliability_engineer')
);
```

### Alert Policies

```sql
-- All authenticated users can view alerts
CREATE POLICY "Authenticated users can view alerts"
ON public.alerts FOR SELECT
TO authenticated
USING (TRUE);

-- Users can acknowledge alerts
CREATE POLICY "Users can acknowledge alerts"
ON public.alerts FOR UPDATE
TO authenticated
USING (TRUE)
WITH CHECK (
  -- Can only update acknowledgment fields
  acknowledged IS NOT NULL
);
```

---

## Edge Functions

### `ai-chat`

AI-powered support chat.

**Endpoint:** `POST /functions/v1/ai-chat`

**Authentication:** Required (Bearer token)

**Request:**
```typescript
interface AIChatRequest {
  sessionId: string;
  message: string;
  context?: {
    assetId?: string;
    alertId?: string;
  };
}
```

**Response:**
```typescript
interface AIChatResponse {
  message: string;
  citations: Citation[];
  troubleshootingSteps?: TroubleshootingStep[];
  suggestedActions?: string[];
}
```

**Example:**
```typescript
const { data, error } = await supabase.functions.invoke('ai-chat', {
  body: {
    sessionId: 'session-123',
    message: 'What is causing high vibration on Asset-1?',
    context: { assetId: 'asset-1' }
  }
});
```

---

### `run-agent`

Execute an AI agent.

**Endpoint:** `POST /functions/v1/run-agent`

**Authentication:** Required (Bearer token)

**Request:**
```typescript
interface RunAgentRequest {
  agentId: string;
  inputs: Record<string, any>;
  requireApproval?: boolean;
}
```

**Response:**
```typescript
interface RunAgentResponse {
  executionId: string;
  status: 'running' | 'awaiting-approval' | 'completed' | 'failed';
  outputs?: Record<string, any>;
  reasoning?: string;
}
```

---

### `generate-prediction`

Generate ML predictions for assets.

**Endpoint:** `POST /functions/v1/generate-prediction`

**Authentication:** Required (Bearer token)

**Request:**
```typescript
interface GeneratePredictionRequest {
  assetId: string;
  predictionType: 'rul' | 'anomaly' | 'failure_mode';
  modelId?: string;
}
```

**Response:**
```typescript
interface GeneratePredictionResponse {
  predictionId: string;
  prediction: {
    type: string;
    value: number;
    confidence: number;
    featureImportance: Record<string, number>;
  };
}
```

---

### `send-alert-notification`

Send alert notifications via multiple channels.

**Endpoint:** `POST /functions/v1/send-alert-notification`

**Authentication:** Required (Bearer token)

**Request:**
```typescript
interface SendAlertNotificationRequest {
  alertId: string;
  channels: ('email' | 'slack' | 'teams' | 'sms')[];
  recipients?: string[];
}
```

---

### `sync-cmms`

Sync with external CMMS systems.

**Endpoint:** `POST /functions/v1/sync-cmms`

**Authentication:** Required (Bearer token)

**Request:**
```typescript
interface SyncCMMSRequest {
  system: 'SAP PM' | 'IBM Maximo' | 'ServiceNow' | 'MaintainX';
  operation: 'push' | 'pull' | 'sync';
  workOrderIds?: string[];
}
```

---

### `generate-report`

Generate and export reports.

**Endpoint:** `POST /functions/v1/generate-report`

**Authentication:** Required (Bearer token)

**Request:**
```typescript
interface GenerateReportRequest {
  reportId: string;
  format: 'pdf' | 'csv' | 'xlsx';
  dateRange?: {
    start: string;
    end: string;
  };
}
```

**Response:**
```typescript
interface GenerateReportResponse {
  downloadUrl: string;
  expiresAt: string;
}
```

---

### `process-telemetry`

Process incoming telemetry data.

**Endpoint:** `POST /functions/v1/process-telemetry`

**Authentication:** API Key or Service Role

**Request:**
```typescript
interface ProcessTelemetryRequest {
  gatewayId: string;
  readings: {
    sensorId: string;
    value: number;
    timestamp: string;
    quality?: 'good' | 'bad' | 'uncertain';
  }[];
}
```

---

### `webhook-handler`

Handle incoming webhooks from external systems.

**Endpoint:** `POST /functions/v1/webhook-handler`

**Authentication:** Webhook signature verification

---

## Real-time Subscriptions

### Alert Updates

```typescript
// Subscribe to new alerts
const alertChannel = supabase
  .channel('alerts')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'alerts',
      filter: 'severity=eq.critical'
    },
    (payload) => {
      console.log('New critical alert:', payload.new);
    }
  )
  .subscribe();
```

### Asset Status Updates

```typescript
// Subscribe to asset status changes
const assetChannel = supabase
  .channel('asset-status')
  .on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'assets',
      filter: 'status=neq.healthy'
    },
    (payload) => {
      console.log('Asset status changed:', payload.new);
    }
  )
  .subscribe();
```

### User Presence

```typescript
// Track online users
const presenceChannel = supabase.channel('online-users');

presenceChannel
  .on('presence', { event: 'sync' }, () => {
    const state = presenceChannel.presenceState();
    console.log('Online users:', Object.keys(state).length);
  })
  .on('presence', { event: 'join' }, ({ key, newPresences }) => {
    console.log('User joined:', newPresences);
  })
  .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
    console.log('User left:', leftPresences);
  })
  .subscribe(async (status) => {
    if (status === 'SUBSCRIBED') {
      await presenceChannel.track({
        user_id: user.id,
        online_at: new Date().toISOString()
      });
    }
  });
```

---

## API Contracts

### Standard Response Format

All API responses follow this format:

```typescript
interface APIResponse<T> {
  data: T | null;
  error: {
    code: string;
    message: string;
    details?: any;
  } | null;
  meta?: {
    total?: number;
    page?: number;
    pageSize?: number;
  };
}
```

### Error Codes

| Code | Description |
|------|-------------|
| `AUTH_REQUIRED` | Authentication required |
| `AUTH_INVALID` | Invalid authentication token |
| `FORBIDDEN` | Insufficient permissions |
| `NOT_FOUND` | Resource not found |
| `VALIDATION_ERROR` | Request validation failed |
| `RATE_LIMITED` | Rate limit exceeded |
| `INTERNAL_ERROR` | Internal server error |

### Pagination

```typescript
// Request
GET /rest/v1/assets?offset=0&limit=20&order=name.asc

// Response includes meta
{
  "data": [...],
  "meta": {
    "total": 150,
    "page": 1,
    "pageSize": 20
  }
}
```

### Filtering

```typescript
// Simple equality
GET /rest/v1/assets?status=eq.critical

// Multiple conditions
GET /rest/v1/assets?status=in.(warning,critical)&health_score=lt.50

// Full-text search
GET /rest/v1/knowledge_articles?search_vector=fts.bearing+replacement
```

---

## Environment Variables

### Required Secrets

| Name | Description |
|------|-------------|
| `OPENAI_API_KEY` | OpenAI API key for AI features |
| `RESEND_API_KEY` | Resend API key for email notifications |
| `SLACK_WEBHOOK_URL` | Slack webhook for notifications |
| `TEAMS_WEBHOOK_URL` | Microsoft Teams webhook |

### Optional Secrets

| Name | Description |
|------|-------------|
| `SAP_API_KEY` | SAP PM integration |
| `MAXIMO_API_KEY` | IBM Maximo integration |
| `SERVICENOW_API_KEY` | ServiceNow integration |

---

## Rate Limits

| Endpoint | Limit |
|----------|-------|
| `/functions/v1/*` | 100 requests/minute |
| `/rest/v1/*` | 1000 requests/minute |
| `/realtime/*` | 100 connections |

---

## Changelog

### v1.0.0 (Initial)
- Core database schema
- Basic CRUD operations
- Authentication setup
- Real-time subscriptions

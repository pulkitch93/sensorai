# Architecture Documentation

## Overview

The Asset Intelligence (AI) Platform is a modern, single-page application (SPA) built with React and TypeScript. This document outlines the architectural decisions, patterns, and structure of the codebase.

---

## Table of Contents

- [High-Level Architecture](#high-level-architecture)
- [Directory Structure](#directory-structure)
- [Architectural Patterns](#architectural-patterns)
- [Component Architecture](#component-architecture)
- [Data Flow](#data-flow)
- [Routing Architecture](#routing-architecture)
- [State Management](#state-management)
- [Styling Architecture](#styling-architecture)
- [Type System](#type-system)
- [Module Dependencies](#module-dependencies)

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Interface                            │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                    React Application                         ││
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ ││
│  │  │   Pages     │  │ Components  │  │   UI Components     │ ││
│  │  │  (Routes)   │  │  (Feature)  │  │   (shadcn/ui)       │ ││
│  │  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘ ││
│  │         │                │                     │            ││
│  │  ┌──────┴────────────────┴─────────────────────┴──────────┐││
│  │  │                    Hooks & Utils                        │││
│  │  │   (use-toast, use-mobile, utils, exportUtils)           │││
│  │  └─────────────────────────┬───────────────────────────────┘││
│  │                            │                                ││
│  │  ┌─────────────────────────┴───────────────────────────────┐││
│  │  │                    Mock Data Layer                       │││
│  │  │   (mockData, analyticsMockData, alertsMockData, etc.)   │││
│  │  └─────────────────────────────────────────────────────────┘││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                    Type Definitions                          ││
│  │   (TypeScript interfaces for all domain entities)           ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

---

## Directory Structure

```
src/
├── components/              # React components
│   ├── ui/                  # Reusable UI primitives (shadcn/ui)
│   ├── admin/               # Admin module components
│   ├── agents/              # AI Agents module components
│   ├── alerts/              # Alerts module components
│   ├── analytics/           # Analytics module components
│   ├── asset-detail/        # Asset Detail module components
│   ├── digital-twin/        # Digital Twin module components
│   ├── portfolio/           # Portfolio module components
│   ├── prescriptions/       # Prescriptions module components
│   ├── reports/             # Reports module components
│   ├── sensors/             # Sensors module components
│   ├── support/             # Support module components
│   └── [shared components]  # Shared components at root level
│
├── pages/                   # Route-level page components
│   ├── Home.tsx             # Marketing landing page
│   ├── Dashboard.tsx        # Plant operations dashboard
│   ├── DigitalTwin.tsx      # 3D visualization
│   ├── AssetDetail.tsx      # Single asset view
│   ├── Alerts.tsx           # Alert management
│   ├── Analytics.tsx        # Analytics lab
│   ├── Portfolio.tsx        # Executive overview
│   ├── Prescriptions.tsx    # Workflow management
│   ├── Agents.tsx           # AI agents
│   ├── Sensors.tsx          # Sensor hub
│   ├── Reports.tsx          # Report builder
│   ├── Support.tsx          # Expert support
│   ├── Admin.tsx            # Administration
│   ├── Index.tsx            # Default redirect
│   └── NotFound.tsx         # 404 page
│
├── hooks/                   # Custom React hooks
│   ├── use-toast.ts         # Toast notification hook
│   └── use-mobile.tsx       # Mobile detection hook
│
├── lib/                     # Utilities and mock data
│   ├── utils.ts             # General utilities (cn, etc.)
│   ├── exportUtils.ts       # CSV/PDF export utilities
│   ├── mockData.ts          # Core mock data
│   ├── adminMockData.ts     # Admin module mock data
│   ├── agentsMockData.ts    # Agents module mock data
│   ├── alertsMockData.ts    # Alerts module mock data
│   ├── analyticsMockData.ts # Analytics module mock data
│   ├── assetDetailMockData.ts # Asset detail mock data
│   ├── portfolioMockData.ts # Portfolio module mock data
│   ├── prescriptionsMockData.ts # Prescriptions mock data
│   ├── reportsMockData.ts   # Reports module mock data
│   ├── sensorsMockData.ts   # Sensors module mock data
│   └── supportMockData.ts   # Support module mock data
│
├── types/                   # TypeScript type definitions
│   ├── asset.ts             # Core asset types
│   ├── assetDetail.ts       # Asset detail types
│   ├── alerts.ts            # Alert types
│   ├── analytics.ts         # Analytics types
│   ├── portfolio.ts         # Portfolio types
│   ├── prescriptions.ts     # Prescription types
│   ├── agents.ts            # Agent types
│   ├── sensors.ts           # Sensor types
│   ├── reports.ts           # Report types
│   ├── support.ts           # Support types
│   └── admin.ts             # Admin types
│
├── App.tsx                  # Root application component
├── App.css                  # Application styles
├── main.tsx                 # Application entry point
└── index.css                # Global styles and CSS variables
```

---

## Architectural Patterns

### 1. Feature-Based Component Organization

Components are organized by feature/module rather than by type. Each module has its own directory containing all related components.

```
components/
├── alerts/
│   ├── AlertQueueCard.tsx      # Individual alert display
│   ├── AlertStatsBar.tsx       # Statistics summary
│   └── RuleTemplatesDialog.tsx # Alert rules management
```

**Benefits:**
- High cohesion within modules
- Easy to find related components
- Supports team ownership of features

### 2. Container/Presentational Pattern

Pages act as containers that manage state and pass data to presentational components.

```tsx
// Page (Container)
const Alerts = () => {
  const [alerts, setAlerts] = useState<EnhancedAlert[]>(mockEnhancedAlerts);
  // ... state management logic
  
  return (
    <AlertQueueCard
      alert={alert}
      onAction={handleAlertAction}
    />
  );
};

// Component (Presentational)
const AlertQueueCard = ({ alert, onAction }) => {
  return (
    <Card>
      {/* Pure rendering logic */}
    </Card>
  );
};
```

### 3. Composition over Inheritance

Components are built using composition, leveraging React's children prop and render props patterns.

```tsx
// Using shadcn's slot pattern for flexibility
<Card className="p-6 border-primary/50">
  <CardContent>
    {children}
  </CardContent>
</Card>
```

### 4. Controlled Components

Form elements and interactive components are controlled, with state lifted to parent components.

```tsx
<Select value={severityFilter} onValueChange={setSeverityFilter}>
  <SelectTrigger>
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="all">All Severities</SelectItem>
    <SelectItem value="critical">Critical</SelectItem>
  </SelectContent>
</Select>
```

---

## Component Architecture

### Component Hierarchy

```
App.tsx
├── SidebarProvider
│   ├── AppSidebar
│   │   └── SidebarMenu (Navigation links)
│   └── Routes
│       ├── Home (Marketing page - no sidebar)
│       └── [Feature Pages]
│           ├── Page Header
│           ├── Metrics Grid
│           ├── Tabs Container
│           │   └── Tab Content
│           │       └── Feature Components
│           └── Dialogs/Modals
```

### Component Categories

| Category | Location | Purpose |
|----------|----------|---------|
| **UI Primitives** | `components/ui/` | Reusable, atomic UI elements from shadcn |
| **Feature Components** | `components/[module]/` | Module-specific composite components |
| **Shared Components** | `components/` | Cross-module reusable components |
| **Page Components** | `pages/` | Route-level containers |

### Shared Components

```
components/
├── AlertCard.tsx       # Generic alert display
├── AppSidebar.tsx      # Navigation sidebar
├── DigitalTwin3D.tsx   # 3D visualization engine
├── Footer.tsx          # Page footer
├── KPICard.tsx         # Key performance indicator
├── RoleSwitch.tsx      # User role selector
└── StatusBadge.tsx     # Status indicator badge
```

---

## Data Flow

### Unidirectional Data Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Mock Data  │────▶│   Pages     │────▶│ Components  │
│   (lib/)    │     │  (State)    │     │  (Props)    │
└─────────────┘     └──────┬──────┘     └─────────────┘
                          │
                          │ Events/Callbacks
                          ▼
                   ┌─────────────┐
                   │  Handlers   │
                   │ (setState)  │
                   └─────────────┘
```

### State Management Strategy

| State Type | Solution | Example |
|------------|----------|---------|
| **Local UI State** | `useState` | Filter selections, modal open state |
| **Form State** | `useState` / React Hook Form | Input values, validation |
| **Derived State** | Computed in render | Filtered lists, sorted data |
| **Server State** | React Query (future) | API data caching |

### Event Handling Pattern

```tsx
// Parent (Page) defines handler
const handleAlertAction = (alertId: string, action: string) => {
  switch (action) {
    case 'acknowledge':
      setAlerts(prev => prev.map(a =>
        a.id === alertId 
          ? { ...a, acknowledged: true }
          : a
      ));
      toast.success("Alert acknowledged");
      break;
  }
};

// Child receives handler via props
<AlertQueueCard
  alert={alert}
  onAction={handleAlertAction}
/>
```

---

## Routing Architecture

### Route Structure

```tsx
<Routes>
  {/* Public/Marketing */}
  <Route path="/" element={<Home />} />
  
  {/* Main Application (with Sidebar) */}
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/digital-twin" element={<DigitalTwin />} />
  <Route path="/asset/:id" element={<AssetDetail />} />
  <Route path="/alerts" element={<Alerts />} />
  <Route path="/analytics" element={<Analytics />} />
  <Route path="/portfolio" element={<Portfolio />} />
  <Route path="/prescriptions" element={<Prescriptions />} />
  <Route path="/agents" element={<Agents />} />
  <Route path="/sensors" element={<Sensors />} />
  <Route path="/reports" element={<Reports />} />
  <Route path="/support" element={<Support />} />
  <Route path="/admin" element={<Admin />} />
  
  {/* Fallback */}
  <Route path="*" element={<NotFound />} />
</Routes>
```

### Route Parameters

| Route | Parameters | Usage |
|-------|------------|-------|
| `/asset/:id` | `id` - Asset identifier | View specific asset details |

### Navigation

```tsx
// Programmatic navigation
const navigate = useNavigate();
navigate('/asset/asset-1');

// Link-based navigation (in sidebar)
<NavLink to="/dashboard" />
```

---

## State Management

### Local State (useState)

Used for component-level UI state:

```tsx
const [searchQuery, setSearchQuery] = useState("");
const [selectedTab, setSelectedTab] = useState("overview");
const [isDialogOpen, setIsDialogOpen] = useState(false);
```

### Derived State

Computed from existing state without additional useState:

```tsx
// Filtering is computed on each render
const filteredAlerts = alerts.filter(a => 
  severityFilter === 'all' || a.severity === severityFilter
);

// Sorting is computed on each render
const sortedAlerts = [...filteredAlerts].sort((a, b) => 
  b.timestamp.getTime() - a.timestamp.getTime()
);
```

### Side Effects (useEffect)

Used for subscriptions, timers, and async operations:

```tsx
// Real-time updates simulation
useEffect(() => {
  const interval = setInterval(() => {
    setLastUpdate(new Date());
    // Update logic
  }, 5000);

  return () => clearInterval(interval);
}, []);
```

### Future: Server State with React Query

The architecture is prepared for React Query integration:

```tsx
// Future pattern
const { data: alerts, isLoading } = useQuery({
  queryKey: ['alerts'],
  queryFn: fetchAlerts,
});
```

---

## Styling Architecture

### Design Tokens (CSS Variables)

All colors and design decisions are centralized in CSS variables:

```css
/* index.css */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --secondary: 210 40% 96.1%;
  --muted: 210 40% 96.1%;
  --accent: 210 40% 96.1%;
  --destructive: 0 84.2% 60.2%;
  --success: 142 76% 36%;
  --warning: 38 92% 50%;
  /* ... */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... */
}
```

### Tailwind Configuration

Extended with custom tokens:

```ts
// tailwind.config.ts
{
  theme: {
    extend: {
      colors: {
        success: "hsl(var(--success))",
        warning: "hsl(var(--warning))",
        // Maps to CSS variables
      }
    }
  }
}
```

### Component Styling Patterns

```tsx
// Using semantic tokens (preferred)
<Card className="border-primary/50 bg-card">

// Status-based styling
<Badge className={cn(
  status === 'critical' && "bg-destructive/20 text-destructive",
  status === 'warning' && "bg-warning/20 text-warning",
  status === 'healthy' && "bg-success/20 text-success",
)}>
```

### Class Composition with cn()

```tsx
import { cn } from "@/lib/utils";

<div className={cn(
  "base-styles",
  condition && "conditional-styles",
  className // Allow override from props
)} />
```

---

## Type System

### Domain Entity Types

Each module has its own type definitions:

```
types/
├── asset.ts         # Asset, UserRole
├── assetDetail.ts   # ComponentHealth, WorkOrder, etc.
├── alerts.ts        # EnhancedAlert, AlertRule, etc.
├── analytics.ts     # TimeSeriesPoint, ModelCard, etc.
├── portfolio.ts     # PortfolioKPI, Site, etc.
├── prescriptions.ts # Prescription, Workflow, etc.
├── agents.ts        # AgentConfig, AgentExecution, etc.
├── sensors.ts       # Sensor, Gateway, etc.
├── reports.ts       # Report, ReportDelivery, etc.
├── support.ts       # ChatMessage, KnowledgeArticle, etc.
└── admin.ts         # UserAccount, AuditLogEntry, etc.
```

### Type Patterns

**Union Types for Status:**
```typescript
export type SensorStatus = 'online' | 'offline' | 'warning' | 'error';
export type AgentStatus = 'idle' | 'running' | 'completed' | 'failed' | 'awaiting-approval';
```

**Interface for Entities:**
```typescript
export interface Sensor {
  id: string;
  name: string;
  type: SensorType;
  status: SensorStatus;
  configuration: {
    samplingFrequency: number;
    // ...
  };
}
```

**Discriminated Unions (future pattern):**
```typescript
type AlertAction =
  | { type: 'acknowledge'; by: string }
  | { type: 'resolve'; resolution: string }
  | { type: 'escalate'; to: string };
```

---

## Module Dependencies

### Dependency Graph

```
                    ┌─────────────┐
                    │   App.tsx   │
                    └──────┬──────┘
                           │
           ┌───────────────┼───────────────┐
           ▼               ▼               ▼
    ┌────────────┐  ┌────────────┐  ┌────────────┐
    │   Pages    │  │ AppSidebar │  │  Toaster   │
    └─────┬──────┘  └────────────┘  └────────────┘
          │
    ┌─────┴─────────────────────┐
    ▼                           ▼
┌──────────────┐         ┌─────────────┐
│ Feature      │         │ UI          │
│ Components   │────────▶│ Components  │
└──────┬───────┘         └─────────────┘
       │
       ▼
┌─────────────┐    ┌─────────────┐
│ Mock Data   │    │   Types     │
│   (lib/)    │    │  (types/)   │
└─────────────┘    └─────────────┘
```

### Import Guidelines

```tsx
// UI components from shadcn
import { Card, CardContent } from "@/components/ui/card";

// Feature components
import { AlertQueueCard } from "@/components/alerts/AlertQueueCard";

// Shared components
import { StatusBadge } from "@/components/StatusBadge";

// Types
import { EnhancedAlert } from "@/types/alerts";

// Mock data
import { mockEnhancedAlerts } from "@/lib/alertsMockData";

// Utilities
import { cn } from "@/lib/utils";
```

---

## Best Practices

### 1. Component Guidelines

- Keep components focused and single-purpose
- Extract reusable logic into custom hooks
- Use TypeScript for all component props
- Prefer composition over prop drilling

### 2. State Guidelines

- Lift state only when necessary
- Derive state instead of syncing
- Use useEffect sparingly
- Clear subscriptions in cleanup

### 3. Performance Guidelines

- Avoid inline object/function creation in render
- Use React.memo for expensive renders
- Virtualize long lists (future)
- Code split routes (future)

### 4. Styling Guidelines

- Use semantic color tokens, never raw colors
- Prefer Tailwind classes over custom CSS
- Use cn() for conditional classes
- Keep dark mode in mind

---

## Future Architecture Considerations

### Backend Integration

When connecting to a real backend:

1. Replace mock data imports with API calls
2. Implement React Query for server state
3. Add authentication layer
4. Implement real-time WebSocket connections

### Performance Optimizations

1. Route-based code splitting with React.lazy()
2. Virtual scrolling for large lists
3. Image optimization and lazy loading
4. Service worker for offline support

### Testing Strategy

1. Unit tests for utility functions
2. Component tests with React Testing Library
3. Integration tests for user flows
4. E2E tests with Playwright/Cypress

---

## Conclusion

This architecture provides a solid foundation for a scalable, maintainable industrial application. The modular structure supports team collaboration, while the consistent patterns enable predictable development workflows.

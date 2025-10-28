import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { mockEnhancedAlerts, mockAlertRules, mockAlertStats } from "@/lib/alertsMockData";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertQueueCard } from "@/components/alerts/AlertQueueCard";
import { AlertStatsBar } from "@/components/alerts/AlertStatsBar";
import { RuleTemplatesDialog } from "@/components/alerts/RuleTemplatesDialog";
import { EnhancedAlert } from "@/types/alerts";
import { 
  ArrowLeft, 
  CheckCheck, 
  X, 
  RefreshCw,
  SortAsc,
  Filter
} from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Alerts = () => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<EnhancedAlert[]>(mockEnhancedAlerts);
  const [rules, setRules] = useState(mockAlertRules);
  const [stats, setStats] = useState(mockAlertStats);
  const [selectedAlerts, setSelectedAlerts] = useState<Set<string>>(new Set());
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('timestamp');
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simulate real-time alert updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
      // Simulate alert latency < 5 seconds
      const randomChance = Math.random();
      if (randomChance < 0.1) {
        toast.info("New alert received", {
          description: "Critical vibration spike detected",
          duration: 3000,
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleSelectAlert = (id: string) => {
    setSelectedAlerts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedAlerts.size === filteredAlerts.length) {
      setSelectedAlerts(new Set());
    } else {
      setSelectedAlerts(new Set(filteredAlerts.map(a => a.id)));
    }
  };

  const handleBulkAcknowledge = () => {
    setAlerts(prev => prev.map(alert =>
      selectedAlerts.has(alert.id) 
        ? { ...alert, acknowledged: true, acknowledgedBy: "Current User", acknowledgedAt: new Date() }
        : alert
    ));
    toast.success(`Acknowledged ${selectedAlerts.size} alerts`);
    setSelectedAlerts(new Set());
    
    // Update stats
    setStats(prev => ({
      ...prev,
      acknowledged: prev.acknowledged + selectedAlerts.size,
      unacknowledged: prev.unacknowledged - selectedAlerts.size,
    }));
  };

  const handleBulkResolve = () => {
    setAlerts(prev => prev.map(alert =>
      selectedAlerts.has(alert.id)
        ? { ...alert, resolved: true, resolvedAt: new Date() }
        : alert
    ));
    toast.success(`Resolved ${selectedAlerts.size} alerts`);
    setSelectedAlerts(new Set());
  };

  const handleAlertAction = (alertId: string, action: string) => {
    const alert = alerts.find(a => a.id === alertId);
    
    switch (action) {
      case 'acknowledge':
        setAlerts(prev => prev.map(a =>
          a.id === alertId 
            ? { ...a, acknowledged: true, acknowledgedBy: "Current User", acknowledgedAt: new Date() }
            : a
        ));
        toast.success("Alert acknowledged");
        setStats(prev => ({
          ...prev,
          acknowledged: prev.acknowledged + 1,
          unacknowledged: prev.unacknowledged - 1,
        }));
        break;
      
      case 'prescription':
        toast.success("Opening prescription workflow", {
          description: `Creating prescription for ${alert?.assetName}`,
        });
        break;
      
      case 'work-order':
        toast.success("Creating work order", {
          description: "Work order created and assigned to maintenance team",
        });
        break;
      
      case 'notify':
        toast.success("Team notification sent", {
          description: "Alert notification sent via Slack and email",
        });
        break;
      
      case 'escalate':
        toast.warning("Escalating to expert", {
          description: "Senior engineer will be notified immediately",
        });
        break;
      
      case 'ai-runbook':
        toast.info("AI Runbook triggered", {
          description: "AI agent analyzing issue and preparing recommendations",
        });
        break;
    }
  };

  const handleToggleRule = (ruleId: string) => {
    setRules(prev => prev.map(rule =>
      rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
    ));
    const rule = rules.find(r => r.id === ruleId);
    toast.success(`Rule "${rule?.name}" ${rule?.enabled ? 'disabled' : 'enabled'}`);
  };

  // Apply filters and sorting
  let filteredAlerts = alerts;

  if (severityFilter !== 'all') {
    filteredAlerts = filteredAlerts.filter(a => a.severity === severityFilter);
  }

  if (statusFilter === 'unacknowledged') {
    filteredAlerts = filteredAlerts.filter(a => !a.acknowledged);
  } else if (statusFilter === 'acknowledged') {
    filteredAlerts = filteredAlerts.filter(a => a.acknowledged && !a.resolved);
  } else if (statusFilter === 'resolved') {
    filteredAlerts = filteredAlerts.filter(a => a.resolved);
  }

  // Sort alerts
  filteredAlerts = [...filteredAlerts].sort((a, b) => {
    switch (sortBy) {
      case 'timestamp':
        return b.timestamp.getTime() - a.timestamp.getTime();
      case 'severity':
        const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return severityOrder[b.severity] - severityOrder[a.severity];
      case 'impact':
        const impactOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return impactOrder[b.businessImpact] - impactOrder[a.businessImpact];
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-[1800px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Active Alerts</h1>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span>{stats.unacknowledged} active alerts requiring attention</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <RefreshCw className="w-3 h-3" />
                  Updated {Math.floor((Date.now() - lastUpdate.getTime()) / 1000)}s ago
                </span>
              </div>
            </div>
          </div>
          <RuleTemplatesDialog rules={rules} onToggleRule={handleToggleRule} />
        </div>

        {/* Stats Bar */}
        <AlertStatsBar stats={stats} />

        {/* Filters and Actions */}
        <Card className="p-4 border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-muted-foreground" />
                <Select value={severityFilter} onValueChange={setSeverityFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severities</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="unacknowledged">Unacknowledged</SelectItem>
                  <SelectItem value="acknowledged">Acknowledged</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2">
                <SortAsc className="w-5 h-5 text-muted-foreground" />
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="timestamp">Newest First</SelectItem>
                    <SelectItem value="severity">Severity</SelectItem>
                    <SelectItem value="impact">Business Impact</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {selectedAlerts.size > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {selectedAlerts.size} selected
                </span>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={handleBulkAcknowledge}
                  className="gap-2"
                >
                  <CheckCheck className="w-4 h-4" />
                  Acknowledge All
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={handleBulkResolve}
                  className="gap-2"
                >
                  <X className="w-4 h-4" />
                  Resolve All
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Select All */}
        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={handleSelectAll}
          >
            {selectedAlerts.size === filteredAlerts.length ? 'Deselect All' : 'Select All'}
          </Button>
          <span className="text-sm text-muted-foreground">
            {filteredAlerts.length} alerts
          </span>
        </div>

        {/* Alerts Queue */}
        <div className="space-y-3">
          {filteredAlerts.length === 0 ? (
            <Card className="p-12 text-center border-border">
              <p className="text-muted-foreground">No alerts match the current filters</p>
            </Card>
          ) : (
            filteredAlerts.map((alert) => (
              <AlertQueueCard
                key={alert.id}
                alert={alert}
                selected={selectedAlerts.has(alert.id)}
                onSelect={handleSelectAlert}
                onAction={handleAlertAction}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Alerts;

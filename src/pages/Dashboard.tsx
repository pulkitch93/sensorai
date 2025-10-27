import { useState } from "react";
import { KPICard } from "@/components/KPICard";
import { RoleSwitch } from "@/components/RoleSwitch";
import { mockKPIs, mockAssets, mockAlerts } from "@/lib/mockData";
import { UserRole } from "@/types/asset";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  Activity, 
  AlertTriangle, 
  TrendingUp, 
  MapPin,
  Zap,
  Settings
} from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";

const Dashboard = () => {
  const [role, setRole] = useState<UserRole>('executive');
  const navigate = useNavigate();

  const criticalAssets = mockAssets.filter(a => a.status === 'critical' || a.status === 'warning');
  const activeAlerts = mockAlerts.filter(a => !a.acknowledged);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Plant Operations
            </h1>
            <p className="text-muted-foreground">
              Real-time monitoring and predictive maintenance
            </p>
          </div>
          <RoleSwitch currentRole={role} onRoleChange={setRole} />
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockKPIs.map((kpi, idx) => (
            <KPICard key={idx} kpi={kpi} />
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 border-primary/50 bg-card hover:border-primary transition-all cursor-pointer group" onClick={() => navigate('/digital-twin')}>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/20 group-hover:bg-primary/30 transition-all">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Digital Twin</h3>
                <p className="text-sm text-muted-foreground">
                  View 3D plant layout and asset status
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-warning/50 bg-card hover:border-warning transition-all cursor-pointer group" onClick={() => navigate('/alerts')}>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-warning/20 group-hover:bg-warning/30 transition-all">
                <AlertTriangle className="w-6 h-6 text-warning" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Active Alerts</h3>
                <p className="text-sm text-muted-foreground">
                  {activeAlerts.length} alerts require attention
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-success/50 bg-card hover:border-success transition-all cursor-pointer group">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-success/20 group-hover:bg-success/30 transition-all">
                <TrendingUp className="w-6 h-6 text-success" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Analytics</h3>
                <p className="text-sm text-muted-foreground">
                  View trends and performance metrics
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Assets at Risk */}
        <Card className="p-6 border-border bg-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Assets Requiring Attention
            </h2>
            <Button variant="outline" size="sm" onClick={() => navigate('/digital-twin')}>
              View All
            </Button>
          </div>
          <div className="space-y-3">
            {criticalAssets.map((asset) => (
              <div
                key={asset.id}
                className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-all cursor-pointer"
                onClick={() => navigate(`/asset/${asset.id}`)}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    asset.status === 'critical' ? 'bg-destructive/20' : 'bg-warning/20'
                  }`}>
                    {asset.status === 'critical' ? (
                      <AlertTriangle className="w-6 h-6 text-destructive" />
                    ) : (
                      <Zap className="w-6 h-6 text-warning" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{asset.name}</h3>
                    <p className="text-sm text-muted-foreground">{asset.type} • {asset.alerts} active alerts</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-foreground">{asset.healthScore}</p>
                    <p className="text-xs text-muted-foreground">Health Score</p>
                  </div>
                  <StatusBadge status={asset.status} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

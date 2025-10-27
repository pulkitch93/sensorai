import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockAlerts } from "@/lib/mockData";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCard } from "@/components/AlertCard";
import { ArrowLeft, Filter } from "lucide-react";
import { toast } from "sonner";
import { Alert } from "@/types/asset";

const Alerts = () => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [filter, setFilter] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all');

  const handleAcknowledge = (id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, acknowledged: true } : alert
    ));
    toast.success("Alert acknowledged");
  };

  const filteredAlerts = filter === 'all' 
    ? alerts 
    : alerts.filter(a => a.severity === filter);

  const activeCount = alerts.filter(a => !a.acknowledged).length;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-foreground mb-2">Alerts Dashboard</h1>
            <p className="text-muted-foreground">
              {activeCount} active alerts requiring attention
            </p>
          </div>
        </div>

        {/* Filters */}
        <Card className="p-4 border-border">
          <div className="flex items-center gap-4">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <div className="flex gap-2">
              {['all', 'critical', 'high', 'medium', 'low'].map((f) => (
                <Button
                  key={f}
                  variant={filter === f ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(f as any)}
                  className="capitalize"
                >
                  {f}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        {/* Alerts List */}
        <div className="space-y-3">
          {filteredAlerts.length === 0 ? (
            <Card className="p-12 text-center border-border">
              <p className="text-muted-foreground">No alerts match the current filter</p>
            </Card>
          ) : (
            filteredAlerts.map((alert) => (
              <AlertCard 
                key={alert.id} 
                alert={alert} 
                onAcknowledge={handleAcknowledge}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Alerts;

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { mockAssets, mockAlerts } from "@/lib/mockData";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { AlertCard } from "@/components/AlertCard";
import { 
  ArrowLeft, 
  Activity,
  Thermometer,
  Gauge,
  Calendar,
  TrendingUp
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const AssetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const asset = mockAssets.find(a => a.id === id);
  const alerts = mockAlerts.filter(a => a.assetId === id);

  // Mock time-series data
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    // Generate mock time-series data
    const data = Array.from({ length: 24 }, (_, i) => ({
      time: `${i}:00`,
      temperature: asset ? asset.temperature + (Math.random() - 0.5) * 10 : 0,
      vibration: asset ? asset.vibration + (Math.random() - 0.5) * 0.5 : 0,
    }));
    setChartData(data);
  }, [asset]);

  if (!asset) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-6">
          <p className="text-foreground">Asset not found</p>
          <Button onClick={() => navigate('/')} className="mt-4">
            Return to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/digital-twin')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold text-foreground">{asset.name}</h1>
              <StatusBadge status={asset.status} />
            </div>
            <p className="text-muted-foreground">{asset.type}</p>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6 border-border">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <Activity className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Health Score</p>
                <p className="text-3xl font-bold text-foreground">{asset.healthScore}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-border">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-warning/20">
                <Thermometer className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Temperature</p>
                <p className="text-3xl font-bold text-foreground">{asset.temperature}°C</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-border">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-destructive/20">
                <Gauge className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Vibration</p>
                <p className="text-3xl font-bold text-foreground">{asset.vibration} mm/s</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-border">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-success/20">
                <Calendar className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Alerts</p>
                <p className="text-3xl font-bold text-foreground">{asset.alerts}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Charts */}
        <Card className="p-6 border-border">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Real-Time Telemetry</h2>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="time" 
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="temperature" 
                  stroke="hsl(var(--warning))" 
                  strokeWidth={2}
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="vibration" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Alerts */}
        {alerts.length > 0 && (
          <Card className="p-6 border-border">
            <h2 className="text-xl font-semibold text-foreground mb-4">Active Alerts</h2>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
            </div>
          </Card>
        )}

        {/* Maintenance Schedule */}
        <Card className="p-6 border-border">
          <h2 className="text-xl font-semibold text-foreground mb-4">Maintenance Schedule</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-secondary/50">
              <p className="text-sm text-muted-foreground mb-1">Last Maintenance</p>
              <p className="text-lg font-semibold text-foreground">
                {asset.lastMaintenance.toLocaleDateString()}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/50">
              <p className="text-sm text-muted-foreground mb-1">Next Scheduled</p>
              <p className="text-lg font-semibold text-foreground">
                {asset.nextMaintenance.toLocaleDateString()}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AssetDetail;

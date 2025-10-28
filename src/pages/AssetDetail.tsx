import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { mockAssets, mockAlerts } from "@/lib/mockData";
import {
  mockComponentHealth,
  mockBOM,
  mockWorkOrders,
  mockOperatorNotes,
  mockFailurePatterns,
  mockRULForecast,
  mockPrescriptiveInsights,
  mockRiskFeatures,
} from "@/lib/assetDetailMockData";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/StatusBadge";
import { ComponentHealthCard } from "@/components/asset-detail/ComponentHealthCard";
import { RULChart } from "@/components/asset-detail/RULChart";
import { PrescriptiveInsightsCard } from "@/components/asset-detail/PrescriptiveInsightsCard";
import { ExplainabilityCard } from "@/components/asset-detail/ExplainabilityCard";
import { FailurePatternsCard } from "@/components/asset-detail/FailurePatternsCard";
import { AssetHistoryTabs } from "@/components/asset-detail/AssetHistoryTabs";
import {
  ArrowLeft,
  Activity,
  Thermometer,
  Gauge,
  TrendingUp,
  Zap,
  Settings,
  Network,
  RefreshCw,
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const AssetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const asset = mockAssets.find((a) => a.id === id);
  const alerts = mockAlerts.filter((a) => a.assetId === id);

  const [chartData, setChartData] = useState<any[]>([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
      // Update chart data with new values
      setChartData((prev) => {
        const newData = [...prev];
        if (newData.length > 0) {
          const latest = newData[newData.length - 1];
          newData.push({
            time: new Date().toLocaleTimeString(),
            temperature: latest.temperature + (Math.random() - 0.5) * 2,
            vibration: latest.vibration + (Math.random() - 0.5) * 0.3,
            pressure: latest.pressure + (Math.random() - 0.5) * 1,
          });
          return newData.slice(-30); // Keep last 30 points
        }
        return newData;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!asset) return;
    
    // Initial chart data
    const data = Array.from({ length: 30 }, (_, i) => ({
      time: new Date(Date.now() - (29 - i) * 3000).toLocaleTimeString(),
      temperature: asset.temperature + (Math.random() - 0.5) * 5,
      vibration: asset.vibration + (Math.random() - 0.5) * 0.4,
      pressure: asset.pressure + (Math.random() - 0.5) * 2,
    }));
    setChartData(data);
  }, [asset]);

  if (!asset) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-6">
          <p className="text-foreground">Asset not found</p>
          <Button onClick={() => navigate("/")} className="mt-4">
            Return to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-[1800px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/digital-twin")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold text-foreground">{asset.name}</h1>
                <StatusBadge status={asset.status} />
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Settings className="w-4 h-4" />
                  {asset.type}
                </span>
                <span className="flex items-center gap-1">
                  <Network className="w-4 h-4" />
                  {mockComponentHealth.length} Components
                </span>
                <span className="flex items-center gap-1">
                  <RefreshCw className="w-3 h-3" />
                  Updated {Math.floor((Date.now() - lastUpdate.getTime()) / 1000)}s ago
                </span>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="health">Health & Components</TabsTrigger>
            <TabsTrigger value="predictive">Predictive Analytics</TabsTrigger>
            <TabsTrigger value="prescriptive">Prescriptive Insights</TabsTrigger>
            <TabsTrigger value="history">History & Records</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-6 border-border">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/20">
                    <Activity className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Health Score</p>
                    <p className="text-3xl font-bold text-foreground">{asset.healthScore}</p>
                    <p className="text-xs text-success mt-1">+2% from last week</p>
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
                    <p className="text-xs text-muted-foreground mt-1">Normal: 45-65°C</p>
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
                    <p className="text-xs text-warning mt-1">Above threshold</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-border">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-accent/20">
                    <Zap className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Power Draw</p>
                    <p className="text-3xl font-bold text-foreground">125 kW</p>
                    <p className="text-xs text-muted-foreground mt-1">85% efficiency</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Real-Time Telemetry */}
            <Card className="p-6 border-border">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground">Real-Time Telemetry</h2>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span className="text-sm text-muted-foreground">Live</span>
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="time"
                      stroke="hsl(var(--muted-foreground))"
                      style={{ fontSize: "12px" }}
                    />
                    <YAxis stroke="hsl(var(--muted-foreground))" style={{ fontSize: "12px" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="temperature"
                      name="Temperature (°C)"
                      stroke="hsl(var(--warning))"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="vibration"
                      name="Vibration (mm/s)"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="pressure"
                      name="Pressure (bar)"
                      stroke="hsl(var(--accent))"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Asset Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6 border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Asset Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Asset ID</span>
                    <span className="text-foreground font-medium">{asset.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Make/Model</span>
                    <span className="text-foreground font-medium">Siemens S7-1500</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Criticality</span>
                    <span className="text-destructive font-medium">High</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Commissioning Date</span>
                    <span className="text-foreground font-medium">Jan 2020</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Operating Hours</span>
                    <span className="text-foreground font-medium">28,450 hrs</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Maintenance Schedule</h3>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-secondary/50">
                    <p className="text-sm text-muted-foreground mb-1">Last Maintenance</p>
                    <p className="text-lg font-semibold text-foreground">
                      {asset.lastMaintenance.toLocaleDateString()}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Quarterly inspection</p>
                  </div>
                  <div className="p-4 rounded-lg bg-warning/10 border border-warning/30">
                    <p className="text-sm text-muted-foreground mb-1">Next Scheduled</p>
                    <p className="text-lg font-semibold text-foreground">
                      {asset.nextMaintenance.toLocaleDateString()}
                    </p>
                    <p className="text-xs text-warning mt-1">Due in 15 days</p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Health & Components Tab */}
          <TabsContent value="health" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {mockComponentHealth.map((component) => (
                <ComponentHealthCard key={component.id} component={component} />
              ))}
            </div>

            <ExplainabilityCard features={mockRiskFeatures} />
          </TabsContent>

          {/* Predictive Analytics Tab */}
          <TabsContent value="predictive" className="space-y-6">
            <RULChart forecast={mockRULForecast} />
            <FailurePatternsCard patterns={mockFailurePatterns} />
          </TabsContent>

          {/* Prescriptive Insights Tab */}
          <TabsContent value="prescriptive" className="space-y-6">
            {mockPrescriptiveInsights.map((insight) => (
              <PrescriptiveInsightsCard key={insight.id} insight={insight} />
            ))}
          </TabsContent>

          {/* History & Records Tab */}
          <TabsContent value="history">
            <AssetHistoryTabs
              workOrders={mockWorkOrders}
              operatorNotes={mockOperatorNotes}
              bom={mockBOM}
              alerts={alerts}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AssetDetail;

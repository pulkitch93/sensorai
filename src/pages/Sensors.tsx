import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SensorCard } from "@/components/sensors/SensorCard";
import { GatewayCard } from "@/components/sensors/GatewayCard";
import { SensorSetupWizardDialog } from "@/components/sensors/SensorSetupWizard";
import { mockSensors, mockGateways, mockSensorMetrics } from "@/lib/sensorsMockData";
import { 
  Cpu,
  Plus,
  Search,
  Activity,
  AlertTriangle,
  TrendingUp,
  Wifi,
  Filter
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Sensors = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [wizardOpen, setWizardOpen] = useState(false);
  const { toast } = useToast();

  const handleConfigureSensor = (id: string) => {
    toast({
      title: "Opening Configuration",
      description: `Configuring sensor ${id}`,
    });
  };

  const handleViewData = (id: string) => {
    toast({
      title: "Viewing Data",
      description: "Live telemetry data will be displayed",
    });
  };

  const handleConfigureGateway = (id: string) => {
    toast({
      title: "Gateway Configuration",
      description: `Opening configuration for gateway ${id}`,
    });
  };

  const handleWizardComplete = (data: any) => {
    toast({
      title: "Sensor Added Successfully",
      description: "Starting telemetry simulation...",
    });
    console.log("New sensor data:", data);
  };

  const filteredSensors = mockSensors.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.location.assetName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Sensor Hub & Integrations
            </h1>
            <p className="text-muted-foreground">
              Device management, gateway configuration, and data mapping
            </p>
          </div>
          <Button size="sm" onClick={() => setWizardOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Sensor
          </Button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6 border-success/50 bg-card">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Online Sensors</p>
                <p className="text-3xl font-bold text-foreground">
                  {mockSensorMetrics.onlineSensors}
                </p>
                <p className="text-xs text-muted-foreground">
                  of {mockSensorMetrics.totalSensors} total
                </p>
              </div>
              <div className="p-3 rounded-lg bg-success/20">
                <Activity className="w-6 h-6 text-success" />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-warning/50 bg-card">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Warning/Offline</p>
                <p className="text-3xl font-bold text-foreground">
                  {mockSensorMetrics.warningSensors + mockSensorMetrics.offlineSensors}
                </p>
                <p className="text-xs text-muted-foreground">
                  Require attention
                </p>
              </div>
              <div className="p-3 rounded-lg bg-warning/20">
                <AlertTriangle className="w-6 h-6 text-warning" />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-primary/50 bg-card">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Active Gateways</p>
                <p className="text-3xl font-bold text-foreground">
                  {mockSensorMetrics.activeGateways}
                </p>
                <p className="text-xs text-muted-foreground">
                  Edge devices online
                </p>
              </div>
              <div className="p-3 rounded-lg bg-primary/20">
                <Cpu className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-accent/50 bg-card">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Avg. Latency</p>
                <p className="text-3xl font-bold text-foreground">
                  {mockSensorMetrics.averageLatency}ms
                </p>
                <p className="text-xs text-muted-foreground">
                  Data collection
                </p>
              </div>
              <div className="p-3 rounded-lg bg-accent/20">
                <TrendingUp className="w-6 h-6 text-accent" />
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="sensors" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto">
            <TabsTrigger value="sensors" className="gap-2">
              <Activity className="w-4 h-4" />
              Sensors
              <Badge variant="secondary" className="ml-1">
                {mockSensorMetrics.totalSensors}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="gateways" className="gap-2">
              <Cpu className="w-4 h-4" />
              Gateways
              <Badge variant="secondary" className="ml-1">
                {mockGateways.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="telemetry" className="gap-2">
              <Wifi className="w-4 h-4" />
              Live Data
            </TabsTrigger>
          </TabsList>

          {/* Sensors Tab */}
          <TabsContent value="sensors" className="space-y-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search sensors by name or asset..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredSensors.map((sensor) => (
                <SensorCard
                  key={sensor.id}
                  sensor={sensor}
                  onConfigure={handleConfigureSensor}
                  onViewData={handleViewData}
                />
              ))}
            </div>
          </TabsContent>

          {/* Gateways Tab */}
          <TabsContent value="gateways" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {mockGateways.map((gateway) => (
                <GatewayCard
                  key={gateway.id}
                  gateway={gateway}
                  onConfigure={handleConfigureGateway}
                />
              ))}
            </div>
          </TabsContent>

          {/* Telemetry Tab */}
          <TabsContent value="telemetry" className="space-y-4">
            <Card className="p-6 border-border bg-card">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Real-Time Telemetry Stream
              </h2>
              <p className="text-muted-foreground mb-6">
                Live sensor data streams with sub-second latency. Data is automatically synchronized
                to asset charts and digital twin visualization.
              </p>
              <div className="space-y-4">
                <Card className="p-4 border-success/30 bg-success/5">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-semibold text-foreground">Total Data Points</p>
                      <p className="text-2xl font-bold text-success">
                        {mockSensorMetrics.totalDataPoints.toLocaleString()}
                      </p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-success" />
                  </div>
                </Card>
                <div className="text-center py-8 text-muted-foreground">
                  <Activity className="w-12 h-12 mx-auto mb-4 animate-pulse" />
                  <p>Live telemetry visualization coming soon</p>
                  <p className="text-sm">Add a sensor to start streaming data</p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <SensorSetupWizardDialog
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        onComplete={handleWizardComplete}
      />
    </div>
  );
};

export default Sensors;

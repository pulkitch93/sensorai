import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Gateway } from "@/types/sensors";
import { 
  Server,
  Cpu,
  HardDrive,
  Activity,
  Wifi,
  Database,
  Settings,
  AlertTriangle
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface GatewayCardProps {
  gateway: Gateway;
  onConfigure?: (id: string) => void;
}

export const GatewayCard = ({ gateway, onConfigure }: GatewayCardProps) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "healthy":
        return { color: "bg-success/20 text-success border-success/30", label: "Healthy" };
      case "degraded":
        return { color: "bg-warning/20 text-warning border-warning/30", label: "Degraded" };
      default:
        return { color: "bg-destructive/20 text-destructive border-destructive/30", label: "Offline" };
    }
  };

  const statusConfig = getStatusConfig(gateway.status);

  const getHealthColor = (value: number) => {
    if (value >= 80) return "text-destructive";
    if (value >= 60) return "text-warning";
    return "text-success";
  };

  return (
    <Card className="p-6 hover:border-primary/50 transition-all">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              gateway.status === 'healthy' ? 'bg-primary/20' : 'bg-warning/20'
            }`}>
              <Server className={`w-6 h-6 ${
                gateway.status === 'healthy' ? 'text-primary' : 'text-warning'
              }`} />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{gateway.name}</h3>
              <p className="text-sm text-muted-foreground">{gateway.location}</p>
            </div>
          </div>
          <Badge className={statusConfig.color}>
            {statusConfig.label}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-muted-foreground text-xs">
              <Activity className="w-3 h-3" />
              <span>Protocol</span>
            </div>
            <p className="text-sm font-medium text-foreground">{gateway.protocol}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-muted-foreground text-xs">
              <Wifi className="w-3 h-3" />
              <span>Sensors</span>
            </div>
            <p className="text-sm font-medium text-foreground">{gateway.connectedSensors}</p>
          </div>
        </div>

        <div className="space-y-3 pt-2 border-t border-border">
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground flex items-center gap-1">
                <Cpu className="w-3 h-3" />
                CPU Usage
              </span>
              <span className={`font-medium ${getHealthColor(gateway.health.cpuUsage)}`}>
                {gateway.health.cpuUsage}%
              </span>
            </div>
            <Progress value={gateway.health.cpuUsage} className="h-1" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground flex items-center gap-1">
                <HardDrive className="w-3 h-3" />
                Memory Usage
              </span>
              <span className={`font-medium ${getHealthColor(gateway.health.memoryUsage)}`}>
                {gateway.health.memoryUsage}%
              </span>
            </div>
            <Progress value={gateway.health.memoryUsage} className="h-1" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground flex items-center gap-1">
                <Database className="w-3 h-3" />
                Buffer Usage
              </span>
              <span className={`font-medium ${getHealthColor(gateway.health.bufferUsage)}`}>
                {gateway.health.bufferUsage}%
              </span>
            </div>
            <Progress value={gateway.health.bufferUsage} className="h-1" />
          </div>
        </div>

        {gateway.health.bufferUsage > 50 && (
          <div className="flex items-center gap-2 p-2 rounded bg-warning/10 border border-warning/30">
            <AlertTriangle className="w-4 h-4 text-warning" />
            <p className="text-xs text-warning">
              {gateway.health.bufferedMessages} messages buffered
            </p>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="text-xs text-muted-foreground">
            <p>Uptime: {Math.floor(gateway.health.uptime / 24)}d {gateway.health.uptime % 24}h</p>
            <p>Last seen: {formatDistanceToNow(gateway.lastSeen, { addSuffix: true })}</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => onConfigure?.(gateway.id)}>
            <Settings className="w-4 h-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>
    </Card>
  );
};

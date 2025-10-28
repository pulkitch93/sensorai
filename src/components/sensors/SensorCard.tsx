import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sensor } from "@/types/sensors";
import { 
  Activity, 
  MapPin, 
  Wifi, 
  Battery, 
  Clock, 
  Settings,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface SensorCardProps {
  sensor: Sensor;
  onConfigure?: (id: string) => void;
  onViewData?: (id: string) => void;
}

export const SensorCard = ({ sensor, onConfigure, onViewData }: SensorCardProps) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "online":
        return { color: "bg-success/20 text-success border-success/30", icon: Activity };
      case "warning":
        return { color: "bg-warning/20 text-warning border-warning/30", icon: AlertCircle };
      case "offline":
        return { color: "bg-destructive/20 text-destructive border-destructive/30", icon: AlertCircle };
      default:
        return { color: "bg-secondary text-secondary-foreground", icon: Activity };
    }
  };

  const statusConfig = getStatusConfig(sensor.status);
  const StatusIcon = statusConfig.icon;

  const getSignalColor = (strength: number) => {
    if (strength >= 80) return "text-success";
    if (strength >= 50) return "text-warning";
    return "text-destructive";
  };

  const getBatteryColor = (level?: number) => {
    if (!level) return "text-muted-foreground";
    if (level >= 50) return "text-success";
    if (level >= 20) return "text-warning";
    return "text-destructive";
  };

  return (
    <Card className="p-6 hover:border-primary/50 transition-all">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground">{sensor.name}</h3>
              <Badge variant="outline" className="text-xs">
                {sensor.type}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{sensor.location.assetName}</span>
              {sensor.location.component && (
                <>
                  <span>•</span>
                  <span>{sensor.location.component}</span>
                </>
              )}
            </div>
          </div>
          <Badge className={statusConfig.color}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {sensor.status}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-muted-foreground text-xs">
              <Activity className="w-3 h-3" />
              <span>Sampling</span>
            </div>
            <p className="text-sm font-medium text-foreground">
              {sensor.configuration.samplingFrequency} Hz
            </p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-muted-foreground text-xs">
              <TrendingUp className="w-3 h-3" />
              <span>Tag</span>
            </div>
            <p className="text-sm font-medium text-foreground">
              {sensor.dataMapping.tagName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 pt-2 border-t border-border">
          <div className="flex items-center gap-2">
            <Wifi className={`w-4 h-4 ${getSignalColor(sensor.connectivity.signalStrength)}`} />
            <span className="text-xs text-muted-foreground">
              {sensor.connectivity.signalStrength}%
            </span>
          </div>
          {sensor.connectivity.batteryLevel !== undefined && (
            <div className="flex items-center gap-2">
              <Battery className={`w-4 h-4 ${getBatteryColor(sensor.connectivity.batteryLevel)}`} />
              <span className="text-xs text-muted-foreground">
                {sensor.connectivity.batteryLevel}%
              </span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(sensor.connectivity.lastSeen, { addSuffix: true })}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="text-xs text-muted-foreground">
            <span>{sensor.connectivity.protocol}</span>
            <span className="mx-2">•</span>
            <span>{sensor.connectivity.firmwareVersion}</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onConfigure?.(sensor.id)}>
              <Settings className="w-4 h-4" />
            </Button>
            <Button size="sm" onClick={() => onViewData?.(sensor.id)}>
              View Data
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

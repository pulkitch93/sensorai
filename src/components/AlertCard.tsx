import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert } from "@/types/asset";
import { AlertTriangle, Clock, CheckCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface AlertCardProps {
  alert: Alert;
  onAcknowledge?: (id: string) => void;
}

export const AlertCard = ({ alert, onAcknowledge }: AlertCardProps) => {
  const severityColors = {
    low: "text-muted-foreground border-l-muted",
    medium: "text-warning border-l-warning",
    high: "text-warning border-l-warning",
    critical: "text-destructive border-l-destructive",
  };

  return (
    <Card className={`p-4 border-l-4 ${severityColors[alert.severity]} ${alert.acknowledged ? 'opacity-60' : ''}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-3 flex-1">
          <AlertTriangle className={`w-5 h-5 mt-0.5 ${severityColors[alert.severity]}`} />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-foreground">{alert.title}</h4>
              <span className="text-xs px-2 py-0.5 rounded bg-secondary text-secondary-foreground uppercase">
                {alert.severity}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDistanceToNow(alert.timestamp, { addSuffix: true })}
              </span>
              <span className="font-medium">{alert.assetName}</span>
            </div>
          </div>
        </div>
        {!alert.acknowledged && onAcknowledge && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onAcknowledge(alert.id)}
            className="gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            Acknowledge
          </Button>
        )}
      </div>
    </Card>
  );
};

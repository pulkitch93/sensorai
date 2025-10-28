import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CMMSAdapter } from "@/types/prescriptions";
import { CheckCircle2, XCircle, AlertCircle, RefreshCw } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface CMMSIntegrationCardProps {
  adapter: CMMSAdapter;
  onConnect?: (system: string) => void;
  onSync?: (system: string) => void;
}

export const CMMSIntegrationCard = ({ adapter, onConnect, onSync }: CMMSIntegrationCardProps) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "active":
        return { color: "bg-success/20 text-success border-success/30", icon: CheckCircle2, label: "Active" };
      case "error":
        return { color: "bg-destructive/20 text-destructive border-destructive/30", icon: AlertCircle, label: "Error" };
      default:
        return { color: "bg-secondary text-secondary-foreground", icon: XCircle, label: "Disconnected" };
    }
  };

  const statusConfig = getStatusConfig(adapter.status);
  const StatusIcon = statusConfig.icon;

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              adapter.connected ? 'bg-primary/20' : 'bg-secondary'
            }`}>
              <StatusIcon className={`w-6 h-6 ${
                adapter.connected ? 'text-primary' : 'text-muted-foreground'
              }`} />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{adapter.system}</h3>
              <Badge className={statusConfig.color} variant="outline">
                {statusConfig.label}
              </Badge>
            </div>
          </div>
        </div>

        {adapter.connected && (
          <div className="space-y-2 pt-2 border-t border-border">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Work Orders Synced</span>
              <span className="font-semibold text-foreground">{adapter.workOrdersSynced}</span>
            </div>
            {adapter.lastSync && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Last Sync</span>
                <span className="font-medium text-foreground">
                  {formatDistanceToNow(adapter.lastSync, { addSuffix: true })}
                </span>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-2">
          {adapter.connected ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSync?.(adapter.system)}
              className="w-full gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Sync Now
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={() => onConnect?.(adapter.system)}
              className="w-full"
            >
              Connect
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

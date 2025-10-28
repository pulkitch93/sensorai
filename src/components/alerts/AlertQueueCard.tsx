import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { EnhancedAlert } from "@/types/alerts";
import { 
  AlertTriangle, 
  Clock, 
  DollarSign, 
  Shield, 
  CheckCircle2, 
  Users,
  Wrench,
  FileText,
  Bot
} from "lucide-react";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AlertQueueCardProps {
  alert: EnhancedAlert;
  selected: boolean;
  onSelect: (id: string) => void;
  onAction: (alertId: string, action: string) => void;
}

export const AlertQueueCard = ({ alert, selected, onSelect, onAction }: AlertQueueCardProps) => {
  const severityColors = {
    low: "bg-muted text-muted-foreground border-border",
    medium: "bg-primary/20 text-primary border-primary/40",
    high: "bg-warning/20 text-warning border-warning/40",
    critical: "bg-destructive/20 text-destructive border-destructive/40",
  };

  const businessImpactColors = {
    low: "text-muted-foreground",
    medium: "text-primary",
    high: "text-warning",
    critical: "text-destructive",
  };

  const getTimeSince = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <Card className={`p-4 border-l-4 transition-all ${
      alert.severity === 'critical' 
        ? 'border-l-destructive' 
        : alert.severity === 'high'
        ? 'border-l-warning'
        : 'border-l-border'
    } ${alert.acknowledged ? 'bg-muted/30' : 'bg-card'} ${selected ? 'ring-2 ring-primary' : ''}`}>
      <div className="flex items-start gap-4">
        <Checkbox 
          checked={selected}
          onCheckedChange={() => onSelect(alert.id)}
          className="mt-1"
        />

        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded ${
                alert.severity === 'critical' 
                  ? 'bg-destructive/20' 
                  : alert.severity === 'high'
                  ? 'bg-warning/20'
                  : 'bg-primary/20'
              }`}>
                <AlertTriangle className={`w-5 h-5 ${
                  alert.severity === 'critical' 
                    ? 'text-destructive' 
                    : alert.severity === 'high'
                    ? 'text-warning'
                    : 'text-primary'
                }`} />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-foreground">{alert.title}</h4>
                  <Badge className={severityColors[alert.severity]} variant="outline">
                    {alert.severity.toUpperCase()}
                  </Badge>
                  {alert.safetyRisk && (
                    <Badge variant="outline" className="bg-destructive/20 text-destructive border-destructive/40">
                      <Shield className="w-3 h-3 mr-1" />
                      Safety Risk
                    </Badge>
                  )}
                  {alert.autoRecovery && (
                    <Badge variant="outline" className="bg-success/20 text-success border-success/40">
                      Auto-Recovery
                    </Badge>
                  )}
                </div>

                <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{alert.assetName}</span>
                  <span>•</span>
                  <span>{alert.ruleName}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {getTimeSince(alert.timestamp)}
                  </span>
                  {alert.duplicateCount > 0 && (
                    <>
                      <span>•</span>
                      <span className="text-warning">{alert.duplicateCount + 1} occurrences</span>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-3 mt-2">
                  {alert.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-right space-y-1">
              {alert.acknowledged ? (
                <div className="flex items-center gap-1 text-xs text-success">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Acknowledged</span>
                </div>
              ) : (
                <Badge variant="outline" className="bg-warning/20 text-warning border-warning/40">
                  Needs Attention
                </Badge>
              )}
              {alert.resolved && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span>Resolved {format(alert.resolvedAt!, 'HH:mm')}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">Impact:</span>
                <span className={`font-medium ${businessImpactColors[alert.businessImpact]}`}>
                  {alert.businessImpact.toUpperCase()}
                </span>
              </div>
              {alert.estimatedDowntime && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{alert.estimatedDowntime}h downtime</span>
                </div>
              )}
              {alert.estimatedCost && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <DollarSign className="w-4 h-4" />
                  <span>${alert.estimatedCost.toLocaleString()}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {!alert.acknowledged && (
                <Button 
                  size="sm" 
                  onClick={() => onAction(alert.id, 'acknowledge')}
                >
                  Acknowledge
                </Button>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="outline">
                    Actions
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-popover">
                  <DropdownMenuItem onClick={() => onAction(alert.id, 'prescription')}>
                    <FileText className="w-4 h-4 mr-2" />
                    Open Prescription
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onAction(alert.id, 'work-order')}>
                    <Wrench className="w-4 h-4 mr-2" />
                    Create Work Order
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onAction(alert.id, 'notify')}>
                    <Users className="w-4 h-4 mr-2" />
                    Notify Teams
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onAction(alert.id, 'escalate')}>
                    <Shield className="w-4 h-4 mr-2" />
                    Escalate to Expert
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onAction(alert.id, 'ai-runbook')}>
                    <Bot className="w-4 h-4 mr-2" />
                    Trigger AI Runbook
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

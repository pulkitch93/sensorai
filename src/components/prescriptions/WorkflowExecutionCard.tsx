import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { WorkflowExecution } from "@/types/prescriptions";
import { Clock, User, Package, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface WorkflowExecutionCardProps {
  workflow: WorkflowExecution;
  onContinue?: (id: string) => void;
  onView?: (id: string) => void;
}

export const WorkflowExecutionCard = ({ workflow, onContinue, onView }: WorkflowExecutionCardProps) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "completed":
        return { color: "bg-success/20 text-success border-success/30", icon: CheckCircle2 };
      case "in-progress":
        return { color: "bg-primary/20 text-primary border-primary/30", icon: Loader2 };
      case "failed":
        return { color: "bg-destructive/20 text-destructive border-destructive/30", icon: XCircle };
      default:
        return { color: "bg-secondary text-secondary-foreground", icon: Clock };
    }
  };

  const statusConfig = getStatusConfig(workflow.status);
  const StatusIcon = statusConfig.icon;
  const progress = (workflow.currentStep / workflow.totalSteps) * 100;

  return (
    <Card className="p-6 hover:border-primary/50 transition-all">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground">{workflow.prescriptionTitle}</h3>
              {workflow.syncedToCMMS && (
                <Badge variant="outline" className="text-xs">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  CMMS
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Package className="w-4 h-4" />
              <span>{workflow.assetName}</span>
            </div>
          </div>
          <Badge className={statusConfig.color}>
            <StatusIcon className={`w-3 h-3 mr-1 ${workflow.status === 'in-progress' ? 'animate-spin' : ''}`} />
            {workflow.status}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium text-foreground">
              {workflow.currentStep} / {workflow.totalSteps} steps
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-muted-foreground text-xs">
              <User className="w-3 h-3" />
              <span>Technician</span>
            </div>
            <p className="text-sm font-medium text-foreground">{workflow.executedBy}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-muted-foreground text-xs">
              <Clock className="w-3 h-3" />
              <span>Started</span>
            </div>
            <p className="text-sm font-medium text-foreground">
              {formatDistanceToNow(workflow.startedAt, { addSuffix: true })}
            </p>
          </div>
        </div>

        {workflow.cmmsWorkOrderId && (
          <div className="text-xs text-muted-foreground pt-2 border-t border-border">
            Work Order: {workflow.cmmsWorkOrderId}
          </div>
        )}

        {workflow.status === "in-progress" && onContinue && (
          <Button size="sm" onClick={() => onContinue(workflow.id)} className="w-full">
            Continue Workflow
          </Button>
        )}

        {workflow.status === "completed" && onView && (
          <Button variant="outline" size="sm" onClick={() => onView(workflow.id)} className="w-full">
            View Details & Feedback
          </Button>
        )}
      </div>
    </Card>
  );
};

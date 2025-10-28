import { Card } from "@/components/ui/card";
import { ComponentHealth } from "@/types/assetDetail";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface ComponentHealthCardProps {
  component: ComponentHealth;
}

export const ComponentHealthCard = ({ component }: ComponentHealthCardProps) => {
  const statusColors = {
    healthy: "bg-success/20 text-success border-success/40",
    warning: "bg-warning/20 text-warning border-warning/40",
    critical: "bg-destructive/20 text-destructive border-destructive/40",
  };

  return (
    <Card className="p-4 border-border hover:border-primary/50 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-foreground">{component.name}</h4>
          <p className="text-xs text-muted-foreground">{component.type}</p>
        </div>
        <Badge className={statusColors[component.status]} variant="outline">
          {component.status}
        </Badge>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">Health Score</span>
            <span className="font-semibold text-foreground">{component.healthScore}%</span>
          </div>
          <Progress value={component.healthScore} className="h-2" />
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">Confidence</span>
            <span className="font-semibold text-foreground">{component.confidence}%</span>
          </div>
          <Progress value={component.confidence} className="h-1.5" />
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
          <div>
            <p className="text-xs text-muted-foreground">Last Inspection</p>
            <p className="text-xs font-medium text-foreground">
              {format(component.lastInspection, "MMM dd, yyyy")}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Next Due</p>
            <p className="text-xs font-medium text-foreground">
              {format(component.nextInspection, "MMM dd, yyyy")}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PrescriptiveInsight } from "@/types/assetDetail";
import { Wrench, TrendingUp, Clock, Package, Shield, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface PrescriptiveInsightsCardProps {
  insight: PrescriptiveInsight;
}

export const PrescriptiveInsightsCard = ({ insight }: PrescriptiveInsightsCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const priorityColors = {
    low: "bg-muted text-muted-foreground border-border",
    medium: "bg-primary/20 text-primary border-primary/40",
    high: "bg-warning/20 text-warning border-warning/40",
    critical: "bg-destructive/20 text-destructive border-destructive/40",
  };

  return (
    <Card className="p-6 border-border">
      <div className="flex items-start justify-between mb-4">
        <Badge className={priorityColors[insight.priority]} variant="outline">
          {insight.priority.toUpperCase()} PRIORITY
        </Badge>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Potential Savings</p>
          <p className="text-xl font-bold text-success">${insight.estimatedSavings.toLocaleString()}</p>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-semibold text-muted-foreground mb-2">Root Cause Analysis</h4>
        <p className="text-foreground">{insight.rootCause}</p>
        <p className="text-sm text-muted-foreground mt-1">Confidence: {insight.confidence}%</p>
      </div>

      <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg mb-4">
        <p className="text-sm font-semibold text-destructive mb-1">Risk if Ignored:</p>
        <p className="text-sm text-foreground">{insight.riskIfIgnored}</p>
      </div>

      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full mb-4">
            <Wrench className="w-4 h-4 mr-2" />
            {isOpen ? "Hide" : "View"} Recommended Actions ({insight.recommendedActions.length})
            {isOpen ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent className="space-y-4">
          {insight.recommendedActions.map((action, idx) => (
            <div key={idx} className="p-4 bg-card border border-border rounded-lg space-y-3">
              <h5 className="font-semibold text-foreground flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm">
                  {idx + 1}
                </span>
                {action.action}
              </h5>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-start gap-2">
                  <TrendingUp className="w-4 h-4 text-success mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">Impact</p>
                    <p className="text-muted-foreground">{action.impact}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Wrench className="w-4 h-4 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">Effort</p>
                    <p className="text-muted-foreground">{action.effort}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-warning mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">Downtime</p>
                    <p className="text-muted-foreground">{action.estimatedDowntime}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Package className="w-4 h-4 text-accent mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">Required Parts</p>
                    <p className="text-muted-foreground">{action.requiredParts.join(", ")}</p>
                  </div>
                </div>
              </div>

              {action.safetyNotes.length > 0 && (
                <div className="flex items-start gap-2 p-3 bg-warning/10 border border-warning/30 rounded">
                  <Shield className="w-4 h-4 text-warning mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground text-sm mb-1">Safety Notes</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {action.safetyNotes.map((note, i) => (
                        <li key={i}>• {note}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              <Button className="w-full mt-2">Create Work Order</Button>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

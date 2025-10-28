import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FailurePattern } from "@/types/assetDetail";
import { AlertCircle } from "lucide-react";
import { format } from "date-fns";

interface FailurePatternsCardProps {
  patterns: FailurePattern[];
}

export const FailurePatternsCard = ({ patterns }: FailurePatternsCardProps) => {
  return (
    <Card className="p-6 border-border">
      <div className="flex items-center gap-2 mb-4">
        <AlertCircle className="w-5 h-5 text-warning" />
        <h3 className="text-lg font-semibold text-foreground">
          Detected Failure Patterns
        </h3>
      </div>

      <div className="space-y-4">
        {patterns.map((pattern) => (
          <div key={pattern.id} className="p-4 bg-card border border-border rounded-lg">
            <div className="flex items-start justify-between mb-3">
              <h4 className="font-semibold text-foreground">{pattern.name}</h4>
              <Badge variant="outline" className="bg-warning/20 text-warning border-warning/40">
                {pattern.matchConfidence}% Match
              </Badge>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Symptoms</p>
                <ul className="text-sm text-foreground space-y-1">
                  {pattern.symptoms.map((symptom, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-warning mt-1">•</span>
                      <span>{symptom}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Likely Root Causes</p>
                <ul className="text-sm text-foreground space-y-1">
                  {pattern.rootCauses.map((cause, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-destructive mt-1">•</span>
                      <span>{cause}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-border flex justify-between text-xs text-muted-foreground">
                <span>Historical occurrences: {pattern.historicalOccurrences}</span>
                {pattern.lastOccurrence && (
                  <span>Last seen: {format(pattern.lastOccurrence, "MMM dd, yyyy")}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

import { Card } from "@/components/ui/card";
import { RiskFeature } from "@/types/assetDetail";
import { Progress } from "@/components/ui/progress";
import { TrendingDown, TrendingUp } from "lucide-react";

interface ExplainabilityCardProps {
  features: RiskFeature[];
}

export const ExplainabilityCard = ({ features }: ExplainabilityCardProps) => {
  return (
    <Card className="p-6 border-border">
      <h3 className="text-lg font-semibold text-foreground mb-2">
        Risk Factors Explainability
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        Top features contributing to current health assessment
      </p>

      <div className="space-y-4">
        {features.map((feature, idx) => (
          <div key={idx} className="space-y-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                {feature.contribution === "negative" ? (
                  <TrendingDown className="w-4 h-4 text-destructive" />
                ) : (
                  <TrendingUp className="w-4 h-4 text-success" />
                )}
                <div>
                  <p className="text-sm font-medium text-foreground">{feature.feature}</p>
                  <p className="text-xs text-muted-foreground">
                    Current: {typeof feature.currentValue === 'number' && feature.currentValue % 1 !== 0 
                      ? feature.currentValue.toFixed(1) 
                      : feature.currentValue} | Normal: {feature.normalRange}
                  </p>
                </div>
              </div>
              <span className="text-sm font-semibold text-foreground">
                {(feature.importance * 100).toFixed(0)}%
              </span>
            </div>
            <Progress 
              value={feature.importance * 100} 
              className="h-2"
            />
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-muted/50 rounded-lg">
        <p className="text-xs text-muted-foreground">
          Model accuracy: 94% | Last updated: 2 hours ago
        </p>
      </div>
    </Card>
  );
};

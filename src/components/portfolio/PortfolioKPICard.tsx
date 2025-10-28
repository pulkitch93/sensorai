import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { PortfolioKPI } from "@/types/portfolio";

interface PortfolioKPICardProps {
  kpi: PortfolioKPI;
}

export const PortfolioKPICard = ({ kpi }: PortfolioKPICardProps) => {
  const TrendIcon = kpi.trend === 'up' ? TrendingUp : kpi.trend === 'down' ? TrendingDown : Minus;
  const trendColor = kpi.trend === 'up' ? 'text-success' : kpi.trend === 'down' ? 'text-destructive' : 'text-muted-foreground';
  
  return (
    <Card className="p-6 border-border bg-card hover:border-primary/50 transition-all">
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-1">{kpi.label}</p>
            <p className="text-3xl font-bold text-foreground">{kpi.value}</p>
          </div>
          <div className={`flex items-center gap-1 text-sm font-medium ${trendColor}`}>
            <TrendIcon className="w-4 h-4" />
            <span>{Math.abs(kpi.change)}%</span>
          </div>
        </div>
        {kpi.target && (
          <div className="pt-2 border-t border-border">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Target</span>
              <span className="text-foreground font-medium">{kpi.target}</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { ROIMetric } from "@/types/portfolio";

interface ROICardProps {
  metric: ROIMetric;
}

export const ROICard = ({ metric }: ROICardProps) => {
  const TrendIcon = metric.trend === 'up' ? TrendingUp : TrendingDown;
  const trendColor = metric.trend === 'up' ? 'text-success' : 'text-destructive';
  
  const formatValue = (value: number, unit: string) => {
    if (unit === 'USD') {
      return `$${(value / 1000000).toFixed(2)}M`;
    } else if (unit === 'units') {
      return `${(value / 1000).toFixed(0)}K`;
    } else if (unit === 'hours') {
      return `${value.toLocaleString()}`;
    } else if (unit === 'months') {
      return value.toFixed(1);
    }
    return value.toString();
  };

  return (
    <Card className="p-6 border-border bg-card hover:border-primary/50 transition-all">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{metric.label}</p>
          <p className="text-3xl font-bold text-foreground">
            {formatValue(metric.value, metric.unit)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">{metric.unit}</p>
        </div>
        <div className={`flex items-center gap-1 ${trendColor}`}>
          <TrendIcon className="w-5 h-5" />
        </div>
      </div>
    </Card>
  );
};

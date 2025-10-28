import { Card } from "@/components/ui/card";
import { AlertStats } from "@/types/alerts";
import { AlertTriangle, CheckCircle2, Clock, TrendingDown } from "lucide-react";

interface AlertStatsBarProps {
  stats: AlertStats;
}

export const AlertStatsBar = ({ stats }: AlertStatsBarProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="p-4 border-border">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-destructive/20">
            <AlertTriangle className="w-5 h-5 text-destructive" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Active Alerts</p>
            <p className="text-2xl font-bold text-foreground">{stats.unacknowledged}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.critical} critical, {stats.high} high
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-4 border-border">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-success/20">
            <CheckCircle2 className="w-5 h-5 text-success" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Acknowledged</p>
            <p className="text-2xl font-bold text-foreground">{stats.acknowledged}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {((stats.acknowledged / stats.total) * 100).toFixed(0)}% response rate
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-4 border-border">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/20">
            <Clock className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Avg Response</p>
            <p className="text-2xl font-bold text-foreground">{stats.avgResponseTime}m</p>
            <p className="text-xs text-success mt-1 flex items-center gap-1">
              <TrendingDown className="w-3 h-3" />
              18% faster
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-4 border-border">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-accent/20">
            <Clock className="w-5 h-5 text-accent" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Avg Resolution</p>
            <p className="text-2xl font-bold text-foreground">{Math.floor(stats.avgResolutionTime / 60)}h</p>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.avgResolutionTime % 60}m
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

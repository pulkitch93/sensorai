import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExecutiveBrief } from "@/types/reports";
import { 
  TrendingUp,
  Shield,
  Clock,
  Zap,
  AlertTriangle,
  Lightbulb,
  Download
} from "lucide-react";
import { format } from "date-fns";

interface ExecutiveBriefCardProps {
  brief: ExecutiveBrief;
  onExport?: () => void;
}

export const ExecutiveBriefCard = ({ brief, onExport }: ExecutiveBriefCardProps) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 border-primary/50 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Executive Brief</h2>
            <p className="text-muted-foreground">
              Period: {format(brief.period.startDate, 'MMM d')} - {format(brief.period.endDate, 'MMM d, yyyy')}
            </p>
          </div>
          <Button onClick={onExport}>
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>

        {/* Key Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-success">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm font-medium">Savings Achieved</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              ${(brief.highlights.savingsAchieved / 1000).toFixed(1)}K
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary">
              <Shield className="w-5 h-5" />
              <span className="text-sm font-medium">Risks Mitigated</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {brief.highlights.risksMitigated}
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-accent">
              <Clock className="w-5 h-5" />
              <span className="text-sm font-medium">Downtime Prevented</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {brief.highlights.downtimePrevented}h
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-chart-2">
              <Zap className="w-5 h-5" />
              <span className="text-sm font-medium">Efficiency Gain</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {brief.highlights.efficiencyGain}%
            </p>
          </div>
        </div>
      </Card>

      {/* Top Alerts */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-warning" />
          <h3 className="text-lg font-semibold text-foreground">Critical Alerts</h3>
        </div>
        <div className="space-y-3">
          {brief.topAlerts.map((alert) => (
            <div key={alert.id} className="p-4 rounded-lg border border-border bg-secondary/30">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-foreground">{alert.title}</h4>
                    <Badge variant={alert.severity === 'high' ? 'destructive' : 'outline'}>
                      {alert.severity}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{alert.impact}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recommendations */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-accent" />
          <h3 className="text-lg font-semibold text-foreground">Strategic Recommendations</h3>
        </div>
        <div className="space-y-3">
          {brief.recommendations.map((rec) => (
            <div key={rec.id} className="p-4 rounded-lg border border-border bg-secondary/30">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-foreground">{rec.title}</h4>
                    <Badge variant="outline" className="capitalize">
                      {rec.priority} priority
                    </Badge>
                  </div>
                  <p className="text-sm text-success font-semibold">
                    Est. savings: ${(rec.estimatedSavings / 1000).toFixed(1)}K annually
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

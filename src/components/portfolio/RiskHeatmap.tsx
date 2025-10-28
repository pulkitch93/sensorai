import { Card } from "@/components/ui/card";
import { RiskHeatmapData } from "@/types/portfolio";

interface RiskHeatmapProps {
  data: RiskHeatmapData[];
}

export const RiskHeatmap = ({ data }: RiskHeatmapProps) => {
  const getRiskColor = (score: number) => {
    if (score >= 70) return 'bg-destructive/80 border-destructive';
    if (score >= 40) return 'bg-warning/80 border-warning';
    return 'bg-success/80 border-success';
  };

  const getRiskLabel = (score: number) => {
    if (score >= 70) return 'Critical Risk';
    if (score >= 40) return 'Elevated Risk';
    return 'Low Risk';
  };

  return (
    <Card className="p-6 border-border bg-card">
      <h3 className="text-xl font-semibold text-foreground mb-4">Risk Heatmap by Site</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((site) => (
          <div
            key={site.siteId}
            className={`p-4 rounded-lg border-2 transition-all hover:scale-105 cursor-pointer ${getRiskColor(site.riskScore)}`}
          >
            <div className="text-white">
              <h4 className="font-semibold text-lg mb-1">{site.siteName}</h4>
              <p className="text-sm opacity-90 mb-3">{site.region}</p>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-3xl font-bold">{site.riskScore}</p>
                  <p className="text-xs opacity-90">{getRiskLabel(site.riskScore)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm">{site.criticalAssets} critical assets</p>
                  <p className="text-sm">{site.alerts} active alerts</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

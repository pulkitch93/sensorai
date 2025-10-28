import { Card } from "@/components/ui/card";
import { RULForecast } from "@/types/assetDetail";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AlertTriangle } from "lucide-react";

interface RULChartProps {
  forecast: RULForecast;
}

export const RULChart = ({ forecast }: RULChartProps) => {
  return (
    <Card className="p-6 border-border">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">
            Remaining Useful Life (RUL)
          </h3>
          <p className="text-sm text-muted-foreground">
            Predicted time to failure with confidence intervals
          </p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-foreground">{forecast.daysRemaining}</p>
          <p className="text-sm text-muted-foreground">days remaining</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4 p-3 bg-warning/10 border border-warning/40 rounded-lg">
        <AlertTriangle className="w-4 h-4 text-warning" />
        <div className="flex-1">
          <p className="text-sm text-foreground">
            Confidence: {forecast.confidence}% 
            <span className="text-muted-foreground ml-2">
              (Range: {forecast.confidenceBands.lower}-{forecast.confidenceBands.upper} days)
            </span>
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={forecast.failureProbability}>
          <defs>
            <linearGradient id="probabilityGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="day"
            stroke="hsl(var(--muted-foreground))"
            label={{ value: "Days from Now", position: "insideBottom", offset: -5 }}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            label={{ value: "Failure Probability (%)", angle: -90, position: "insideLeft" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
            labelStyle={{ color: "hsl(var(--foreground))" }}
          />
          <Area
            type="monotone"
            dataKey="probability"
            stroke="hsl(var(--destructive))"
            strokeWidth={2}
            fill="url(#probabilityGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
};

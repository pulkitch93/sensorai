import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BenchmarkData } from "@/types/analytics";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface BenchmarkingViewProps {
  benchmarks: BenchmarkData[];
}

export const BenchmarkingView = ({ benchmarks }: BenchmarkingViewProps) => {
  return (
    <Card className="p-6 border-border">
      <h3 className="text-lg font-semibold text-foreground mb-4">Asset Benchmarking</h3>

      <div className="space-y-6">
        {benchmarks.map((benchmark, idx) => {
          const isAboveMedian = benchmark.value > benchmark.comparison.median;
          const percentileColor = 
            benchmark.percentile >= 75 ? "text-success" :
            benchmark.percentile >= 50 ? "text-primary" :
            benchmark.percentile >= 25 ? "text-warning" :
            "text-destructive";

          const chartData = [
            { name: "Worst", value: benchmark.comparison.worst, fill: "hsl(var(--destructive))" },
            { name: "Mean", value: benchmark.comparison.mean, fill: "hsl(var(--muted))" },
            { name: "Current", value: benchmark.value, fill: isAboveMedian ? "hsl(var(--success))" : "hsl(var(--warning))" },
            { name: "Median", value: benchmark.comparison.median, fill: "hsl(var(--primary))" },
            { name: "Best", value: benchmark.comparison.best, fill: "hsl(var(--chart-2))" },
          ];

          return (
            <div key={idx} className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-foreground">{benchmark.metric}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="capitalize">
                      {benchmark.cohort} comparison
                    </Badge>
                    <span className={`text-sm font-medium ${percentileColor}`}>
                      {benchmark.percentile}th percentile
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-3xl font-bold text-foreground">{benchmark.value}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {isAboveMedian ? (
                      <>
                        <TrendingUp className="w-4 h-4 text-success" />
                        <span className="text-sm text-success">Above median</span>
                      </>
                    ) : (
                      <>
                        <TrendingDown className="w-4 h-4 text-warning" />
                        <span className="text-sm text-warning">Below median</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={120}>
                <BarChart data={chartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" style={{ fontSize: "12px" }} />
                  <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" style={{ fontSize: "12px" }} width={60} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Z-score: {benchmark.zscore.toFixed(2)}</span>
                <span>Gap to best: {(benchmark.comparison.best - benchmark.value).toFixed(1)}</span>
              </div>

              {idx < benchmarks.length - 1 && <div className="border-t border-border" />}
            </div>
          );
        })}
      </div>
    </Card>
  );
};

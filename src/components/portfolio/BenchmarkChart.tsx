import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { BenchmarkData } from "@/types/portfolio";

interface BenchmarkChartProps {
  data: BenchmarkData[];
}

export const BenchmarkChart = ({ data }: BenchmarkChartProps) => {
  return (
    <Card className="p-6 border-border bg-card">
      <h3 className="text-xl font-semibold text-foreground mb-4">Cross-Site Benchmarking - MTBF</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="siteName" 
            stroke="hsl(var(--muted-foreground))"
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
            label={{ value: 'Hours', angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
            }}
            labelStyle={{ color: 'hsl(var(--foreground))' }}
          />
          <Legend 
            wrapperStyle={{ color: 'hsl(var(--foreground))' }}
          />
          <Bar dataKey="value" fill="hsl(var(--primary))" name="Site MTBF" radius={[8, 8, 0, 0]} />
          <Bar dataKey="internal" fill="hsl(var(--chart-2))" name="Internal Average" radius={[8, 8, 0, 0]} />
          <Bar dataKey="industry" fill="hsl(var(--chart-3))" name="Industry Standard" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { WaterfallItem } from "@/types/portfolio";

interface WaterfallChartProps {
  data: WaterfallItem[];
}

export const WaterfallChart = ({ data }: WaterfallChartProps) => {
  const chartData = data.map((item, index) => {
    let cumulative = 0;
    for (let i = 0; i <= index; i++) {
      cumulative += data[i].value;
    }
    return {
      ...item,
      cumulative,
      start: index === 0 ? 0 : cumulative - item.value,
    };
  });

  const getColor = (type: string) => {
    if (type === 'positive') return 'hsl(var(--success))';
    if (type === 'negative') return 'hsl(var(--destructive))';
    return 'hsl(var(--primary))';
  };

  return (
    <Card className="p-6 border-border bg-card">
      <h3 className="text-xl font-semibold text-foreground mb-4">Savings Waterfall</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="label" 
            angle={-45} 
            textAnchor="end" 
            height={120}
            stroke="hsl(var(--muted-foreground))"
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
            tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
          />
          <Tooltip 
            formatter={(value: number) => [`$${(value / 1000000).toFixed(2)}M`, 'Value']}
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
            }}
          />
          <Bar dataKey="value" radius={[8, 8, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.type)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

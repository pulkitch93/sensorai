import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SensorTag } from "@/types/analytics";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Plus, Download, Trash2, ZoomIn, ZoomOut } from "lucide-react";

interface TimeSeriesExplorerProps {
  availableTags: SensorTag[];
}

export const TimeSeriesExplorer = ({ availableTags }: TimeSeriesExplorerProps) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([availableTags[0]?.id]);
  const [downsample, setDownsample] = useState<string>("1m");

  const addTag = (tagId: string) => {
    if (!selectedTags.includes(tagId)) {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  const removeTag = (tagId: string) => {
    setSelectedTags(selectedTags.filter(id => id !== tagId));
  };

  // Mock data
  const chartData = Array.from({ length: 100 }, (_, i) => {
    const point: any = { time: new Date(Date.now() - (100 - i) * 60000).toLocaleTimeString() };
    selectedTags.forEach(tagId => {
      const tag = availableTags.find(t => t.id === tagId);
      point[tag?.name || tagId] = 50 + Math.sin(i * 0.1) * 20 + Math.random() * 10;
    });
    return point;
  });

  const colors = ["hsl(var(--primary))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"];

  return (
    <Card className="p-6 border-border">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Time-Series Explorer</h3>
          <div className="flex items-center gap-2">
            <Select value={downsample} onValueChange={setDownsample}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="raw">Raw</SelectItem>
                <SelectItem value="1s">1 second</SelectItem>
                <SelectItem value="10s">10 seconds</SelectItem>
                <SelectItem value="1m">1 minute</SelectItem>
                <SelectItem value="5m">5 minutes</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm" variant="outline">
              <ZoomIn className="w-4 h-4 mr-2" />
              Zoom
            </Button>
            <Button size="sm" variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {selectedTags.map(tagId => {
            const tag = availableTags.find(t => t.id === tagId);
            if (!tag) return null;
            return (
              <Badge key={tagId} variant="outline" className="gap-2 px-3 py-1">
                <span>{tag.name}</span>
                <span className="text-xs text-muted-foreground">({tag.unit})</span>
                <button onClick={() => removeTag(tagId)} className="hover:text-destructive">
                  <Trash2 className="w-3 h-3" />
                </button>
              </Badge>
            );
          })}
          <Select onValueChange={addTag}>
            <SelectTrigger className="w-[200px] h-8">
              <Plus className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Add sensor" />
            </SelectTrigger>
            <SelectContent>
              {availableTags
                .filter(tag => !selectedTags.includes(tag.id))
                .map(tag => (
                  <SelectItem key={tag.id} value={tag.id}>
                    {tag.name} ({tag.assetName})
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" style={{ fontSize: "12px" }} />
              <YAxis stroke="hsl(var(--muted-foreground))" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              {selectedTags.map((tagId, idx) => {
                const tag = availableTags.find(t => t.id === tagId);
                return (
                  <Line
                    key={tagId}
                    type="monotone"
                    dataKey={tag?.name || tagId}
                    stroke={colors[idx % colors.length]}
                    strokeWidth={2}
                    dot={false}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
};

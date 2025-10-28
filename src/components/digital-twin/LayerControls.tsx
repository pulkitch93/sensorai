import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { 
  Activity, 
  Volume2, 
  Thermometer, 
  Zap, 
  Droplets, 
  Gauge 
} from "lucide-react";

export interface LayerState {
  vibration: boolean;
  acoustics: boolean;
  thermal: boolean;
  energy: boolean;
  flow: boolean;
  pressure: boolean;
}

interface LayerControlsProps {
  layers: LayerState;
  onLayerToggle: (layer: keyof LayerState) => void;
  opacity: number;
  onOpacityChange: (opacity: number) => void;
}

const layerConfig = [
  { key: 'vibration' as const, label: 'Vibration', icon: Activity, color: 'text-chart-2' },
  { key: 'acoustics' as const, label: 'Acoustics', icon: Volume2, color: 'text-chart-3' },
  { key: 'thermal' as const, label: 'Thermal', icon: Thermometer, color: 'text-destructive' },
  { key: 'energy' as const, label: 'Energy', icon: Zap, color: 'text-warning' },
  { key: 'flow' as const, label: 'Flow', icon: Droplets, color: 'text-primary' },
  { key: 'pressure' as const, label: 'Pressure', icon: Gauge, color: 'text-accent' },
];

export const LayerControls = ({
  layers,
  onLayerToggle,
  opacity,
  onOpacityChange,
}: LayerControlsProps) => {
  return (
    <Card className="p-4 bg-card border-border">
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold mb-3">Sensor Layers</h3>
          <div className="space-y-3">
            {layerConfig.map(({ key, label, icon: Icon, color }) => (
              <div key={key} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${color}`} />
                  <Label htmlFor={key} className="text-sm cursor-pointer">
                    {label}
                  </Label>
                </div>
                <Switch
                  id={key}
                  checked={layers[key]}
                  onCheckedChange={() => onLayerToggle(key)}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="pt-3 border-t border-border">
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm">Overlay Opacity</Label>
            <span className="text-xs text-muted-foreground">{opacity}%</span>
          </div>
          <Slider
            value={[opacity]}
            onValueChange={(value) => onOpacityChange(value[0])}
            max={100}
            step={5}
          />
        </div>
      </div>
    </Card>
  );
};

import { Asset } from "@/types/asset";
import { LayerState } from "./LayerControls";

interface SensorOverlayProps {
  asset: Asset;
  layers: LayerState;
  opacity: number;
}

export const SensorOverlay = ({ asset, layers, opacity }: SensorOverlayProps) => {
  const activeLayersCount = Object.values(layers).filter(Boolean).length;
  
  if (activeLayersCount === 0) return null;

  const getSensorValue = (layer: keyof LayerState): string | null => {
    switch (layer) {
      case 'vibration':
        return `${asset.vibration.toFixed(2)} mm/s`;
      case 'thermal':
        return `${asset.temperature.toFixed(1)}°C`;
      case 'pressure':
        return `${asset.pressure.toFixed(1)} bar`;
      case 'acoustics':
        return `${(Math.random() * 30 + 50).toFixed(0)} dB`;
      case 'energy':
        return `${(Math.random() * 50 + 100).toFixed(0)} kW`;
      case 'flow':
        return `${(Math.random() * 20 + 10).toFixed(1)} L/s`;
      default:
        return null;
    }
  };

  const getLayerColor = (layer: keyof LayerState): string => {
    const colors = {
      vibration: 'hsl(var(--chart-2))',
      acoustics: 'hsl(var(--chart-3))',
      thermal: 'hsl(var(--destructive))',
      energy: 'hsl(var(--warning))',
      flow: 'hsl(var(--primary))',
      pressure: 'hsl(var(--accent))',
    };
    return colors[layer];
  };

  return (
    <div 
      className="absolute -top-2 left-full ml-2 bg-card/95 backdrop-blur-sm border border-border rounded-lg p-2 shadow-lg min-w-[140px] z-10"
      style={{ opacity: opacity / 100 }}
    >
      <div className="space-y-1">
        {(Object.entries(layers) as [keyof LayerState, boolean][])
          .filter(([_, enabled]) => enabled)
          .map(([layer]) => {
            const value = getSensorValue(layer);
            if (!value) return null;
            
            return (
              <div key={layer} className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground capitalize">{layer}:</span>
                <span 
                  className="font-semibold"
                  style={{ color: getLayerColor(layer) }}
                >
                  {value}
                </span>
              </div>
            );
          })}
      </div>
    </div>
  );
};

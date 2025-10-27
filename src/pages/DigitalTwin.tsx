import { useState } from "react";
import { DigitalTwin3D } from "@/components/DigitalTwin3D";
import { mockAssets } from "@/lib/mockData";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Maximize2 } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";

const DigitalTwin = () => {
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const navigate = useNavigate();

  const selectedAsset = selectedAssetId 
    ? mockAssets.find(a => a.id === selectedAssetId) 
    : null;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-foreground">Digital Twin</h1>
              <p className="text-muted-foreground">Plant Floor 3D Visualization</p>
            </div>
          </div>
          <Button variant="outline" className="gap-2">
            <Maximize2 className="w-4 h-4" />
            Fullscreen
          </Button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 3D View */}
          <div className="lg:col-span-2">
            <div className="h-[600px]">
              <DigitalTwin3D 
                assets={mockAssets} 
                onAssetClick={setSelectedAssetId}
              />
            </div>
          </div>

          {/* Asset Details Panel */}
          <div className="space-y-4">
            {selectedAsset ? (
              <>
                <Card className="p-6 border-primary/50">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-1">
                        {selectedAsset.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">{selectedAsset.type}</p>
                    </div>
                    <StatusBadge status={selectedAsset.status} />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Health Score</p>
                      <div className="flex items-end gap-2">
                        <p className="text-4xl font-bold text-foreground">
                          {selectedAsset.healthScore}
                        </p>
                        <p className="text-muted-foreground mb-1">/100</p>
                      </div>
                      <div className="w-full h-2 bg-secondary rounded-full mt-2 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all ${
                            selectedAsset.healthScore >= 80 ? 'bg-success' :
                            selectedAsset.healthScore >= 60 ? 'bg-warning' :
                            'bg-destructive'
                          }`}
                          style={{ width: `${selectedAsset.healthScore}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Temperature</p>
                        <p className="text-lg font-semibold text-foreground">
                          {selectedAsset.temperature}°C
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Vibration</p>
                        <p className="text-lg font-semibold text-foreground">
                          {selectedAsset.vibration} mm/s
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Pressure</p>
                        <p className="text-lg font-semibold text-foreground">
                          {selectedAsset.pressure} PSI
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Active Alerts</p>
                        <p className="text-lg font-semibold text-foreground">
                          {selectedAsset.alerts}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button 
                    className="w-full mt-4" 
                    onClick={() => navigate(`/asset/${selectedAsset.id}`)}
                  >
                    View Full Details
                  </Button>
                </Card>

                {/* Legend */}
                <Card className="p-6 border-border">
                  <h4 className="font-semibold text-foreground mb-4">Status Legend</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded bg-success" />
                      <span className="text-sm text-muted-foreground">Healthy</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded bg-warning" />
                      <span className="text-sm text-muted-foreground">Warning</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded bg-destructive" />
                      <span className="text-sm text-muted-foreground">Critical</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded bg-muted" />
                      <span className="text-sm text-muted-foreground">Offline</span>
                    </div>
                  </div>
                </Card>
              </>
            ) : (
              <Card className="p-6 border-border">
                <p className="text-center text-muted-foreground">
                  Click on an asset in the 3D view to see details
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalTwin;

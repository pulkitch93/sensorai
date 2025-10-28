import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  VibrationDiagnostics,
  AcousticDiagnostics,
  ThermalDiagnostics,
  EnergyDiagnostics,
} from "@/types/analytics";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Activity, Volume2, Thermometer, Zap } from "lucide-react";

interface AdvancedDiagnosticsCardProps {
  vibration: VibrationDiagnostics;
  acoustic: AcousticDiagnostics;
  thermal: ThermalDiagnostics;
  energy: EnergyDiagnostics;
}

export const AdvancedDiagnosticsCard = ({
  vibration,
  acoustic,
  thermal,
  energy,
}: AdvancedDiagnosticsCardProps) => {
  const spectralData = vibration.spectral.frequencies.map((freq, idx) => ({
    frequency: freq,
    amplitude: vibration.spectral.amplitudes[idx],
  }));

  return (
    <Card className="p-6 border-border">
      <h3 className="text-lg font-semibold text-foreground mb-4">Advanced Diagnostics</h3>

      <Tabs defaultValue="vibration">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="vibration" className="gap-2">
            <Activity className="w-4 h-4" />
            Vibration
          </TabsTrigger>
          <TabsTrigger value="acoustic" className="gap-2">
            <Volume2 className="w-4 h-4" />
            Acoustic
          </TabsTrigger>
          <TabsTrigger value="thermal" className="gap-2">
            <Thermometer className="w-4 h-4" />
            Thermal
          </TabsTrigger>
          <TabsTrigger value="energy" className="gap-2">
            <Zap className="w-4 h-4" />
            Energy
          </TabsTrigger>
        </TabsList>

        <TabsContent value="vibration" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">RMS</p>
              <p className="text-2xl font-bold text-foreground">{vibration.rms}</p>
              <p className="text-xs text-muted-foreground">mm/s</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Kurtosis</p>
              <p className="text-2xl font-bold text-foreground">{vibration.kurtosis}</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Crest Factor</p>
              <p className="text-2xl font-bold text-foreground">{vibration.crestFactor}</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Peak-to-Peak</p>
              <p className="text-2xl font-bold text-foreground">{vibration.peakToPeak}</p>
              <p className="text-xs text-muted-foreground">mm/s</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-2">Spectral Analysis</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={spectralData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="frequency" stroke="hsl(var(--muted-foreground))" label={{ value: "Frequency (Hz)", position: "insideBottom", offset: -5 }} />
                <YAxis stroke="hsl(var(--muted-foreground))" label={{ value: "Amplitude", angle: -90, position: "insideLeft" }} />
                <Tooltip />
                <Bar dataKey="amplitude" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-2">Bearing Frequencies</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between p-2 bg-muted/50 rounded">
                <span className="text-muted-foreground">BPFO:</span>
                <span className="font-medium">{vibration.bearing.bpfo} Hz</span>
              </div>
              <div className="flex justify-between p-2 bg-muted/50 rounded">
                <span className="text-muted-foreground">BPFI:</span>
                <span className="font-medium">{vibration.bearing.bpfi} Hz</span>
              </div>
              <div className="flex justify-between p-2 bg-muted/50 rounded">
                <span className="text-muted-foreground">FTF:</span>
                <span className="font-medium">{vibration.bearing.ftf} Hz</span>
              </div>
              <div className="flex justify-between p-2 bg-muted/50 rounded">
                <span className="text-muted-foreground">BSF:</span>
                <span className="font-medium">{vibration.bearing.bsf} Hz</span>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="acoustic" className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Noise Floor</p>
              <p className="text-2xl font-bold text-foreground">{acoustic.noiseFloor}</p>
              <p className="text-xs text-muted-foreground">dB</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Peak Amplitude</p>
              <p className="text-2xl font-bold text-foreground">{acoustic.peakAmplitude}</p>
              <p className="text-xs text-muted-foreground">dB</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">SNR</p>
              <p className="text-2xl font-bold text-foreground">{acoustic.snr}</p>
              <p className="text-xs text-muted-foreground">dB</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-2">Pattern Recognition</h4>
            <div className="space-y-2">
              {acoustic.patterns.map((pattern, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded">
                  <span className="text-foreground">{pattern.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${pattern.confidence * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {(pattern.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="thermal" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Current</p>
              <p className="text-2xl font-bold text-foreground">{thermal.current}°C</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Ambient</p>
              <p className="text-2xl font-bold text-foreground">{thermal.ambient}°C</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Delta</p>
              <p className="text-2xl font-bold text-warning">{thermal.delta}°C</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Rate</p>
              <p className="text-2xl font-bold text-foreground">{thermal.rate}°C/h</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-2">24h Thermal Prediction</h4>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={thermal.predicted}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="timestamp" 
                  stroke="hsl(var(--muted-foreground))"
                  tickFormatter={(val) => new Date(val).getHours() + 'h'}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="hsl(var(--warning))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>

        <TabsContent value="energy" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">kWh/Unit</p>
              <p className="text-2xl font-bold text-foreground">{energy.kwhPerUnit}</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Power Factor</p>
              <p className="text-2xl font-bold text-foreground">{energy.powerFactor}</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Demand Peak</p>
              <p className="text-2xl font-bold text-foreground">{energy.demandPeak}</p>
              <p className="text-xs text-muted-foreground">kW</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Efficiency</p>
              <p className="text-2xl font-bold text-success">{energy.efficiency}%</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Cost per Hour</p>
              <p className="text-3xl font-bold text-foreground">${energy.costPerHour}</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Baseline Deviation</p>
              <p className="text-3xl font-bold text-warning">+{energy.deviation}%</p>
              <p className="text-xs text-muted-foreground mt-1">Baseline: {energy.baseline} kW</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

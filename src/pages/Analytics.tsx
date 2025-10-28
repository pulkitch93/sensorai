import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TimeSeriesExplorer } from "@/components/analytics/TimeSeriesExplorer";
import { AdvancedDiagnosticsCard } from "@/components/analytics/AdvancedDiagnosticsCard";
import { AnomalyDetectionStudio } from "@/components/analytics/AnomalyDetectionStudio";
import { BenchmarkingView } from "@/components/analytics/BenchmarkingView";
import {
  mockSensorTags,
  mockVibrationDiagnostics,
  mockAcousticDiagnostics,
  mockThermalDiagnostics,
  mockEnergyDiagnostics,
  mockBacktestResult,
  mockModelCards,
  mockBenchmarkData,
} from "@/lib/analyticsMockData";
import { ArrowLeft, Activity, BarChart3, Bot, GitCompare } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Analytics = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-[1800px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                Analytics & Diagnostics Lab
              </h1>
              <p className="text-muted-foreground">
                Advanced analytics, anomaly detection, and performance benchmarking
              </p>
            </div>
          </div>
        </div>

        {/* Model Cards Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockModelCards.map((model) => (
            <Card key={model.id} className="p-4 border-border">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-foreground">{model.name}</h4>
                  <p className="text-sm text-muted-foreground capitalize">{model.model.replace("-", " ")}</p>
                </div>
                <Badge
                  variant="outline"
                  className={
                    model.deployment.status === "deployed"
                      ? "bg-success/20 text-success border-success/40"
                      : "bg-muted text-muted-foreground border-border"
                  }
                >
                  {model.deployment.status}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="p-2 bg-muted/50 rounded">
                  <p className="text-xs text-muted-foreground">Accuracy</p>
                  <p className="font-semibold text-foreground">
                    {(model.performance.accuracy * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="p-2 bg-muted/50 rounded">
                  <p className="text-xs text-muted-foreground">F1 Score</p>
                  <p className="font-semibold text-foreground">
                    {model.performance.f1Score.toFixed(3)}
                  </p>
                </div>
                <div className="p-2 bg-muted/50 rounded">
                  <p className="text-xs text-muted-foreground">ROC AUC</p>
                  <p className="font-semibold text-foreground">
                    {model.performance.rocAuc.toFixed(3)}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="explorer" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="explorer" className="gap-2">
              <Activity className="w-4 h-4" />
              Time-Series Explorer
            </TabsTrigger>
            <TabsTrigger value="diagnostics" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Advanced Diagnostics
            </TabsTrigger>
            <TabsTrigger value="anomaly" className="gap-2">
              <Bot className="w-4 h-4" />
              Anomaly Detection
            </TabsTrigger>
            <TabsTrigger value="benchmark" className="gap-2">
              <GitCompare className="w-4 h-4" />
              Benchmarking
            </TabsTrigger>
          </TabsList>

          <TabsContent value="explorer" className="space-y-6">
            <TimeSeriesExplorer availableTags={mockSensorTags} />
          </TabsContent>

          <TabsContent value="diagnostics" className="space-y-6">
            <AdvancedDiagnosticsCard
              vibration={mockVibrationDiagnostics}
              acoustic={mockAcousticDiagnostics}
              thermal={mockThermalDiagnostics}
              energy={mockEnergyDiagnostics}
            />
          </TabsContent>

          <TabsContent value="anomaly" className="space-y-6">
            <AnomalyDetectionStudio backtestResult={mockBacktestResult} />
          </TabsContent>

          <TabsContent value="benchmark" className="space-y-6">
            <BenchmarkingView benchmarks={mockBenchmarkData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Analytics;

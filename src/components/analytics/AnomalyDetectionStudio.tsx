import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AnomalyModel, BacktestResult } from "@/types/analytics";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Play, Download, Save } from "lucide-react";
import { toast } from "sonner";

interface AnomalyDetectionStudioProps {
  backtestResult: BacktestResult;
}

export const AnomalyDetectionStudio = ({ backtestResult }: AnomalyDetectionStudioProps) => {
  const [model, setModel] = useState<AnomalyModel>("isolation-forest");
  const [trainWindow, setTrainWindow] = useState("30");
  const [sensitivity, setSensitivity] = useState("medium");

  const handleRunBacktest = () => {
    toast.info("Running 30-day backtest...", {
      description: "This may take a few moments",
    });
    setTimeout(() => {
      toast.success("Backtest complete!", {
        description: `Accuracy: ${(backtestResult.accuracy * 100).toFixed(1)}%, F1: ${backtestResult.f1Score.toFixed(3)}`,
      });
    }, 2000);
  };

  const handleExportModelCard = () => {
    toast.success("Model card exported", {
      description: "Model_card_v1.json downloaded",
    });
  };

  const confusionData = [
    { label: "True Neg", value: backtestResult.trueNegatives },
    { label: "False Pos", value: backtestResult.falsePositives },
    { label: "False Neg", value: backtestResult.falseNegatives },
    { label: "True Pos", value: backtestResult.truePositives },
  ];

  return (
    <Card className="p-6 border-border">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Anomaly Detection Studio</h3>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleExportModelCard}>
              <Download className="w-4 h-4 mr-2" />
              Export Model Card
            </Button>
            <Button size="sm" onClick={handleRunBacktest}>
              <Play className="w-4 h-4 mr-2" />
              Run Backtest
            </Button>
          </div>
        </div>

        {/* Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Model Type</Label>
            <Select value={model} onValueChange={(v) => setModel(v as AnomalyModel)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="isolation-forest">Isolation Forest</SelectItem>
                <SelectItem value="one-class-svm">One-Class SVM</SelectItem>
                <SelectItem value="stl-decomposition">STL Decomposition</SelectItem>
                <SelectItem value="lstm-autoencoder">LSTM Autoencoder</SelectItem>
                <SelectItem value="multivariate-gaussian">Multivariate Gaussian</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Training Window (days)</Label>
            <Input
              type="number"
              value={trainWindow}
              onChange={(e) => setTrainWindow(e.target.value)}
              min="7"
              max="90"
            />
          </div>

          <div className="space-y-2">
            <Label>Sensitivity</Label>
            <Select value={sensitivity} onValueChange={setSensitivity}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Performance Metrics */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3">Performance Metrics</h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Precision</p>
              <p className="text-2xl font-bold text-foreground">
                {(backtestResult.precision * 100).toFixed(1)}%
              </p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Recall</p>
              <p className="text-2xl font-bold text-foreground">
                {(backtestResult.recall * 100).toFixed(1)}%
              </p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">F1 Score</p>
              <p className="text-2xl font-bold text-foreground">
                {backtestResult.f1Score.toFixed(3)}
              </p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Accuracy</p>
              <p className="text-2xl font-bold text-success">
                {(backtestResult.accuracy * 100).toFixed(1)}%
              </p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">ROC AUC</p>
              <p className="text-2xl font-bold text-foreground">
                {backtestResult.rocAuc.toFixed(3)}
              </p>
            </div>
          </div>
        </div>

        {/* Confusion Matrix */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3">Confusion Matrix</h4>
          <div className="grid grid-cols-2 gap-3 max-w-md">
            <div className="p-6 bg-success/10 border border-success/30 rounded-lg text-center">
              <p className="text-sm text-muted-foreground mb-1">True Negatives</p>
              <p className="text-3xl font-bold text-success">{backtestResult.trueNegatives}</p>
            </div>
            <div className="p-6 bg-warning/10 border border-warning/30 rounded-lg text-center">
              <p className="text-sm text-muted-foreground mb-1">False Positives</p>
              <p className="text-3xl font-bold text-warning">{backtestResult.falsePositives}</p>
            </div>
            <div className="p-6 bg-destructive/10 border border-destructive/30 rounded-lg text-center">
              <p className="text-sm text-muted-foreground mb-1">False Negatives</p>
              <p className="text-3xl font-bold text-destructive">{backtestResult.falseNegatives}</p>
            </div>
            <div className="p-6 bg-success/10 border border-success/30 rounded-lg text-center">
              <p className="text-sm text-muted-foreground mb-1">True Positives</p>
              <p className="text-3xl font-bold text-success">{backtestResult.truePositives}</p>
            </div>
          </div>
        </div>

        {/* ROC Curve */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3">ROC Curve</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={backtestResult.rocCurve}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="fpr" 
                stroke="hsl(var(--muted-foreground))"
                label={{ value: "False Positive Rate", position: "insideBottom", offset: -5 }}
              />
              <YAxis 
                dataKey="tpr"
                stroke="hsl(var(--muted-foreground))"
                label={{ value: "True Positive Rate", angle: -90, position: "insideLeft" }}
              />
              <Tooltip />
              <Line type="monotone" dataKey="tpr" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
              <Line 
                type="monotone" 
                data={[{ fpr: 0, tpr: 0 }, { fpr: 1, tpr: 1 }]} 
                dataKey="tpr"
                stroke="hsl(var(--muted-foreground))" 
                strokeDasharray="5 5"
                strokeWidth={1}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
};

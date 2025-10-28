export interface TimeSeriesPoint {
  timestamp: Date;
  value: number;
}

export interface SensorTag {
  id: string;
  name: string;
  assetId: string;
  assetName: string;
  unit: string;
  type: 'vibration' | 'temperature' | 'pressure' | 'acoustic' | 'energy' | 'flow';
  samplingRate: number; // Hz
}

export interface SpectralAnalysis {
  frequencies: number[];
  amplitudes: number[];
  peaks: { frequency: number; amplitude: number; label: string }[];
  fundamentalFrequency?: number;
  harmonics: { order: number; frequency: number; amplitude: number }[];
}

export interface VibrationDiagnostics {
  rms: number;
  peakToPeak: number;
  kurtosis: number;
  crestFactor: number;
  spectral: SpectralAnalysis;
  envelope: TimeSeriesPoint[];
  bearing: {
    bpfo: number; // Ball Pass Frequency Outer
    bpfi: number; // Ball Pass Frequency Inner
    ftf: number;  // Fundamental Train Frequency
    bsf: number;  // Ball Spin Frequency
  };
}

export interface AcousticDiagnostics {
  noiseFloor: number;
  peakAmplitude: number;
  snr: number; // Signal-to-noise ratio
  spectral: SpectralAnalysis;
  patterns: { name: string; confidence: number; timestamp: Date }[];
}

export interface ThermalDiagnostics {
  current: number;
  ambient: number;
  delta: number;
  trend: 'rising' | 'falling' | 'stable';
  rate: number; // degrees per hour
  predicted: { timestamp: Date; value: number; confidence: number }[];
}

export interface EnergyDiagnostics {
  kwhPerUnit: number;
  powerFactor: number;
  demandPeak: number;
  demandAverage: number;
  efficiency: number;
  costPerHour: number;
  baseline: number;
  deviation: number;
}

export type AnomalyModel = 
  | 'isolation-forest' 
  | 'one-class-svm' 
  | 'stl-decomposition'
  | 'lstm-autoencoder'
  | 'multivariate-gaussian';

export interface AnomalyDetectionConfig {
  model: AnomalyModel;
  trainWindow: number; // days
  contamination: number; // 0-1
  sensitivity: 'low' | 'medium' | 'high';
  features: string[];
}

export interface BacktestResult {
  truePositives: number;
  trueNegatives: number;
  falsePositives: number;
  falseNegatives: number;
  precision: number;
  recall: number;
  f1Score: number;
  accuracy: number;
  rocAuc: number;
  confusionMatrix: number[][];
  rocCurve: { fpr: number; tpr: number }[];
  prCurve: { recall: number; precision: number }[];
}

export interface ModelCard {
  id: string;
  name: string;
  model: AnomalyModel;
  trainedAt: Date;
  trainWindow: number;
  features: string[];
  performance: BacktestResult;
  dataCoverage: number;
  biasChecks: { check: string; passed: boolean; details: string }[];
  deployment: {
    status: 'draft' | 'deployed' | 'archived';
    version: string;
    lastDeployedAt?: Date;
  };
}

export interface BenchmarkData {
  assetId: string;
  metric: string;
  value: number;
  percentile: number;
  cohort: 'peer' | 'industry' | 'historical';
  zscore: number;
  comparison: {
    best: number;
    worst: number;
    median: number;
    mean: number;
  };
}

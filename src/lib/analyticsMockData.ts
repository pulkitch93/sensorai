import {
  SensorTag,
  VibrationDiagnostics,
  AcousticDiagnostics,
  ThermalDiagnostics,
  EnergyDiagnostics,
  BacktestResult,
  ModelCard,
  BenchmarkData,
  TimeSeriesPoint,
} from "@/types/analytics";

export const mockSensorTags: SensorTag[] = [
  {
    id: "tag-1",
    name: "Motor Bearing Vibration",
    assetId: "asset-1",
    assetName: "Hydraulic Press #1",
    unit: "mm/s",
    type: "vibration",
    samplingRate: 10000,
  },
  {
    id: "tag-2",
    name: "Motor Winding Temperature",
    assetId: "asset-1",
    assetName: "Hydraulic Press #1",
    unit: "°C",
    type: "temperature",
    samplingRate: 1,
  },
  {
    id: "tag-3",
    name: "Hydraulic Pressure",
    assetId: "asset-1",
    assetName: "Hydraulic Press #1",
    unit: "bar",
    type: "pressure",
    samplingRate: 10,
  },
  {
    id: "tag-4",
    name: "Compressor Acoustic",
    assetId: "asset-2",
    assetName: "Compressor Unit #2",
    unit: "dB",
    type: "acoustic",
    samplingRate: 44100,
  },
  {
    id: "tag-5",
    name: "Power Consumption",
    assetId: "asset-1",
    assetName: "Hydraulic Press #1",
    unit: "kW",
    type: "energy",
    samplingRate: 1,
  },
];

export const mockVibrationDiagnostics: VibrationDiagnostics = {
  rms: 12.4,
  peakToPeak: 45.2,
  kurtosis: 3.8,
  crestFactor: 4.2,
  spectral: {
    frequencies: Array.from({ length: 100 }, (_, i) => i * 10),
    amplitudes: Array.from({ length: 100 }, () => Math.random() * 10),
    peaks: [
      { frequency: 60, amplitude: 8.5, label: "1X RPM" },
      { frequency: 120, amplitude: 4.2, label: "2X RPM" },
      { frequency: 180, amplitude: 2.1, label: "3X RPM" },
      { frequency: 420, amplitude: 6.8, label: "BPFO" },
    ],
    fundamentalFrequency: 60,
    harmonics: [
      { order: 1, frequency: 60, amplitude: 8.5 },
      { order: 2, frequency: 120, amplitude: 4.2 },
      { order: 3, frequency: 180, amplitude: 2.1 },
    ],
  },
  envelope: Array.from({ length: 100 }, (_, i) => ({
    timestamp: new Date(Date.now() - (100 - i) * 60000),
    value: 5 + Math.random() * 3,
  })),
  bearing: {
    bpfo: 420,
    bpfi: 580,
    ftf: 24,
    bsf: 140,
  },
};

export const mockAcousticDiagnostics: AcousticDiagnostics = {
  noiseFloor: 45,
  peakAmplitude: 82,
  snr: 18.5,
  spectral: {
    frequencies: Array.from({ length: 100 }, (_, i) => i * 50),
    amplitudes: Array.from({ length: 100 }, () => Math.random() * 20 + 40),
    peaks: [
      { frequency: 500, amplitude: 75, label: "Primary tone" },
      { frequency: 1500, amplitude: 65, label: "Harmonic" },
    ],
    harmonics: [],
  },
  patterns: [
    { name: "Normal operation", confidence: 0.92, timestamp: new Date() },
    { name: "Bearing wear signature", confidence: 0.15, timestamp: new Date() },
  ],
};

export const mockThermalDiagnostics: ThermalDiagnostics = {
  current: 78.5,
  ambient: 22.0,
  delta: 56.5,
  trend: "rising",
  rate: 2.3,
  predicted: Array.from({ length: 24 }, (_, i) => ({
    timestamp: new Date(Date.now() + i * 3600000),
    value: 78.5 + i * 0.5 + Math.random() * 2,
    confidence: 0.85 - i * 0.01,
  })),
};

export const mockEnergyDiagnostics: EnergyDiagnostics = {
  kwhPerUnit: 2.45,
  powerFactor: 0.87,
  demandPeak: 145.2,
  demandAverage: 98.5,
  efficiency: 87.2,
  costPerHour: 14.25,
  baseline: 95.0,
  deviation: 3.7,
};

export const mockBacktestResult: BacktestResult = {
  truePositives: 42,
  trueNegatives: 856,
  falsePositives: 18,
  falseNegatives: 4,
  precision: 0.70,
  recall: 0.91,
  f1Score: 0.79,
  accuracy: 0.976,
  rocAuc: 0.94,
  confusionMatrix: [
    [856, 18],
    [4, 42],
  ],
  rocCurve: Array.from({ length: 20 }, (_, i) => ({
    fpr: i / 20,
    tpr: Math.min(1, i / 20 + 0.3 + Math.random() * 0.1),
  })),
  prCurve: Array.from({ length: 20 }, (_, i) => ({
    recall: i / 20,
    precision: 0.9 - i * 0.02 + Math.random() * 0.05,
  })),
};

export const mockModelCards: ModelCard[] = [
  {
    id: "model-1",
    name: "Bearing Health Classifier",
    model: "isolation-forest",
    trainedAt: new Date("2025-10-15"),
    trainWindow: 90,
    features: ["vibration_rms", "kurtosis", "temperature", "envelope_peaks"],
    performance: mockBacktestResult,
    dataCoverage: 0.98,
    biasChecks: [
      { check: "Operating condition coverage", passed: true, details: "All load ranges represented" },
      { check: "Temporal balance", passed: true, details: "Equal distribution across shifts" },
      { check: "Label quality", passed: false, details: "12% of labels uncertain" },
    ],
    deployment: {
      status: "deployed",
      version: "v2.1.0",
      lastDeployedAt: new Date("2025-10-20"),
    },
  },
  {
    id: "model-2",
    name: "Thermal Anomaly Detector",
    model: "lstm-autoencoder",
    trainedAt: new Date("2025-10-10"),
    trainWindow: 60,
    features: ["temperature", "ambient", "delta", "rate"],
    performance: {
      ...mockBacktestResult,
      precision: 0.85,
      recall: 0.88,
      f1Score: 0.865,
    },
    dataCoverage: 0.95,
    biasChecks: [
      { check: "Season coverage", passed: true, details: "Summer and winter data included" },
      { check: "Asset diversity", passed: true, details: "5 similar assets in training set" },
    ],
    deployment: {
      status: "deployed",
      version: "v1.5.2",
      lastDeployedAt: new Date("2025-10-18"),
    },
  },
];

export const mockBenchmarkData: BenchmarkData[] = [
  {
    assetId: "asset-1",
    metric: "MTBF",
    value: 847,
    percentile: 72,
    cohort: "peer",
    zscore: 0.65,
    comparison: {
      best: 1250,
      worst: 420,
      median: 780,
      mean: 795,
    },
  },
  {
    assetId: "asset-1",
    metric: "Energy Efficiency",
    value: 87.2,
    percentile: 58,
    cohort: "industry",
    zscore: 0.21,
    comparison: {
      best: 94.5,
      worst: 72.0,
      median: 85.5,
      mean: 85.8,
    },
  },
  {
    assetId: "asset-1",
    metric: "OEE",
    value: 82.5,
    percentile: 68,
    cohort: "historical",
    zscore: 0.48,
    comparison: {
      best: 89.0,
      worst: 68.5,
      median: 80.0,
      mean: 80.2,
    },
  },
];

export const generateTimeSeriesData = (
  startTime: Date,
  endTime: Date,
  samplingRate: number
): TimeSeriesPoint[] => {
  const points: TimeSeriesPoint[] = [];
  const duration = endTime.getTime() - startTime.getTime();
  const interval = (1000 / samplingRate);
  const numPoints = Math.floor(duration / interval);

  for (let i = 0; i < numPoints; i++) {
    points.push({
      timestamp: new Date(startTime.getTime() + i * interval),
      value: 50 + Math.sin(i * 0.1) * 20 + Math.random() * 10,
    });
  }

  return points;
};

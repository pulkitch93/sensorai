export type SensorStatus = 'online' | 'offline' | 'warning' | 'error';
export type SensorType = 'temperature' | 'vibration' | 'pressure' | 'flow' | 'acoustic' | 'current' | 'voltage' | 'energy';
export type GatewayProtocol = 'MQTT' | 'OPC UA' | 'Modbus TCP' | 'Modbus RTU' | 'REST API';
export type EdgeStatus = 'healthy' | 'degraded' | 'offline';

export interface Sensor {
  id: string;
  name: string;
  type: SensorType;
  status: SensorStatus;
  deviceId: string;
  location: {
    assetId: string;
    assetName: string;
    component?: string;
    coordinates?: { x: number; y: number; z: number };
  };
  configuration: {
    samplingFrequency: number; // Hz
    reportingInterval: number; // seconds
    engineeringUnit: string;
    minValue: number;
    maxValue: number;
    accuracy: number;
    calibrationDate: Date;
    nextCalibrationDate: Date;
  };
  connectivity: {
    gatewayId: string;
    protocol: GatewayProtocol;
    address: string;
    lastSeen: Date;
    signalStrength: number; // percentage
    batteryLevel?: number; // percentage
    firmwareVersion: string;
  };
  dataMapping: {
    tagName: string;
    description: string;
    resamplingRule: 'average' | 'max' | 'min' | 'last' | 'sum';
    alertThresholdHigh?: number;
    alertThresholdLow?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Gateway {
  id: string;
  name: string;
  protocol: GatewayProtocol;
  status: EdgeStatus;
  ipAddress: string;
  port: number;
  configuration: {
    mqttTopics?: string[];
    opcuaNodes?: string[];
    modbusMapping?: ModbusMapping[];
  };
  health: {
    cpuUsage: number;
    memoryUsage: number;
    diskUsage: number;
    networkLatency: number;
    bufferUsage: number;
    bufferedMessages: number;
    uptime: number; // hours
  };
  connectedSensors: number;
  lastSeen: Date;
  firmwareVersion: string;
  location: string;
}

export interface ModbusMapping {
  register: number;
  function: string;
  dataType: string;
  tagName: string;
  scaleFactor?: number;
}

export interface TelemetryData {
  sensorId: string;
  timestamp: Date;
  value: number;
  unit: string;
  quality: 'good' | 'bad' | 'uncertain';
}

export interface SensorSetupWizard {
  step: 'device' | 'location' | 'configuration' | 'mapping' | 'verify';
  data: {
    device?: {
      name: string;
      type: SensorType;
      deviceId: string;
      manufacturer: string;
      model: string;
    };
    location?: {
      assetId: string;
      component?: string;
      installationNotes?: string;
    };
    configuration?: {
      samplingFrequency: number;
      reportingInterval: number;
      engineeringUnit: string;
      calibration: boolean;
    };
    mapping?: {
      tagName: string;
      gatewayId: string;
      protocol: GatewayProtocol;
      address: string;
    };
  };
}

export interface SensorMetrics {
  totalSensors: number;
  onlineSensors: number;
  offlineSensors: number;
  warningSensors: number;
  activeGateways: number;
  totalDataPoints: number;
  averageLatency: number;
}

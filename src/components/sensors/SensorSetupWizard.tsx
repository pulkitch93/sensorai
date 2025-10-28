import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { SensorSetupWizard, SensorType, GatewayProtocol } from "@/types/sensors";
import { CheckCircle2, Thermometer, Activity, Gauge, Droplets, Volume2, Zap } from "lucide-react";

interface SensorSetupWizardProps {
  open: boolean;
  onClose: () => void;
  onComplete: (data: SensorSetupWizard['data']) => void;
}

export const SensorSetupWizardDialog = ({ open, onClose, onComplete }: SensorSetupWizardProps) => {
  const [currentStep, setCurrentStep] = useState<SensorSetupWizard['step']>('device');
  const [wizardData, setWizardData] = useState<SensorSetupWizard['data']>({});

  const steps = ['device', 'location', 'configuration', 'mapping', 'verify'] as const;
  const currentStepIndex = steps.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const getSensorIcon = (type: string) => {
    switch (type) {
      case 'temperature': return Thermometer;
      case 'vibration': return Activity;
      case 'pressure': return Gauge;
      case 'flow': return Droplets;
      case 'acoustic': return Volume2;
      default: return Zap;
    }
  };

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex]);
    } else {
      onComplete(wizardData);
      onClose();
    }
  };

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Sensor</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Step {currentStepIndex + 1} of {steps.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} />
          </div>

          {currentStep === 'device' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Device Information</h3>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label>Sensor Name</Label>
                  <Input
                    placeholder="e.g., Bearing Temperature Sensor"
                    value={wizardData.device?.name || ''}
                    onChange={(e) => setWizardData({
                      ...wizardData,
                      device: { ...wizardData.device!, name: e.target.value }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Sensor Type</Label>
                  <Select
                    value={wizardData.device?.type}
                    onValueChange={(value) => setWizardData({
                      ...wizardData,
                      device: { ...wizardData.device!, type: value as SensorType }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select sensor type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="temperature">Temperature</SelectItem>
                      <SelectItem value="vibration">Vibration</SelectItem>
                      <SelectItem value="pressure">Pressure</SelectItem>
                      <SelectItem value="flow">Flow</SelectItem>
                      <SelectItem value="acoustic">Acoustic</SelectItem>
                      <SelectItem value="current">Current</SelectItem>
                      <SelectItem value="voltage">Voltage</SelectItem>
                      <SelectItem value="energy">Energy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Device ID</Label>
                  <Input
                    placeholder="e.g., TEMP-001-4A3B"
                    value={wizardData.device?.deviceId || ''}
                    onChange={(e) => setWizardData({
                      ...wizardData,
                      device: { ...wizardData.device!, deviceId: e.target.value }
                    })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Manufacturer</Label>
                    <Input
                      placeholder="e.g., ABB"
                      value={wizardData.device?.manufacturer || ''}
                      onChange={(e) => setWizardData({
                        ...wizardData,
                        device: { ...wizardData.device!, manufacturer: e.target.value }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Model</Label>
                    <Input
                      placeholder="e.g., TT300"
                      value={wizardData.device?.model || ''}
                      onChange={(e) => setWizardData({
                        ...wizardData,
                        device: { ...wizardData.device!, model: e.target.value }
                      })}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 'location' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Installation Location</h3>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label>Asset</Label>
                  <Select
                    value={wizardData.location?.assetId}
                    onValueChange={(value) => setWizardData({
                      ...wizardData,
                      location: { ...wizardData.location!, assetId: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select asset" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asset-1">Turbine A1</SelectItem>
                      <SelectItem value="asset-2">Compressor B1</SelectItem>
                      <SelectItem value="asset-3">Pump C2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Component (Optional)</Label>
                  <Input
                    placeholder="e.g., Bearing Housing - Drive End"
                    value={wizardData.location?.component || ''}
                    onChange={(e) => setWizardData({
                      ...wizardData,
                      location: { ...wizardData.location!, component: e.target.value }
                    })}
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 'configuration' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Sensor Configuration</h3>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Sampling Frequency (Hz)</Label>
                    <Input
                      type="number"
                      placeholder="10"
                      value={wizardData.configuration?.samplingFrequency || ''}
                      onChange={(e) => setWizardData({
                        ...wizardData,
                        configuration: { ...wizardData.configuration!, samplingFrequency: Number(e.target.value) }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Reporting Interval (sec)</Label>
                    <Input
                      type="number"
                      placeholder="5"
                      value={wizardData.configuration?.reportingInterval || ''}
                      onChange={(e) => setWizardData({
                        ...wizardData,
                        configuration: { ...wizardData.configuration!, reportingInterval: Number(e.target.value) }
                      })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Engineering Unit</Label>
                  <Input
                    placeholder="e.g., °C, PSI, g"
                    value={wizardData.configuration?.engineeringUnit || ''}
                    onChange={(e) => setWizardData({
                      ...wizardData,
                      configuration: { ...wizardData.configuration!, engineeringUnit: e.target.value }
                    })}
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 'mapping' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Data Mapping & Gateway</h3>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label>Tag Name</Label>
                  <Input
                    placeholder="e.g., TRB_A1_BRG_TEMP"
                    value={wizardData.mapping?.tagName || ''}
                    onChange={(e) => setWizardData({
                      ...wizardData,
                      mapping: { ...wizardData.mapping!, tagName: e.target.value }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Gateway</Label>
                  <Select
                    value={wizardData.mapping?.gatewayId}
                    onValueChange={(value) => setWizardData({
                      ...wizardData,
                      mapping: { ...wizardData.mapping!, gatewayId: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gateway" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gw-1">Edge Gateway - Building A</SelectItem>
                      <SelectItem value="gw-2">Edge Gateway - Pump House</SelectItem>
                      <SelectItem value="gw-3">Edge Gateway - Electrical Room</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Protocol</Label>
                  <Select
                    value={wizardData.mapping?.protocol}
                    onValueChange={(value) => setWizardData({
                      ...wizardData,
                      mapping: { ...wizardData.mapping!, protocol: value as GatewayProtocol }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select protocol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MQTT">MQTT</SelectItem>
                      <SelectItem value="OPC UA">OPC UA</SelectItem>
                      <SelectItem value="Modbus TCP">Modbus TCP</SelectItem>
                      <SelectItem value="Modbus RTU">Modbus RTU</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Address/Topic</Label>
                  <Input
                    placeholder="e.g., sensors/turbine-a1/bearing/temp"
                    value={wizardData.mapping?.address || ''}
                    onChange={(e) => setWizardData({
                      ...wizardData,
                      mapping: { ...wizardData.mapping!, address: e.target.value }
                    })}
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 'verify' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-6 h-6 text-success" />
                <h3 className="font-semibold text-lg">Review Configuration</h3>
              </div>
              <Card className="p-4 space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Device</p>
                  <p className="font-semibold">{wizardData.device?.name}</p>
                  <p className="text-sm text-muted-foreground">{wizardData.device?.type} • {wizardData.device?.deviceId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Configuration</p>
                  <div className="flex gap-4 text-sm">
                    <Badge variant="outline">{wizardData.configuration?.samplingFrequency} Hz</Badge>
                    <Badge variant="outline">{wizardData.configuration?.engineeringUnit}</Badge>
                    <Badge variant="outline">{wizardData.mapping?.protocol}</Badge>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Data Mapping</p>
                  <p className="font-mono text-sm">{wizardData.mapping?.tagName}</p>
                  <p className="text-sm text-muted-foreground">{wizardData.mapping?.address}</p>
                </div>
              </Card>
            </div>
          )}

          <div className="flex justify-between pt-4 border-t border-border">
            <Button
              variant="outline"
              onClick={currentStepIndex === 0 ? onClose : handleBack}
            >
              {currentStepIndex === 0 ? 'Cancel' : 'Back'}
            </Button>
            <Button onClick={handleNext}>
              {currentStepIndex === steps.length - 1 ? 'Complete Setup' : 'Next'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

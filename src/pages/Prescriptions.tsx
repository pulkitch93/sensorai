import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PrescriptionCard } from "@/components/prescriptions/PrescriptionCard";
import { WorkflowExecutionCard } from "@/components/prescriptions/WorkflowExecutionCard";
import { CMMSIntegrationCard } from "@/components/prescriptions/CMMSIntegrationCard";
import {
  mockPrescriptions,
  mockWorkflowExecutions,
  mockCMMSAdapters,
  mockPrescriptionMetrics,
} from "@/lib/prescriptionsMockData";
import {
  FileCheck,
  Play,
  TrendingUp,
  Zap,
  CheckCircle2,
  Clock,
  Search,
  Plus,
  Settings,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Prescriptions = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const handleViewPrescription = (id: string) => {
    toast({
      title: "Opening Prescription",
      description: `Viewing details for prescription ${id}`,
    });
  };

  const handleExecuteWorkflow = (id: string) => {
    toast({
      title: "Starting Workflow",
      description: "Workflow execution initiated",
    });
  };

  const handleContinueWorkflow = (id: string) => {
    toast({
      title: "Resuming Workflow",
      description: `Continuing execution of workflow ${id}`,
    });
  };

  const handleConnectCMMS = (system: string) => {
    toast({
      title: "Connecting to CMMS",
      description: `Initiating connection to ${system}`,
    });
  };

  const handleSyncCMMS = (system: string) => {
    toast({
      title: "Syncing Data",
      description: `Syncing work orders with ${system}`,
    });
  };

  const filteredPrescriptions = mockPrescriptions.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Prescriptions & Workflows
            </h1>
            <p className="text-muted-foreground">
              Expert-validated actions and AI-generated maintenance procedures
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              New Prescription
            </Button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6 border-primary/50 bg-card">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Prescriptions</p>
                <p className="text-3xl font-bold text-foreground">
                  {mockPrescriptionMetrics.totalPrescriptions}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-primary/20">
                <FileCheck className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-accent/50 bg-card">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Active Workflows</p>
                <p className="text-3xl font-bold text-foreground">
                  {mockPrescriptionMetrics.activeWorkflows}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-accent/20">
                <Play className="w-6 h-6 text-accent" />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-success/50 bg-card">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <p className="text-3xl font-bold text-foreground">
                  {mockPrescriptionMetrics.successRate}%
                </p>
              </div>
              <div className="p-3 rounded-lg bg-success/20">
                <CheckCircle2 className="w-6 h-6 text-success" />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-chart-2/50 bg-card">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Avg. Effectiveness</p>
                <p className="text-3xl font-bold text-foreground">
                  {mockPrescriptionMetrics.averageEffectivenessRating.toFixed(1)}⭐
                </p>
              </div>
              <div className="p-3 rounded-lg bg-chart-2/20">
                <TrendingUp className="w-6 h-6 text-chart-2" />
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="library" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto">
            <TabsTrigger value="library" className="gap-2">
              <FileCheck className="w-4 h-4" />
              Library
            </TabsTrigger>
            <TabsTrigger value="workflows" className="gap-2">
              <Zap className="w-4 h-4" />
              Workflows
              <Badge variant="secondary" className="ml-1">
                {mockPrescriptionMetrics.activeWorkflows}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="cmms" className="gap-2">
              <Settings className="w-4 h-4" />
              CMMS
            </TabsTrigger>
            <TabsTrigger value="metrics" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              Metrics
            </TabsTrigger>
          </TabsList>

          {/* Prescription Library */}
          <TabsContent value="library" className="space-y-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search prescriptions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                Filter
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredPrescriptions.map((prescription) => (
                <PrescriptionCard
                  key={prescription.id}
                  prescription={prescription}
                  onView={handleViewPrescription}
                  onExecute={handleExecuteWorkflow}
                />
              ))}
            </div>
          </TabsContent>

          {/* Active Workflows */}
          <TabsContent value="workflows" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {mockWorkflowExecutions.map((workflow) => (
                <WorkflowExecutionCard
                  key={workflow.id}
                  workflow={workflow}
                  onContinue={handleContinueWorkflow}
                  onView={handleViewPrescription}
                />
              ))}
            </div>
          </TabsContent>

          {/* CMMS Integration */}
          <TabsContent value="cmms" className="space-y-4">
            <Card className="p-6 border-border bg-card">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">CMMS Integrations</h2>
              </div>
              <p className="text-muted-foreground mb-6">
                Two-way sync with enterprise maintenance management systems. Prescriptions can
                automatically create work orders and sync completion data.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockCMMSAdapters.map((adapter) => (
                  <CMMSIntegrationCard
                    key={adapter.system}
                    adapter={adapter}
                    onConnect={handleConnectCMMS}
                    onSync={handleSyncCMMS}
                  />
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Metrics & Analytics */}
          <TabsContent value="metrics" className="space-y-4">
            <Card className="p-6 border-border bg-card">
              <h2 className="text-xl font-semibold text-foreground mb-4">Closed Loop Metrics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Adoption Rate</p>
                  <p className="text-2xl font-bold text-foreground">
                    {mockPrescriptionMetrics.adoptionRate}%
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Prescriptions used vs traditional methods
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Avg. Completion Time</p>
                  <p className="text-2xl font-bold text-foreground">
                    {mockPrescriptionMetrics.averageCompletionTime} min
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Across all workflow executions
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Completed Workflows</p>
                  <p className="text-2xl font-bold text-foreground">
                    {mockPrescriptionMetrics.completedWorkflows}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Total workflows successfully completed
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-border bg-card">
              <h2 className="text-xl font-semibold text-foreground mb-4">Feedback Loop</h2>
              <p className="text-muted-foreground">
                Technician feedback drives continuous improvement of prescriptions and AI model
                retraining. {mockPrescriptionMetrics.completedWorkflows} workflows have provided
                feedback data for model optimization.
              </p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Prescriptions;

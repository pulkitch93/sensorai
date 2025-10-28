import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ReportCard } from "@/components/reports/ReportCard";
import { DeliveryHistoryCard } from "@/components/reports/DeliveryHistoryCard";
import { ExecutiveBriefCard } from "@/components/reports/ExecutiveBriefCard";
import { 
  mockReports, 
  mockReportDeliveries, 
  mockExecutiveBrief,
  mockReportMetrics 
} from "@/lib/reportsMockData";
import { 
  FileText,
  Plus,
  Search,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Share2,
  Filter
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Reports = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const handleEditReport = (id: string) => {
    toast({
      title: "Opening Report Builder",
      description: `Editing report ${id}`,
    });
  };

  const handleShareReport = (id: string) => {
    toast({
      title: "Share Report",
      description: "Generating secure share link...",
    });
  };

  const handleExportReport = (id: string) => {
    toast({
      title: "Exporting Report",
      description: "Your report is being prepared for download",
    });
  };

  const handleScheduleReport = (id: string) => {
    toast({
      title: "Schedule Configuration",
      description: "Opening delivery schedule settings",
    });
  };

  const handleExportBrief = () => {
    toast({
      title: "Exporting Executive Brief",
      description: "Generating PDF report...",
    });
  };

  const handleCreateReport = () => {
    toast({
      title: "Report Builder",
      description: "Opening report builder wizard",
    });
  };

  const filteredReports = mockReports.filter(
    (r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Reports & Analytics
            </h1>
            <p className="text-muted-foreground">
              Build, schedule, and share insightful reports
            </p>
          </div>
          <Button size="sm" onClick={handleCreateReport}>
            <Plus className="w-4 h-4 mr-2" />
            Create Report
          </Button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6 border-primary/50 bg-card">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Reports</p>
                <p className="text-3xl font-bold text-foreground">
                  {mockReportMetrics.totalReports}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-primary/20">
                <FileText className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-accent/50 bg-card">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Active Schedules</p>
                <p className="text-3xl font-bold text-foreground">
                  {mockReportMetrics.activeSchedules}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-accent/20">
                <Calendar className="w-6 h-6 text-accent" />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-success/50 bg-card">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Deliveries (MTD)</p>
                <p className="text-3xl font-bold text-foreground">
                  {mockReportMetrics.deliveriesThisMonth}
                </p>
                <p className="text-xs text-muted-foreground">
                  {mockReportMetrics.successRate}% success
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
                <p className="text-sm text-muted-foreground">Shared Reports</p>
                <p className="text-3xl font-bold text-foreground">
                  {mockReportMetrics.sharedReports}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-chart-2/20">
                <Share2 className="w-6 h-6 text-chart-2" />
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="reports" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto">
            <TabsTrigger value="reports" className="gap-2">
              <FileText className="w-4 h-4" />
              Reports
              <Badge variant="secondary" className="ml-1">
                {mockReportMetrics.totalReports}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="executive" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              Executive Brief
            </TabsTrigger>
            <TabsTrigger value="delivery" className="gap-2">
              <Calendar className="w-4 h-4" />
              Delivery History
            </TabsTrigger>
          </TabsList>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search reports..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredReports.map((report) => (
                <ReportCard
                  key={report.id}
                  report={report}
                  onEdit={handleEditReport}
                  onShare={handleShareReport}
                  onExport={handleExportReport}
                  onSchedule={handleScheduleReport}
                />
              ))}
            </div>
          </TabsContent>

          {/* Executive Brief Tab */}
          <TabsContent value="executive" className="space-y-4">
            <ExecutiveBriefCard 
              brief={mockExecutiveBrief}
              onExport={handleExportBrief}
            />
          </TabsContent>

          {/* Delivery History Tab */}
          <TabsContent value="delivery" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Audit Trail & Delivery Status
              </h2>
              <div className="space-y-3">
                {mockReportDeliveries.map((delivery) => (
                  <DeliveryHistoryCard key={delivery.id} delivery={delivery} />
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Reports;

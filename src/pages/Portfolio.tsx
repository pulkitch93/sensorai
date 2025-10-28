import { useState } from "react";
import { FilterBar } from "@/components/portfolio/FilterBar";
import { PortfolioKPICard } from "@/components/portfolio/PortfolioKPICard";
import { ROICard } from "@/components/portfolio/ROICard";
import { RiskHeatmap } from "@/components/portfolio/RiskHeatmap";
import { WaterfallChart } from "@/components/portfolio/WaterfallChart";
import { BenchmarkChart } from "@/components/portfolio/BenchmarkChart";
import { DateRange } from "react-day-picker";
import { 
  portfolioKPIs, 
  roiMetrics, 
  riskHeatmapData, 
  savingsWaterfall, 
  benchmarkData,
  mockSites,
  regions,
  assetClasses,
  criticality,
} from "@/lib/portfolioMockData";
import { exportToCSV, exportToPDF } from "@/lib/exportUtils";
import { TrendingUp, Building2, BarChart3 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Portfolio = () => {
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [selectedSite, setSelectedSite] = useState('All Sites');
  const [selectedAssetClass, setSelectedAssetClass] = useState('All Classes');
  const [selectedCriticality, setSelectedCriticality] = useState('All Levels');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2024, 0, 1),
    to: new Date(),
  });

  const sites = ['All Sites', ...mockSites.map(s => s.name)];

  const handleExportCSV = () => {
    const exportData = portfolioKPIs.map(kpi => ({
      Metric: kpi.label,
      Value: kpi.value,
      Change: `${kpi.change}%`,
      Target: kpi.target || 'N/A',
    }));
    exportToCSV(exportData, 'portfolio_kpis');
  };

  const handleExportPDF = () => {
    exportToPDF('portfolio-content', 'portfolio_dashboard');
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-[1600px] mx-auto space-y-6" id="portfolio-content">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Portfolio & Executive Overview
            </h1>
            <p className="text-muted-foreground">
              Enterprise-wide visibility and performance analytics
            </p>
          </div>
        </div>

        {/* Filters */}
        <FilterBar
          region={selectedRegion}
          setRegion={setSelectedRegion}
          site={selectedSite}
          setSite={setSelectedSite}
          assetClass={selectedAssetClass}
          setAssetClass={setSelectedAssetClass}
          criticality={selectedCriticality}
          setCriticality={setSelectedCriticality}
          dateRange={dateRange}
          setDateRange={setDateRange}
          onExportCSV={handleExportCSV}
          onExportPDF={handleExportPDF}
          regions={regions}
          sites={sites}
          assetClasses={assetClasses}
          criticalityLevels={criticality}
        />

        {/* Tabs for different views */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="overview" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="roi" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              ROI & Impact
            </TabsTrigger>
            <TabsTrigger value="sites" className="gap-2">
              <Building2 className="w-4 h-4" />
              Site Comparison
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Portfolio KPIs */}
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Enterprise KPIs</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {portfolioKPIs.map((kpi, idx) => (
                  <PortfolioKPICard key={idx} kpi={kpi} />
                ))}
              </div>
            </div>

            {/* Risk Heatmap */}
            <RiskHeatmap data={riskHeatmapData} />
          </TabsContent>

          {/* ROI Tab */}
          <TabsContent value="roi" className="space-y-6">
            {/* ROI Metrics */}
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-4">ROI & Impact Metrics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {roiMetrics.map((metric, idx) => (
                  <ROICard key={idx} metric={metric} />
                ))}
              </div>
            </div>

            {/* Waterfall Chart */}
            <WaterfallChart data={savingsWaterfall} />
          </TabsContent>

          {/* Sites Comparison Tab */}
          <TabsContent value="sites" className="space-y-6">
            {/* Benchmark Chart */}
            <BenchmarkChart data={benchmarkData} />

            {/* Site Cards */}
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Site Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockSites.map((site) => (
                  <div
                    key={site.id}
                    className="p-6 rounded-lg border-2 border-border bg-card hover:border-primary transition-all cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg text-foreground">{site.name}</h3>
                        <p className="text-sm text-muted-foreground">{site.location}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        site.status === 'healthy' ? 'bg-success/20 text-success' :
                        site.status === 'warning' ? 'bg-warning/20 text-warning' :
                        'bg-destructive/20 text-destructive'
                      }`}>
                        {site.status}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Region</span>
                        <span className="text-foreground font-medium">{site.region}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Assets</span>
                        <span className="text-foreground font-medium">{site.assetCount}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Portfolio;

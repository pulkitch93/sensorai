import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Download, Filter } from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

interface FilterBarProps {
  region: string;
  setRegion: (value: string) => void;
  site: string;
  setSite: (value: string) => void;
  assetClass: string;
  setAssetClass: (value: string) => void;
  criticality: string;
  setCriticality: (value: string) => void;
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
  onExportCSV: () => void;
  onExportPDF: () => void;
  regions: string[];
  sites: string[];
  assetClasses: string[];
  criticalityLevels: string[];
}

export const FilterBar = ({
  region,
  setRegion,
  site,
  setSite,
  assetClass,
  setAssetClass,
  criticality,
  setCriticality,
  dateRange,
  setDateRange,
  onExportCSV,
  onExportPDF,
  regions,
  sites,
  assetClasses,
  criticalityLevels,
}: FilterBarProps) => {
  return (
    <div className="flex flex-wrap gap-3 items-center p-4 bg-card border border-border rounded-lg">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Filter className="w-4 h-4" />
        <span className="font-medium">Filters:</span>
      </div>

      <Select value={region} onValueChange={setRegion}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Region" />
        </SelectTrigger>
        <SelectContent>
          {regions.map((r) => (
            <SelectItem key={r} value={r}>{r}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={site} onValueChange={setSite}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Site" />
        </SelectTrigger>
        <SelectContent>
          {sites.map((s) => (
            <SelectItem key={s} value={s}>{s}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={assetClass} onValueChange={setAssetClass}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Asset Class" />
        </SelectTrigger>
        <SelectContent>
          {assetClasses.map((ac) => (
            <SelectItem key={ac} value={ac}>{ac}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={criticality} onValueChange={setCriticality}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Criticality" />
        </SelectTrigger>
        <SelectContent>
          {criticalityLevels.map((c) => (
            <SelectItem key={c} value={c}>{c}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "MMM dd, yyyy")} - {format(dateRange.to, "MMM dd, yyyy")}
                </>
              ) : (
                format(dateRange.from, "MMM dd, yyyy")
              )
            ) : (
              <span>Pick date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={setDateRange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>

      <div className="ml-auto flex gap-2">
        <Button variant="outline" size="sm" onClick={onExportCSV}>
          <Download className="w-4 h-4 mr-2" />
          CSV
        </Button>
        <Button variant="outline" size="sm" onClick={onExportPDF}>
          <Download className="w-4 h-4 mr-2" />
          PDF
        </Button>
      </div>
    </div>
  );
};

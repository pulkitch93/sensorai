import { toast } from "@/hooks/use-toast";

export const exportToCSV = (data: any[], filename: string) => {
  try {
    if (!data || data.length === 0) {
      toast({
        title: "No data to export",
        description: "There is no data available to export.",
        variant: "destructive",
      });
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          if (typeof value === 'string' && value.includes(',')) {
            return `"${value}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    toast({
      title: "Export successful",
      description: `Data exported to ${filename}.csv`,
    });
  } catch (error) {
    toast({
      title: "Export failed",
      description: "Failed to export data to CSV.",
      variant: "destructive",
    });
  }
};

export const exportToPDF = (elementId: string, filename: string) => {
  toast({
    title: "PDF Export",
    description: "PDF export functionality requires a backend service. Use print dialog as alternative.",
  });
  
  // Trigger browser print dialog as fallback
  window.print();
};

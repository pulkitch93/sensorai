import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Report } from "@/types/reports";
import { 
  FileText,
  Calendar,
  Mail,
  Share2,
  Download,
  Edit,
  Clock,
  Users
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ReportCardProps {
  report: Report;
  onEdit?: (id: string) => void;
  onShare?: (id: string) => void;
  onExport?: (id: string) => void;
  onSchedule?: (id: string) => void;
}

export const ReportCard = ({ report, onEdit, onShare, onExport, onSchedule }: ReportCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-success/20 text-success border-success/30";
      case "draft":
        return "bg-warning/20 text-warning border-warning/30";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "site-scorecard": return "Site Scorecard";
      case "executive-brief": return "Executive Brief";
      case "asset-health": return "Asset Health";
      case "maintenance-summary": return "Maintenance Summary";
      case "energy-report": return "Energy Report";
      default: return "Custom Report";
    }
  };

  return (
    <Card className="p-6 hover:border-primary/50 transition-all">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-foreground">{report.name}</h3>
              <p className="text-sm text-muted-foreground">{report.description}</p>
            </div>
          </div>
          <Badge className={getStatusColor(report.status)}>
            {report.status}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{getTypeLabel(report.type)}</Badge>
          <Badge variant="outline">{report.configuration.layout}</Badge>
          <Badge variant="outline">{report.configuration.kpis.length} KPIs</Badge>
        </div>

        {report.schedule?.enabled && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-accent/10 border border-accent/30">
            <Calendar className="w-4 h-4 text-accent" />
            <span className="text-sm text-foreground">
              Scheduled {report.schedule.frequency} on {report.schedule.dayOfWeek !== undefined ? 
                ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][report.schedule.dayOfWeek] :
                `day ${report.schedule.dayOfMonth}`} at {report.schedule.time}
            </span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
          {report.schedule && (
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-muted-foreground text-xs">
                <Mail className="w-3 h-3" />
                <span>Recipients</span>
              </div>
              <p className="text-sm font-medium text-foreground">
                {report.schedule.recipients.length} contacts
              </p>
            </div>
          )}
          {report.sharing?.enabled && (
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-muted-foreground text-xs">
                <Share2 className="w-3 h-3" />
                <span>Sharing</span>
              </div>
              <p className="text-sm font-medium text-foreground">
                {report.sharing.requiresAuth ? "Protected" : "Public"}
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="text-xs text-muted-foreground">
            <p>Updated {formatDistanceToNow(report.updatedAt, { addSuffix: true })}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onEdit?.(report.id)}>
              <Edit className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => onShare?.(report.id)}>
              <Share2 className="w-4 h-4" />
            </Button>
            <Button size="sm" onClick={() => onExport?.(report.id)}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

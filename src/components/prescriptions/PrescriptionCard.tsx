import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Prescription } from "@/types/prescriptions";
import { Clock, CheckCircle2, Users, FileCheck, Sparkles, TrendingUp } from "lucide-react";

interface PrescriptionCardProps {
  prescription: Prescription;
  onView: (id: string) => void;
  onExecute: (id: string) => void;
}

export const PrescriptionCard = ({ prescription, onView, onExecute }: PrescriptionCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-success/20 text-success border-success/30";
      case "active": return "bg-primary/20 text-primary border-primary/30";
      case "draft": return "bg-warning/20 text-warning border-warning/30";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "ai-generated": return <Sparkles className="w-4 h-4" />;
      case "expert": return <Users className="w-4 h-4" />;
      default: return <FileCheck className="w-4 h-4" />;
    }
  };

  return (
    <Card className="p-6 hover:border-primary/50 transition-all">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground text-lg">{prescription.title}</h3>
              {prescription.requiresApproval && prescription.approvedBy && (
                <CheckCircle2 className="w-4 h-4 text-success" />
              )}
            </div>
            <p className="text-sm text-muted-foreground">{prescription.description}</p>
          </div>
          <Badge className={getStatusColor(prescription.status)}>
            {prescription.status}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="gap-1">
            {getSourceIcon(prescription.source)}
            {prescription.source}
          </Badge>
          <Badge variant="outline">{prescription.assetType}</Badge>
          <Badge variant="outline">{prescription.category}</Badge>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-muted-foreground text-xs">
              <Clock className="w-3 h-3" />
              <span>Duration</span>
            </div>
            <p className="text-sm font-semibold text-foreground">{prescription.estimatedDuration} min</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-muted-foreground text-xs">
              <TrendingUp className="w-3 h-3" />
              <span>Success Rate</span>
            </div>
            <p className="text-sm font-semibold text-foreground">{prescription.successRate}%</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs">Usage Count</p>
            <p className="text-sm font-semibold text-foreground">{prescription.usageCount}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs">Rating</p>
            <p className="text-sm font-semibold text-foreground">
              {prescription.effectivenessRating ? `⭐ ${prescription.effectivenessRating.toFixed(1)}` : "N/A"}
            </p>
          </div>
        </div>

        {prescription.cmmsLinked && prescription.cmmsLinked.length > 0 && (
          <div className="flex items-center gap-2 pt-2 border-t border-border">
            <span className="text-xs text-muted-foreground">Synced to:</span>
            {prescription.cmmsLinked.map((system) => (
              <Badge key={system} variant="secondary" className="text-xs">
                {system}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={() => onView(prescription.id)} className="flex-1">
            View Details
          </Button>
          <Button size="sm" onClick={() => onExecute(prescription.id)} className="flex-1">
            Execute Workflow
          </Button>
        </div>
      </div>
    </Card>
  );
};

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ReportDelivery } from "@/types/reports";
import { 
  CheckCircle2,
  XCircle,
  Clock,
  Mail,
  MessageSquare,
  Users,
  AlertCircle
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

interface DeliveryHistoryCardProps {
  delivery: ReportDelivery;
}

export const DeliveryHistoryCard = ({ delivery }: DeliveryHistoryCardProps) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "delivered":
        return { 
          color: "bg-success/20 text-success border-success/30", 
          icon: CheckCircle2,
          label: "Delivered"
        };
      case "failed":
        return { 
          color: "bg-destructive/20 text-destructive border-destructive/30", 
          icon: XCircle,
          label: "Failed"
        };
      case "sending":
        return { 
          color: "bg-primary/20 text-primary border-primary/30", 
          icon: Clock,
          label: "Sending"
        };
      default:
        return { 
          color: "bg-secondary text-secondary-foreground", 
          icon: Clock,
          label: "Pending"
        };
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "email": return Mail;
      case "slack": return MessageSquare;
      case "teams": return Users;
      default: return Mail;
    }
  };

  const statusConfig = getStatusConfig(delivery.status);
  const StatusIcon = statusConfig.icon;
  const ChannelIcon = getChannelIcon(delivery.channel);

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            delivery.status === 'delivered' ? 'bg-success/20' : 
            delivery.status === 'failed' ? 'bg-destructive/20' : 'bg-secondary'
          }`}>
            <StatusIcon className={`w-5 h-5 ${
              delivery.status === 'delivered' ? 'text-success' : 
              delivery.status === 'failed' ? 'text-destructive' : 'text-muted-foreground'
            }`} />
          </div>
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-sm text-foreground">{delivery.reportName}</h4>
              <Badge className={statusConfig.color} variant="outline">
                {statusConfig.label}
              </Badge>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <ChannelIcon className="w-3 h-3" />
                <span className="capitalize">{delivery.channel}</span>
              </div>
              <span>•</span>
              <span>{delivery.recipients.length} recipient{delivery.recipients.length > 1 ? 's' : ''}</span>
              <span>•</span>
              <span className="uppercase">{delivery.format}</span>
            </div>
            {delivery.errorMessage && (
              <div className="flex items-center gap-1 text-xs text-destructive">
                <AlertCircle className="w-3 h-3" />
                <span>{delivery.errorMessage}</span>
              </div>
            )}
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">
            {delivery.deliveredAt ? 
              format(delivery.deliveredAt, 'MMM d, HH:mm') :
              format(delivery.scheduledAt, 'MMM d, HH:mm')}
          </p>
          <p className="text-xs text-muted-foreground">
            {delivery.deliveredAt ? 
              formatDistanceToNow(delivery.deliveredAt, { addSuffix: true }) :
              'Scheduled'}
          </p>
        </div>
      </div>
    </Card>
  );
};

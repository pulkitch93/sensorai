import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WorkOrder, OperatorNote, BOMItem } from "@/types/assetDetail";
import { Alert } from "@/types/asset";
import { format } from "date-fns";
import { Clock, User, Wrench, Package, AlertTriangle, DollarSign } from "lucide-react";

interface AssetHistoryTabsProps {
  workOrders: WorkOrder[];
  operatorNotes: OperatorNote[];
  bom: BOMItem[];
  alerts: Alert[];
}

export const AssetHistoryTabs = ({ workOrders, operatorNotes, bom, alerts }: AssetHistoryTabsProps) => {
  const statusColors = {
    open: "bg-primary/20 text-primary border-primary/40",
    "in-progress": "bg-warning/20 text-warning border-warning/40",
    completed: "bg-success/20 text-success border-success/40",
    cancelled: "bg-muted text-muted-foreground border-border",
  };

  const priorityColors = {
    low: "bg-muted text-muted-foreground border-border",
    medium: "bg-primary/20 text-primary border-primary/40",
    high: "bg-warning/20 text-warning border-warning/40",
    critical: "bg-destructive/20 text-destructive border-destructive/40",
  };

  const noteColors = {
    observation: "bg-primary/20 text-primary border-primary/40",
    issue: "bg-warning/20 text-warning border-warning/40",
    fix: "bg-success/20 text-success border-success/40",
    general: "bg-muted text-muted-foreground border-border",
  };

  return (
    <Tabs defaultValue="work-orders" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="work-orders">Work Orders</TabsTrigger>
        <TabsTrigger value="alerts">Alerts</TabsTrigger>
        <TabsTrigger value="notes">Notes</TabsTrigger>
        <TabsTrigger value="bom">BOM</TabsTrigger>
      </TabsList>

      <TabsContent value="work-orders" className="space-y-4">
        {workOrders.map((wo) => (
          <Card key={wo.id} className="p-4 border-border">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-foreground">{wo.title}</h4>
                  <Badge className={statusColors[wo.status]} variant="outline">
                    {wo.status}
                  </Badge>
                  <Badge className={priorityColors[wo.priority]} variant="outline">
                    {wo.priority}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{wo.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Assignee</p>
                  <p className="text-foreground">{wo.assignee}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Hours</p>
                  <p className="text-foreground">
                    {wo.actualHours || wo.estimatedHours}h
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Cost</p>
                  <p className="text-foreground">${wo.cost}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Type</p>
                  <p className="text-foreground capitalize">{wo.type}</p>
                </div>
              </div>
            </div>

            {wo.notes && (
              <p className="text-sm text-muted-foreground mt-3 pt-3 border-t border-border">
                {wo.notes}
              </p>
            )}
          </Card>
        ))}
      </TabsContent>

      <TabsContent value="alerts" className="space-y-4">
        {alerts.map((alert) => (
          <Card key={alert.id} className="p-4 border-border">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-destructive mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-foreground">{alert.title}</h4>
                  <Badge variant="outline" className={priorityColors[alert.severity]}>
                    {alert.severity}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
                <p className="text-xs text-muted-foreground">
                  {format(alert.timestamp, "MMM dd, yyyy HH:mm")}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </TabsContent>

      <TabsContent value="notes" className="space-y-4">
        {operatorNotes.map((note) => (
          <Card key={note.id} className="p-4 border-border">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">{note.author}</span>
                <Badge className={noteColors[note.category]} variant="outline">
                  {note.category}
                </Badge>
              </div>
              <span className="text-xs text-muted-foreground">
                {format(note.timestamp, "MMM dd, HH:mm")}
              </span>
            </div>
            <p className="text-sm text-foreground">{note.content}</p>
          </Card>
        ))}
      </TabsContent>

      <TabsContent value="bom" className="space-y-4">
        {bom.map((item) => (
          <Card key={item.id} className="p-4 border-border">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <Package className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-semibold text-foreground">{item.description}</h4>
                  <p className="text-sm text-muted-foreground mb-2">PN: {item.partNumber}</p>
                  <div className="grid grid-cols-2 gap-x-4 text-sm">
                    <span className="text-muted-foreground">Qty: {item.quantity}</span>
                    <span className="text-muted-foreground">Supplier: {item.supplier}</span>
                    <span className="text-muted-foreground">Lead Time: {item.leadTime} days</span>
                    <span className="text-foreground font-medium">${item.cost}</span>
                  </div>
                </div>
              </div>
              <Badge variant="outline" className={item.inStock ? "bg-success/20 text-success border-success/40" : "bg-warning/20 text-warning border-warning/40"}>
                {item.inStock ? "In Stock" : "Order Required"}
              </Badge>
            </div>
          </Card>
        ))}
      </TabsContent>
    </Tabs>
  );
};

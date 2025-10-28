import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { AlertRule } from "@/types/alerts";
import { Plus, Settings2, TrendingUp, Activity, Zap, GitBranch } from "lucide-react";

interface RuleTemplatesDialogProps {
  rules: AlertRule[];
  onToggleRule: (ruleId: string) => void;
}

export const RuleTemplatesDialog = ({ rules, onToggleRule }: RuleTemplatesDialogProps) => {
  const [open, setOpen] = useState(false);

  const ruleIcons = {
    threshold: Activity,
    "rate-of-change": TrendingUp,
    "multivariate-anomaly": GitBranch,
    "sequence-pattern": Settings2,
    "energy-exception": Zap,
  };

  const ruleColors = {
    threshold: "text-primary",
    "rate-of-change": "text-warning",
    "multivariate-anomaly": "text-chart-2",
    "sequence-pattern": "text-accent",
    "energy-exception": "text-chart-3",
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Settings2 className="w-4 h-4" />
          Rule Templates ({rules.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-popover">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings2 className="w-5 h-5" />
            Alert Rule Templates
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <Button className="w-full gap-2">
            <Plus className="w-4 h-4" />
            Create New Rule
          </Button>

          <div className="space-y-3">
            {rules.map((rule) => {
              const Icon = ruleIcons[rule.type];
              return (
                <Card key={rule.id} className="p-4 border-border">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`p-2 rounded-lg bg-muted`}>
                        <Icon className={`w-5 h-5 ${ruleColors[rule.type]}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-foreground">{rule.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            {rule.type.replace("-", " ")}
                          </Badge>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <span>Assets: {rule.assetIds.length}</span>
                            <span>•</span>
                            <span>Actions: {rule.actions.length}</span>
                            {rule.suppressionWindow && (
                              <>
                                <span>•</span>
                                <span>Suppression: {rule.suppressionWindow}m</span>
                              </>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-1">
                            {rule.parameters.tags?.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          {rule.lastTriggered && (
                            <p className="text-xs text-muted-foreground">
                              Last triggered: {rule.lastTriggered.toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Switch
                        checked={rule.enabled}
                        onCheckedChange={() => onToggleRule(rule.id)}
                      />
                      <Button size="sm" variant="ghost">
                        Edit
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

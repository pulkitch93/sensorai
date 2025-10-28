import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bot, Play, Settings, Activity, CheckCircle2, Clock } from 'lucide-react';
import { AgentConfig } from '@/types/agents';

interface AgentCardProps {
  config: AgentConfig;
  lastRun?: Date;
  successRate?: number;
  onRun: () => void;
  onConfigure: () => void;
}

export function AgentCard({ config, lastRun, successRate, onRun, onConfigure }: AgentCardProps) {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div className={`p-2 rounded-lg ${config.enabled ? 'bg-primary/10' : 'bg-muted'}`}>
              <Bot className={`h-5 w-5 ${config.enabled ? 'text-primary' : 'text-muted-foreground'}`} />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold">{config.name}</h4>
                <Badge variant={config.enabled ? 'default' : 'secondary'}>
                  {config.enabled ? 'Active' : 'Inactive'}
                </Badge>
                {config.autoTrigger && (
                  <Badge variant="outline" className="text-xs">
                    Auto
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{config.description}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Activity className="h-3 w-3" />
            <span>{config.tools.length} tools</span>
          </div>
          {lastRun && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>Last run: {lastRun.toLocaleDateString()}</span>
            </div>
          )}
          {successRate !== undefined && (
            <div className="flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              <span>{successRate}% success</span>
            </div>
          )}
        </div>

        {config.requiresHumanApproval && (
          <div className="text-xs text-warning flex items-center gap-1">
            <span>⚠️ Requires human approval</span>
          </div>
        )}

        <div className="flex gap-2 pt-2 border-t">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={onRun}
            disabled={!config.enabled}
          >
            <Play className="h-3 w-3 mr-1" />
            Run Now
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={onConfigure}
          >
            <Settings className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

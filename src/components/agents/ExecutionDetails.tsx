import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle2, XCircle, Clock, AlertCircle, FileText, Wrench } from 'lucide-react';
import { AgentExecution } from '@/types/agents';

interface ExecutionDetailsProps {
  execution: AgentExecution;
}

export function ExecutionDetails({ execution }: ExecutionDetailsProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-5 w-5 text-success" />;
      case 'failed': return <XCircle className="h-5 w-5 text-destructive" />;
      case 'running': return <Clock className="h-5 w-5 text-primary animate-pulse" />;
      case 'awaiting-approval': return <AlertCircle className="h-5 w-5 text-warning" />;
      default: return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'secondary';
      case 'failed': return 'destructive';
      case 'running': return 'default';
      case 'awaiting-approval': return 'outline';
      default: return 'secondary';
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getStatusIcon(execution.status)}
            <div>
              <h3 className="font-semibold text-lg">{execution.agentName}</h3>
              <p className="text-sm text-muted-foreground">
                Execution ID: {execution.id}
              </p>
            </div>
          </div>
          <Badge variant={getStatusColor(execution.status)}>
            {execution.status}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Started</p>
            <p className="font-medium">{execution.startedAt.toLocaleString()}</p>
          </div>
          {execution.completedAt && (
            <div>
              <p className="text-muted-foreground">Completed</p>
              <p className="font-medium">{execution.completedAt.toLocaleString()}</p>
            </div>
          )}
          <div>
            <p className="text-muted-foreground">Triggered By</p>
            <p className="font-medium capitalize">{execution.triggeredBy}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Audit Log</p>
            <p className="font-medium font-mono text-xs">{execution.auditLogId}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            <h4 className="font-semibold">Inputs</h4>
          </div>
          <Card className="p-3 bg-muted">
            <pre className="text-xs overflow-x-auto">
              {JSON.stringify(execution.inputs, null, 2)}
            </pre>
          </Card>
        </div>

        {execution.reasoning && (
          <div className="space-y-3">
            <h4 className="font-semibold">AI Reasoning</h4>
            <Card className="p-3 bg-primary/5">
              <p className="text-sm">{execution.reasoning}</p>
            </Card>
          </div>
        )}

        {execution.outputs && (
          <div className="space-y-3">
            <h4 className="font-semibold">Outputs</h4>
            <Card className="p-3 bg-muted">
              <pre className="text-xs overflow-x-auto">
                {JSON.stringify(execution.outputs, null, 2)}
              </pre>
            </Card>
          </div>
        )}

        {execution.toolCalls.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Wrench className="h-4 w-4 text-primary" />
              <h4 className="font-semibold">Tool Calls ({execution.toolCalls.length})</h4>
            </div>
            <ScrollArea className="h-[200px]">
              <div className="space-y-2">
                {execution.toolCalls.map((call) => (
                  <Card key={call.id} className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{call.toolName}</span>
                        {call.success ? (
                          <CheckCircle2 className="h-3 w-3 text-success" />
                        ) : (
                          <XCircle className="h-3 w-3 text-destructive" />
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {call.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="text-xs space-y-1">
                      <div>
                        <span className="font-medium">Parameters:</span>
                        <pre className="mt-1 p-2 bg-muted rounded overflow-x-auto">
                          {JSON.stringify(call.parameters, null, 2)}
                        </pre>
                      </div>
                      {call.result && (
                        <div>
                          <span className="font-medium">Result:</span>
                          <pre className="mt-1 p-2 bg-muted rounded overflow-x-auto">
                            {JSON.stringify(call.result, null, 2)}
                          </pre>
                        </div>
                      )}
                      {call.error && (
                        <div className="text-destructive">
                          <span className="font-medium">Error:</span> {call.error}
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {execution.guardrailChecks.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold">Guardrail Checks</h4>
            <div className="space-y-2">
              {execution.guardrailChecks.map((check) => (
                <Card key={check.id} className="p-3">
                  <div className="flex items-start gap-2">
                    {check.passed ? (
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-warning mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{check.message}</p>
                      {check.details && (
                        <pre className="text-xs mt-2 p-2 bg-muted rounded overflow-x-auto">
                          {JSON.stringify(check.details, null, 2)}
                        </pre>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {execution.error && (
          <div className="space-y-3">
            <h4 className="font-semibold text-destructive">Error</h4>
            <Card className="p-3 bg-destructive/10 border-destructive">
              <p className="text-sm">{execution.error}</p>
            </Card>
          </div>
        )}
      </div>
    </Card>
  );
}

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Bot, Zap, CheckSquare, FileText, TrendingUp, Activity } from 'lucide-react';
import { AgentCard } from '@/components/agents/AgentCard';
import { ExecutionDetails } from '@/components/agents/ExecutionDetails';
import { ApprovalQueue } from '@/components/agents/ApprovalQueue';
import { agentConfigs, agentExecutions, agentMetrics } from '@/lib/agentsMockData';
import { AgentExecution } from '@/types/agents';
import { useToast } from '@/hooks/use-toast';

export default function Agents() {
  const [selectedExecution, setSelectedExecution] = useState<AgentExecution | null>(null);
  const { toast } = useToast();

  const handleRunAgent = (agentId: string, agentName: string) => {
    toast({
      title: "Agent Started",
      description: `${agentName} is now running. You'll see results shortly.`,
    });
  };

  const handleConfigureAgent = (agentId: string, agentName: string) => {
    toast({
      title: "Configuration",
      description: `Opening configuration for ${agentName}`,
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Agents & Automations</h1>
          <p className="text-muted-foreground mt-1">
            Intelligent automation with tool access, guardrails, and human oversight
          </p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          <Bot className="h-4 w-4 mr-2" />
          {agentMetrics.activeAgents} Active
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Executions</p>
              <p className="text-2xl font-bold">{agentMetrics.totalExecutions}</p>
            </div>
            <Activity className="h-8 w-8 text-primary opacity-20" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Success Rate</p>
              <p className="text-2xl font-bold">{agentMetrics.successRate}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-success opacity-20" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending Approvals</p>
              <p className="text-2xl font-bold">{agentMetrics.pendingApprovals}</p>
            </div>
            <CheckSquare className="h-8 w-8 text-warning opacity-20" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Runs Today</p>
              <p className="text-2xl font-bold">{agentMetrics.automationsRunToday}</p>
            </div>
            <Zap className="h-8 w-8 text-primary opacity-20" />
          </div>
        </Card>
      </div>

      <Tabs defaultValue="agents" className="space-y-4">
        <TabsList>
          <TabsTrigger value="agents" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            AI Agents
          </TabsTrigger>
          <TabsTrigger value="executions" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Execution History
          </TabsTrigger>
          <TabsTrigger value="approvals" className="flex items-center gap-2">
            <CheckSquare className="h-4 w-4" />
            Approvals
            {agentMetrics.pendingApprovals > 0 && (
              <Badge variant="destructive">{agentMetrics.pendingApprovals}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="audit" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Audit Trail
          </TabsTrigger>
        </TabsList>

        <TabsContent value="agents" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {agentConfigs.map((config) => (
              <AgentCard
                key={config.id}
                config={config}
                lastRun={agentExecutions.find(e => e.agentId === config.id)?.startedAt}
                successRate={config.id === 'agent-diag' ? 96 : config.id === 'agent-triage' ? 98 : 94}
                onRun={() => handleRunAgent(config.id, config.name)}
                onConfigure={() => handleConfigureAgent(config.id, config.name)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="executions">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-3">
              <h3 className="font-semibold">Recent Executions</h3>
              <div className="space-y-2">
                {agentExecutions.map((execution) => (
                  <Card
                    key={execution.id}
                    className={`p-3 cursor-pointer hover:shadow-md transition-shadow ${
                      selectedExecution?.id === execution.id ? 'border-primary' : ''
                    }`}
                    onClick={() => setSelectedExecution(execution)}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{execution.agentName}</span>
                        <Badge variant={
                          execution.status === 'completed' ? 'secondary' :
                          execution.status === 'failed' ? 'destructive' :
                          execution.status === 'awaiting-approval' ? 'outline' :
                          'default'
                        }>
                          {execution.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {execution.startedAt.toLocaleString()}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2">
              {selectedExecution ? (
                <ExecutionDetails execution={selectedExecution} />
              ) : (
                <Card className="p-12 text-center text-muted-foreground">
                  <Bot className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Select an execution to view details</p>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="approvals">
          <ApprovalQueue />
        </TabsContent>

        <TabsContent value="audit">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Agent Audit Trail</h3>
            <div className="space-y-3">
              {agentExecutions.map((execution) => (
                <Card key={execution.id} className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{execution.agentType}</Badge>
                        <span className="font-medium">{execution.agentName}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {execution.startedAt.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="text-sm space-y-1">
                      <div className="flex gap-4">
                        <span className="text-muted-foreground">Audit Log:</span>
                        <span className="font-mono text-xs">{execution.auditLogId}</span>
                      </div>
                      <div className="flex gap-4">
                        <span className="text-muted-foreground">Triggered:</span>
                        <span className="capitalize">{execution.triggeredBy}</span>
                      </div>
                      <div className="flex gap-4">
                        <span className="text-muted-foreground">Tools Used:</span>
                        <span>{execution.toolCalls.length}</span>
                      </div>
                      {execution.requiresApproval && (
                        <div className="flex gap-4">
                          <span className="text-muted-foreground">Approval:</span>
                          <Badge variant="outline">
                            {execution.approvalStatus || 'Pending'}
                          </Badge>
                        </div>
                      )}
                    </div>

                    {execution.reasoning && (
                      <Card className="p-2 bg-muted text-xs">
                        <p className="font-medium mb-1">Decision Reasoning:</p>
                        <p>{execution.reasoning}</p>
                      </Card>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

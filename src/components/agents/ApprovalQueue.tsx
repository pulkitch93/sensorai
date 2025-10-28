import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { humanApprovalRequests } from '@/lib/agentsMockData';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export function ApprovalQueue() {
  const [reviewNotes, setReviewNotes] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const handleApprove = (requestId: string) => {
    toast({
      title: "Approved",
      description: "Agent execution approved and will proceed",
    });
  };

  const handleReject = (requestId: string) => {
    if (!reviewNotes[requestId]?.trim()) {
      toast({
        title: "Review Notes Required",
        description: "Please provide a reason for rejection",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Rejected",
      description: "Agent execution rejected",
      variant: "destructive"
    });
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-warning" />
          <h3 className="text-lg font-semibold">Pending Approvals</h3>
          <Badge variant="destructive">{humanApprovalRequests.length}</Badge>
        </div>

        <div className="space-y-4">
          {humanApprovalRequests.map((request) => (
            <Card key={request.id} className="p-4 border-warning">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold">{request.agentName}</h4>
                      <Badge variant="outline">{request.agentType}</Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {request.requestedAt.toLocaleTimeString()}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium mb-1">Inputs:</p>
                    <Card className="p-2 bg-muted">
                      <pre className="text-xs overflow-x-auto">
                        {JSON.stringify(request.inputs, null, 2)}
                      </pre>
                    </Card>
                  </div>

                  <div>
                    <p className="font-medium mb-1">Proposed Outputs:</p>
                    <Card className="p-2 bg-muted">
                      <pre className="text-xs overflow-x-auto">
                        {JSON.stringify(request.proposedOutputs, null, 2)}
                      </pre>
                    </Card>
                  </div>

                  <div>
                    <p className="font-medium mb-1">AI Reasoning:</p>
                    <Card className="p-3 bg-primary/5">
                      <p>{request.reasoning}</p>
                    </Card>
                  </div>

                  <div className="p-3 bg-warning/10 rounded border border-warning">
                    <p className="font-medium mb-1">Impact Assessment:</p>
                    <p>{request.impact}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`notes-${request.id}`}>Review Notes</Label>
                  <Textarea
                    id={`notes-${request.id}`}
                    value={reviewNotes[request.id] || ''}
                    onChange={(e) => setReviewNotes({
                      ...reviewNotes,
                      [request.id]: e.target.value
                    })}
                    placeholder="Add notes about your decision..."
                    rows={3}
                  />
                </div>

                <div className="flex gap-2 pt-2 border-t">
                  <Button 
                    className="flex-1"
                    onClick={() => handleApprove(request.id)}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="flex-1"
                    onClick={() => handleReject(request.id)}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
              </div>
            </Card>
          ))}

          {humanApprovalRequests.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <CheckCircle2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No pending approvals</p>
              <p className="text-sm mt-1">All agent executions are up to date</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

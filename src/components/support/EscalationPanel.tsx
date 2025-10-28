import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Clock, User, CheckCircle2 } from 'lucide-react';
import { smeTickets } from '@/lib/supportMockData';
import { ChatMessage, TicketPriority } from '@/types/support';
import { useToast } from '@/hooks/use-toast';

export function EscalationPanel({ 
  initialTranscript 
}: { 
  initialTranscript?: ChatMessage[] 
}) {
  const [priority, setPriority] = useState<TicketPriority>('medium');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const { toast } = useToast();

  const handleEscalate = () => {
    if (!subject || !description) {
      toast({
        title: "Missing Information",
        description: "Please provide a subject and description for the escalation.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Escalation Created",
      description: `Your request has been escalated to an SME with ${priority} priority. You'll receive updates via email.`,
    });

    setSubject('');
    setDescription('');
    setPriority('medium');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'secondary';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'text-success';
      case 'in-progress': return 'text-primary';
      case 'assigned': return 'text-blue-500';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4">Create SME Escalation</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="priority">Priority Level</Label>
            <Select value={priority} onValueChange={(v) => setPriority(v as TicketPriority)}>
              <SelectTrigger id="priority">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low - General Question</SelectItem>
                <SelectItem value="medium">Medium - Technical Issue</SelectItem>
                <SelectItem value="high">High - Production Impact</SelectItem>
                <SelectItem value="critical">Critical - System Down</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="subject">Subject</Label>
            <input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Brief description of the issue"
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div>
            <Label htmlFor="description">Detailed Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide detailed information about the issue, including what you've already tried..."
              rows={6}
            />
          </div>

          {initialTranscript && initialTranscript.length > 0 && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-1">Chat Transcript Included</p>
              <p className="text-xs text-muted-foreground">
                Your conversation history ({initialTranscript.length} messages) will be attached to help the SME understand context.
              </p>
            </div>
          )}

          <div className="flex gap-2 pt-4 border-t">
            <Button onClick={handleEscalate} className="flex-1">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Escalate to SME
            </Button>
            <Button variant="outline" className="flex-1">
              Save as Draft
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4">Active SME Tickets</h3>
        <div className="space-y-3">
          {smeTickets.map(ticket => (
            <Card key={ticket.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={getPriorityColor(ticket.priority)}>
                        {ticket.priority}
                      </Badge>
                      <Badge variant="outline" className={getStatusColor(ticket.status)}>
                        {ticket.status}
                      </Badge>
                    </div>
                    <h4 className="font-medium text-sm">{ticket.subject}</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {ticket.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  {ticket.assignedTo && (
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{ticket.assignedTo}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>
                      SLA: {ticket.slaDeadline.toLocaleTimeString()}
                    </span>
                  </div>
                </div>

                {ticket.status === 'resolved' && ticket.resolution && (
                  <div className="pt-2 border-t">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs font-medium">Resolution</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {ticket.resolution}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))}

          {smeTickets.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">No active tickets</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

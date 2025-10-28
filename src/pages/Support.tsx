import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, BookOpen, AlertTriangle, Clock, TrendingUp, Users } from 'lucide-react';
import { ChatInterface } from '@/components/support/ChatInterface';
import { KnowledgeBase } from '@/components/support/KnowledgeBase';
import { EscalationPanel } from '@/components/support/EscalationPanel';
import { supportMetrics } from '@/lib/supportMockData';
import { ChatMessage } from '@/types/support';

export default function Support() {
  const [escalationTranscript, setEscalationTranscript] = useState<ChatMessage[]>([]);
  const [activeTab, setActiveTab] = useState('chat');

  const handleEscalate = (transcript: ChatMessage[]) => {
    setEscalationTranscript(transcript);
    setActiveTab('escalation');
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">24x7 Expert Support</h1>
          <p className="text-muted-foreground mt-1">
            AI-powered assistance with SME escalation
          </p>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          <MessageSquare className="h-4 w-4 mr-2" />
          Online
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg Response Time</p>
              <p className="text-2xl font-bold">{supportMetrics.avgResponseTime}m</p>
            </div>
            <Clock className="h-8 w-8 text-primary opacity-20" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Resolution Rate</p>
              <p className="text-2xl font-bold">{supportMetrics.resolutionRate}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-success opacity-20" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active SME Tickets</p>
              <p className="text-2xl font-bold">{supportMetrics.activeSMETickets}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-warning opacity-20" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Sessions Today</p>
              <p className="text-2xl font-bold">{supportMetrics.chatSessionsToday}</p>
            </div>
            <Users className="h-8 w-8 text-primary opacity-20" />
          </div>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            AI Assistant
          </TabsTrigger>
          <TabsTrigger value="kb" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Knowledge Base
          </TabsTrigger>
          <TabsTrigger value="escalation" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            SME Escalation
            {supportMetrics.activeSMETickets > 0 && (
              <Badge variant="destructive" className="ml-2">
                {supportMetrics.activeSMETickets}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ChatInterface onEscalate={handleEscalate} />
            </div>
            <div className="space-y-4">
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Quick Tips</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Ask about specific assets by name or ID</p>
                  <p>• Reference recent alerts for context</p>
                  <p>• Request troubleshooting steps</p>
                  <p>• Get citations to KB articles</p>
                  <p>• Escalate to human SMEs anytime</p>
                </div>
              </Card>

              <Card className="p-4">
                <h3 className="font-semibold mb-3">Common Queries</h3>
                <div className="space-y-2">
                  {[
                    'Vibration analysis for Asset-1',
                    'Temperature trending on Pump-3B',
                    'Gateway connectivity issues',
                    'RUL prediction confidence',
                    'Bearing replacement procedure'
                  ].map((query, idx) => (
                    <button
                      key={idx}
                      className="w-full text-left text-sm p-2 rounded hover:bg-accent transition-colors"
                    >
                      {query}
                    </button>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="kb">
          <KnowledgeBase />
        </TabsContent>

        <TabsContent value="escalation">
          <EscalationPanel initialTranscript={escalationTranscript} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

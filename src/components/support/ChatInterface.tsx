import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Send, Bot, User, ExternalLink, FileText, Activity, BarChart3 } from 'lucide-react';
import { ChatMessage } from '@/types/support';
import { aiResponseTemplates } from '@/lib/supportMockData';

export function ChatInterface({ onEscalate }: { onEscalate: (transcript: ChatMessage[]) => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI support assistant. I can help with diagnostics, asset history, troubleshooting, and answer questions about your equipment. How can I help you today?',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');

  const getCitationIcon = (type: string) => {
    switch (type) {
      case 'kb-article': return <FileText className="h-3 w-3" />;
      case 'asset-history': return <Activity className="h-3 w-3" />;
      case 'diagnostic-chart': return <BarChart3 className="h-3 w-3" />;
      default: return <ExternalLink className="h-3 w-3" />;
    }
  };

  const generateAIResponse = (userMessage: string): ChatMessage => {
    const lowerMessage = userMessage.toLowerCase();
    
    let template = aiResponseTemplates.default;
    if (lowerMessage.includes('vibration') || lowerMessage.includes('bearing')) {
      template = aiResponseTemplates.vibration;
    } else if (lowerMessage.includes('temperature') || lowerMessage.includes('temp') || lowerMessage.includes('heat')) {
      template = aiResponseTemplates.temperature;
    } else if (lowerMessage.includes('rul') || lowerMessage.includes('remaining') || lowerMessage.includes('life')) {
      template = aiResponseTemplates.rul;
    } else if (lowerMessage.includes('gateway') || lowerMessage.includes('connectivity') || lowerMessage.includes('network')) {
      template = aiResponseTemplates.gateway;
    }

    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: template.content,
      timestamp: new Date(),
      citations: template.citations,
      troubleshootingSteps: template.troubleshootingSteps.length > 0 ? template.troubleshootingSteps : undefined
    };
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Simulate AI thinking delay
    setTimeout(() => {
      const aiResponse = generateAIResponse(input);
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <Card className="flex flex-col h-[600px]">
      <div className="border-b p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          <div>
            <h3 className="font-semibold">AI Support Assistant</h3>
            <p className="text-xs text-muted-foreground">Context-aware help with citations</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => onEscalate(messages)}>
          Escalate to SME
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                </div>
              )}
              
              <div className={`flex-1 max-w-[80%] ${message.role === 'user' ? 'order-first' : ''}`}>
                <div
                  className={`p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground ml-auto'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>

                {message.citations && message.citations.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Sources:</p>
                    {message.citations.map((citation, idx) => (
                      <div
                        key={idx}
                        className="text-xs p-2 rounded bg-background border flex items-start gap-2 hover:bg-accent transition-colors"
                      >
                        {getCitationIcon(citation.type)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{citation.title}</span>
                            <Badge variant="secondary" className="text-xs">
                              {citation.type.replace('-', ' ')}
                            </Badge>
                          </div>
                          {citation.excerpt && (
                            <p className="text-muted-foreground mt-1">{citation.excerpt}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {message.troubleshootingSteps && message.troubleshootingSteps.length > 0 && (
                  <div className="mt-3 p-3 rounded-lg border bg-background">
                    <p className="text-xs font-semibold mb-2">Recommended Troubleshooting Steps:</p>
                    <div className="space-y-2">
                      {message.troubleshootingSteps.map((step) => (
                        <div key={step.id} className="flex gap-2 text-xs">
                          <span className="font-medium text-primary">{step.order}.</span>
                          <div className="flex-1">
                            <p className="font-medium">{step.description}</p>
                            <p className="text-muted-foreground mt-0.5">
                              Expected: {step.expectedOutcome}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <p className="text-xs text-muted-foreground mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>

              {message.role === 'user' && (
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                    <User className="h-4 w-4" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="border-t p-4">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about diagnostics, alerts, or troubleshooting..."
            className="flex-1"
          />
          <Button onClick={handleSend} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

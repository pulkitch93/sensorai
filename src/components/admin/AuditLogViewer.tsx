import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, FileText, AlertCircle, CheckCircle2, XCircle, User } from 'lucide-react';
import { auditLogs } from '@/lib/adminMockData';
import { AuditEventType } from '@/types/admin';

export function AuditLogViewer() {
  const [searchQuery, setSearchQuery] = useState('');
  const [eventFilter, setEventFilter] = useState<string>('all');

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.resource.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesEvent = eventFilter === 'all' || log.eventType === eventFilter;
    return matchesSearch && matchesEvent;
  });

  const getEventIcon = (eventType: AuditEventType) => {
    switch (eventType) {
      case 'prescription': return <FileText className="h-4 w-4" />;
      case 'threshold': return <AlertCircle className="h-4 w-4" />;
      case 'impersonation': return <User className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getEventColor = (eventType: AuditEventType) => {
    switch (eventType) {
      case 'prescription': return 'default';
      case 'threshold': return 'secondary';
      case 'override': return 'destructive';
      case 'model-change': return 'default';
      case 'impersonation': return 'outline';
      default: return 'secondary';
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Audit Log</h3>

        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search audit logs..."
              className="pl-10"
            />
          </div>
          <Select value={eventFilter} onValueChange={setEventFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              <SelectItem value="prescription">Prescriptions</SelectItem>
              <SelectItem value="threshold">Thresholds</SelectItem>
              <SelectItem value="override">Overrides</SelectItem>
              <SelectItem value="model-change">Model Changes</SelectItem>
              <SelectItem value="impersonation">Impersonation</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <ScrollArea className="h-[500px]">
          <div className="space-y-2">
            {filteredLogs.map(log => (
              <Card key={log.id} className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`mt-1 ${log.success ? 'text-success' : 'text-destructive'}`}>
                    {log.success ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <XCircle className="h-5 w-5" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={getEventColor(log.eventType)} className="flex items-center gap-1">
                        {getEventIcon(log.eventType)}
                        {log.eventType}
                      </Badge>
                      <span className="text-sm font-medium">{log.action}</span>
                    </div>

                    <div className="text-sm text-muted-foreground space-y-1">
                      <div className="flex items-center gap-4">
                        <span><strong>User:</strong> {log.userName} ({log.userRole})</span>
                        <span><strong>Resource:</strong> {log.resource}</span>
                        <span><strong>IP:</strong> {log.ipAddress}</span>
                      </div>

                      {log.changes && (
                        <div className="mt-2 p-2 bg-muted rounded text-xs">
                          <strong>Changes:</strong>
                          {Object.entries(log.changes).map(([key, value]) => (
                            <div key={key} className="mt-1">
                              <span className="font-medium">{key}:</span>{' '}
                              <span className="text-destructive">{JSON.stringify(value.old)}</span>
                              {' → '}
                              <span className="text-success">{JSON.stringify(value.new)}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {!log.success && log.errorMessage && (
                        <div className="mt-2 p-2 bg-destructive/10 rounded text-xs text-destructive">
                          <strong>Error:</strong> {log.errorMessage}
                        </div>
                      )}

                      {log.impersonatedBy && (
                        <div className="mt-2 text-xs text-warning">
                          <strong>Impersonated by:</strong> {log.impersonatedBy}
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground mt-2">
                      {log.timestamp.toLocaleString()}
                    </p>
                  </div>
                </div>
              </Card>
            ))}

            {filteredLogs.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p>No audit logs found matching your filters.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
}

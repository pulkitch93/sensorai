import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Key, Plus, Copy, Trash2, Calendar, Activity } from 'lucide-react';
import { apiKeys } from '@/lib/adminMockData';
import { useToast } from '@/hooks/use-toast';

export function APIKeyManagement() {
  const { toast } = useToast();

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast({
      title: "Copied",
      description: "API key copied to clipboard",
    });
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">API Keys</h3>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create API Key
          </Button>
        </div>

        <div className="space-y-3">
          {apiKeys.map(key => (
            <Card key={key.id} className="p-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Key className="h-4 w-4 text-primary" />
                      <h4 className="font-medium">{key.name}</h4>
                      <Badge variant={key.active ? 'default' : 'secondary'}>
                        {key.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{key.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleCopyKey(key.key)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Activity className="h-3 w-3" />
                    <span>{key.usageCount.toLocaleString()} requests</span>
                  </div>
                  {key.lastUsed && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>Last used: {key.lastUsed.toLocaleDateString()}</span>
                    </div>
                  )}
                  {key.expiresAt && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>Expires: {key.expiresAt.toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-1 flex-wrap">
                  {key.scope.map(scope => (
                    <Badge key={scope} variant="secondary" className="text-xs">
                      {scope}
                    </Badge>
                  ))}
                </div>

                <div className="pt-2 border-t">
                  <code className="text-xs bg-muted px-2 py-1 rounded">
                    {key.key}
                  </code>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Card>
  );
}

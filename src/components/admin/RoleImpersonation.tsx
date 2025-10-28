import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { User, ShieldAlert, Play, StopCircle, Clock, FileText } from 'lucide-react';
import { impersonationSessions } from '@/lib/adminMockData';
import { UserRole } from '@/types/admin';
import { useToast } from '@/hooks/use-toast';

export function RoleImpersonation() {
  const [selectedRole, setSelectedRole] = useState<UserRole>('technician');
  const [reason, setReason] = useState('');
  const [isImpersonating, setIsImpersonating] = useState(false);
  const { toast } = useToast();

  const handleStartImpersonation = () => {
    if (!reason.trim()) {
      toast({
        title: "Reason Required",
        description: "Please provide a reason for impersonation",
        variant: "destructive"
      });
      return;
    }

    setIsImpersonating(true);
    toast({
      title: "Impersonation Started",
      description: `Now viewing as ${selectedRole}. All actions will be logged.`,
    });
  };

  const handleStopImpersonation = () => {
    setIsImpersonating(false);
    setReason('');
    toast({
      title: "Impersonation Ended",
      description: "Returned to admin view. Session logged.",
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-warning" />
            <h3 className="text-lg font-semibold">Role Impersonation</h3>
          </div>

          {isImpersonating && (
            <Alert className="border-warning bg-warning/10">
              <User className="h-4 w-4" />
              <AlertDescription>
                <strong>Currently impersonating:</strong> {selectedRole}
                <br />
                All actions are being logged with your admin identity.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div>
              <Label htmlFor="role-select">Select Role to Impersonate</Label>
              <Select 
                value={selectedRole} 
                onValueChange={(v) => setSelectedRole(v as UserRole)}
                disabled={isImpersonating}
              >
                <SelectTrigger id="role-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technician">Technician</SelectItem>
                  <SelectItem value="engineer">Engineer</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="executive">Executive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="reason">Reason for Impersonation</Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g., Testing new workflow permissions, Validating user experience..."
                rows={3}
                disabled={isImpersonating}
              />
            </div>

            <div className="flex gap-2 pt-4">
              {!isImpersonating ? (
                <Button onClick={handleStartImpersonation} className="flex-1">
                  <Play className="h-4 w-4 mr-2" />
                  Start Impersonation
                </Button>
              ) : (
                <Button onClick={handleStopImpersonation} variant="destructive" className="flex-1">
                  <StopCircle className="h-4 w-4 mr-2" />
                  End Impersonation
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h4 className="font-semibold mb-4">Recent Impersonation Sessions</h4>
        <div className="space-y-3">
          {impersonationSessions.map(session => (
            <Card key={session.id} className="p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant={session.active ? 'default' : 'secondary'}>
                      {session.active ? 'Active' : 'Ended'}
                    </Badge>
                    <span className="text-sm font-medium">
                      Impersonated: {session.impersonatedRole}
                    </span>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground space-y-1">
                  <div className="flex items-center gap-2">
                    <User className="h-3 w-3" />
                    <span>Admin: {session.adminUserName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    <span>
                      {session.startedAt.toLocaleString()}
                      {session.endedAt && ` - ${session.endedAt.toLocaleString()}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-3 w-3" />
                    <span>Reason: {session.reason}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
}

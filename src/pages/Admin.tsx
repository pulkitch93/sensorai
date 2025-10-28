import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Shield, Users, FileText, Key, Webhook, Database, UserCog, CheckSquare } from 'lucide-react';
import { UserManagement } from '@/components/admin/UserManagement';
import { AuditLogViewer } from '@/components/admin/AuditLogViewer';
import { RoleImpersonation } from '@/components/admin/RoleImpersonation';
import { APIKeyManagement } from '@/components/admin/APIKeyManagement';
import { adminMetrics, rolePermissions, approvalRequests, webhooks, dataRetentionPolicies } from '@/lib/adminMockData';

export default function Admin() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin & Governance</h1>
          <p className="text-muted-foreground mt-1">
            Role-based access control, audit logs, and system governance
          </p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          <Shield className="h-4 w-4 mr-2" />
          Admin Console
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="text-2xl font-bold">{adminMetrics.totalUsers}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {adminMetrics.activeUsers} active
              </p>
            </div>
            <Users className="h-8 w-8 text-primary opacity-20" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending Approvals</p>
              <p className="text-2xl font-bold">{adminMetrics.pendingApprovals}</p>
            </div>
            <CheckSquare className="h-8 w-8 text-warning opacity-20" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Audit Log Entries</p>
              <p className="text-2xl font-bold">{adminMetrics.auditLogCount}</p>
            </div>
            <FileText className="h-8 w-8 text-primary opacity-20" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active API Keys</p>
              <p className="text-2xl font-bold">{adminMetrics.activeAPIKeys}</p>
            </div>
            <Key className="h-8 w-8 text-primary opacity-20" />
          </div>
        </Card>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Users & Roles
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Permissions
          </TabsTrigger>
          <TabsTrigger value="approvals" className="flex items-center gap-2">
            <CheckSquare className="h-4 w-4" />
            Approvals
            {adminMetrics.pendingApprovals > 0 && (
              <Badge variant="destructive">{adminMetrics.pendingApprovals}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="audit" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Audit Log
          </TabsTrigger>
          <TabsTrigger value="impersonate" className="flex items-center gap-2">
            <UserCog className="h-4 w-4" />
            Impersonation
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            API & Webhooks
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Data Governance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <UserManagement />
        </TabsContent>

        <TabsContent value="permissions">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Role Permissions Matrix</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Role</th>
                    <th className="text-left p-2">Resource</th>
                    <th className="text-left p-2">Actions</th>
                    <th className="text-left p-2">Site Scope</th>
                    <th className="text-left p-2">Asset Scope</th>
                  </tr>
                </thead>
                <tbody>
                  {rolePermissions.map(perm => (
                    <tr key={perm.id} className="border-b hover:bg-muted/50">
                      <td className="p-2">
                        <Badge variant="secondary">{perm.role}</Badge>
                      </td>
                      <td className="p-2 font-medium">{perm.resource}</td>
                      <td className="p-2">
                        <div className="flex gap-1 flex-wrap">
                          {perm.actions.map(action => (
                            <Badge key={action} variant="outline" className="text-xs">
                              {action}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="p-2 text-muted-foreground">
                        {perm.siteScope.join(', ')}
                      </td>
                      <td className="p-2 text-muted-foreground">
                        {perm.assetClassScope.join(', ')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="approvals">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Approval Requests</h3>
            <div className="space-y-3">
              {approvalRequests.map(request => (
                <Card key={request.id} className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={
                            request.status === 'pending' ? 'default' :
                            request.status === 'approved' ? 'secondary' : 'destructive'
                          }>
                            {request.status}
                          </Badge>
                          <Badge variant="outline">{request.type}</Badge>
                          <h4 className="font-medium">{request.title}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">{request.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Requested by: {request.requestedBy} ({request.requestedByRole})</span>
                      <span>{request.requestedAt.toLocaleDateString()}</span>
                      {request.reviewedBy && (
                        <span>Reviewed by: {request.reviewedBy}</span>
                      )}
                    </div>

                    {request.reviewNotes && (
                      <div className="p-2 bg-muted rounded text-sm">
                        <strong>Review Notes:</strong> {request.reviewNotes}
                      </div>
                    )}

                    {request.status === 'pending' && (
                      <div className="flex gap-2 pt-2 border-t">
                        <button className="px-3 py-1 bg-primary text-primary-foreground rounded text-sm">
                          Approve
                        </button>
                        <button className="px-3 py-1 bg-destructive text-destructive-foreground rounded text-sm">
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="audit">
          <AuditLogViewer />
        </TabsContent>

        <TabsContent value="impersonate">
          <RoleImpersonation />
        </TabsContent>

        <TabsContent value="api">
          <div className="space-y-6">
            <APIKeyManagement />
            
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Webhooks</h3>
                  <button className="px-4 py-2 bg-primary text-primary-foreground rounded text-sm">
                    Add Webhook
                  </button>
                </div>
                <div className="space-y-3">
                  {webhooks.map(webhook => (
                    <Card key={webhook.id} className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Webhook className="h-4 w-4 text-primary" />
                            <h4 className="font-medium">{webhook.name}</h4>
                            <Badge variant={webhook.active ? 'default' : 'secondary'}>
                              {webhook.active ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{webhook.url}</p>
                        <div className="flex gap-1 flex-wrap">
                          {webhook.events.map(event => (
                            <Badge key={event} variant="secondary" className="text-xs">
                              {event}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Success: {webhook.successCount}</span>
                          <span>Failures: {webhook.failureCount}</span>
                          {webhook.lastTriggered && (
                            <span>Last: {webhook.lastTriggered.toLocaleString()}</span>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="data">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Data Retention Policies</h3>
            <div className="space-y-3">
              {dataRetentionPolicies.map(policy => (
                <Card key={policy.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">{policy.category}</Badge>
                        <span className="font-medium">{policy.retentionDays} days retention</span>
                      </div>
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        {policy.archiveEnabled && (
                          <span>✓ Archiving enabled</span>
                        )}
                        {policy.autoDelete && (
                          <span>✓ Auto-delete</span>
                        )}
                        {policy.piiScrubbing && (
                          <span>✓ PII scrubbing</span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Last applied: {policy.lastApplied.toLocaleDateString()}
                      </p>
                    </div>
                    <button className="px-3 py-1 border rounded text-sm">Edit</button>
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

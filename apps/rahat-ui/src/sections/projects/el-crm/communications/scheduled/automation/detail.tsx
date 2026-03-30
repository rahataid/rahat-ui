import React from 'react';
import { useParams } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/components/card';
import { Badge } from '@rahat-ui/shadcn/components/badge';
import { Label } from '@rahat-ui/shadcn/components/label';
import { ArrowLeft, Zap } from 'lucide-react';
import Link from 'next/link';
import {
  useAutomationDetail,
  useListElCrmSessionBroadcast,
} from '@rahat-ui/query';
import { UUID } from 'crypto';
import useCommsLogsTableColumns from '../../useCommsLogsTableColumns';
import CommsLogsTable from 'apps/rahat-ui/src/sections/projects/aa/communication-logs/comms.logs.table';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
} from '@tanstack/react-table';
import ClientSidePagination from '../../../../components/client.side.pagination';

export default function AutomationDetailPage() {
  const { id: projectUUID, automationId } = useParams() as {
    id: UUID;
    automationId: string;
  };

  const { data, isLoading, error } = useAutomationDetail(
    projectUUID,
    automationId,
  );
  console.log({ data });

  const rule = data?.rule;
  const logs = data?.logs || [];
  const showsRecurringConfig =
    Boolean(rule?.isRecurring) && Boolean(rule?.recurrenceCooldownDays);
  const showsMaxSends =
    !rule?.fireOnceOnEntry && rule?.maxSendsPerTarget != null;

  const columns = useCommsLogsTableColumns();
  const table = useReactTable({
    data: logs,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });
  if (isLoading) return <div>Loading...</div>;
  if (error)
    return (
      <div className="text-red-500">Failed to load automation detail.</div>
    );
  if (!rule) return <div>No automation rule found.</div>;

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-border bg-card px-6 py-5">
        <div className="flex items-center gap-4">
          <Link
            href={`/projects/el-crm/${projectUUID}/communications/scheduled/compose`}
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Automation Details
          </h1>
        </div>
      </div>
      <div className="flex-1 p-6 space-y-6 overflow-auto">
        <Card>
          <CardHeader>
            <CardTitle>
              <Zap className="inline-block mr-2 text-yellow-500" />
              {rule.name}
              {rule.isEnabled && (
                <Badge className="ml-2" variant="success">
                  Active
                </Badge>
              )}
              {!rule.isEnabled && (
                <Badge className="ml-2" variant="secondary">
                  Inactive
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Linked Campaign</Label>
                <div>{rule.campaign?.name}</div>
              </div>
              <div>
                <Label>Target Group</Label>
                <div>{rule.targetType}</div>
              </div>
              <div>
                <Label>Fire Once Per Target</Label>
                <div>{rule.fireOnceOnEntry ? 'Yes' : 'No'}</div>
              </div>
              {showsRecurringConfig && (
                <div>
                  <Label>Recurring</Label>
                  <div>Yes</div>
                </div>
              )}
              {showsRecurringConfig && (
                <div>
                  <Label>Cooldown Days</Label>
                  <div>{rule.recurrenceCooldownDays}</div>
                </div>
              )}
              {showsMaxSends && (
                <div>
                  <Label>Max Sends Per Target</Label>
                  <div>{rule.maxSendsPerTarget}</div>
                </div>
              )}
            </div>
            <div>
              <Label>Conditions</Label>
              <ul className="list-disc ml-6">
                {rule.conditions.map((cond: any, i: number) => (
                  <li key={i}>
                    <span className="font-medium">{cond.fieldPath}</span>{' '}
                    {cond.operator}{' '}
                    <span className="font-mono">{cond.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Automation Session Logs</CardTitle>
          </CardHeader>
          <CardContent>
            {Array.isArray(logs) && logs.length === 0 ? (
              <div>No session logs found.</div>
            ) : (
              table && (
                <>
                  <CommsLogsTable table={table} />
                  <ClientSidePagination table={table} />
                </>
              )
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

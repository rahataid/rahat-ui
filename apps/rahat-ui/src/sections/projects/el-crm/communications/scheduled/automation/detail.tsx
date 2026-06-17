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
import { ArrowLeft, FilterX, Hash, Zap } from 'lucide-react';
import Link from 'next/link';
import {
  useAutomationDetail,
  useListElCrmTransport,
  usePagination,
} from '@rahat-ui/query';
import { UUID } from 'crypto';
import { PaginatedResult } from '@rumsan/sdk/types';
import useCommsLogsTableColumns from '../../useCommsLogsTableColumns';
import { useReactTable, getCoreRowModel } from '@tanstack/react-table';
import CustomPagination from 'apps/rahat-ui/src/components/customPagination';
import DemoTable from 'apps/rahat-ui/src/components/table';
import SelectComponent from '../../../../cambodia/select.component';
import { Button } from '@rahat-ui/shadcn/components/button';
import CampaignBroadcastActions from '../../campaign-broadcast-actions';

const STATUS_OPTIONS = ['ALL', 'SUCCESS', 'PENDING', 'FAIL', 'SCHEDULED'];

export default function AutomationDetailPage() {
  const { id: projectUUID, automationId } = useParams() as {
    id: UUID;
    automationId: string;
  };

  const { pagination, setNextPage, setPrevPage, setPerPage, filters, setFilters, setPagination } =
    usePagination();

  const activeStatus = filters?.status;

  const { data, isLoading, error } = useAutomationDetail(
    projectUUID,
    automationId,
    {
      ...pagination,
      ...(activeStatus ? { status: activeStatus } : {}),
    },
  );

  const rule = data?.rule;
  const logs = data?.logs || [];
  const sessionIds: string[] = data?.sessionIds || [];

  const transport = useListElCrmTransport(projectUUID);
  const transportName = (transport.data || []).find(
    (t: { cuid: string; name: string }) => t.cuid === rule?.campaign?.transportId,
  )?.name;
  const isWhatsApp = !!transportName?.toLowerCase().includes('whatsapp');
  const meta: PaginatedResult<any>['meta'] = data?.meta || {
    total: 0,
    lastPage: 1,
    currentPage: pagination.page,
    perPage: pagination.perPage,
    prev: null,
    next: null,
  };

  const showsRecurringConfig =
    Boolean(rule?.isRecurring) && Boolean(rule?.recurrenceCooldownDays);
  const showsMaxSends =
    !rule?.fireOnceOnEntry && rule?.maxSendsPerTarget != null;

  const columns = useCommsLogsTableColumns();
  const table = useReactTable({
    manualPagination: true,
    data: logs,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleStatusChange = (value: string) => {
    setFilters((prev: any) => {
      const updated = { ...prev };
      if (value === 'ALL') delete updated.status;
      else updated.status = value;
      return updated;
    });
    setPagination({ ...pagination, page: 1 });
  };

  const hasActiveFilters = !!activeStatus;

  const clearFilters = () => {
    setFilters({});
    setPagination({ ...pagination, page: 1 });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error)
    return (
      <div className="text-red-500">Failed to load automation detail.</div>
    );
  if (!rule) return <div>No automation rule found.</div>;

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-border bg-card px-6 py-5">
        <div className="flex items-center justify-between">
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
          {!!sessionIds.length && (
            <div className="flex items-center gap-2 shrink-0">
              <CampaignBroadcastActions
                projectUUID={projectUUID}
                sessionIds={sessionIds}
                campaignName={rule.campaign?.name || rule.name}
                targetType={rule.campaign?.targetType || rule.targetType}
                messageBody={rule.campaign?.body || ''}
                isWhatsApp={isWhatsApp}
                filters={{ status: activeStatus }}
              />
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 p-6 space-y-6 overflow-auto">
        <Card>
          <CardHeader>
            <CardTitle>
              <Zap className="inline-block mr-2 text-yellow-500" />
              {rule.name}
              {rule.isEnabled ? (
                <Badge className="ml-2" variant="success">
                  Active
                </Badge>
              ) : (
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

        <Card className="overflow-hidden">
          <CardHeader className="space-y-3 border-b px-5 py-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <div className="rounded-md bg-primary/10 p-1.5">
                  <Hash className="h-3.5 w-3.5 text-primary" />
                </div>
                Automation Session Logs
                <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-semibold text-primary-foreground">
                  {meta?.total || 0}
                </span>
              </CardTitle>
              {hasActiveFilters && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={clearFilters}
                >
                  <FilterX className="mr-1.5 h-3.5 w-3.5" />
                  Clear
                </Button>
              )}
            </div>
            <div className="w-48">
              <SelectComponent
                name="Status"
                options={STATUS_OPTIONS}
                onChange={handleStatusChange}
                value={activeStatus ?? 'ALL'}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <DemoTable table={table} loading={isLoading} />
            <CustomPagination
              meta={meta}
              handleNextPage={setNextPage}
              handlePrevPage={setPrevPage}
              handlePageSizeChange={setPerPage}
              currentPage={pagination.page}
              perPage={pagination.perPage}
              total={meta?.total}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

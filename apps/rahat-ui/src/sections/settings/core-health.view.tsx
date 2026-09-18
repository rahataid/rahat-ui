'use client';

import { useTranslations } from 'next-intl';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { AlertTriangle, RefreshCw } from 'lucide-react';

import {
  DemoTable,
  HealthRow,
  IconLabelBtn,
  SystemHealthBanner,
  SystemHealthBannerSkeleton,
  deriveOverallStatus,
  latestCheckedAt,
  toHealthRowStatus,
  useHealthColumns,
  useHealthLabels,
} from 'apps/rahat-ui/src/common';
import { useCoreHealth } from '@rahat-ui/query';

export default function CoreHealthView() {
  const tg = useTranslations('GLOBAL');
  const ta = useTranslations('AA_PROJECT');
  // isFetching (not isLoading) also covers manual refetch, which drives the button feedback.
  const { data, isLoading, isFetching, isError, refetch } = useCoreHealth();
  const { labelFor } = useHealthLabels();
  const columns = useHealthColumns();

  // Built from whatever the backend returns, so new services need no frontend change.
  const rows: HealthRow[] = Object.entries(data?.services ?? {}).map(
    ([key, service]) => ({
      key,
      name: labelFor(key),
      status: toHealthRowStatus(service?.status),
      lastChecked: service?.last_checked,
      responseTime: service?.latency,
      message: service?.message,
    }),
  );

  const healthyCount = rows.filter((r) => r.status === 'HEALTHY').length;
  const unhealthyCount = rows.filter((r) => r.status === 'UNHEALTHY').length;

  const overallStatus = isError || !data ? 'NA' : deriveOverallStatus(rows);

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-6">
      <div className="pb-3 flex justify-end">
        <IconLabelBtn
          Icon={RefreshCw}
          handleClick={() => refetch()}
          name={isFetching ? tg('CHECKING') : tg('RUN_HEALTH_CHECK')}
          className="px-3 py-2"
          disabled={isFetching}
        />
      </div>

      <div className="mb-4">
        {isLoading ? (
          <SystemHealthBannerSkeleton />
        ) : (
          <SystemHealthBanner
            overallStatus={overallStatus}
            healthyCount={healthyCount}
            unhealthyCount={unhealthyCount}
            totalCount={rows.length}
            lastUpdated={latestCheckedAt(rows)}
            overallLabel={ta('OVERALL_SYSTEM_HEALTH')}
            healthyLabel={ta('HEALTHY')}
            unhealthyLabel={ta('UNHEALTHY')}
            lastUpdatedLabel={tg('LAST_UPDATED')}
          />
        )}
      </div>

      {isError && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 flex items-center gap-2 text-sm text-red-700">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {tg('SOMETHING_WENT_WRONG')}
        </div>
      )}

      <DemoTable
        table={table}
        tableHeight="h-[calc(100vh-280px)]"
        loading={isFetching}
      />
    </div>
  );
}

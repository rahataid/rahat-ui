'use client';

import { useTranslations } from 'next-intl';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { RefreshCw } from 'lucide-react';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';

import {
  DemoTable,
  HealthRow,
  Heading,
  IconLabelBtn,
  SystemHealthBanner,
  SystemHealthBannerSkeleton,
  deriveOverallStatus,
  latestCheckedAt,
  toHealthRowStatus,
  useHealthColumns,
  useHealthLabels,
} from 'apps/rahat-ui/src/common';
import { useProjectHealthCheck } from '@rahat-ui/query';
import { useAlert } from 'apps/rahat-ui/src/components/swal';
import { useLabelDigits } from 'apps/rahat-ui/src/utils/i18n/number';

export default function ProjectHealthView() {
  const tg = useTranslations('GLOBAL');
  const ta = useTranslations('AA_PROJECT');
  const params = useParams();
  const id = params.id as UUID;

  // isFetching (not isLoading) also covers manual refetch, which drives the button feedback.
  const {
    data: projectHealth,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useProjectHealthCheck(id);
  const { labelFor } = useHealthLabels();
  const columns = useHealthColumns();
  const alert = useAlert();
  const formatDigits = useLabelDigits();

  // Built from whatever the backend returns, so new services need no frontend change.
  const rows: HealthRow[] = Object.entries(projectHealth?.services ?? {}).map(
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

  const overallStatus = deriveOverallStatus(rows);

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Reports the outcome from the refetch result, since rows above are still the previous render's data.
  const handleRunCheck = async () => {
    const { data: result, isError: failed } = await refetch();
    const checked = Object.values(result?.services ?? {});
    const healthy = checked.filter((s) => s?.status === 'up').length;

    alert.fire({
      icon: failed || !checked.length ? 'error' : 'success',
      title:
        failed || !checked.length
          ? tg('HEALTH_CHECK_FAILED')
          : tg('HEALTH_CHECK_SUCCESS', {
              healthy: formatDigits(healthy),
              total: formatDigits(checked.length),
            }),
    });
  };

  return (
    <div>
      <div className="pb-1 flex justify-between items-center space-x-4">
        <Heading
          title={ta('PROJECT_HEALTH')}
          description={ta('PROJECT_HEALTH_DESCRIPTION')}
        />
        <IconLabelBtn
          Icon={RefreshCw}
          handleClick={handleRunCheck}
          name={isFetching ? tg('CHECKING') : tg('RUN_HEALTH_CHECK')}
          className="px-3 py-2"
          disabled={isFetching}
        />
      </div>

      <div className="mb-4">
        {isLoading ? (
          <SystemHealthBannerSkeleton />
        ) : isError ? (
          <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {(error as Error)?.message || tg('SOMETHING_WENT_WRONG')}
          </div>
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

      <div className="w-full mt-1 p-1 bg-secondary">
        <div className="rounded border bg-white">
          <DemoTable
            table={table}
            loading={isFetching}
            tableHeight="h-[calc(100vh-380px)]"
          />
        </div>
      </div>
    </div>
  );
}

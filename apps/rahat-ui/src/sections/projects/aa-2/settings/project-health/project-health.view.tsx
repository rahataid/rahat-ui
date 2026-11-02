'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { RefreshCw } from 'lucide-react';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';

import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { cn } from '@rahat-ui/shadcn/src';
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
import { useAppVersions, useProjectHealthCheck } from '@rahat-ui/query';
import { useAlert } from 'apps/rahat-ui/src/components/swal';
import { useLabelDigits } from 'apps/rahat-ui/src/utils/i18n/number';

const ENV_STYLES: Record<string, string> = {
  production:
    'border-green-300 bg-green-100 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-400',
  prod: 'border-green-300 bg-green-100 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-400',
  staging:
    'border-blue-300 bg-blue-100 text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-400',
  stage:
    'border-blue-300 bg-blue-100 text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-400',
  unreachable:
    'border-red-300 bg-red-100 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-400',
};
const DEFAULT_ENV_STYLE =
  'border-amber-300 bg-amber-100 text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400';

const formatEnvLabel = (env?: string | null, fallback = 'Unreachable') => {
  if (!env) return fallback;
  const lower = env.toLowerCase();
  if (lower === 'production') return 'Production';
  if (lower === 'staging') return 'Staging';
  if (lower === 'development') return 'Development';
  if (lower === 'unreachable') return fallback;
  return env;
};

export default function ProjectHealthView() {
  const tg = useTranslations('GLOBAL');
  const ta = useTranslations('AA_PROJECT');
  const params = useParams();
  const id = params.id as UUID;

  const { data: envData } = useAppVersions(id);

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
  const rows: HealthRow[] = useMemo(
    () =>
      Object.entries(projectHealth?.services ?? {}).map(([key, service]) => ({
        key,
        name: labelFor(key),
        status: toHealthRowStatus(service?.status),
        lastChecked: service?.last_checked,
        responseTime: service?.latency,
        message: service?.message,
        down_time: service?.down_time,
      })),
    [projectHealth, labelFor],
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
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {tg('ENVIRONMENT')}:
            </span>
            <Badge
              variant="outline"
              className={cn(
                'px-3 py-1 text-xs font-semibold',
                envData?.env && envData.env.toLowerCase() !== 'unreachable'
                  ? (ENV_STYLES[envData.env.toLowerCase()] ?? DEFAULT_ENV_STYLE)
                  : ENV_STYLES.unreachable,
              )}
            >
              {envData?.env && envData.env.toLowerCase() !== 'unreachable'
                ? formatEnvLabel(envData.env)
                : (tg('UNREACHABLE') || 'Unreachable')}
            </Badge>
          </div>
          <IconLabelBtn
            Icon={RefreshCw}
            handleClick={handleRunCheck}
            name={isFetching ? tg('CHECKING') : tg('RUN_HEALTH_CHECK')}
            className="px-3 py-2"
            disabled={isFetching}
          />
        </div>
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

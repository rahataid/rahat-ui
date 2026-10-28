'use client';

import { useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { ColumnDef, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useAppVersions, ServiceVersion } from '@rahat-ui/query';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { DemoTable } from 'apps/rahat-ui/src/common';

interface VersionRow {
  key: string;
  name: string;
  version: string;
  env?: string | null;
}

const normalizeVersion = (raw?: string) => {
  if (!raw) return null;
  const v = raw.trim();
  if (!v) return null;
  return v.startsWith('v') ? v : `v${v}`;
};

export default function ListVersion() {
  const t = useTranslations('SETTINGS_NAVIGATION');
  const g = useTranslations('GLOBAL');
  const { data: appVersions, isLoading } = useAppVersions();

  const rahatUiVersion = useMemo(() => normalizeVersion(process.env.NEXT_PUBLIC_APP_VERSION) ?? g('NA'), [g]);

  const serviceVersion = useCallback(
    (service: ServiceVersion | undefined) =>
      service?.version === 'unreachable' ? t('UNREACHABLE') : service?.version ?? g('NA'),
    [t, g]
  );

  const rows: VersionRow[] = useMemo(
    () => [
      {
        key: 'rahat-ui',
        name: 'Rahat UI',
        version: rahatUiVersion,
        env: process.env.NODE_ENV,
      },
      {
        key: 'platform',
        name: 'Platform',
        version: serviceVersion(appVersions?.platform),
        env: appVersions?.platform?.env,
      },
      {
        key: 'triggers',
        name: 'Triggers',
        version: serviceVersion(appVersions?.triggers),
        env: appVersions?.triggers?.env,
      },
      {
        key: 'rahat-aa',
        name: 'Rahat AA',
        version: serviceVersion(appVersions?.rahatAa),
        env: appVersions?.rahatAa?.env,
      },
    ],
    [rahatUiVersion, appVersions, serviceVersion]
  );

  const envStyle = useCallback((env?: string | null) => {
    switch (env) {
      case 'production':
        return 'border-green-300 bg-green-100 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-400';
      case 'staging':
        return 'border-blue-300 bg-blue-100 text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-400';
      default:
        return 'border-amber-300 bg-amber-100 text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400';
    }
  }, []);

  const columns: ColumnDef<VersionRow>[] = useMemo(
    () => [
      {
        header: g('NAME'),
        accessorKey: 'name',
        cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
      },
      {
        header: t('VERSION'),
        accessorKey: 'version',
        cell: ({ row }) => {
          const isUnreachable = row.original.version === t('UNREACHABLE');
          const env = row.original.env ?? '';
          return (
            <div className="flex items-center gap-2">
              <Badge variant={isUnreachable ? 'destructive' : 'outline'}>{row.original.version}</Badge>
              <Badge variant="outline" className={envStyle(env)}>
                {env === 'production'
                  ? 'prod'
                  : env === 'staging'
                    ? 'stage'
                    : env === 'development'
                      ? 'dev'
                      : env || g('NA')}
              </Badge>
            </div>
          );
        },
      },
    ],
    [g, t, envStyle]
  );

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-6">
      <DemoTable
        table={table}
        tableHeight="h-[calc(100vh-230px)]"
        loading={isLoading}
      />
    </div>
  );
}

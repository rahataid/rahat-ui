'use client';

import { useTranslations } from 'next-intl';
import { useAppVersions, useWebVersion } from '@rahat-ui/query';
import {
  Table as TableComponent,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@rahat-ui/shadcn/components/table';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';

export default function ListVersion() {
  const t = useTranslations('SETTINGS_NAVIGATION');
  const g = useTranslations('GLOBAL');
  const { data: appVersions } = useAppVersions();
  const { data: webVersion } = useWebVersion();

  const rahatUiVersion = process.env.NEXT_PUBLIC_APP_VERSION
    ? process.env.NEXT_PUBLIC_APP_VERSION.startsWith('v')
      ? process.env.NEXT_PUBLIC_APP_VERSION
      : `v${process.env.NEXT_PUBLIC_APP_VERSION}`
    : '—';

  const versionBadge = (value: string | undefined) => (
    <Badge variant={value === 'unreachable' ? 'destructive' : 'outline'}>
      {value === 'unreachable' ? t('UNREACHABLE') : value ?? '—'}
    </Badge>
  );

  const rows = [
    { name: 'Rahat UI', version: <Badge variant="outline">{rahatUiVersion}</Badge> },
    { name: 'Platform', version: versionBadge(appVersions?.platform) },
    { name: 'Triggers', version: versionBadge(appVersions?.triggers) },
    { name: 'Rahat AA', version: versionBadge(appVersions?.rahatAa) },
    {
      name: t('WEB_VERSION'),
      version: (
        <a
          href={webVersion?.url}
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          {webVersion?.url ?? '—'}
        </a>
      ),
    },
  ];

  return (
    <div className="w-full mt-1 p-1 bg-secondary">
      <div className="rounded border bg-white">
        <TableComponent>
          <TableHeader className="bg-card">
            <TableRow>
              <TableHead>{g('NAME')}</TableHead>
              <TableHead>{t('VERSION')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.name}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.version}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TableComponent>
      </div>
    </div>
  );
}

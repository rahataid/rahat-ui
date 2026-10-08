'use client';
import { useSyncCoreStats } from '@rahat-ui/query/lib/reports/reports.service';
import { IconLabelBtn } from 'apps/rahat-ui/src/common';
import { RefreshCcw } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function SyncStatsButton() {
  const t = useTranslations('AA_PROJECT');
  const { mutateAsync: syncCoreStats, isPending: isSyncing } =
    useSyncCoreStats();

  return (
    <div className="mr-6">
      <IconLabelBtn
        name={isSyncing ? t('UPDATING') : t('SYNC_STATS')}
        Icon={RefreshCcw}
        disabled={isSyncing}
        handleClick={() => syncCoreStats()}
        variant="outline"
        className="text-[clamp(11px,1vw,14px)] h-[clamp(28px,3vw,36px)] px-2 sm:px-3"
      />
    </div>
  );
}

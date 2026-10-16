'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCcw, ScrollText } from 'lucide-react';
import { SystemUserAuth } from '@rahat-ui/auth';
import CoreBtnComponent from '../../components/core.btn';
import { IconLabelBtn } from '../../common';
import { paths } from '../../routes/paths';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@rahat-ui/shadcn/src/components/ui/alert-dialog';
import {
  useCommsUsage,
  useCommsUsageByXref,
  useCommsCredits,
  useCommsCreditsByXref,
  useCommsUsageBackfill,
} from '@rahat-ui/query';
import UsageFilters from './usage-filters';
import UsageOverviewCards from './usage-overview-cards';
import UsageByTransport from './usage-by-transport';
import TransportDetailCards from './transport-detail-cards';
import CreditUsageSection from './credit-usage-section';

type DateRangeQuery = { from?: string; to?: string };

export default function UsageView() {
  const t = useTranslations('USAGE');
  const tg = useTranslations('GLOBAL');
  const router = useRouter();
  const [showSyncConfirm, setShowSyncConfirm] = useState(false);
  const [usageXref, setUsageXref] = useState<string | null>(null);
  const [usageDateRange, setUsageDateRange] = useState<DateRangeQuery>({});
  const [creditXref, setCreditXref] = useState<string | null>(null);
  const [creditDateRange, setCreditDateRange] = useState<DateRangeQuery>({});

  const { data: usageData, isPending: usageLoading } =
    useCommsUsage(usageXref ? undefined : usageDateRange);
  const { data: usageByXrefData, isPending: usageByXrefLoading } =
    useCommsUsageByXref(usageXref ?? '', usageDateRange);

  const { data: creditsData, isPending: creditsLoading } =
    useCommsCredits(creditXref ? undefined : creditDateRange);
  const { data: creditsByXrefData, isPending: creditsByXrefLoading } =
    useCommsCreditsByXref(creditXref ?? '', creditDateRange);

  const activeUsage = usageXref ? usageByXrefData : usageData;
  const activeUsageLoading = usageXref ? usageByXrefLoading : usageLoading;

  const activeCredits = creditXref ? creditsByXrefData : creditsData;
  const activeCreditsLoading = creditXref
    ? creditsByXrefLoading
    : creditsLoading;

  const { mutateAsync: backfillUsage, isPending: isBackfilling } =
    useCommsUsageBackfill();

  const totals = activeUsage?.data?.totals;
  const byTransport = activeUsage?.data?.byTransport;
  const credits = activeCredits?.data;

  return (
    <>
      <ScrollArea className="h-[calc(100vh-80px)]">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{t('USAGE')}</h2>
          <SystemUserAuth hasContent={false}>
            <div className="flex items-center gap-2">
              <IconLabelBtn
                name={isBackfilling ? t('SYNCING') : t('SYNC_STATS')}
                Icon={RefreshCcw}
                variant="outline"
                disabled={isBackfilling}
                handleClick={() => setShowSyncConfirm(true)}
                className="text-[clamp(11px,1vw,14px)] h-[clamp(28px,3vw,36px)] px-2 sm:px-3"
              />
              <CoreBtnComponent
                Icon={ScrollText}
                name={t('LOG_STREAM')}
                handleClick={() => router.push(paths.logs.root)}
              />
            </div>
          </SystemUserAuth>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg font-semibold">
              {t('COMMUNICATION_USAGE')}
            </CardTitle>
            <UsageFilters
              selectedXref={usageXref}
              onXrefChange={setUsageXref}
              onDateChange={setUsageDateRange}
              onDateClear={() => setUsageDateRange({})}
            />
          </CardHeader>
          <CardContent className="space-y-6">
            <UsageOverviewCards totals={totals} loading={activeUsageLoading} />
            <UsageByTransport byTransport={byTransport} />
            <TransportDetailCards
              byTransport={byTransport}
              loading={activeUsageLoading}
            />
          </CardContent>
        </Card>

        <CreditUsageSection
          credits={credits}
          loading={activeCreditsLoading}
          xref={creditXref}
          onXrefChange={setCreditXref}
          onDateChange={setCreditDateRange}
          onDateClear={() => setCreditDateRange({})}
        />
      </div>
    </ScrollArea>

    <AlertDialog
      open={showSyncConfirm}
      onOpenChange={setShowSyncConfirm}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('SYNC_STATS_QUESTION')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('SYNC_STATS_DESCRIPTION')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{tg('CANCEL')}</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => backfillUsage()}
            disabled={isBackfilling}
          >
            {isBackfilling ? t('SYNCING') : tg('CONFIRM')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </>
  );
}

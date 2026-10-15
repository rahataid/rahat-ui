'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { SystemUserAuth } from '@rahat-ui/auth';
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

import { ReusableTabs } from '../../components/reusable-tabs';
import { useActiveTab } from '../../utils/useActivetab';
import LogStreamView from '../logs/log-stream.view';
import CommunicationOverviewView from '../communication-overview/communication-overview.view';
import { IconLabelBtn } from '../../common';
import { RefreshCcw } from 'lucide-react';

import UsageFilters from './usage-filters';
import UsageOverviewCards from './usage-overview-cards';
import UsageByTransport from './usage-by-transport';
import TransportDetailCards from './transport-detail-cards';
import CreditUsageSection from './credit-usage-section';

type DateRangeQuery = { from?: string; to?: string };

export default function UsageView() {
  const t = useTranslations('USAGE');
  const tg = useTranslations('GLOBAL');
  const { activeTab, setActiveTab } = useActiveTab('usage');
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

  const tabItems = [
    {
      value: 'usage',
      label: t('USAGE'),
      content: (
        <div className="space-y-6 max-w-full min-w-0">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{t('USAGE')}</h2>
            <SystemUserAuth hasContent={false}>
              <IconLabelBtn
                name={isBackfilling ? t('SYNCING') : t('SYNC_STATS')}
                Icon={RefreshCcw}
                variant="outline"
                disabled={isBackfilling}
                handleClick={() => setShowSyncConfirm(true)}
                className="text-[clamp(11px,1vw,14px)] h-[clamp(28px,3vw,36px)] px-2 sm:px-3"
              />
            </SystemUserAuth>
          </div>

          <Card className="max-w-full min-w-0 overflow-hidden">
            <CardHeader className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 space-y-0 pb-4">
              <CardTitle className="text-lg font-semibold shrink-0">
                {t('COMMUNICATION_USAGE')}
              </CardTitle>
              <UsageFilters
                selectedXref={usageXref}
                onXrefChange={setUsageXref}
                onDateChange={setUsageDateRange}
                onDateClear={() => setUsageDateRange({})}
              />
            </CardHeader>
            <CardContent className="space-y-6 max-w-full min-w-0 overflow-hidden">
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
      ),
    },
    {
      value: 'logStream',
      label: t('LOG_STREAM'),
      content: (
        <SystemUserAuth>
          <LogStreamView />
        </SystemUserAuth>
      ),
    },
    {
      value: 'communicationLogs',
      label: t('COMMUNICATION_OVERVIEW'),
      content: (
        <div className="space-y-6 max-w-full min-w-0">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{t('COMMUNICATION_OVERVIEW')}</h2>
          </div>
          <CommunicationOverviewView />
        </div>
      ),
    },
  ];

  return (
    <>
      <ScrollArea className="h-[calc(100vh-80px)] w-full max-w-full">
        <div className="p-4 sm:p-6 space-y-6 max-w-full min-w-0 overflow-x-hidden">
          <ReusableTabs
            defaultValue={activeTab}
            onValueChange={setActiveTab}
            items={tabItems}
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

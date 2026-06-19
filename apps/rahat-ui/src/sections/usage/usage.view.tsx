'use client';

import { useState } from 'react';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { Separator } from '@rahat-ui/shadcn/src/components/ui/separator';
import {
  useCommsUsage,
  useCommsUsageByXref,
  useCommsCredits,
  useCommsCreditsByXref,
} from '@rahat-ui/query';
import UsageFilters from './usage-filters';
import UsageOverviewCards from './usage-overview-cards';
import UsageByTransport from './usage-by-transport';
import TransportDetailCards from './transport-detail-cards';
import CreditUsageSection from './credit-usage-section';

type DateRangeQuery = { from?: string; to?: string };

export default function UsageView() {
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

  const totals = activeUsage?.data?.totals;
  const byTransport = activeUsage?.data?.byTransport;
  const credits = activeCredits?.data;

  return (
    <ScrollArea className="h-[calc(100vh-80px)]">
      <div className="p-6 space-y-6">
        <h2 className="text-2xl font-bold">Communication Usage</h2>

        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Usage Overview</h3>
          <UsageFilters
            selectedXref={usageXref}
            onXrefChange={setUsageXref}
            onDateChange={setUsageDateRange}
            onDateClear={() => setUsageDateRange({})}
          />
        </div>

        <UsageOverviewCards totals={totals} loading={activeUsageLoading} />

        <UsageByTransport byTransport={byTransport} />

        <TransportDetailCards
          byTransport={byTransport}
          loading={activeUsageLoading}
        />

        <Separator />

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
  );
}

'use client';

import { useMemo, useState } from 'react';
import { format, subDays } from 'date-fns';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';
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

const CREDIT_DEFAULT_FROM = subDays(new Date(), 30);
const CREDIT_DEFAULT_TO = new Date();

export default function UsageView() {
  const [usageXref, setUsageXref] = useState<string | null>(null);
  const [usageDateRange, setUsageDateRange] = useState<DateRangeQuery>({});
  const [creditXref, setCreditXref] = useState<string | null>(null);
  const [creditDateRange, setCreditDateRange] = useState<DateRangeQuery>({
    from: format(CREDIT_DEFAULT_FROM, 'yyyy-MM-dd'),
    to: format(CREDIT_DEFAULT_TO, 'yyyy-MM-dd'),
  });

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
        <h2 className="text-2xl font-bold">Usage</h2>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg font-semibold">
              Communication Usage
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
          defaultFrom={CREDIT_DEFAULT_FROM}
          defaultTo={CREDIT_DEFAULT_TO}
        />
      </div>
    </ScrollArea>
  );
}

'use client';

import { useTranslations } from 'next-intl';
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
  useCommsUSAGE,
  useCommsUSAGEByXref,
  useCommsCredits,
  useCommsCreditsByXref,
} from '@rahat-ui/query';
import USAGEFilters from './usage-filters';
import USAGEOverviewCards from './usage-overview-cards';
import USAGEByTransport from './usage-by-transport';
import TransportDetailCards from './transport-detail-cards';
import CreditUSAGESection from './credit-usage-section';

type DateRangeQuery = { from?: string; to?: string };

const CREDIT_DEFAULT_FROM = subDays(new Date(), 30);
const CREDIT_DEFAULT_TO = new Date();

export default function USAGEView() {
  const t = useTranslations('USAGE');
  const [usageXref, setUSAGEXref] = useState<string | null>(null);
  const [usageDateRange, setUSAGEDateRange] = useState<DateRangeQuery>({});
  const [creditXref, setCreditXref] = useState<string | null>(null);
  const [creditDateRange, setCreditDateRange] = useState<DateRangeQuery>({
    from: format(CREDIT_DEFAULT_FROM, 'yyyy-MM-dd'),
    to: format(CREDIT_DEFAULT_TO, 'yyyy-MM-dd'),
  });

  const { data: usageData, isPending: usageLoading } =
    useCommsUSAGE(usageXref ? undefined : usageDateRange);
  const { data: usageByXrefData, isPending: usageByXrefLoading } =
    useCommsUSAGEByXref(usageXref ?? '', usageDateRange);

  const { data: creditsData, isPending: creditsLoading } =
    useCommsCredits(creditXref ? undefined : creditDateRange);
  const { data: creditsByXrefData, isPending: creditsByXrefLoading } =
    useCommsCreditsByXref(creditXref ?? '', creditDateRange);

  const activeUSAGE = usageXref ? usageByXrefData : usageData;
  const activeUSAGELoading = usageXref ? usageByXrefLoading : usageLoading;

  const activeCredits = creditXref ? creditsByXrefData : creditsData;
  const activeCreditsLoading = creditXref
    ? creditsByXrefLoading
    : creditsLoading;

  const totals = activeUSAGE?.data?.totals;
  const byTransport = activeUSAGE?.data?.byTransport;
  const credits = activeCredits?.data;

  return (
    <ScrollArea className="h-[calc(100vh-80px)]">
      <div className="p-6 space-y-6">
        <h2 className="text-2xl font-bold">{t('USAGE')}</h2>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg font-semibold">
              {t('COMMUNICATION_USAGE')}
            </CardTitle>
            <USAGEFilters
              selectedXref={usageXref}
              onXrefChange={setUSAGEXref}
              onDateChange={setUSAGEDateRange}
              onDateClear={() => setUSAGEDateRange({})}
            />
          </CardHeader>
          <CardContent className="space-y-6">
            <USAGEOverviewCards totals={totals} loading={activeUSAGELoading} />
            <USAGEByTransport byTransport={byTransport} />
            <TransportDetailCards
              byTransport={byTransport}
              loading={activeUSAGELoading}
            />
          </CardContent>
        </Card>

        <CreditUSAGESection
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

'use client';

import {
  useCambodiaLineChartsReports,
  useCambodiaVendorGet,
  useCambodiaVendorsStats,
  useVillageDoctorVendorTransactions,
} from '@rahat-ui/query';
import {
  Card,
  CardContent,
  CardHeader,
} from '@rahat-ui/shadcn/components/card';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { DateRangePicker } from 'apps/rahat-ui/src/components/datePickerRange';
import { DateRange } from 'react-day-picker';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import { truncateEthAddress } from '@rumsan/sdk/utils';
import DataCard from 'apps/rahat-ui/src/components/dataCard';
import {
  BadgeDollarSign,
  Coins,
  Copy,
  CopyCheck,
  Glasses,
  Stethoscope,
  UserCheck,
  UserCog,
  Users,
  UserStar,
} from 'lucide-react';
import { useParams } from 'next/navigation';
import React from 'react';
import HealthWorkersView from './health.workers.view';
import TransactionHistoryView from './transaction.history.view';
import CambodiaLineCharts from '../../../chart-reports/cambodia-line-chart';
import MONTHS from '../../../../utils/months.json';
import DropdownComponent from '../../components/dropdownComponent';
import SpinnerLoader from '../../components/spinner.loader';
import {
  VillageDoctorDetailChrome,
  VillageDoctorField,
  VillageDoctorSectionHeading,
} from '../page-shell';

const formatLocalDate = (value: Date) => {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const INVALID_RANGE_MSG = '"To" date cannot be less than "From" date.';

function routeParam(value: string | string[] | undefined): string | undefined {
  if (value == null) return undefined;
  return Array.isArray(value) ? value[0] : value;
}

function pickVendorWallet(row: Record<string, unknown> | undefined): string {
  if (!row || typeof row !== 'object') return '';
  const user =
    (row['User'] as Record<string, unknown> | undefined) ??
    (row['user'] as Record<string, unknown> | undefined);
  const direct =
    typeof user?.['wallet'] === 'string'
      ? user['wallet']
      : typeof row['wallet'] === 'string'
      ? row['wallet']
      : '';
  const trimmed = direct.trim();
  if (trimmed) return trimmed;
  const extras = user?.['extras'];
  if (extras && typeof extras === 'object' && extras !== null) {
    const ex = extras as Record<string, unknown>;
    const w = ex['wallet'] ?? ex['walletAddress'];
    return typeof w === 'string' ? w.trim() : '';
  }
  return '';
}

export default function VendorsDetail() {
  const params = useParams();
  const id = routeParam(params.id);
  const vendorId = routeParam(params.vendorId);
  const {
    data: vendorQueryData,
    isLoading: vendorLoading,
    isFetching: vendorFetching,
    isError: vendorIsError,
    error: vendorQueryError,
    isSuccess: vendorQuerySuccess,
  } = useCambodiaVendorGet({ projectUUID: id, vendorId }) as any;

  const vendorRow = vendorQueryData?.data;
  const [walletCopied, setWalletCopied] = React.useState(false);
  const currentYear = new Date().getFullYear();

  const currentMonth = new Date().getMonth() + 1;
  const currentMonthName = MONTHS.find(
    (month) => month.value === currentMonth.toString(),
  );
  const [filters, setFilters] = React.useState({
    month: currentMonth,
    year: currentYear,
  });
  const [statsDateFrom, setStatsDateFrom] = React.useState('');
  const [statsDateTo, setStatsDateTo] = React.useState('');
  const [dateRangeError, setDateRangeError] = React.useState<string | null>(
    null,
  );
  const [filterResetKey, setFilterResetKey] = React.useState(0);

  const vendorsStatsPayload = React.useMemo(() => {
    const payload: {
      projectUUID: string | undefined;
      vendorId: string | undefined;
      from?: string;
      to?: string;
    } = { projectUUID: id, vendorId };
    if (statsDateFrom) {
      payload.from = new Date(`${statsDateFrom}T00:00:00`).toISOString();
    }
    if (statsDateTo) {
      payload.to = new Date(`${statsDateTo}T23:59:59.999`).toISOString();
    }
    return payload;
  }, [id, vendorId, statsDateFrom, statsDateTo]);

  const { data: vendorsStats, isFetching: vendorsStatsFetching } =
    useCambodiaVendorsStats(vendorsStatsPayload) as any;

  const { data: lineChartReport, isLoading: lineChartLoading } =
    useCambodiaLineChartsReports({
      projectUUID: id,
      filters,
      vendorId: vendorId as string,
    });

  const wallet = pickVendorWallet(
    vendorRow as Record<string, unknown> | undefined,
  );
  const { data: vendorTransactions, isLoading: vendorTransactionsLoading } =
    useVillageDoctorVendorTransactions(wallet);

  const transformedYearData = Array.from({ length: 5 }, (_, index) => {
    const year = currentYear + index;
    return {
      label: year.toString(),
      value: year.toString(),
    };
  });
  const transformedMonthData =
    MONTHS.map((item) => ({
      label: item.label.toString(),
      value: item.value.toString(),
    })) || [];

  if (lineChartLoading) {
    return (
      <div className="flex min-h-[calc(100dvh-3.5rem)] items-center justify-center bg-background">
        <SpinnerLoader />
      </div>
    );
  }
  const handleSelect = (key: string, value: string) => {
    if (key === 'Months') {
      setFilters({ ...filters, month: parseInt(value) });
    }
    if (key === 'Years') {
      setFilters({ ...filters, year: parseInt(value) });
    }
  };

  const vendorFetchFailed =
    vendorIsError &&
    !vendorLoading &&
    !vendorFetching &&
    Boolean(id && vendorId);

  // const titleName = 'Eye partner';
  const headerSubtitle =
    'Performance, wallet, and activity for this Eye Partner location.';

  const copyWallet = () => {
    if (!wallet) return;
    navigator.clipboard.writeText(wallet);
    setWalletCopied(true);
    setTimeout(() => setWalletCopied(false), 1500);
  };

  const statsDateFilterActions = (
    <div className="w-max max-w-full rounded-xl px-3 py-2.5">
      <div className="flex flex-col items-start gap-1">
        <DateRangePicker
          key={filterResetKey}
          placeholder="Select date range"
          type="range"
          className={`h-9 w-auto${
            dateRangeError ? ' border-destructive' : ''
          }`}
          handleDateChange={(range: DateRange | undefined) => {
            const from = range?.from ? formatLocalDate(range.from) : '';
            const to = range?.to ? formatLocalDate(range.to) : '';

            if (from && to && to < from) {
              setDateRangeError(INVALID_RANGE_MSG);
              return;
            }

            setDateRangeError(null);
            setStatsDateFrom(from);
            setStatsDateTo(to);
          }}
          handleClearDate={() => {
            setStatsDateFrom('');
            setStatsDateTo('');
            setDateRangeError(null);
            setFilterResetKey((k) => k + 1);
          }}
          onInvalidRange={() => {
            setDateRangeError(INVALID_RANGE_MSG);
          }}
        />
        {dateRangeError && (
          <p
            className="w-[280px] self-start text-left text-[11px] leading-tight text-destructive"
            aria-live="polite"
          >
            {dateRangeError}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <VillageDoctorDetailChrome
      title={`Eye Partner - ${vendorRow?.User?.name}`}
      subtitle={headerSubtitle}
      backHref={`/projects/el-village-doctor/${id}/vendors`}
      actions={statsDateFilterActions}
    >
      <div
        className={
          vendorsStatsFetching ? 'opacity-70 transition-opacity' : undefined
        }
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <DataCard
            className="rounded-xl border border-border/80 shadow-sm shadow-black/[0.03]"
            titleClassName="text-sm font-medium text-muted-foreground"
            cardHeaderClassName="px-5 pb-2 pt-5"
            cardContentClassName="px-5 pb-5 pt-0"
            numberClassName="text-2xl font-semibold tracking-tight text-foreground"
            title="Total Eyewear Sold"
            Icon={Glasses}
            number={String(vendorsStats?.data?.sales ?? 0)}
          />
          <DataCard
            className="rounded-xl border border-border/80 shadow-sm shadow-black/[0.03]"
            titleClassName="text-sm font-medium text-muted-foreground"
            cardHeaderClassName="px-5 pb-2 pt-5"
            cardContentClassName="px-5 pb-5 pt-0"
            numberClassName="text-2xl font-semibold tracking-tight text-foreground"
            title="Total Village Doctors"
            Icon={Stethoscope}
            number={String(vendorsStats?.data?.healthWorkers ?? 0)}
          />
          <DataCard
            className="rounded-xl border border-border/80 shadow-sm shadow-black/[0.03]"
            titleClassName="text-sm font-medium text-muted-foreground"
            cardHeaderClassName="px-5 pb-2 pt-5"
            cardContentClassName="px-5 pb-5 pt-0"
            numberClassName="text-2xl font-semibold tracking-tight text-foreground"
            title="Total Villagers Referred"
            Icon={Users}
            number={String(vendorsStats?.data?.leadsRecieved ?? 0)}
          />
          <DataCard
            className="rounded-xl border border-border/80 shadow-sm shadow-black/[0.03]"
            titleClassName="text-sm font-medium text-muted-foreground"
            cardHeaderClassName="px-5 pb-2 pt-5"
            cardContentClassName="px-5 pb-5 pt-0"
            numberClassName="text-2xl font-semibold tracking-tight text-foreground"
            title="Total Successful Referrals"
            Icon={UserCheck}
            number={String(vendorsStats?.data?.leadsConverted ?? 0)}
          />
          <DataCard
            className="rounded-xl border border-border/80 shadow-sm shadow-black/[0.03]"
            titleClassName="text-sm font-medium text-muted-foreground"
            cardHeaderClassName="px-5 pb-2 pt-5"
            cardContentClassName="px-5 pb-5 pt-0"
            numberClassName="text-2xl font-semibold tracking-tight text-foreground"
            title={
              <>
                Total Sales Amount in Eye Partners{' '}
                <span className="text-[#229b27]">(RMB)</span>
              </>
            }
            Icon={Coins}
            number={Number(vendorsStats?.data?.totalPurchaseAmountRmb ?? 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}
          />
        </div>
      </div>

      <Card className="border-border/80 shadow-sm">
        <CardHeader className="border-b border-border/60 pb-4">
          <VillageDoctorSectionHeading
            title="Contact & wallet"
            description="Use the wallet for on-chain reconciliation with this partner."
          />
        </CardHeader>
        <CardContent className="pt-6">
          <dl className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <VillageDoctorField label="Wallet address">
              <button
                type="button"
                onClick={copyWallet}
                className="flex cursor-pointer items-center gap-2 text-left text-sm font-medium"
              >
                <span>{wallet ? truncateEthAddress(wallet) : '—'}</span>
                {walletCopied ? (
                  <CopyCheck size={18} strokeWidth={1.5} />
                ) : (
                  <Copy
                    size={18}
                    strokeWidth={1.5}
                    className="text-muted-foreground"
                  />
                )}
              </button>
            </VillageDoctorField>
            <VillageDoctorField label="Phone number">
              {vendorRow?.User?.phone ?? '—'}
            </VillageDoctorField>
            <VillageDoctorField label="Username">
              {vendorRow?.User?.username ?? '—'}
            </VillageDoctorField>
          </dl>
        </CardContent>
      </Card>

      <Card className="border-border/80 shadow-sm">
        <CardHeader className="flex flex-col gap-4 border-b border-border/60 pb-4 sm:flex-row sm:items-end sm:justify-between">
          <VillageDoctorSectionHeading
            title="Trends"
            description="Compare performance across the selected period."
          />
          <div className="flex flex-wrap gap-2">
            <DropdownComponent
              transformedData={transformedMonthData}
              title={'Months'}
              handleSelect={handleSelect}
              current={currentMonthName?.label}
            />
            <DropdownComponent
              transformedData={transformedYearData}
              title={'Years'}
              handleSelect={handleSelect}
              current={currentYear}
            />
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {lineChartReport?.data?.map((item) => {
              return (
                <CambodiaLineCharts
                  series={item?.series}
                  categories={item?.categories}
                  name={item?.name}
                  key={item.name}
                />
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="transactionHistory" className="space-y-4">
        <TabsList className="grid h-auto w-full grid-cols-2 gap-1 rounded-xl border border-border/80 bg-muted/40 p-1">
          <TabsTrigger
            value="transactionHistory"
            className="rounded-lg text-sm font-medium data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm"
          >
            Transactions
          </TabsTrigger>
          {/* <TabsTrigger
            value="conversionList"
            className="rounded-lg text-sm font-medium data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm"
          >
            Conversions
          </TabsTrigger> */}
          <TabsTrigger
            value="healthWorkers"
            className="rounded-lg text-sm font-medium data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm"
          >
            Village Doctors
          </TabsTrigger>
        </TabsList>
        <TabsContent value="transactionHistory" className="mt-0">
          <TransactionHistoryView
            vendorTransactions={vendorTransactions}
            isLoading={vendorTransactionsLoading}
          />
        </TabsContent>
        {/* <TabsContent value="conversionList" className="mt-0">
          <ConversionListView />
        </TabsContent> */}
        <TabsContent value="healthWorkers" className="mt-0">
          <HealthWorkersView />
        </TabsContent>
      </Tabs>
    </VillageDoctorDetailChrome>
  );
}

'use client';
import {
  useCambodiaLineChartsReports,
  useCambodiaVendorGet,
  useCambodiaVendorsStats,
} from '@rahat-ui/query';
import {
  Card,
  CardContent,
  CardHeader,
} from '@rahat-ui/shadcn/components/card';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
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
  ShoppingBag,
  UserCog,
  Users,
} from 'lucide-react';
import { useParams } from 'next/navigation';
import React from 'react';
import ConversionListView from './conversion.list.view';
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

/** Next.js `useParams` may return `string | string[]` for dynamic segments. */
function routeParam(
  value: string | string[] | undefined,
): string | undefined {
  if (value == null) return undefined;
  return Array.isArray(value) ? value[0] : value;
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

  /** `formatResponse`: inner API payload is `vendorQueryData.data` */
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

  const wallet = vendorRow?.User?.wallet as string | undefined;

  const vendorFetchFailed =
    vendorIsError &&
    !vendorLoading &&
    !vendorFetching &&
    Boolean(id && vendorId);

  const titleName =
    vendorRow?.User?.name ??
    (vendorLoading || vendorFetching
      ? 'Loading…'
      : vendorFetchFailed
        ? 'Could not load partner'
        : 'Eye partner');

  const headerSubtitle =
    vendorFetchFailed && vendorQueryError
      ? `The partner request failed: ${vendorQueryError instanceof Error ? vendorQueryError.message : String(vendorQueryError)}. Check the Network tab for POST …/projects/${id}/actions (auth, 4xx/5xx).`
      : vendorQuerySuccess && !vendorRow
        ? 'No project assignment was found for this user and project (missing row in project vendors).'
        : 'Performance, wallet, and activity for this Eye Partner location.';

  const copyWallet = () => {
    if (!wallet) return;
    navigator.clipboard.writeText(wallet);
    setWalletCopied(true);
    setTimeout(() => setWalletCopied(false), 1500);
  };

  const statsDateFilterActions = (
    <div className="w-max max-w-full rounded-xl border border-border/80 bg-muted/30 px-3 py-2.5 shadow-sm">
      <div className="flex flex-wrap items-end justify-end gap-2 sm:gap-3">
        <div className="flex w-[10.5rem] shrink-0 flex-col gap-1">
          <Label htmlFor="vendor-stats-from" className="text-[11px]">
            From
          </Label>
          <Input
            id="vendor-stats-from"
            type="date"
            className="h-8 w-full bg-background"
            value={statsDateFrom}
            max={statsDateTo || undefined}
            onChange={(e) => setStatsDateFrom(e.target.value)}
          />
        </div>
        <div className="flex w-[10.5rem] shrink-0 flex-col gap-1">
          <Label htmlFor="vendor-stats-to" className="text-[11px]">
            To
          </Label>
          <Input
            id="vendor-stats-to"
            type="date"
            className="h-8 w-full bg-background"
            value={statsDateTo}
            min={statsDateFrom || undefined}
            onChange={(e) => setStatsDateTo(e.target.value)}
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 shrink-0 px-2.5 text-xs"
          onClick={() => {
            setStatsDateFrom('');
            setStatsDateTo('');
          }}
        >
          Clear dates
        </Button>
      </div>
    </div>
  );

  console.log(vendorsStats?.data, 'vendor stats');

  return (
    <VillageDoctorDetailChrome
      title={titleName}
      subtitle={headerSubtitle}
      backHref={`/projects/el-village-doctor/${id}/vendors`}
      actions={statsDateFilterActions}
    >
      <div
        className={
          vendorsStatsFetching ? 'opacity-70 transition-opacity' : undefined
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* <DataCard
          className="rounded-xl border-border/80 shadow-sm"
          title="Wearers"
          Icon={Glasses}
          number={String(vendorsStats?.data?.consumers ?? 0)}
        /> */}
        {/* <DataCard
          className="rounded-xl border-border/80 shadow-sm"
          title="Eye checkups"
          Icon={ShoppingBag}
          number={String(vendorsStats?.data?.leadsConverted ?? 0)}
        /> */}
        <DataCard
          className="rounded-xl border-border/80 shadow-sm"
          title="Total Eyewear Sold"
          Icon={BadgeDollarSign}
          number={String(vendorsStats?.data?.sales ?? 0)}
        />
        <DataCard
          className="rounded-xl border-border/80 shadow-sm"
          title="Village Doctors"
          Icon={UserCog}
          number={String(vendorsStats?.data?.healthWorkers ?? 0)}
        />
        <DataCard
          className="rounded-xl border-border/80 shadow-sm"
          title="Villagers referred"
          Icon={Users}
          number={String(vendorsStats?.data?.leadsRecieved ?? 0)}
        />
        {/* <DataCard
          className="rounded-xl border-border/80 shadow-sm"
          title="Eyewear dispensed"
          Icon={Glasses}
          number={String(vendorsStats?.data?.footfalls ?? 0)}
        /> */}
        <DataCard
          className="rounded-xl border-border/80 shadow-sm"
          title="Total Purchase Amount (RMB)"
          Icon={Coins}
          number={String(vendorsStats?.data?.totalPurchaseAmountRmb ?? 0)}
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
                <span>
                  {wallet ? truncateEthAddress(wallet) : '—'}
                </span>
                {walletCopied ? (
                  <CopyCheck size={18} strokeWidth={1.5} />
                ) : (
                  <Copy size={18} strokeWidth={1.5} className="text-muted-foreground" />
                )}
              </button>
            </VillageDoctorField>
            <VillageDoctorField label="Phone number">
              {vendorRow?.User?.phone ?? '—'}
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
          <TransactionHistoryView vendorAddress={vendorRow?.User?.wallet} />
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

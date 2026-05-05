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

export default function VendorsDetail() {
  const { id, vendorId } = useParams();
  const { data } = useCambodiaVendorGet({ projectUUID: id, vendorId }) as any;
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
  const { data: vendorsStats } = useCambodiaVendorsStats({
    projectUUID: id,
    vendorId,
  }) as any;

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

  const wallet = data?.data?.User?.wallet as string | undefined;

  const copyWallet = () => {
    if (!wallet) return;
    navigator.clipboard.writeText(wallet);
    setWalletCopied(true);
    setTimeout(() => setWalletCopied(false), 1500);
  };

  return (
    <VillageDoctorDetailChrome
      title={data?.data?.User?.name}
      subtitle="Performance, wallet, and activity for this Eye Partner location."
      backHref={`/projects/el-village-doctor/${id}/vendors`}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <DataCard
          className="rounded-xl border-border/80 shadow-sm"
          title="Wearers"
          Icon={Glasses}
          number={String(vendorsStats?.data?.consumers ?? 0)}
        />
        <DataCard
          className="rounded-xl border-border/80 shadow-sm"
          title="Eye checkups"
          Icon={ShoppingBag}
          number={String(vendorsStats?.data?.leadsConverted ?? 0)}
        />
        <DataCard
          className="rounded-xl border-border/80 shadow-sm"
          title="Sales"
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
        <DataCard
          className="rounded-xl border-border/80 shadow-sm"
          title="Eyewear dispensed"
          Icon={Glasses}
          number={String(vendorsStats?.data?.footfalls ?? 0)}
        />
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
                <span>{truncateEthAddress(wallet)}</span>
                {walletCopied ? (
                  <CopyCheck size={18} strokeWidth={1.5} />
                ) : (
                  <Copy size={18} strokeWidth={1.5} className="text-muted-foreground" />
                )}
              </button>
            </VillageDoctorField>
            <VillageDoctorField label="Phone number">
              {data?.data?.User?.phone ?? '—'}
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
        <TabsList className="grid h-auto w-full grid-cols-3 gap-1 rounded-xl border border-border/80 bg-muted/40 p-1">
          <TabsTrigger
            value="transactionHistory"
            className="rounded-lg text-sm font-medium data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm"
          >
            Transactions
          </TabsTrigger>
          <TabsTrigger
            value="conversionList"
            className="rounded-lg text-sm font-medium data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm"
          >
            Conversions
          </TabsTrigger>
          <TabsTrigger
            value="healthWorkers"
            className="rounded-lg text-sm font-medium data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm"
          >
            Village Doctors
          </TabsTrigger>
        </TabsList>
        <TabsContent value="transactionHistory" className="mt-0">
          <TransactionHistoryView vendorAddress={data?.data?.User?.wallet} />
        </TabsContent>
        <TabsContent value="conversionList" className="mt-0">
          <ConversionListView />
        </TabsContent>
        <TabsContent value="healthWorkers" className="mt-0">
          <HealthWorkersView />
        </TabsContent>
      </Tabs>
    </VillageDoctorDetailChrome>
  );
}

'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@rahat-ui/shadcn/src/components/ui/chart';
import { Skeleton } from '@rahat-ui/shadcn/src/components/ui/skeleton';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import {
  useFindAllKenyaStats,
  useGetProjectBeneficiaryStats,
  useEyeCheckupLineChartsReports,
  usePurchaseOfGlassLineChartsReports,
} from '@rahat-ui/query';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import {
  BarChart2,
  Users,
  Store,
  UserX,
  EyeOff,
  ShoppingBag,
  CheckCircle2,
  VenetianMask,
  Activity,
  Glasses,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import MONTHS from '../../../../utils/months.json';
import { UUID } from 'crypto';
import { useMemo, useState } from 'react';
import {
  AgeRangeEntry,
  ConsentEntry,
  GenderEntry,
  GlassStatusEntry,
  PLATFORM_STAT_PREFIXES,
  PlatformStat,
  SMS_VOUCHER_STAT_NAMES,
  SmsVoucherStat,
  VoucherTypeEntry,
  getPlatformStat,
  getSmsVoucherStat,
} from './types';

type Props = {
  projectUUID: UUID;
};

const COLORS = {
  primary: '#6366f1',
  slices: ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#0ea5e9', '#a855f7'],
};

function formatNumber(n: number | undefined): string {
  if (n === undefined || n === null || Number.isNaN(n)) return '0';
  return n.toLocaleString();
}

export default function SmsVoucherStatsSection({ projectUUID }: Props) {
  const { data: rawStats, isLoading: statsLoading } =
    useFindAllKenyaStats(projectUUID);
  const { data: platformStats, isLoading: platformLoading } =
    useGetProjectBeneficiaryStats(projectUUID);

  const isLoading = statsLoading || platformLoading;

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const START_YEAR = 2025;

  const [eyeCheckupFilters, setEyeCheckupFilters] = useState({
    month: currentMonth,
    year: currentYear,
  });
  const [purchaseFilters, setPurchaseFilters] = useState({
    month: currentMonth,
    year: currentYear,
  });

  const { data: eyeCheckupReport } = useEyeCheckupLineChartsReports({
    projectUUID,
    filters: eyeCheckupFilters,
  });
  const { data: purchaseReport } = usePurchaseOfGlassLineChartsReports({
    projectUUID,
    filters: purchaseFilters,
  });

  const yearOptions = Array.from(
    { length: currentYear + 5 - START_YEAR + 1 },
    (_, i) => START_YEAR + i,
  );

  const stats = rawStats as SmsVoucherStat[] | undefined;
  // platform response shape: { success: true, data: PlatformStat[] }
  const platformStatsList = (platformStats as { data?: PlatformStat[] } | undefined)?.data;

  const totalConsumers =
    getSmsVoucherStat<number>(stats, SMS_VOUCHER_STAT_NAMES.BENEFICIARY_TOTAL) ?? 0;

  const notRedeemStats =
    getSmsVoucherStat<GlassStatusEntry[]>(stats, SMS_VOUCHER_STAT_NAMES.NOT_REDEEM_STATS) ?? [];
  const totalInactiveConsumers = notRedeemStats.reduce((sum, e) => sum + e.count, 0);

  const voucherUsageType =
    getSmsVoucherStat<VoucherTypeEntry[]>(stats, SMS_VOUCHER_STAT_NAMES.VOUCHER_USAGE_TYPE_STATS) ?? [];

  const redemptionStats =
    getSmsVoucherStat<VoucherTypeEntry[]>(stats, SMS_VOUCHER_STAT_NAMES.REDEMPTION_STATS) ?? [];

  const consentStats =
    getSmsVoucherStat<ConsentEntry[]>(stats, SMS_VOUCHER_STAT_NAMES.CONSENT) ?? [];

  const totalVendors =
    getPlatformStat<{ count: number }>(platformStatsList, PLATFORM_STAT_PREFIXES.VENDOR_TOTAL)?.count ?? 0;
  const genderData =
    getPlatformStat<GenderEntry[]>(platformStatsList, PLATFORM_STAT_PREFIXES.BENEFICIARY_GENDER) ?? [];
  const ageRangeData =
    getPlatformStat<AgeRangeEntry[]>(platformStatsList, PLATFORM_STAT_PREFIXES.BENEFICIARY_AGE_RANGE) ?? [];

  const eyeCheckupChartData = useMemo(() => {
    const { series, categories } = (eyeCheckupReport as any)?.data ?? {};
    if (!categories?.length) return [];
    return (categories as string[]).map((cat, i) => ({
      week: cat,
      count: (series as number[])?.[i] ?? 0,
    }));
  }, [eyeCheckupReport]);

  const purchaseChartData = useMemo(() => {
    const { series, categories } = (purchaseReport as any)?.data ?? {};
    if (!categories?.length) return [];
    return (categories as string[]).map((cat, i) => ({
      week: cat,
      count: (series as number[])?.[i] ?? 0,
    }));
  }, [purchaseReport]);

  const genderChartData = useMemo(
    () => genderData.map((d, i) => ({ id: d.id, count: d.count, fill: COLORS.slices[i % COLORS.slices.length] })),
    [genderData],
  );
  const voucherUsageChartData = useMemo(
    () => voucherUsageType.map((d, i) => ({ ...d, fill: COLORS.slices[i % COLORS.slices.length] })),
    [voucherUsageType],
  );
  const redemptionChartData = useMemo(
    () => redemptionStats.map((d, i) => ({ ...d, fill: COLORS.slices[i % COLORS.slices.length] })),
    [redemptionStats],
  );
  const consentChartData = useMemo(
    () => consentStats.map((d, i) => ({ ...d, fill: COLORS.slices[i % COLORS.slices.length] })),
    [consentStats],
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-60 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-lg" />
      </div>
    );
  }

  const kpiCards = [
    {
      title: 'Total Consumers',
      value: totalConsumers,
      icon: Users,
      bgColor: 'bg-indigo-500/10',
      iconColor: 'text-indigo-500',
    },
    {
      title: 'Total Vendors',
      value: totalVendors,
      icon: Store,
      bgColor: 'bg-emerald-500/10',
      iconColor: 'text-emerald-500',
    },
    {
      title: 'Total Inactive Consumers',
      value: totalInactiveConsumers,
      icon: UserX,
      bgColor: 'bg-rose-500/10',
      iconColor: 'text-rose-500',
    },
  ];

  const donutCharts = [
    {
      title: 'Consumer Gender',
      description: 'Gender distribution of beneficiaries',
      icon: VenetianMask,
      iconBg: 'bg-violet-500/10',
      iconColor: 'text-violet-500',
      emptyIcon: VenetianMask,
      data: genderChartData,
      nameKey: 'id',
      dataKey: 'count',
    },
    {
      title: 'Voucher Usage Type',
      description: 'Eye checkup and purchase of glasses',
      icon: EyeOff,
      iconBg: 'bg-sky-500/10',
      iconColor: 'text-sky-500',
      emptyIcon: EyeOff,
      data: voucherUsageChartData,
      nameKey: 'id',
      dataKey: 'count',
    },
    {
      title: 'Glass Purchase Type',
      description: 'Voucher types redeemed for glasses',
      icon: ShoppingBag,
      iconBg: 'bg-amber-500/10',
      iconColor: 'text-amber-500',
      emptyIcon: ShoppingBag,
      data: redemptionChartData,
      nameKey: 'id',
      dataKey: 'count',
    },
    {
      title: 'Consent Provided',
      description: 'Beneficiary consent breakdown',
      icon: CheckCircle2,
      iconBg: 'bg-green-500/10',
      iconColor: 'text-green-500',
      emptyIcon: CheckCircle2,
      data: consentChartData,
      nameKey: 'id',
      dataKey: 'count',
    },
  ];

  return (
    <ScrollArea className="h-[calc(100vh-170px)]">
    <div className="space-y-6 p-2">
      {/* KPI cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        {kpiCards.map((card) => (
          <Card
            key={card.title}
            className="relative overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1 min-w-0">
                  <p className="text-xs font-medium text-muted-foreground leading-none truncate">
                    {card.title}
                  </p>
                  <p className="text-2xl font-bold tracking-tight">
                    {formatNumber(card.value)}
                  </p>
                </div>
                <div className={`rounded-lg p-2 ${card.bgColor} shrink-0`}>
                  <card.icon className={`h-4 w-4 ${card.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Donut charts */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 3xl:grid-cols-4">
        {donutCharts.map((chart) => (
          <Card key={chart.title}>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className={`rounded-lg p-2 ${chart.iconBg}`}>
                  <chart.icon className={`h-4 w-4 ${chart.iconColor}`} />
                </div>
                <div>
                  <CardTitle className="text-sm font-semibold">
                    {chart.title}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {chart.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {chart.data.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <chart.emptyIcon className="h-8 w-8 mb-2 opacity-30" />
                  <p className="text-sm">No data yet</p>
                </div>
              ) : (
                <ChartContainer
                  config={Object.fromEntries(
                    chart.data.map((d: any) => [
                      d[chart.nameKey],
                      { label: d[chart.nameKey], color: d.fill },
                    ]),
                  )}
                  className="h-[220px] w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chart.data}
                        dataKey={chart.dataKey}
                        nameKey={chart.nameKey}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={75}
                        paddingAngle={3}
                        strokeWidth={0}
                      >
                        {chart.data.map((entry: any, idx: number) => (
                          <Cell key={`cell-${idx}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <ChartTooltip
                        content={<ChartTooltipContent nameKey={chart.nameKey} />}
                      />
                      <ChartLegend content={<ChartLegendContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Consumer Age Group bar chart */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <div className="rounded-lg p-2 bg-indigo-500/10">
              <BarChart2 className="h-4 w-4 text-indigo-500" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">
                Consumer Age Group
              </CardTitle>
              <CardDescription className="text-xs">
                Distribution of beneficiaries by age range
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {ageRangeData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <BarChart2 className="h-8 w-8 mb-2 opacity-30" />
              <p className="text-sm">No age range data yet</p>
            </div>
          ) : (
            <ChartContainer
              config={{ count: { label: 'Consumers', color: COLORS.primary } }}
              className="h-[260px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={ageRangeData}
                  margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="hsl(var(--border))"
                    strokeOpacity={0.5}
                  />
                  <XAxis
                    dataKey="id"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11 }}
                    dy={8}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11 }}
                    width={40}
                    allowDecimals={false}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="count"
                    fill={COLORS.primary}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      {/* Line charts — Eye Checkup & Purchase of Glasses */}
      <div className="grid gap-6 lg:grid-cols-2">
        {[
          {
            title: 'Eye Checkup',
            description: 'Weekly count for selected month',
            icon: Activity,
            iconBg: 'bg-sky-500/10',
            iconColor: 'text-sky-500',
            color: '#0ea5e9',
            chartData: eyeCheckupChartData,
            filters: eyeCheckupFilters,
            setFilters: setEyeCheckupFilters,
          },
          {
            title: 'Purchase of Glasses',
            description: 'Weekly count for selected month',
            icon: Glasses,
            iconBg: 'bg-violet-500/10',
            iconColor: 'text-violet-500',
            color: '#a855f7',
            chartData: purchaseChartData,
            filters: purchaseFilters,
            setFilters: setPurchaseFilters,
          },
        ].map((chart) => (
          <Card key={chart.title}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className={`rounded-lg p-2 ${chart.iconBg}`}>
                    <chart.icon className={`h-4 w-4 ${chart.iconColor}`} />
                  </div>
                  <div>
                    <CardTitle className="text-base font-semibold">
                      {chart.title}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {chart.description}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    value={chart.filters.month.toString()}
                    onValueChange={(v) =>
                      chart.setFilters((prev) => ({ ...prev, month: parseInt(v) }))
                    }
                  >
                    <SelectTrigger className="h-7 w-[90px] text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MONTHS.map((m) => (
                        <SelectItem key={m.value} value={m.value} className="text-xs">
                          {m.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={chart.filters.year.toString()}
                    onValueChange={(v) =>
                      chart.setFilters((prev) => ({ ...prev, year: parseInt(v) }))
                    }
                  >
                    <SelectTrigger className="h-7 w-[80px] text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {yearOptions.map((y) => (
                        <SelectItem key={y} value={y.toString()} className="text-xs">
                          {y}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {chart.chartData.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <chart.icon className="h-8 w-8 mb-2 opacity-30" />
                  <p className="text-sm">No data for selected period</p>
                </div>
              ) : (
                <ChartContainer
                  config={{ count: { label: chart.title, color: chart.color } }}
                  className="h-[260px] w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={chart.chartData}
                      margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="hsl(var(--border))"
                        strokeOpacity={0.5}
                      />
                      <XAxis
                        dataKey="week"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11 }}
                        dy={8}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11 }}
                        width={40}
                        allowDecimals={false}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="count"
                        stroke={chart.color}
                        strokeWidth={2}
                        dot={{ r: 3, fill: chart.color }}
                        activeDot={{ r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
    </ScrollArea>
  );
}

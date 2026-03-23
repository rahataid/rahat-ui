'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@rahat-ui/shadcn/src/components/ui/chart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import {
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
  ResponsiveContainer,
  Label,
  RadialBarChart,
  RadialBar,
} from 'recharts';
import {
  Users,
  UserCheck,
  UserMinus,
  UserX,
  Send,
  Activity,
  Download,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Bot,
  FileUp,
  XCircle,
} from 'lucide-react';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import {
  CustomerCategory,
  Stat,
  useCustomerStats,
  type CommunicationStats,
  type AutomationHealth,
  type RecentCampaign,
  type RecentImport,
  type CustomersByMonthEntry,
} from '@rahat-ui/query';
import { useParams, useRouter } from 'next/navigation';
import { UUID } from 'crypto';
import { useMemo, useState } from 'react';

// -- Helpers ------------------------------------------------------------------

function getStat(stats: Stat[] | undefined, name: string): any {
  return stats?.find((s: Stat) => s.name === name)?.data;
}

function formatMonth(raw: string): string {
  // "2024-01" → "Jan '24"
  const [y, m] = raw.split('-');
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  return `${months[parseInt(m, 10) - 1]} '${y.slice(2)}`;
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(n >= 10_000 ? 0 : 1)}K`;
  return n.toLocaleString();
}

function pctOf(part: number, total: number): number {
  return total > 0 ? Math.round((part / total) * 100) : 0;
}

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return 'Never';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

// -- Color Palette ------------------------------------------------------------

const COLORS = {
  active: '#6366f1', // indigo-500
  newlyInactive: '#f59e0b', // amber-500
  inactive: '#94a3b8', // slate-400 (muted, not alarming)
  sent: '#22c55e', // green-500
  failed: '#ef4444', // red-500
  skipped: '#f59e0b', // amber-500
  gauge: '#6366f1',
  gaugeTrack: '#e2e8f0', // slate-200
};

// =============================================================================
// DASHBOARD COMPONENT
// =============================================================================

export default function DashboardView() {
  const { id: projectUUID } = useParams() as { id: UUID };
  const router = useRouter();
  const [dateRange, setDateRange] = useState<string>('all');

  const { data: stats, isLoading } = useCustomerStats(projectUUID);

  // -- Extract Stats ----------------------------------------------------------

  const totalCustomers: number = getStat(stats, 'TOTAL_CUSTOMER') || 0;
  const activeCustomers: number = getStat(stats, 'ACTIVE_CUSTOMER') || 0;
  const inactiveCustomers: number = getStat(stats, 'INACTIVE_CUSTOMER') || 0;
  const newlyInactiveCustomers: number =
    getStat(stats, 'NEWLY_INACTIVE_CUSTOMER') || 0;
  const customersByMonth: CustomersByMonthEntry[] =
    getStat(stats, 'CUSTOMERS_BY_MONTH') || [];

  const commStats: CommunicationStats = getStat(
    stats,
    'COMMUNICATION_STATS',
  ) || {
    sent: 0,
    failed: 0,
    skipped: 0,
    totalMessages: 0,
    deliveryRate: 0,
  };

  const automationHealth: AutomationHealth = getStat(
    stats,
    'AUTOMATION_HEALTH',
  ) || {
    totalRules: 0,
    enabledRules: 0,
    lastTriggeredAt: null,
  };

  const failedBatchCount: number = getStat(stats, 'FAILED_BATCH_COUNT') || 0;
  const recentCampaigns: RecentCampaign[] =
    getStat(stats, 'RECENT_CAMPAIGNS') || [];
  const recentImports: RecentImport[] =
    getStat(stats, 'RECENT_IMPORTS') || [];

  // -- Derived Data -----------------------------------------------------------

  const activePct = pctOf(activeCustomers, totalCustomers);

  const categoryDonutData = useMemo(
    () => [
      { name: 'Active', value: activeCustomers, fill: COLORS.active },
      {
        name: 'Newly Inactive',
        value: newlyInactiveCustomers,
        fill: COLORS.newlyInactive,
      },
      { name: 'Inactive', value: inactiveCustomers, fill: COLORS.inactive },
    ],
    [activeCustomers, newlyInactiveCustomers, inactiveCustomers],
  );

  // Filter customersByMonth based on date range
  const filteredMonthData = useMemo(() => {
    if (!customersByMonth.length) return [];
    if (dateRange === 'all') return customersByMonth;

    const now = new Date();
    const cutoff = new Date(now);
    if (dateRange === '30d') cutoff.setDate(now.getDate() - 30);
    else if (dateRange === '90d') cutoff.setDate(now.getDate() - 90);
    else if (dateRange === 'ytd') cutoff.setMonth(0, 1);

    const cutoffKey = `${cutoff.getFullYear()}-${(cutoff.getMonth() + 1).toString().padStart(2, '0')}`;
    return customersByMonth.filter(
      (entry: CustomersByMonthEntry) => entry.month >= cutoffKey,
    );
  }, [customersByMonth, dateRange]);

  // Delivery gauge data for radial bar
  const deliveryGaugeData = useMemo(
    () => [
      {
        name: 'Delivery Rate',
        value: commStats.deliveryRate,
        fill: COLORS.gauge,
      },
    ],
    [commStats.deliveryRate],
  );

  // -- KPI Card Config --------------------------------------------------------

  const kpiCards = [
    {
      title: 'Total Customers',
      value: totalCustomers,
      icon: Users,
      bgColor: 'bg-primary/10',
      iconColor: 'text-primary',
      subtitle: null,
    },
    {
      title: 'Active',
      value: activeCustomers,
      icon: UserCheck,
      bgColor: 'bg-emerald-500/10',
      iconColor: 'text-emerald-500',
      subtitle: `${activePct}% of total`,
    },
    {
      title: 'Newly Inactive',
      value: newlyInactiveCustomers,
      icon: UserMinus,
      bgColor:
        newlyInactiveCustomers > 0 ? 'bg-amber-500/10' : 'bg-slate-500/10',
      iconColor:
        newlyInactiveCustomers > 0 ? 'text-amber-500' : 'text-slate-500',
      subtitle: newlyInactiveCustomers > 0 ? 'Needs attention' : 'Stable',
    },
    {
      title: 'Inactive',
      value: inactiveCustomers,
      icon: UserX,
      bgColor: 'bg-slate-500/10',
      iconColor: 'text-slate-500',
      subtitle: `${pctOf(inactiveCustomers, totalCustomers)}% of total`,
    },
    {
      title: 'Messages Sent',
      value: commStats.totalMessages,
      icon: Send,
      bgColor: 'bg-violet-500/10',
      iconColor: 'text-violet-500',
      subtitle: null,
    },
    {
      title: 'Delivery Rate',
      value: `${commStats.deliveryRate}%`,
      icon: Activity,
      bgColor:
        commStats.deliveryRate >= 80
          ? 'bg-emerald-500/10'
          : commStats.deliveryRate >= 60
            ? 'bg-amber-500/10'
            : 'bg-red-500/10',
      iconColor:
        commStats.deliveryRate >= 80
          ? 'text-emerald-500'
          : commStats.deliveryRate >= 60
            ? 'text-amber-500'
            : 'text-red-500',
      subtitle:
        commStats.deliveryRate >= 80
          ? 'Healthy'
          : commStats.deliveryRate >= 60
            ? 'Needs improvement'
            : 'Critical',
    },
  ];

  // ==========================================================================
  // RENDER
  // ==========================================================================

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex flex-col h-full">
        {/* ── Page Header ─────────────────────────────────────────── */}
        <div className="border-b border-border bg-card px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Dashboard
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                CRM analytics and customer health overview
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-[160px] h-9">
                  <SelectValue placeholder="Time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last quarter</SelectItem>
                  <SelectItem value="ytd">Year to date</SelectItem>
                  <SelectItem value="all">All time</SelectItem>
                </SelectContent>
              </Select>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Export dashboard data as CSV</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-155px)]">
          <div className="flex-1 p-6 space-y-6">
            {/* ── Failed Batch Alert Banner ─────────────────────── */}
            {failedBatchCount > 0 && (
              <div className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800 px-4 py-3">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
                  <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
                    {failedBatchCount} failed import batch
                    {failedBatchCount !== 1 ? 'es' : ''} pending retry
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 text-amber-700 dark:text-amber-300 hover:text-amber-900 hover:bg-amber-100 dark:hover:bg-amber-900/30"
                  onClick={() =>
                    router.push(
                      `/projects/el-crm/${projectUUID}/customers/upload/retry`,
                    )
                  }
                >
                  View
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}

            {/* ── SECTION 1: KPI Summary Strip ──────────────────── */}
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
              {kpiCards.map((card) => (
                <Card
                  key={card.title}
                  className="relative overflow-hidden transition-all hover:shadow-md"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 min-w-0">
                        <p className="text-xs font-medium text-muted-foreground leading-none truncate">
                          {card.title}
                        </p>
                        <p className="text-2xl font-bold tracking-tight text-foreground">
                          {typeof card.value === 'number'
                            ? formatNumber(card.value)
                            : card.value}
                        </p>
                        {card.subtitle && (
                          <p className="text-[11px] text-muted-foreground leading-tight">
                            {card.subtitle}
                          </p>
                        )}
                      </div>
                      <div className={`rounded-lg p-2 ${card.bgColor} shrink-0`}>
                        <card.icon
                          className={`h-4 w-4 ${card.iconColor}`}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* ── SECTION 2: Two-Column Layout ──────────────────── */}
            <div className="grid gap-6 lg:grid-cols-5">
              {/* ── Left Column: Customer Health (3/5) ───────────── */}
              <div className="lg:col-span-3 space-y-6">
                {/* Customer Category Distribution Donut */}
                <Card className="transition-shadow hover:shadow-md">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <div className="rounded-lg p-2 bg-indigo-500/10">
                        <Users className="h-4 w-4 text-indigo-500" />
                      </div>
                      <div>
                        <CardTitle className="text-base font-semibold">
                          Customer Category Distribution
                        </CardTitle>
                        <CardDescription className="text-xs">
                          Breakdown of customers by status
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        Active: { label: 'Active', color: COLORS.active },
                        'Newly Inactive': {
                          label: 'Newly Inactive',
                          color: COLORS.newlyInactive,
                        },
                        Inactive: {
                          label: 'Inactive',
                          color: COLORS.inactive,
                        },
                      }}
                      className="h-[200px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categoryDonutData}
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={80}
                            paddingAngle={3}
                            dataKey="value"
                            nameKey="name"
                            strokeWidth={0}
                          >
                            {categoryDonutData.map((entry, index) => (
                              <Cell key={`cat-${index}`} fill={entry.fill} />
                            ))}
                            <Label
                              content={({ viewBox }) => {
                                if (
                                  viewBox &&
                                  'cx' in viewBox &&
                                  'cy' in viewBox
                                ) {
                                  return (
                                    <text
                                      x={viewBox.cx}
                                      y={viewBox.cy}
                                      textAnchor="middle"
                                      dominantBaseline="middle"
                                    >
                                      <tspan
                                        x={viewBox.cx}
                                        y={(viewBox.cy || 0) - 6}
                                        className="fill-foreground text-xl font-bold"
                                      >
                                        {formatNumber(totalCustomers)}
                                      </tspan>
                                      <tspan
                                        x={viewBox.cx}
                                        y={(viewBox.cy || 0) + 14}
                                        className="fill-muted-foreground text-xs"
                                      >
                                        Total
                                      </tspan>
                                    </text>
                                  );
                                }
                              }}
                            />
                          </Pie>
                          <ChartTooltip
                            content={<ChartTooltipContent nameKey="name" />}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                    <div className="flex justify-center gap-6 mt-2 text-sm">
                      {categoryDonutData.map((item) => (
                        <div
                          key={item.name}
                          className="flex items-center gap-2"
                        >
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: item.fill }}
                          />
                          <span className="text-muted-foreground text-xs font-medium">
                            {item.name}
                          </span>
                          <span className="text-foreground text-xs font-semibold tabular-nums">
                            {item.value.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Category Trend — Stacked Area Chart */}
                <Card className="transition-shadow hover:shadow-md">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <div className="rounded-lg p-2 bg-blue-500/10">
                        <TrendingUp className="h-4 w-4 text-blue-500" />
                      </div>
                      <div>
                        <CardTitle className="text-base font-semibold">
                          Customer Category Trend
                        </CardTitle>
                        <CardDescription className="text-xs">
                          Category distribution over time
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        [CustomerCategory.ACTIVE]: {
                          label: 'Active',
                          color: COLORS.active,
                        },
                        [CustomerCategory.NEWLY_INACTIVE]: {
                          label: 'Newly Inactive',
                          color: COLORS.newlyInactive,
                        },
                        [CustomerCategory.INACTIVE]: {
                          label: 'Inactive',
                          color: COLORS.inactive,
                        },
                      }}
                      className="h-[280px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={filteredMonthData}
                          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient
                              id="fillActive"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor={COLORS.active}
                                stopOpacity={0.3}
                              />
                              <stop
                                offset="95%"
                                stopColor={COLORS.active}
                                stopOpacity={0.05}
                              />
                            </linearGradient>
                            <linearGradient
                              id="fillNewlyInactive"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor={COLORS.newlyInactive}
                                stopOpacity={0.3}
                              />
                              <stop
                                offset="95%"
                                stopColor={COLORS.newlyInactive}
                                stopOpacity={0.05}
                              />
                            </linearGradient>
                            <linearGradient
                              id="fillInactive"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor={COLORS.inactive}
                                stopOpacity={0.3}
                              />
                              <stop
                                offset="95%"
                                stopColor={COLORS.inactive}
                                stopOpacity={0.05}
                              />
                            </linearGradient>
                          </defs>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="hsl(var(--border))"
                            strokeOpacity={0.5}
                          />
                          <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 11 }}
                            dy={8}
                            tickFormatter={formatMonth}
                            interval="preserveStartEnd"
                          />
                          <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 11 }}
                            dx={-4}
                            width={40}
                          />
                          <ChartTooltip
                            content={
                              <ChartTooltipContent
                                labelFormatter={(label) =>
                                  formatMonth(label as string)
                                }
                              />
                            }
                          />
                          <Area
                            type="monotone"
                            dataKey={CustomerCategory.ACTIVE}
                            stackId="1"
                            stroke={COLORS.active}
                            fill="url(#fillActive)"
                            strokeWidth={2}
                          />
                          <Area
                            type="monotone"
                            dataKey={CustomerCategory.NEWLY_INACTIVE}
                            stackId="1"
                            stroke={COLORS.newlyInactive}
                            fill="url(#fillNewlyInactive)"
                            strokeWidth={2}
                          />
                          <Area
                            type="monotone"
                            dataKey={CustomerCategory.INACTIVE}
                            stackId="1"
                            stroke={COLORS.inactive}
                            fill="url(#fillInactive)"
                            strokeWidth={2}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                    <div className="flex justify-center gap-6 mt-3 text-sm">
                      {[
                        { label: 'Active', color: COLORS.active },
                        {
                          label: 'Newly Inactive',
                          color: COLORS.newlyInactive,
                        },
                        { label: 'Inactive', color: COLORS.inactive },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className="flex items-center gap-2"
                        >
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-muted-foreground text-xs font-medium">
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* ── Right Column: Communication Performance (2/5) ── */}
              <div className="lg:col-span-2 space-y-6">
                {/* Delivery Rate Gauge */}
                <Card className="transition-shadow hover:shadow-md">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <div className="rounded-lg p-2 bg-emerald-500/10">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      </div>
                      <div>
                        <CardTitle className="text-base font-semibold">
                          Delivery Rate
                        </CardTitle>
                        <CardDescription className="text-xs">
                          Message delivery performance
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center">
                    <div className="h-[140px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart
                          cx="50%"
                          cy="100%"
                          innerRadius="120%"
                          outerRadius="160%"
                          startAngle={180}
                          endAngle={0}
                          barSize={12}
                          data={deliveryGaugeData}
                        >
                          <RadialBar
                            dataKey="value"
                            background={{ fill: COLORS.gaugeTrack }}
                            cornerRadius={6}
                          />
                        </RadialBarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="-mt-8 text-center">
                      <p className="text-3xl font-bold text-foreground">
                        {commStats.deliveryRate}%
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {commStats.sent.toLocaleString()} delivered /{' '}
                        {commStats.totalMessages.toLocaleString()} total
                      </p>
                    </div>
                    <div className="flex justify-center gap-6 mt-4 text-xs">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: COLORS.sent }}
                        />
                        <span className="text-muted-foreground">Delivered</span>
                        <span className="font-semibold tabular-nums">
                          {commStats.sent.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: COLORS.failed }}
                        />
                        <span className="text-muted-foreground">Failed</span>
                        <span className="font-semibold tabular-nums">
                          {commStats.failed.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Campaign Performance Table */}
                <Card className="transition-shadow hover:shadow-md">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="rounded-lg p-2 bg-violet-500/10">
                          <Send className="h-4 w-4 text-violet-500" />
                        </div>
                        <div>
                          <CardTitle className="text-base font-semibold">
                            Recent Campaigns
                          </CardTitle>
                          <CardDescription className="text-xs">
                            Last 5 campaigns sent
                          </CardDescription>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs gap-1 h-7"
                        onClick={() =>
                          router.push(
                            `/projects/el-crm/${projectUUID}/communications/summary`,
                          )
                        }
                      >
                        View all
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {recentCampaigns.length > 0 ? (
                      <div className="space-y-0">
                        <div className="grid grid-cols-[1fr_60px_60px] gap-2 pb-2 border-b text-xs font-medium text-muted-foreground">
                          <span>Campaign</span>
                          <span className="text-right">Sent</span>
                          <span className="text-right">Date</span>
                        </div>
                        {recentCampaigns.map(
                          (campaign: RecentCampaign) => (
                            <div
                              key={campaign.uuid}
                              className="grid grid-cols-[1fr_60px_60px] gap-2 py-2.5 border-b border-border/50 last:border-0 text-sm"
                            >
                              <span className="truncate text-foreground font-medium">
                                {campaign.name}
                              </span>
                              <span className="text-right tabular-nums text-muted-foreground">
                                {campaign.recipientCount}
                              </span>
                              <span className="text-right text-muted-foreground text-xs">
                                {formatDate(campaign.createdAt)}
                              </span>
                            </div>
                          ),
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                        <Send className="h-8 w-8 mb-2 opacity-30" />
                        <p className="text-sm">No campaigns yet</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Automation Health */}
                <Card className="transition-shadow hover:shadow-md">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="rounded-lg p-2 bg-sky-500/10">
                          <Bot className="h-4 w-4 text-sky-500" />
                        </div>
                        <div>
                          <CardTitle className="text-base font-semibold">
                            Automation Health
                          </CardTitle>
                          <CardDescription className="text-xs">
                            Automated messaging rules
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-lg border p-3 text-center">
                        <p className="text-2xl font-bold text-foreground">
                          {automationHealth.enabledRules}/
                          {automationHealth.totalRules}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Rules active
                        </p>
                      </div>
                      <div className="rounded-lg border p-3 text-center">
                        <p className="text-sm font-semibold text-foreground flex items-center justify-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                          {timeAgo(automationHealth.lastTriggeredAt)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Last triggered
                        </p>
                      </div>
                    </div>
                    {automationHealth.totalRules === 0 && (
                      <p className="text-xs text-muted-foreground text-center mt-3">
                        No automation rules configured
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* ── SECTION 3: Recent Activity ────────────────────── */}
            <Card className="transition-shadow hover:shadow-md">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg p-2 bg-slate-500/10">
                    <Clock className="h-4 w-4 text-slate-500" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-semibold">
                      Recent Imports
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Latest data import activity
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {recentImports.length > 0 ? (
                  <div className="space-y-3">
                    {recentImports.map((imp: RecentImport) => {
                      const succeeded = Array.isArray(imp.successVendors)
                        ? imp.successVendors.length
                        : 0;
                      const failedCount = Array.isArray(imp.failedVendors)
                        ? imp.failedVendors.length
                        : 0;
                      const total = succeeded + failedCount;
                      const isFailed =
                        imp.status !== 'COMPLETED' && failedCount > 0;

                      return (
                        <div
                          key={imp.uuid}
                          className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0"
                        >
                          <div
                            className={`rounded-full p-1.5 ${isFailed ? 'bg-red-500/10' : 'bg-emerald-500/10'}`}
                          >
                            {isFailed ? (
                              <XCircle className="h-4 w-4 text-red-500" />
                            ) : (
                              <FileUp className="h-4 w-4 text-emerald-500" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-foreground">
                              {total > 0 ? (
                                <>
                                  {total} record{total !== 1 ? 's' : ''}{' '}
                                  processed
                                  {failedCount > 0 && (
                                    <span className="text-red-500">
                                      {' '}
                                      ({failedCount} failed)
                                    </span>
                                  )}
                                </>
                              ) : (
                                <span className="capitalize">
                                  {imp.status.toLowerCase().replace('_', ' ')}
                                </span>
                              )}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <Badge
                              variant={isFailed ? 'destructive' : 'success'}
                              className="text-[10px] px-1.5 py-0.5"
                            >
                              {imp.status}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(imp.createdAt)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
                    <FileUp className="h-8 w-8 mb-2 opacity-30" />
                    <p className="text-sm">No import activity yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </div>
    </TooltipProvider>
  );
}

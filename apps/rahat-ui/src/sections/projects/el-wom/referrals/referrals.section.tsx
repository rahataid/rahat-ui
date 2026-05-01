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
import { useFindAllKenyaStats } from '@rahat-ui/query';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import {
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  UserPlus,
  Users,
  UserCheck,
  Trophy,
  Layers,
} from 'lucide-react';
import { UUID } from 'crypto';
import { useMemo } from 'react';
import {
  HistogramEntry,
  LimitReachedStat,
  ReferralStat,
  ReferralWeekly,
  RefereeVoucherTypeEntry,
  REFERRAL_STAT_NAMES,
  RedeemedRefereesStat,
  TopReferrer,
  getReferralStat,
} from './types';

type Props = {
  projectUUID: UUID;
};

const COLORS = {
  primary: '#6366f1',
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
  muted: '#94a3b8',
  voucherTypes: ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#0ea5e9', '#a855f7'],
};

function formatNumber(n: number | undefined): string {
  if (n === undefined || n === null || Number.isNaN(n)) return '0';
  return n.toLocaleString();
}

function shortAddress(addr: string | null): string {
  if (!addr) return '';
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export default function ReferralsSection({ projectUUID }: Props) {
  const { data: rawStats } = useFindAllKenyaStats(projectUUID);
  const stats = rawStats as ReferralStat[] | undefined;

  const totalReferrers =
    getReferralStat<number>(stats, REFERRAL_STAT_NAMES.TOTAL_REFERRERS) ?? 0;
  const totalReferees =
    getReferralStat<number>(stats, REFERRAL_STAT_NAMES.TOTAL_REFEREES) ?? 0;
  const redeemedReferees = getReferralStat<RedeemedRefereesStat>(
    stats,
    REFERRAL_STAT_NAMES.REDEEMED_REFEREES,
  ) ?? { redeemed: 0, total: 0, rate: 0 };
  const avgPerReferrer =
    getReferralStat<number>(stats, REFERRAL_STAT_NAMES.AVG_PER_REFERRER) ?? 0;
  const histogram =
    getReferralStat<HistogramEntry[]>(stats, REFERRAL_STAT_NAMES.HISTOGRAM) ??
    [];
  const limitReached = getReferralStat<LimitReachedStat>(
    stats,
    REFERRAL_STAT_NAMES.LIMIT_REACHED,
  ) ?? { count: 0, threshold: 10 };
  const topReferrers =
    getReferralStat<TopReferrer[]>(stats, REFERRAL_STAT_NAMES.TOP_REFERRERS) ??
    [];
  const weekly =
    getReferralStat<ReferralWeekly[]>(stats, REFERRAL_STAT_NAMES.WEEKLY) ?? [];
  const voucherTypeBreakdown =
    getReferralStat<RefereeVoucherTypeEntry[]>(
      stats,
      REFERRAL_STAT_NAMES.REFEREE_VOUCHER_TYPE,
    ) ?? [];

  const kpiCards = [
    {
      title: 'Total Referrers',
      value: totalReferrers,
      icon: Users,
      bgColor: 'bg-indigo-500/10',
      iconColor: 'text-indigo-500',
      subtitle: null,
    },
    {
      title: 'Total Referees',
      value: totalReferees,
      icon: UserPlus,
      bgColor: 'bg-emerald-500/10',
      iconColor: 'text-emerald-500',
      subtitle: null,
    },
    {
      title: 'Redeemed Referees',
      value: redeemedReferees.redeemed,
      icon: UserCheck,
      bgColor: 'bg-green-500/10',
      iconColor: 'text-green-600',
      subtitle: `${redeemedReferees.rate}% redemption rate`,
    },
    {
      title: 'Avg Referrals / Referrer',
      value: avgPerReferrer,
      icon: TrendingUp,
      bgColor: 'bg-violet-500/10',
      iconColor: 'text-violet-500',
      subtitle: null,
    },
  ];

  const voucherChartData = useMemo(
    () =>
      voucherTypeBreakdown.map((entry, idx) => ({
        ...entry,
        fill: COLORS.voucherTypes[idx % COLORS.voucherTypes.length],
      })),
    [voucherTypeBreakdown],
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Referral Program</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Real-time stats for beneficiary referrals and redemptions
        </p>
      </div>

      {/* Limit reached alert */}
      {limitReached.count > 0 && (
        <div className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800 px-4 py-3">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                {limitReached.count} referrer
                {limitReached.count !== 1 ? 's' : ''} reached the{' '}
                {limitReached.threshold}-referral limit
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-300">
                These referrers can no longer onboard new referees
              </p>
            </div>
          </div>
        </div>
      )}

      {/* KPI cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
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
                    {formatNumber(card.value as number)}
                  </p>
                  {card.subtitle && (
                    <p className="text-[11px] text-muted-foreground leading-tight">
                      {card.subtitle}
                    </p>
                  )}
                </div>
                <div className={`rounded-lg p-2 ${card.bgColor} shrink-0`}>
                  <card.icon className={`h-4 w-4 ${card.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Top referrers + voucher-type breakdown */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="rounded-lg p-2 bg-amber-500/10">
                <Trophy className="h-4 w-4 text-amber-500" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">
                  Top Referrers
                </CardTitle>
                <CardDescription className="text-xs">
                  Highest performing referrers by total referees
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {topReferrers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <Trophy className="h-8 w-8 mb-2 opacity-30" />
                <p className="text-sm">No referrers yet</p>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-[24px_1fr_70px_70px] gap-2 pb-2 border-b text-xs font-medium text-muted-foreground">
                  <span>#</span>
                  <span>Referrer</span>
                  <span className="text-right">Referees</span>
                  <span className="text-right">Redeemed</span>
                </div>
                {topReferrers.map((r, idx) => (
                  <div
                    key={`${r.walletAddress ?? 'na'}-${idx}`}
                    className="grid grid-cols-[24px_1fr_70px_70px] gap-2 py-2.5 border-b border-border/50 last:border-0 text-sm hover:bg-muted/50 -mx-2 px-2 rounded-sm transition-colors"
                  >
                    <span className="text-muted-foreground tabular-nums">
                      {idx + 1}
                    </span>
                    <span className="truncate">
                      {r.phone ? (
                        <span className="font-medium">{r.phone}</span>
                      ) : (
                        <span className="font-mono text-xs">
                          {shortAddress(r.walletAddress)}
                        </span>
                      )}
                    </span>
                    <span className="text-right tabular-nums font-semibold">
                      {r.total}
                    </span>
                    <span className="text-right tabular-nums text-emerald-600">
                      {r.redeemed}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="rounded-lg p-2 bg-violet-500/10">
                <Layers className="h-4 w-4 text-violet-500" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">
                  Referee Voucher Types
                </CardTitle>
                <CardDescription className="text-xs">
                  Voucher type distribution across referees
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {voucherChartData.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <Layers className="h-8 w-8 mb-2 opacity-30" />
                <p className="text-sm">No voucher data yet</p>
              </div>
            ) : (
              <ChartContainer
                config={Object.fromEntries(
                  voucherChartData.map((v) => [
                    v.id,
                    { label: v.id, color: v.fill },
                  ]),
                )}
                className="h-[260px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={voucherChartData}
                      dataKey="count"
                      nameKey="id"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={90}
                      paddingAngle={3}
                      strokeWidth={0}
                    >
                      {voucherChartData.map((entry, idx) => (
                        <Cell key={`v-${idx}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartTooltip
                      content={<ChartTooltipContent nameKey="id" />}
                    />
                    <ChartLegend content={<ChartLegendContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Weekly referrals trend */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <div className="rounded-lg p-2 bg-blue-500/10">
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">
                Referrals Over Time
              </CardTitle>
              <CardDescription className="text-xs">
                Weekly referral creation (last 12 weeks)
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {weekly.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <TrendingUp className="h-8 w-8 mb-2 opacity-30" />
              <p className="text-sm">No referrals yet</p>
            </div>
          ) : (
            <ChartContainer
              config={{ count: { label: 'Referrals', color: COLORS.primary } }}
              className="h-[260px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={weekly}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="fillReferrals" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={COLORS.primary}
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor={COLORS.primary}
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
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke={COLORS.primary}
                    fill="url(#fillReferrals)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      {/* Referrals per referrer histogram */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <div className="rounded-lg p-2 bg-emerald-500/10">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">
                Referrals per Referrer
              </CardTitle>
              <CardDescription className="text-xs">
                Distribution of how many referees each referrer onboarded
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {histogram.every((h) => h.count === 0) ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <CheckCircle2 className="h-8 w-8 mb-2 opacity-30" />
              <p className="text-sm">No referral activity yet</p>
            </div>
          ) : (
            <ChartContainer
              config={{ count: { label: 'Referrers', color: COLORS.primary } }}
              className="h-[240px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={histogram}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
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
    </div>
  );
}

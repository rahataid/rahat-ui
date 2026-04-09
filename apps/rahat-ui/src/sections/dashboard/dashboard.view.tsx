'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@rahat-ui/shadcn/src/components/ui/chart';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import {
  TooltipProvider,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Label,
  Tooltip,
} from 'recharts';
import { ClusterMap, StyledMapContainer, THEMES } from '@rahat-ui/shadcn/maps';
import { useRSQuery } from '@rumsan/react-query';
import { useQuery } from '@tanstack/react-query';
import {
  FolderOpen,
  FolderCheck,
  Users,
  Store,
  UserPlus,
  AlertTriangle,
  ArrowRight,
  MapPin,
  BarChart2,
  Shield,
  Smartphone,
  Globe,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { mapboxBasicConfig } from '../../constants/config';

// ---------------------------------------------------------------------------
// Data Hook — calls GET /v1/dashboard/stats
// ---------------------------------------------------------------------------

const useDashboardStats = () => {
  const { rumsanService } = useRSQuery();
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const res = await rumsanService.client.get('/dashboard/stats');
      return res.data as {
        stats: Record<string, any>;
        projects: any[];
      };
    },
  });
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getStat(stats: Record<string, any> | undefined, name: string): any {
  return stats?.[name];
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(n >= 10_000 ? 0 : 1)}K`;
  return n.toLocaleString();
}

// ---------------------------------------------------------------------------
// Color Palette
// ---------------------------------------------------------------------------

const COLORS = {
  primary: '#6366f1',
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
  muted: '#94a3b8',
  info: '#3b82f6',
  chart: [
    '#6366f1',
    '#22c55e',
    '#f59e0b',
    '#ef4444',
    '#8b5cf6',
    '#06b6d4',
    '#ec4899',
    '#f97316',
  ],
};

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: COLORS.success,
  NOT_READY: COLORS.warning,
  CLOSED: COLORS.muted,
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function EmptyChart({ message = 'No data available' }: { message?: string }) {
  return (
    <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
      {message}
    </div>
  );
}

function MiniDonut({
  data,
  label,
}: {
  data: { id: string; count: number }[] | undefined;
  label: string;
}) {
  const chartData = (data || []).map((d, i) => ({
    name: d.id,
    value: d.count,
    fill: COLORS.chart[i % COLORS.chart.length],
  }));
  const total = chartData.reduce((sum, d) => sum + d.value, 0);

  if (!chartData.length) {
    return (
      <div className="flex items-center justify-center h-[140px]">
        <EmptyChart />
      </div>
    );
  }

  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground mb-1 text-center">
        {label}
      </p>
      <div className="h-[130px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={38}
              outerRadius={55}
              paddingAngle={2}
              dataKey="value"
              strokeWidth={0}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 5}
                          className="fill-foreground text-sm font-bold"
                          fontSize={14}
                          fontWeight={700}
                        >
                          {formatNumber(total)}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 12}
                          className="fill-muted-foreground"
                          fontSize={9}
                          fill="#94a3b8"
                        >
                          total
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
            <Tooltip
              formatter={(value: number, name: string) => [
                value.toLocaleString(),
                name,
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1 justify-center mt-1">
        {chartData.map((item) => (
          <div key={item.name} className="flex items-center gap-1">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: item.fill }}
            />
            <span className="text-[10px] text-muted-foreground">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function DashboardView() {
  const router = useRouter();
  const { data: dashboardData, isLoading } = useDashboardStats();

  const stats = dashboardData?.stats;
  const projects = dashboardData?.projects || [];

  // --------------------------------------------------------------------------
  // Section 1: KPI data
  // --------------------------------------------------------------------------

  const totalProjects = projects.length;
  const activeProjects = projects.filter((p: any) => p.status === 'ACTIVE').length;
  const totalBeneficiaries = getStat(stats, 'beneficiary_total')?.count || 0;
  const totalVendors = getStat(stats, 'vendor_total')?.count || 0;
  const totalFamilyMembers = getStat(stats, 'total_number_family_members')?.count || 0;

  const kpiCards = [
    {
      title: 'Total Projects',
      value: totalProjects,
      icon: FolderOpen,
      bgColor: 'bg-indigo-500/10',
      iconColor: 'text-indigo-500',
      subtitle: null,
    },
    {
      title: 'Active Projects',
      value: activeProjects,
      icon: FolderCheck,
      bgColor: 'bg-emerald-500/10',
      iconColor: 'text-emerald-500',
      subtitle: totalProjects > 0 ? `${Math.round((activeProjects / totalProjects) * 100)}% of total` : null,
    },
    {
      title: 'Beneficiaries',
      value: totalBeneficiaries,
      icon: Users,
      bgColor: 'bg-blue-500/10',
      iconColor: 'text-blue-500',
      subtitle: null,
    },
    {
      title: 'Vendors',
      value: totalVendors,
      icon: Store,
      bgColor: 'bg-violet-500/10',
      iconColor: 'text-violet-500',
      subtitle: null,
    },
    {
      title: 'Family Members',
      value: totalFamilyMembers,
      icon: UserPlus,
      bgColor: 'bg-sky-500/10',
      iconColor: 'text-sky-500',
      subtitle: null,
    },
    {
      title: 'Open Grievances',
      value: 'N/A',
      icon: AlertTriangle,
      bgColor: 'bg-amber-500/10',
      iconColor: 'text-amber-500',
      subtitle: 'Placeholder',
    },
  ];

  // --------------------------------------------------------------------------
  // Section 2: Project Overview stacked bar data
  // --------------------------------------------------------------------------

  const projectBarData = (() => {
    const byType: Record<string, Record<string, number>> = {};
    projects.forEach((p: any) => {
      const type = p.type || 'Unknown';
      if (!byType[type]) byType[type] = {};
      byType[type][p.status] = (byType[type][p.status] || 0) + 1;
    });
    return Object.entries(byType).map(([type, statuses]) => ({
      type,
      ACTIVE: statuses['ACTIVE'] || 0,
      NOT_READY: statuses['NOT_READY'] || 0,
      CLOSED: statuses['CLOSED'] || 0,
    }));
  })();

  // --------------------------------------------------------------------------
  // Section 3: Beneficiary demographics
  // --------------------------------------------------------------------------

  const genderData: { id: string; count: number }[] | undefined = getStat(
    stats,
    'beneficiary_gender',
  );
  const ageRangeData: { id: string; count: number }[] | undefined = getStat(
    stats,
    'beneficiary_age_range',
  );
  const genderTotal = (genderData || []).reduce((s, d) => s + d.count, 0);

  // --------------------------------------------------------------------------
  // Section 4: Access & Inclusion
  // --------------------------------------------------------------------------

  const bankingData: { id: string; count: number }[] | undefined = getStat(
    stats,
    'beneficiary_bankedStatus',
  );
  const internetData: { id: string; count: number }[] | undefined = getStat(
    stats,
    'beneficiary_internetStatus',
  );
  const phoneStatusData: { id: string; count: number }[] | undefined = getStat(
    stats,
    'beneficiary_phoneStatus',
  );

  // --------------------------------------------------------------------------
  // Section 5: Geographic Distribution
  // --------------------------------------------------------------------------

  const mapStats: any[] | undefined = getStat(stats, 'beneficiary_map_stats');
  const mapData =
    mapStats && mapStats.length > 0
      ? {
          type: 'FeatureCollection' as const,
          features: mapStats.map((s: any) => ({
            type: 'Feature' as const,
            geometry: {
              type: 'Point' as const,
              coordinates: [s.longitude, s.latitude],
            },
            properties: { name: s.name },
          })),
        }
      : null;

  // --------------------------------------------------------------------------
  // Section 6: Vulnerability & Resilience
  // --------------------------------------------------------------------------

  const vulnerabilityData: { id: string; count: number }[] | undefined =
    getStat(stats, 'vulnerable_count_stats') ||
    getStat(stats, 'beneficiary_vulnerability_count_stats');

  const floodImpactData: { id: string; count: number }[] | undefined = getStat(
    stats,
    'flood_impact_in_last_5years',
  );
  const earlyWarningData: { id: string; count: number }[] | undefined =
    getStat(stats, 'acces_to_early_warning_information');

  // --------------------------------------------------------------------------
  // Section 7: Digital Inclusion
  // --------------------------------------------------------------------------

  const phoneTypeData: { id: string; count: number }[] | undefined = getStat(
    stats,
    'type_of_phone',
  );
  const mobileAccessData: { id: string; count: number }[] | undefined =
    getStat(stats, 'mobile_access');
  const internetAccessData: { id: string; count: number }[] | undefined =
    getStat(stats, 'internet_access');
  const digitalWalletData: { id: string; count: number }[] | undefined =
    getStat(stats, 'digital_wallet_use');

  const buildYesNoPct = (data: { id: string; count: number }[] | undefined) => {
    if (!data) return 0;
    const yes = data.find((d) => d.id === 'Yes')?.count || 0;
    const total = data.reduce((s, d) => s + d.count, 0);
    return total > 0 ? Math.round((yes / total) * 100) : 0;
  };

  const digitalBars = [
    { label: 'Mobile Access', pct: buildYesNoPct(mobileAccessData) },
    { label: 'Internet Access', pct: buildYesNoPct(internetAccessData) },
    { label: 'Digital Wallet', pct: buildYesNoPct(digitalWalletData) },
  ];

  // --------------------------------------------------------------------------
  // Section 8: Age Groups
  // --------------------------------------------------------------------------

  const ageGroupsData: { id: string; count: number }[] | undefined = getStat(stats, 'age_groups');

  // --------------------------------------------------------------------------
  // Section 9: Caste Distribution + Communication Channels
  // --------------------------------------------------------------------------

  const casteData: { id: string; count: number }[] | undefined = getStat(stats, 'beneficiary_caste_count_stats');
  const channelData: { id: string; count: number }[] | undefined = getStat(stats, 'channel_usage_stats');

  // --------------------------------------------------------------------------
  // Section 10: Banking & Financial Access
  // --------------------------------------------------------------------------

  const bankAccessData: { id: string; count: number }[] | undefined = getStat(stats, 'bank_account_access');
  const ssLinkedData: { id: string; count: number }[] | undefined = getStat(stats, 'social_security_linked_to_bank_account');
  const phoneAvailData: { id: string; count: number }[] | undefined = getStat(stats, 'beneficiary_phone_availability_stats');

  // --------------------------------------------------------------------------
  // Section 11: Bank Distribution
  // --------------------------------------------------------------------------

  const bankDistData: { id: string; count: number }[] | undefined = getStat(stats, 'bank_count_stats');

  // --------------------------------------------------------------------------
  // Section 12: Phone Type Details + Social Protection
  // --------------------------------------------------------------------------

  const phoneTypeRawData: { id: string; count: number }[] | undefined = getStat(stats, 'beneficiary_phone_type_stats');
  const socialProtectionData: { id: string; count: number }[] | undefined = getStat(stats, 'household_receiving_social_protection_benefits');

  // --------------------------------------------------------------------------
  // Loading state
  // --------------------------------------------------------------------------

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
        Loading dashboard...
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // RENDER
  // --------------------------------------------------------------------------

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex flex-col h-full">
        {/* Page Header */}
        <div className="border-b border-border bg-card px-6 py-5">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Dashboard
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Platform-wide analytics and reporting
            </p>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-155px)]">
          <div className="flex-1 p-6 space-y-6">

            {/* ── SECTION 1: KPI Strip ──────────────────────────────── */}
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
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
                        <card.icon className={`h-4 w-4 ${card.iconColor}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* ── SECTION 2: Project Overview ───────────────────────── */}
            <Card className="transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg p-2 bg-indigo-500/10">
                    <BarChart2 className="h-4 w-4 text-indigo-500" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-semibold">
                      Project Overview
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Projects grouped by type and status
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {projectBarData.length === 0 ? (
                  <div className="h-[200px] flex items-center justify-center">
                    <EmptyChart message="No projects found" />
                  </div>
                ) : (
                  <ChartContainer
                    config={{
                      ACTIVE: { label: 'Active', color: COLORS.success },
                      NOT_READY: { label: 'Not Ready', color: COLORS.warning },
                      CLOSED: { label: 'Closed', color: COLORS.muted },
                    }}
                    className="h-[220px] w-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={projectBarData}
                        margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="hsl(var(--border))"
                          strokeOpacity={0.5}
                        />
                        <XAxis
                          dataKey="type"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 11 }}
                          dy={8}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 11 }}
                          dx={-4}
                          width={40}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar
                          dataKey="ACTIVE"
                          stackId="a"
                          fill={STATUS_COLORS['ACTIVE']}
                          radius={[0, 0, 0, 0]}
                        />
                        <Bar
                          dataKey="NOT_READY"
                          stackId="a"
                          fill={STATUS_COLORS['NOT_READY']}
                        />
                        <Bar
                          dataKey="CLOSED"
                          stackId="a"
                          fill={STATUS_COLORS['CLOSED']}
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                )}
                <div className="flex justify-center gap-6 mt-2 text-xs">
                  {[
                    { label: 'Active', color: COLORS.success },
                    { label: 'Not Ready', color: COLORS.warning },
                    { label: 'Closed', color: COLORS.muted },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-1.5">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-muted-foreground">{item.label}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* ── SECTION 3: Beneficiary Demographics ──────────────── */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Gender Donut */}
              <Card className="transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg p-2 bg-blue-500/10">
                      <Users className="h-4 w-4 text-blue-500" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-semibold">
                        Gender Distribution
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Beneficiaries by gender
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {!genderData || genderData.length === 0 ? (
                    <div className="h-[200px] flex items-center justify-center">
                      <EmptyChart />
                    </div>
                  ) : (
                    <>
                      <ChartContainer
                        config={Object.fromEntries(
                          (genderData || []).map((d, i) => [
                            d.id,
                            {
                              label: d.id,
                              color: COLORS.chart[i % COLORS.chart.length],
                            },
                          ]),
                        )}
                        className="h-[200px] mx-auto"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={(genderData || []).map((d, i) => ({
                                name: d.id,
                                value: d.count,
                                fill: COLORS.chart[i % COLORS.chart.length],
                              }))}
                              cx="50%"
                              cy="50%"
                              innerRadius={55}
                              outerRadius={80}
                              paddingAngle={3}
                              dataKey="value"
                              strokeWidth={0}
                            >
                              {(genderData || []).map((entry, index) => (
                                <Cell
                                  key={`gender-${index}`}
                                  fill={COLORS.chart[index % COLORS.chart.length]}
                                />
                              ))}
                              <Label
                                content={({ viewBox }) => {
                                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
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
                                          fontSize={18}
                                          fontWeight={700}
                                        >
                                          {formatNumber(genderTotal)}
                                        </tspan>
                                        <tspan
                                          x={viewBox.cx}
                                          y={(viewBox.cy || 0) + 14}
                                          fontSize={10}
                                          fill="#94a3b8"
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
                      <div className="flex justify-center gap-4 mt-2 flex-wrap">
                        {(genderData || []).map((item, i) => (
                          <div key={item.id} className="flex items-center gap-1.5">
                            <span
                              className="h-2.5 w-2.5 rounded-full"
                              style={{ backgroundColor: COLORS.chart[i % COLORS.chart.length] }}
                            />
                            <span className="text-xs text-muted-foreground font-medium">
                              {item.id}
                            </span>
                            <span className="text-xs font-semibold tabular-nums">
                              {item.count.toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Age Range Bars */}
              <Card className="transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg p-2 bg-violet-500/10">
                      <BarChart2 className="h-4 w-4 text-violet-500" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-semibold">
                        Age Distribution
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Beneficiaries by age range
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {!ageRangeData || ageRangeData.length === 0 ? (
                    <div className="h-[200px] flex items-center justify-center">
                      <EmptyChart />
                    </div>
                  ) : (
                    <ChartContainer
                      config={{
                        count: { label: 'Count', color: COLORS.primary },
                      }}
                      className="h-[220px] w-full"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={(ageRangeData || []).map((d) => ({
                            name: d.id,
                            count: d.count,
                          }))}
                          layout="vertical"
                          margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            horizontal={false}
                            stroke="hsl(var(--border))"
                            strokeOpacity={0.5}
                          />
                          <XAxis
                            type="number"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 11 }}
                          />
                          <YAxis
                            type="category"
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 11 }}
                            width={50}
                          />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar
                            dataKey="count"
                            fill={COLORS.primary}
                            radius={[0, 4, 4, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* ── SECTION 4: Access & Inclusion ─────────────────────── */}
            <Card className="transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg p-2 bg-emerald-500/10">
                    <Shield className="h-4 w-4 text-emerald-500" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-semibold">
                      Access &amp; Inclusion
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Banking, internet, and phone access
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 lg:grid-cols-3">
                  <MiniDonut data={bankingData} label="Banking Status" />
                  <MiniDonut data={internetData} label="Internet Access" />
                  <MiniDonut data={phoneStatusData} label="Phone Status" />
                </div>
              </CardContent>
            </Card>

            {/* ── SECTION 5: Geographic Distribution ────────────────── */}
            <Card className="transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg p-2 bg-sky-500/10">
                    <MapPin className="h-4 w-4 text-sky-500" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-semibold">
                      Geographic Distribution
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Beneficiary locations across regions
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {mapData ? (
                  <div className="h-[400px] rounded-lg overflow-hidden">
                    <StyledMapContainer
                      theme={THEMES.streets}
                      {...mapboxBasicConfig}
                    >
                      <ClusterMap data={mapData} />
                    </StyledMapContainer>
                  </div>
                ) : (
                  <div className="h-[400px] flex items-center justify-center rounded-lg border border-dashed border-border">
                    <div className="text-center">
                      <MapPin className="h-10 w-10 mx-auto text-muted-foreground/30 mb-2" />
                      <p className="text-sm text-muted-foreground">
                        No geographic data available
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* ── SECTION 6: Vulnerability & Resilience ─────────────── */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Vulnerability horizontal bars */}
              <Card className="transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg p-2 bg-red-500/10">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-semibold">
                        Vulnerability Counts
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Beneficiaries by vulnerability type
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {!vulnerabilityData || vulnerabilityData.length === 0 ? (
                    <div className="h-[200px] flex items-center justify-center">
                      <EmptyChart />
                    </div>
                  ) : (
                    <ChartContainer
                      config={{
                        count: { label: 'Count', color: COLORS.danger },
                      }}
                      className="h-[220px] w-full"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={(vulnerabilityData || []).map((d) => ({
                            name: d.id,
                            count: d.count,
                          }))}
                          layout="vertical"
                          margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            horizontal={false}
                            stroke="hsl(var(--border))"
                            strokeOpacity={0.5}
                          />
                          <XAxis
                            type="number"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 11 }}
                          />
                          <YAxis
                            type="category"
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10 }}
                            width={70}
                          />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar
                            dataKey="count"
                            fill={COLORS.danger}
                            radius={[0, 4, 4, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  )}
                </CardContent>
              </Card>

              {/* Flood / Early Warning */}
              <Card className="transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg p-2 bg-amber-500/10">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-semibold">
                        Flood &amp; Early Warning
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Exposure and access to information
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Flood Impact */}
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">
                      Flood impact in last 5 years
                    </p>
                    {!floodImpactData || floodImpactData.length === 0 ? (
                      <p className="text-xs text-muted-foreground italic">No data</p>
                    ) : (
                      <div className="space-y-1.5">
                        {(floodImpactData || []).map((d, i) => {
                          const total = (floodImpactData || []).reduce(
                            (s, x) => s + x.count,
                            0,
                          );
                          const pct =
                            total > 0 ? Math.round((d.count / total) * 100) : 0;
                          return (
                            <div key={d.id} className="flex items-center gap-2">
                              <span className="text-xs w-6 text-muted-foreground">
                                {d.id}
                              </span>
                              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full"
                                  style={{
                                    width: `${pct}%`,
                                    backgroundColor:
                                      COLORS.chart[i % COLORS.chart.length],
                                  }}
                                />
                              </div>
                              <span className="text-xs tabular-nums text-muted-foreground w-10 text-right">
                                {d.count.toLocaleString()}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  {/* Early Warning */}
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">
                      Access to early warning information
                    </p>
                    {!earlyWarningData || earlyWarningData.length === 0 ? (
                      <p className="text-xs text-muted-foreground italic">No data</p>
                    ) : (
                      <div className="space-y-1.5">
                        {(earlyWarningData || []).map((d, i) => {
                          const total = (earlyWarningData || []).reduce(
                            (s, x) => s + x.count,
                            0,
                          );
                          const pct =
                            total > 0 ? Math.round((d.count / total) * 100) : 0;
                          return (
                            <div key={d.id} className="flex items-center gap-2">
                              <span className="text-xs w-6 text-muted-foreground">
                                {d.id}
                              </span>
                              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full"
                                  style={{
                                    width: `${pct}%`,
                                    backgroundColor:
                                      COLORS.chart[(i + 2) % COLORS.chart.length],
                                  }}
                                />
                              </div>
                              <span className="text-xs tabular-nums text-muted-foreground w-10 text-right">
                                {d.count.toLocaleString()}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* ── SECTION 7: Digital Inclusion ──────────────────────── */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Phone Type Donut */}
              <Card className="transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg p-2 bg-pink-500/10">
                      <Smartphone className="h-4 w-4 text-pink-500" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-semibold">
                        Phone Type
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Type of device owned by beneficiaries
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {!phoneTypeData || phoneTypeData.length === 0 ? (
                    <div className="h-[200px] flex items-center justify-center">
                      <EmptyChart />
                    </div>
                  ) : (
                    <>
                      <ChartContainer
                        config={Object.fromEntries(
                          (phoneTypeData || []).map((d, i) => [
                            d.id,
                            {
                              label: d.id,
                              color: COLORS.chart[i % COLORS.chart.length],
                            },
                          ]),
                        )}
                        className="h-[200px] mx-auto"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={(phoneTypeData || []).map((d, i) => ({
                                name: d.id,
                                value: d.count,
                                fill: COLORS.chart[i % COLORS.chart.length],
                              }))}
                              cx="50%"
                              cy="50%"
                              innerRadius={55}
                              outerRadius={80}
                              paddingAngle={3}
                              dataKey="value"
                              strokeWidth={0}
                            >
                              {(phoneTypeData || []).map((entry, index) => (
                                <Cell
                                  key={`phone-${index}`}
                                  fill={COLORS.chart[index % COLORS.chart.length]}
                                />
                              ))}
                            </Pie>
                            <ChartTooltip
                              content={<ChartTooltipContent nameKey="name" />}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                      <div className="flex justify-center gap-4 mt-2 flex-wrap">
                        {(phoneTypeData || []).map((item, i) => (
                          <div key={item.id} className="flex items-center gap-1.5">
                            <span
                              className="h-2.5 w-2.5 rounded-full"
                              style={{
                                backgroundColor: COLORS.chart[i % COLORS.chart.length],
                              }}
                            />
                            <span className="text-xs text-muted-foreground">
                              {item.id}
                            </span>
                            <span className="text-xs font-semibold tabular-nums">
                              {item.count.toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Digital Access Progress Bars */}
              <Card className="transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg p-2 bg-cyan-500/10">
                      <Globe className="h-4 w-4 text-cyan-500" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-semibold">
                        Digital Access
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Percentage with access (Yes responses)
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5 pt-2">
                  {digitalBars.map((bar, i) => (
                    <div key={bar.label}>
                      <div className="flex justify-between mb-1.5">
                        <span className="text-sm font-medium">{bar.label}</span>
                        <span className="text-sm font-semibold tabular-nums text-muted-foreground">
                          {bar.pct}%
                        </span>
                      </div>
                      <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${bar.pct}%`,
                            backgroundColor: COLORS.chart[i % COLORS.chart.length],
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* ── SECTION 8: Age Groups ─────────────────────────────── */}
            <Card className="transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg p-2 bg-orange-500/10">
                    <BarChart2 className="h-4 w-4 text-orange-500" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-semibold">
                      Age Groups
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Beneficiaries grouped by age brackets
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {!ageGroupsData || ageGroupsData.length === 0 ? (
                  <div className="h-[200px] flex items-center justify-center">
                    <EmptyChart />
                  </div>
                ) : (
                  <ChartContainer
                    config={{
                      count: { label: 'Count', color: COLORS.chart[3] },
                    }}
                    className="h-[220px] w-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={ageGroupsData.map((d) => ({
                          name: d.id,
                          count: d.count,
                        }))}
                        layout="vertical"
                        margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          horizontal={false}
                          stroke="hsl(var(--border))"
                          strokeOpacity={0.5}
                        />
                        <XAxis
                          type="number"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 11 }}
                        />
                        <YAxis
                          type="category"
                          dataKey="name"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 11 }}
                          width={50}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar
                          dataKey="count"
                          fill={COLORS.chart[3]}
                          radius={[0, 4, 4, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>

            {/* ── SECTION 9: Caste Distribution + Communication Channels ── */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Caste Distribution Donut */}
              <Card className="transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg p-2 bg-amber-500/10">
                      <Users className="h-4 w-4 text-amber-500" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-semibold">
                        Caste Distribution
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Beneficiaries by caste
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {!casteData || casteData.length === 0 ? (
                    <div className="h-[200px] flex items-center justify-center">
                      <EmptyChart />
                    </div>
                  ) : (
                    <>
                      <ChartContainer
                        config={Object.fromEntries(
                          casteData.map((d, i) => [
                            d.id,
                            {
                              label: d.id,
                              color: COLORS.chart[i % COLORS.chart.length],
                            },
                          ]),
                        )}
                        className="h-[200px] mx-auto"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={casteData.map((d, i) => ({
                                name: d.id,
                                value: d.count,
                                fill: COLORS.chart[i % COLORS.chart.length],
                              }))}
                              cx="50%"
                              cy="50%"
                              innerRadius={55}
                              outerRadius={80}
                              paddingAngle={3}
                              dataKey="value"
                              strokeWidth={0}
                            >
                              {casteData.map((_, index) => (
                                <Cell
                                  key={`caste-${index}`}
                                  fill={COLORS.chart[index % COLORS.chart.length]}
                                />
                              ))}
                              <Label
                                content={({ viewBox }) => {
                                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                                    const total = casteData.reduce((s, d) => s + d.count, 0);
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
                                          fontSize={18}
                                          fontWeight={700}
                                          fill="currentColor"
                                        >
                                          {formatNumber(total)}
                                        </tspan>
                                        <tspan
                                          x={viewBox.cx}
                                          y={(viewBox.cy || 0) + 14}
                                          fontSize={10}
                                          fill="#94a3b8"
                                        >
                                          Total
                                        </tspan>
                                      </text>
                                    );
                                  }
                                }}
                              />
                            </Pie>
                            <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                          </PieChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                      <div className="flex justify-center gap-4 mt-2 flex-wrap">
                        {casteData.map((item, i) => (
                          <div key={item.id} className="flex items-center gap-1.5">
                            <span
                              className="h-2.5 w-2.5 rounded-full"
                              style={{ backgroundColor: COLORS.chart[i % COLORS.chart.length] }}
                            />
                            <span className="text-xs text-muted-foreground font-medium">
                              {item.id}
                            </span>
                            <span className="text-xs font-semibold tabular-nums">
                              {item.count.toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Communication Channels Horizontal Bar */}
              <Card className="transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg p-2 bg-teal-500/10">
                      <Smartphone className="h-4 w-4 text-teal-500" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-semibold">
                        Communication Channels
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Preferred communication channels
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {!channelData || channelData.length === 0 ? (
                    <div className="h-[200px] flex items-center justify-center">
                      <EmptyChart />
                    </div>
                  ) : (
                    <ChartContainer
                      config={{
                        count: { label: 'Count', color: COLORS.chart[5] },
                      }}
                      className="h-[220px] w-full"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={channelData.map((d) => ({
                            name: d.id,
                            count: d.count,
                          }))}
                          layout="vertical"
                          margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            horizontal={false}
                            stroke="hsl(var(--border))"
                            strokeOpacity={0.5}
                          />
                          <XAxis
                            type="number"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 11 }}
                          />
                          <YAxis
                            type="category"
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 11 }}
                            width={80}
                          />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar
                            dataKey="count"
                            fill={COLORS.chart[5]}
                            radius={[0, 4, 4, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* ── SECTION 10: Banking & Financial Access ────────────── */}
            <Card className="transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg p-2 bg-green-500/10">
                    <Shield className="h-4 w-4 text-green-500" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-semibold">
                      Banking &amp; Financial Access
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Bank accounts and financial inclusion
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 lg:grid-cols-3">
                  <MiniDonut data={bankAccessData} label="Bank Account Access" />
                  <MiniDonut data={ssLinkedData} label="SS Linked to Bank" />
                  <MiniDonut data={phoneAvailData} label="Phone Availability" />
                </div>
              </CardContent>
            </Card>

            {/* ── SECTION 11: Bank Distribution ─────────────────────── */}
            <Card className="transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg p-2 bg-indigo-500/10">
                    <Store className="h-4 w-4 text-indigo-500" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-semibold">
                      Bank Distribution
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Beneficiaries by bank
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {!bankDistData || bankDistData.length === 0 ? (
                  <div className="h-[200px] flex items-center justify-center">
                    <EmptyChart />
                  </div>
                ) : (
                  <ChartContainer
                    config={{
                      count: { label: 'Count', color: COLORS.info },
                    }}
                    className="h-[220px] w-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={bankDistData.map((d) => ({
                          name: d.id,
                          count: d.count,
                        }))}
                        layout="vertical"
                        margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          horizontal={false}
                          stroke="hsl(var(--border))"
                          strokeOpacity={0.5}
                        />
                        <XAxis
                          type="number"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 11 }}
                        />
                        <YAxis
                          type="category"
                          dataKey="name"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 10 }}
                          width={90}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar
                          dataKey="count"
                          fill={COLORS.info}
                          radius={[0, 4, 4, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>

            {/* ── SECTION 12: Phone Type (Detailed) + Social Protection ── */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Phone Type Detailed Donut */}
              <Card className="transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg p-2 bg-rose-500/10">
                      <Smartphone className="h-4 w-4 text-rose-500" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-semibold">
                        Phone Type (Detailed)
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Device types owned by beneficiaries
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {!phoneTypeRawData || phoneTypeRawData.length === 0 ? (
                    <div className="h-[200px] flex items-center justify-center">
                      <EmptyChart />
                    </div>
                  ) : (
                    <>
                      <ChartContainer
                        config={Object.fromEntries(
                          phoneTypeRawData.map((d, i) => [
                            d.id,
                            {
                              label: d.id,
                              color: COLORS.chart[i % COLORS.chart.length],
                            },
                          ]),
                        )}
                        className="h-[200px] mx-auto"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={phoneTypeRawData.map((d, i) => ({
                                name: d.id,
                                value: d.count,
                                fill: COLORS.chart[i % COLORS.chart.length],
                              }))}
                              cx="50%"
                              cy="50%"
                              innerRadius={55}
                              outerRadius={80}
                              paddingAngle={3}
                              dataKey="value"
                              strokeWidth={0}
                            >
                              {phoneTypeRawData.map((_, index) => (
                                <Cell
                                  key={`phoneraw-${index}`}
                                  fill={COLORS.chart[index % COLORS.chart.length]}
                                />
                              ))}
                              <Label
                                content={({ viewBox }) => {
                                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                                    const total = phoneTypeRawData.reduce((s, d) => s + d.count, 0);
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
                                          fontSize={18}
                                          fontWeight={700}
                                          fill="currentColor"
                                        >
                                          {formatNumber(total)}
                                        </tspan>
                                        <tspan
                                          x={viewBox.cx}
                                          y={(viewBox.cy || 0) + 14}
                                          fontSize={10}
                                          fill="#94a3b8"
                                        >
                                          Total
                                        </tspan>
                                      </text>
                                    );
                                  }
                                }}
                              />
                            </Pie>
                            <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                          </PieChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                      <div className="flex justify-center gap-4 mt-2 flex-wrap">
                        {phoneTypeRawData.map((item, i) => (
                          <div key={item.id} className="flex items-center gap-1.5">
                            <span
                              className="h-2.5 w-2.5 rounded-full"
                              style={{ backgroundColor: COLORS.chart[i % COLORS.chart.length] }}
                            />
                            <span className="text-xs text-muted-foreground font-medium">
                              {item.id}
                            </span>
                            <span className="text-xs font-semibold tabular-nums">
                              {item.count.toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Social Protection Benefits Bar */}
              <Card className="transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg p-2 bg-purple-500/10">
                      <Shield className="h-4 w-4 text-purple-500" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-semibold">
                        Social Protection Benefits
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Household social security allowance types
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {!socialProtectionData || socialProtectionData.length === 0 ? (
                    <div className="h-[200px] flex items-center justify-center">
                      <EmptyChart />
                    </div>
                  ) : (
                    <ChartContainer
                      config={{
                        count: { label: 'Count', color: COLORS.chart[4] },
                      }}
                      className="h-[220px] w-full"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={socialProtectionData.map((d) => ({
                            name: d.id.replace(/_+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
                            count: d.count,
                          }))}
                          layout="vertical"
                          margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            horizontal={false}
                            stroke="hsl(var(--border))"
                            strokeOpacity={0.5}
                          />
                          <XAxis
                            type="number"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 11 }}
                          />
                          <YAxis
                            type="category"
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10 }}
                            width={110}
                          />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar
                            dataKey="count"
                            fill={COLORS.chart[4]}
                            radius={[0, 4, 4, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* ── SECTION 13: Per-Project Summary Table ──────────────── */}
            <Card className="transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg p-2 bg-slate-500/10">
                    <FolderOpen className="h-4 w-4 text-slate-500" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-semibold">
                      Project Summary
                    </CardTitle>
                    <CardDescription className="text-xs">
                      All registered projects and their current status
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {projects.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                    <FolderOpen className="h-8 w-8 mb-2 opacity-30" />
                    <p className="text-sm">No projects found</p>
                  </div>
                ) : (
                  <div className="space-y-0">
                    <div className="grid grid-cols-[1fr_120px_100px_40px] gap-3 pb-2 border-b text-xs font-medium text-muted-foreground">
                      <span>Project Name</span>
                      <span>Type</span>
                      <span>Status</span>
                      <span />
                    </div>
                    {projects.map((project: any) => (
                      <div
                        key={project.uuid}
                        className="grid grid-cols-[1fr_120px_100px_40px] gap-3 py-3 border-b border-border/50 last:border-0 hover:bg-muted/50 -mx-2 px-2 rounded-sm transition-colors cursor-pointer"
                        onClick={() =>
                          router.push(
                            `/projects/${project.type}/${project.uuid}`,
                          )
                        }
                      >
                        <span className="text-sm font-medium text-foreground truncate">
                          {project.name}
                        </span>
                        <span className="text-sm text-muted-foreground truncate">
                          {project.type}
                        </span>
                        <span>
                          <Badge
                            variant="outline"
                            className="text-[10px] px-1.5 py-0.5 font-medium"
                            style={{
                              borderColor:
                                STATUS_COLORS[project.status] || COLORS.muted,
                              color:
                                STATUS_COLORS[project.status] || COLORS.muted,
                            }}
                          >
                            {project.status}
                          </Badge>
                        </span>
                        <span className="flex items-center justify-end">
                          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                        </span>
                      </div>
                    ))}
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

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
import { TooltipProvider } from '@rahat-ui/shadcn/src/components/ui/tooltip';
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
import { useRSQuery } from '@rumsan/react-query';
import { useQuery } from '@tanstack/react-query';
import {
  FolderOpen,
  FolderCheck,
  Users,
  Store,
  BarChart2,
  Shield,
} from 'lucide-react';

interface ExtraStat {
  key: string;
  label: string;
  classification: 'boolean' | 'numeric' | 'status' | 'category';
  chart: 'pie' | 'bar' | 'metric';
  coverage: { nonNull: number; pct: number };
  series: Array<{ label: string; value: number }>;
  summary?: { count: number; min: number; max: number; avg: number };
}

interface DashboardResponse {
  scope: { beneficiaryCount: number };
  coreStats: {
    beneficiary_total: { count: number };
    vendor_total: { count: number };
    beneficiary_gender: Array<{ label: string; value: number }>;
    beneficiary_age_range: Array<{ label: string; value: number }>;
    beneficiary_bankedStatus: Array<{ label: string; value: number }>;
    beneficiary_internetStatus: Array<{ label: string; value: number }>;
    beneficiary_phoneStatus: Array<{ label: string; value: number }>;
  };
  extraStats: ExtraStat[];
  projects: Array<{
    uuid: string;
    name: string;
    type: string;
    status: string;
    createdAt: string;
    description: string;
  }>;
}

const useDashboardStats = () => {
  const { rumsanService } = useRSQuery();
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const res = await rumsanService.client.get('/dashboard/stats');
      return res.data.data as DashboardResponse;
    },
  });
};

function humanizeLabel(raw: string): string {
  return raw
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_\-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(n >= 10_000 ? 0 : 1)}K`;
  return n.toLocaleString();
}

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
  data: Array<{ label: string; value: number }> | undefined;
  label: string;
}) {
  const chartData = (data || []).map((d, i) => ({
    name: humanizeLabel(d.label),
    value: d.value,
    fill: COLORS.chart[i % COLORS.chart.length],
  }));
  const total = chartData.reduce((sum, d) => sum + d.value, 0);

  if (!chartData.length) {
    return (
      <div className="flex flex-col items-center">
        <p className="text-xs font-medium text-muted-foreground mb-1 text-center">{label}</p>
        <div className="flex items-center justify-center h-[130px]">
          <EmptyChart />
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground mb-1 text-center">{label}</p>
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
                          fontSize={14}
                          fontWeight={700}
                          fill="currentColor"
                        >
                          {formatNumber(total)}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 12}
                          fontSize={9}
                          fill="#94a3b8"
                        >
                          total
                        </tspan>
                      </text>
                    );
                  }
                  return null;
                }}
              />
            </Pie>
            <Tooltip
              formatter={(value: number, name: string) => [value.toLocaleString(), name]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1 justify-center mt-1">
        {chartData.map((item) => (
          <div key={item.name} className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: item.fill }} />
            <span className="text-[10px] text-muted-foreground">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExtraStatDonut({ series }: { series: Array<{ label: string; value: number }> }) {
  const chartData = series.map((d, i) => ({
    name: humanizeLabel(d.label),
    value: d.value,
    fill: COLORS.chart[i % COLORS.chart.length],
  }));
  const total = chartData.reduce((sum, d) => sum + d.value, 0);

  return (
    <>
      <ChartContainer
        config={Object.fromEntries(
          series.map((d, i) => [
            d.label,
            { label: humanizeLabel(d.label), color: COLORS.chart[i % COLORS.chart.length] },
          ]),
        )}
        className="h-[200px] mx-auto"
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
            >
              {chartData.map((entry, index) => (
                <Cell key={`extra-pie-${index}`} fill={entry.fill} />
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
                  return null;
                }}
              />
            </Pie>
            <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>
      <div className="flex justify-center gap-4 mt-2 flex-wrap">
        {chartData.map((item, i) => (
          <div key={item.name} className="flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: COLORS.chart[i % COLORS.chart.length] }}
            />
            <span className="text-xs text-muted-foreground font-medium">{item.name}</span>
            <span className="text-xs font-semibold tabular-nums">{item.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </>
  );
}

function ExtraStatBar({ series }: { series: Array<{ label: string; value: number }> }) {
  return (
    <ChartContainer
      config={{ count: { label: 'Count', color: COLORS.primary } }}
      className="h-[220px] w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={series.map((d) => ({ name: humanizeLabel(d.label), count: d.value }))}
          layout="vertical"
          margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            horizontal={false}
            stroke="hsl(var(--border))"
            strokeOpacity={0.5}
          />
          <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
          <YAxis
            type="category"
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11 }}
            width={80}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="count" fill={COLORS.primary} radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

function ExtraStatMetric({ summary }: { summary: ExtraStat['summary'] }) {
  if (!summary) {
    return (
      <div className="flex items-center justify-center h-[140px]">
        <EmptyChart message="No summary available" />
      </div>
    );
  }

  const items = [
    { label: 'Count', value: formatNumber(summary.count) },
    { label: 'Min', value: summary.min.toLocaleString() },
    { label: 'Max', value: summary.max.toLocaleString() },
    { label: 'Avg', value: summary.avg.toFixed(1) },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 py-2">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex flex-col items-center justify-center rounded-lg border border-border/50 bg-muted/30 py-4"
        >
          <span className="text-2xl font-bold tracking-tight text-foreground tabular-nums">
            {item.value}
          </span>
          <span className="text-xs text-muted-foreground mt-1">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

function ExtraStatChart({ stat }: { stat: ExtraStat }) {
  if (!stat.series || stat.series.length === 0) return null;
  if (stat.chart === 'pie') return <ExtraStatDonut series={stat.series} />;
  if (stat.chart === 'metric') return <ExtraStatMetric summary={stat.summary} />;
  return <ExtraStatBar series={stat.series} />;
}

export default function DashboardView() {
  const { data: dashboardData, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
        Loading dashboard...
      </div>
    );
  }

  const coreStats = dashboardData?.coreStats;
  const projects = dashboardData?.projects || [];
  const extraStats = dashboardData?.extraStats || [];

  const totalProjects = projects.length;
  const activeProjects = projects.filter((p) => p.status === 'ACTIVE').length;
  const totalBeneficiaries = coreStats?.beneficiary_total?.count ?? 0;
  const totalVendors = coreStats?.vendor_total?.count ?? 0;

  const kpiCards = [
    {
      title: 'Total Projects',
      value: totalProjects,
      icon: FolderOpen,
      bgColor: 'bg-indigo-500/10',
      iconColor: 'text-indigo-500',
      subtitle: null as string | null,
    },
    {
      title: 'Active Projects',
      value: activeProjects,
      icon: FolderCheck,
      bgColor: 'bg-emerald-500/10',
      iconColor: 'text-emerald-500',
      subtitle:
        totalProjects > 0
          ? `${Math.round((activeProjects / totalProjects) * 100)}% of total`
          : null,
    },
    {
      title: 'Beneficiaries',
      value: totalBeneficiaries,
      icon: Users,
      bgColor: 'bg-blue-500/10',
      iconColor: 'text-blue-500',
      subtitle: null as string | null,
    },
    {
      title: 'Vendors',
      value: totalVendors,
      icon: Store,
      bgColor: 'bg-violet-500/10',
      iconColor: 'text-violet-500',
      subtitle: null as string | null,
    },
  ];

  const projectBarData = (() => {
    const byType: Record<string, Record<string, number>> = {};
    projects.forEach((p) => {
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

  const genderData = coreStats?.beneficiary_gender ?? [];
  const ageRangeData = coreStats?.beneficiary_age_range ?? [];
  const bankingData = coreStats?.beneficiary_bankedStatus ?? [];
  const internetData = coreStats?.beneficiary_internetStatus ?? [];
  const phoneStatusData = coreStats?.beneficiary_phoneStatus ?? [];
  const genderTotal = genderData.reduce((s, d) => s + d.value, 0);

  const renderedExtras = extraStats.filter((s) => s.series && s.series.length > 0);

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex flex-col h-full">
        <div className="border-b border-border bg-card px-6 py-5">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Platform-wide analytics and reporting</p>
        </div>

        <ScrollArea className="h-[calc(100vh-155px)]">
          <div className="flex-1 p-6 space-y-6">

            <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
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
                          {formatNumber(card.value)}
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

            <Card className="transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg p-2 bg-indigo-500/10">
                    <BarChart2 className="h-4 w-4 text-indigo-500" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-semibold">Project Overview</CardTitle>
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
                  <>
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
                          <Bar dataKey="ACTIVE" stackId="a" fill={STATUS_COLORS['ACTIVE']} radius={[0, 0, 0, 0]} />
                          <Bar dataKey="NOT_READY" stackId="a" fill={STATUS_COLORS['NOT_READY']} />
                          <Bar dataKey="CLOSED" stackId="a" fill={STATUS_COLORS['CLOSED']} radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                    <div className="flex justify-center gap-6 mt-2 text-xs">
                      {[
                        { label: 'Active', color: COLORS.success },
                        { label: 'Not Ready', color: COLORS.warning },
                        { label: 'Closed', color: COLORS.muted },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-muted-foreground">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg p-2 bg-blue-500/10">
                      <Users className="h-4 w-4 text-blue-500" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-semibold">Gender Distribution</CardTitle>
                      <CardDescription className="text-xs">Beneficiaries by gender</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {genderData.length === 0 ? (
                    <div className="h-[200px] flex items-center justify-center">
                      <EmptyChart />
                    </div>
                  ) : (
                    <>
                      <ChartContainer
                        config={Object.fromEntries(
                          genderData.map((d, i) => [
                            d.label,
                            { label: humanizeLabel(d.label), color: COLORS.chart[i % COLORS.chart.length] },
                          ]),
                        )}
                        className="h-[200px] mx-auto"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={genderData.map((d, i) => ({
                                name: humanizeLabel(d.label),
                                value: d.value,
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
                              {genderData.map((_, index) => (
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
                                          fontSize={18}
                                          fontWeight={700}
                                          fill="currentColor"
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
                                  return null;
                                }}
                              />
                            </Pie>
                            <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                          </PieChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                      <div className="flex justify-center gap-4 mt-2 flex-wrap">
                        {genderData.map((item, i) => (
                          <div key={item.label} className="flex items-center gap-1.5">
                            <span
                              className="h-2.5 w-2.5 rounded-full"
                              style={{ backgroundColor: COLORS.chart[i % COLORS.chart.length] }}
                            />
                            <span className="text-xs text-muted-foreground font-medium">{humanizeLabel(item.label)}</span>
                            <span className="text-xs font-semibold tabular-nums">{item.value.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card className="transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg p-2 bg-violet-500/10">
                      <BarChart2 className="h-4 w-4 text-violet-500" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-semibold">Age Distribution</CardTitle>
                      <CardDescription className="text-xs">Beneficiaries by age range</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {ageRangeData.length === 0 ? (
                    <div className="h-[200px] flex items-center justify-center">
                      <EmptyChart />
                    </div>
                  ) : (
                    <ChartContainer
                      config={{ count: { label: 'Count', color: COLORS.primary } }}
                      className="h-[220px] w-full"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={ageRangeData.map((d) => ({ name: humanizeLabel(d.label), count: d.value }))}
                          layout="vertical"
                          margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            horizontal={false}
                            stroke="hsl(var(--border))"
                            strokeOpacity={0.5}
                          />
                          <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                          <YAxis
                            type="category"
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 11 }}
                            width={50}
                          />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="count" fill={COLORS.primary} radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card className="transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg p-2 bg-emerald-500/10">
                    <Shield className="h-4 w-4 text-emerald-500" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-semibold">Access &amp; Inclusion</CardTitle>
                    <CardDescription className="text-xs">Banking, internet, and phone access</CardDescription>
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

            {renderedExtras.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg p-2 bg-sky-500/10">
                    <BarChart2 className="h-4 w-4 text-sky-500" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold leading-none">Additional Insights</h2>
                    <p className="text-xs text-muted-foreground mt-1">
                      Auto-discovered from beneficiary data fields
                    </p>
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  {renderedExtras.map((stat) => (
                    <Card
                      key={stat.key}
                      className="transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <CardTitle className="text-base font-semibold">{stat.label}</CardTitle>
                            <CardDescription className="text-xs mt-0.5">
                              {stat.coverage.nonNull.toLocaleString()} records (
                              {Math.round(stat.coverage.pct)}% coverage)
                            </CardDescription>
                          </div>
                          <Badge variant="outline" className="text-[10px] shrink-0 capitalize">
                            {stat.classification}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ExtraStatChart stat={stat} />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

          </div>
        </ScrollArea>
      </div>
    </TooltipProvider>
  );
}

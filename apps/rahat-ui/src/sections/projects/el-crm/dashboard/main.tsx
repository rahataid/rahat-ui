import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@rahat-ui/shadcn/src/components/ui/chart';
import {
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  ResponsiveContainer,
  Label,
} from 'recharts';
import {
  Users,
  UserCheck,
  MessageSquare,
  Download,
  TrendingUp,
  Send,
  CheckCircle2,
} from 'lucide-react';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { CustomerCategory, Stat, useCustomerStats } from '@rahat-ui/query';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';

const DONUT_COLORS_MESSAGES = ['#6366f1', '#22d3ee'];
const DONUT_COLORS_DELIVERY = ['#8b5cf6', '#f43f5e'];
const monthlyTrendData = [
  { month: 'Jan', messages: 2400 },
  { month: 'Feb', messages: 1398 },
  { month: 'Mar', messages: 9800 },
  { month: 'Apr', messages: 3908 },
  { month: 'May', messages: 4800 },
  { month: 'Jun', messages: 3800 },
];

const customerCategorizationData = [
  { month: 'Jan', active: 1200, inactive: 800, newlyActive: 400 },
  { month: 'Feb', active: 1100, inactive: 900, newlyActive: 300 },
  { month: 'Mar', active: 1400, inactive: 700, newlyActive: 600 },
  { month: 'Apr', active: 1300, inactive: 750, newlyActive: 500 },
  { month: 'May', active: 1500, inactive: 650, newlyActive: 550 },
  { month: 'Jun', active: 1600, inactive: 600, newlyActive: 600 },
];

export default function DashboardView() {
  const { id: projectUUID } = useParams() as { id: UUID };

  const { data: stats } = useCustomerStats(projectUUID);

  const totalCustomers =
    stats?.find((stat: Stat) => stat.name === 'TOTAL_CUSTOMER')?.data || 0;

  const totalMessagesSent =
    stats?.find((stat: Stat) => stat.name === 'TOTAL_MESSAGES_SENT')?.data || 0;

  const successfulMessages =
    stats?.find((stat: Stat) => stat.name === 'TOTAL_MESSAGES_SUCCESS')?.data ||
    0;

  const failedMessages =
    stats?.find((stat: Stat) => stat.name === 'TOTAL_MESSAGES_FAILED')?.data ||
    0;

  const messagesToConsumers =
    stats?.find((stat: Stat) => stat.name === 'MESSAGES_TO_CONSUMERS')?.data ||
    0;

  const messagesToCustomers =
    stats?.find((stat: Stat) => stat.name === 'MESSAGES_TO_CUSTOMERS')?.data ||
    0;

  const customersByMonth =
    stats?.find((stat: Stat) => stat.name === 'CUSTOMERS_BY_MONTH')?.data || [];
  const messagesSentData = [
    {
      name: 'Consumers',
      value: Number(messagesToConsumers) || 0,
      fill: '#6366f1',
    },
    {
      name: 'Customers',
      value: Number(messagesToCustomers) || 0,
      fill: '#22d3ee',
    },
  ];

  const deliveryStatusData = [
    {
      name: 'Delivered',
      value: Number(successfulMessages) || 0,
      fill: '#8b5cf6',
    },
    { name: 'Failed', value: Number(failedMessages) || 0, fill: '#f43f5e' },
  ];
  const totalMessages = messagesSentData.reduce((s, d) => s + d.value, 0);
  const totalDelivery = deliveryStatusData.reduce((s, d) => s + d.value, 0);
  const statCards = [
    {
      title: 'Total Customers',
      value: totalCustomers,
      icon: Users,
      bgColor: 'bg-primary/5',
      iconColor: 'text-primary',
      tooltip: 'Total number of registered customers in the system',
    },
    {
      title: 'Total Consumers',
      value: 0,
      icon: UserCheck,
      bgColor: 'bg-emerald-500/5',
      iconColor: 'text-emerald-500',
      tooltip: 'Total number of consumers receiving services',
    },
    {
      title: 'Total Messages Sent',
      value: totalMessages,
      icon: Send,
      bgColor: 'bg-violet-500/5',
      iconColor: 'text-violet-500',
      tooltip: 'Total messages dispatched across all channels',
    },
  ];

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex flex-col h-full">
        {/* Page Header — mirrors Customer page header */}
        <div className="border-b border-border bg-card px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Dashboard
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Real-time analytics and data visualization
              </p>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  Download Report
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Export dashboard analytics as a report</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-145px)]">
          <div className="flex-1 p-6 space-y-6">
            {/* Stat Cards — same pattern as Customer page */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
              {statCards.map((stat) => (
                <Card
                  key={stat.title}
                  className="relative overflow-hidden transition-shadow hover:shadow-md"
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1.5">
                        <p className="text-sm font-medium text-muted-foreground leading-none">
                          {stat.title}
                        </p>
                        <p className="text-3xl font-bold tracking-tight text-foreground">
                          {stat.value}
                        </p>
                      </div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className={`rounded-lg p-2.5 ${stat.bgColor}`}>
                            <stat.icon
                              className={`h-5 w-5 ${stat.iconColor}`}
                            />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          <p className="max-w-[220px]">{stat.tooltip}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Donut Charts Row */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Messages Sent Donut */}
              <Card className="transition-shadow hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg p-2 bg-indigo-500/5">
                      <MessageSquare className="h-4 w-4 text-indigo-500" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-semibold">
                        Messages Sent
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Distribution by recipient type
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      Consumers: { label: 'Consumers', color: '#6366f1' },
                      Customers: { label: 'Customers', color: '#22d3ee' },
                    }}
                    className="h-[260px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={messagesSentData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={4}
                          dataKey="value"
                          nameKey="name"
                          strokeWidth={0}
                        >
                          {messagesSentData.map((_, index) => (
                            <Cell
                              key={`msg-${index}`}
                              fill={DONUT_COLORS_MESSAGES[index]}
                            />
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
                                      className="fill-foreground text-2xl font-bold"
                                    >
                                      {totalMessages.toLocaleString()}
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
                    {messagesSentData.map((item, i) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: DONUT_COLORS_MESSAGES[i] }}
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

              {/* Delivery Status Donut */}
              <Card className="transition-shadow hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg p-2 bg-violet-500/5">
                      <CheckCircle2 className="h-4 w-4 text-violet-500" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-semibold">
                        Delivery Status
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Success vs failure rates
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      Delivered: { label: 'Delivered', color: '#8b5cf6' },
                      Failed: { label: 'Failed', color: '#f43f5e' },
                    }}
                    className="h-[260px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={deliveryStatusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={4}
                          dataKey="value"
                          nameKey="name"
                          strokeWidth={0}
                        >
                          {deliveryStatusData.map((_, index) => (
                            <Cell
                              key={`del-${index}`}
                              fill={DONUT_COLORS_DELIVERY[index]}
                            />
                          ))}
                          <Label
                            content={({ viewBox }) => {
                              if (
                                viewBox &&
                                'cx' in viewBox &&
                                'cy' in viewBox
                              ) {
                                const rate =
                                  totalDelivery > 0
                                    ? Math.round(
                                        (deliveryStatusData[0].value /
                                          totalDelivery) *
                                          100,
                                      )
                                    : 0;
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
                                      className="fill-foreground text-2xl font-bold"
                                    >
                                      {rate}%
                                    </tspan>
                                    <tspan
                                      x={viewBox.cx}
                                      y={(viewBox.cy || 0) + 14}
                                      className="fill-muted-foreground text-xs"
                                    >
                                      Success
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
                    {deliveryStatusData.map((item, i) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: DONUT_COLORS_DELIVERY[i] }}
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
            </div>

            {/* Customer Categorization Bar Chart */}
            <Card className="transition-shadow hover:shadow-md">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg p-2 bg-blue-500/5">
                    <TrendingUp className="h-4 w-4 text-blue-500" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-semibold">
                      Customer Categorization
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Active, Inactive, and Newly Inactive customers per month
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    [CustomerCategory.ACTIVE]: {
                      label: 'Active',
                      color: '#6366f1',
                    },
                    [CustomerCategory.INACTIVE]: {
                      label: 'Inactive',
                      color: '#f59e0b',
                    },
                    [CustomerCategory.NEWLY_INACTIVE]: {
                      label: 'Newly Inactive',
                      color: '#22d3ee',
                    },
                  }}
                  className="h-[320px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={customersByMonth} barCategoryGap="20%">
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
                        tick={{ fontSize: 12 }}
                        dy={8}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12 }}
                        dx={-4}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar
                        dataKey={CustomerCategory.ACTIVE}
                        stackId="a"
                        fill="#6366f1"
                        radius={[0, 0, 0, 0]}
                      />
                      <Bar
                        dataKey={CustomerCategory.INACTIVE}
                        stackId="a"
                        fill="#f59e0b"
                        radius={[0, 0, 0, 0]}
                      />
                      <Bar
                        dataKey={CustomerCategory.NEWLY_INACTIVE}
                        stackId="a"
                        fill="#22d3ee"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
                <div className="flex justify-center gap-6 mt-3 text-sm">
                  {[
                    { label: 'Active', color: '#6366f1' },
                    { label: 'Inactive', color: '#f59e0b' },
                    { label: 'Newly Inactive', color: '#22d3ee' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2">
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
        </ScrollArea>
      </div>
    </TooltipProvider>
  );
}

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
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  ResponsiveContainer,
} from 'recharts';
import { Users, UserCheck, MessageSquare, Download } from 'lucide-react';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';

const messagesSentData = [
  { name: 'Consumers', value: 2400, fill: '#60a5fa' }, // Light blue
  { name: 'Customers', value: 1600, fill: '#34d399' }, // Light emerald
];

const deliveryStatusData = [
  { name: 'Delivered', value: 3200, fill: '#a78bfa' }, // Light purple
  { name: 'Failed', value: 800, fill: '#fb7185' }, // Light pink/rose
];

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
  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-border bg-card/50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Welcome to Dashboard
            </h1>
            <p className="text-muted-foreground">
              Your Hub for Real-Time Analytics and Data Visualization of the
              system
            </p>
          </div>
          <Button variant="default">
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>
        </div>
      </div>
      <ScrollArea className="h-[calc(100vh-145px)]">
        <div className="flex-1 p-6 space-y-6">
          {/* Top Cards Section - 3 Cards Horizontally */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Customers
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,847</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Consumers
                </CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,924</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Messages Sent
                </CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24,567</div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          {/* Row 1: Two Pie Charts */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-2 border-border">
              <CardHeader>
                <CardTitle>Messages Sent</CardTitle>
                <CardDescription>
                  Distribution of messages sent to consumers vs customers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    Consumers: {
                      label: 'Consumers',
                      color: '#60a5fa',
                    },
                    Customers: {
                      label: 'Customers',
                      color: '#34d399',
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={messagesSentData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        nameKey="name"
                      />
                      <ChartTooltip
                        content={<ChartTooltipContent nameKey="name" />}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
                <div className="flex justify-center gap-4 mt-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                    <span>Consumers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                    <span>Customers</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-border">
              <CardHeader>
                <CardTitle>Delivery Status</CardTitle>
                <CardDescription>
                  Message delivery success vs failure rates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    Delivered: {
                      label: 'Delivered',
                      color: '#a78bfa',
                    },
                    Failed: {
                      label: 'Failed',
                      color: '#fb7185',
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={deliveryStatusData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        nameKey="name"
                      />
                      <ChartTooltip
                        content={<ChartTooltipContent nameKey="name" />}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
                <div className="flex justify-center gap-4 mt-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-violet-400"></div>
                    <span>Delivered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                    <span>Failed</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Row 2: Stacked/Bar Chart for Customer Categorization */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Categorization</CardTitle>
              <CardDescription>
                Active, Inactive, and Newly Active customers per month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  active: {
                    label: 'Active',
                    color: '#60a5fa', // Light blue
                  },
                  inactive: {
                    label: 'Inactive',
                    color: '#fbbf24', // Light amber instead of red
                  },
                  newlyActive: {
                    label: 'Newly Active',
                    color: '#4ade80', // Light green
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={customerCategorizationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="active" stackId="a" fill="#60a5fa" />
                    <Bar dataKey="inactive" stackId="a" fill="#fbbf24" />
                    <Bar dataKey="newlyActive" stackId="a" fill="#4ade80" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}

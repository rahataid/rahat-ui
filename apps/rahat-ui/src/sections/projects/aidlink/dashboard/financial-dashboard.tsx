'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Progress } from '@rahat-ui/shadcn/src/components/ui/progress';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  DollarSign,
  Wallet,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Banknote,
  PiggyBank,
  Target,
} from 'lucide-react';

const exchangeRateData = [
  { time: '00:00', rate: 1850 },
  { time: '04:00', rate: 1845 },
  { time: '08:00', rate: 1860 },
  { time: '12:00', rate: 1875 },
  { time: '16:00', rate: 1870 },
  { time: '20:00', rate: 1865 },
];

const budgetData = [
  { category: 'Direct Aid', budgeted: 45000, actual: 38500, percentage: 85.6 },
  { category: 'Operations', budgeted: 8000, actual: 6200, percentage: 77.5 },
  { category: 'Technology', budgeted: 5000, actual: 4800, percentage: 96.0 },
  {
    category: 'Emergency Reserve',
    budgeted: 12000,
    actual: 11800,
    percentage: 98.3,
  },
];

const donorFunds = [
  {
    id: 1,
    donor: 'UNICEF',
    amount: 25000,
    allocated: 22000,
    remaining: 3000,
    status: 'active',
    purpose: 'Emergency Relief',
    color: '#3b82f6',
  },
  {
    id: 2,
    donor: 'World Bank',
    amount: 30000,
    allocated: 18500,
    remaining: 11500,
    status: 'active',
    purpose: 'Food Security',
    color: '#10b981',
  },
  {
    id: 3,
    donor: 'EU Humanitarian Aid',
    amount: 15000,
    allocated: 14200,
    remaining: 800,
    status: 'nearly_depleted',
    purpose: 'Education Support',
    color: '#f59e0b',
  },
];

const spendingTrend = [
  { month: 'Jan', budgeted: 8000, actual: 7200 },
  { month: 'Feb', budgeted: 8500, actual: 8100 },
  { month: 'Mar', budgeted: 9000, actual: 8800 },
  { month: 'Apr', budgeted: 8200, actual: 7900 },
  { month: 'May', budgeted: 8800, actual: 9200 },
  { month: 'Jun', budgeted: 9200, actual: 8600 },
];

export function FinancialDashboard() {
  const [currentExchangeRate, setCurrentExchangeRate] = useState(1865);
  const [rateChange, setRateChange] = useState({ value: 2.3, trend: 'up' });

  const totalBudget = budgetData.reduce((sum, item) => sum + item.budgeted, 0);
  const totalSpent = budgetData.reduce((sum, item) => sum + item.actual, 0);
  const budgetUtilization = (totalSpent / totalBudget) * 100;

  const totalDonorFunds = donorFunds.reduce(
    (sum, donor) => sum + donor.amount,
    0,
  );
  const totalAllocated = donorFunds.reduce(
    (sum, donor) => sum + donor.allocated,
    0,
  );
  const totalRemaining = donorFunds.reduce(
    (sum, donor) => sum + donor.remaining,
    0,
  );

  // Simulate real-time exchange rate updates
  useEffect(() => {
    const interval = setInterval(() => {
      const change = (Math.random() - 0.5) * 10;
      setCurrentExchangeRate((prev) => Math.max(1800, prev + change));
      setRateChange({
        value: Math.abs(change),
        trend: change > 0 ? 'up' : 'down',
      });
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            Financial Management
          </h2>
          <p className="text-gray-600 mt-1">
            Comprehensive budget tracking and fund management
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Export Report
          </Button>
          <Button size="sm">Generate Statement</Button>
        </div>
      </div>

      {/* Key Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">
              Total Budget
            </CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">
              ${totalBudget.toLocaleString()}
            </div>
            <p className="text-xs text-blue-600 mt-1">Project allocation</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">
              Funds Disbursed
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              ${totalSpent.toLocaleString()}
            </div>
            <p className="text-xs text-green-600 mt-1">
              {budgetUtilization.toFixed(1)}% of budget
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">
              Available Funds
            </CardTitle>
            <PiggyBank className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              ${totalRemaining.toLocaleString()}
            </div>
            <p className="text-xs text-purple-600 mt-1">Ready for allocation</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">
              Exchange Rate
            </CardTitle>
            <Banknote className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold text-orange-900">
                {currentExchangeRate.toFixed(0)}
              </div>
              <div className="flex items-center">
                {rateChange.trend === 'up' ? (
                  <ArrowUpRight className="h-4 w-4 text-green-600" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-600" />
                )}
                <span
                  className={`text-xs ${
                    rateChange.trend === 'up'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {rateChange.value.toFixed(1)}
                </span>
              </div>
            </div>
            <p className="text-xs text-orange-600 mt-1">
              USDC to Local Currency
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="budget" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="budget">Budget Analysis</TabsTrigger>
          <TabsTrigger value="exchange">Exchange Rates</TabsTrigger>
          <TabsTrigger value="reserves">Reserve Funds</TabsTrigger>
          <TabsTrigger value="donors">Donor Tracking</TabsTrigger>
        </TabsList>

        <TabsContent value="budget" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Budget vs. Actual Spending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {budgetData.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          {item.category}
                        </span>
                        <div className="text-right">
                          <div className="text-sm font-bold">
                            ${item.actual.toLocaleString()} / $
                            {item.budgeted.toLocaleString()}
                          </div>
                          <Badge
                            className={
                              item.percentage > 90
                                ? 'bg-red-100 text-red-800'
                                : item.percentage > 75
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                            }
                          >
                            {item.percentage.toFixed(1)}%
                          </Badge>
                        </div>
                      </div>
                      <Progress value={item.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Spending Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={spendingTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="budgeted" fill="#e5e7eb" name="Budgeted" />
                      <Bar dataKey="actual" fill="#3b82f6" name="Actual" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Budget Variance Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-900">2</div>
                  <p className="text-sm text-green-700">
                    Categories Under Budget
                  </p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-yellow-900">1</div>
                  <p className="text-sm text-yellow-700">
                    Categories Near Limit
                  </p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-red-900">1</div>
                  <p className="text-sm text-red-700">Categories Over Budget</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exchange" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>USDC to Local Currency Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={exchangeRateData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="rate"
                        stroke="#3b82f6"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Exchange Rate Impact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">
                    Current Rate Impact
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>$100 USDC equals:</span>
                      <span className="font-bold">
                        {(currentExchangeRate * 0.1).toFixed(0)} Local Currency
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Daily rate change:</span>
                      <span
                        className={`font-bold ${
                          rateChange.trend === 'up'
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {rateChange.trend === 'up' ? '+' : '-'}
                        {rateChange.value.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Rate Alerts</h4>
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm text-yellow-800">
                        Rate volatility detected - consider timing disbursements
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Beneficiary Impact</h4>
                  <div className="text-sm text-gray-600">
                    <p>
                      • Higher rates = More local currency for beneficiaries
                    </p>
                    <p>• Current rate is 2.3% above yesterday</p>
                    <p>• Optimal disbursement window: Next 2-4 hours</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reserves" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Emergency Reserve</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    $12,000
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Available for emergencies
                  </p>
                  <Progress value={85} className="mb-2" />
                  <p className="text-xs text-gray-500">85% of target reserve</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Operational Buffer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    $5,500
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Monthly operations
                  </p>
                  <Progress value={92} className="mb-2" />
                  <p className="text-xs text-gray-500">92% of monthly needs</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contingency Fund</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    $8,200
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Unexpected expenses
                  </p>
                  <Progress value={68} className="mb-2" />
                  <p className="text-xs text-gray-500">68% of target amount</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Reserve Fund Allocation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        {
                          name: 'Emergency Reserve',
                          value: 12000,
                          color: '#10b981',
                        },
                        {
                          name: 'Operational Buffer',
                          value: 5500,
                          color: '#3b82f6',
                        },
                        {
                          name: 'Contingency Fund',
                          value: 8200,
                          color: '#8b5cf6',
                        },
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                    >
                      {[
                        {
                          name: 'Emergency Reserve',
                          value: 12000,
                          color: '#10b981',
                        },
                        {
                          name: 'Operational Buffer',
                          value: 5500,
                          color: '#3b82f6',
                        },
                        {
                          name: 'Contingency Fund',
                          value: 8200,
                          color: '#8b5cf6',
                        },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="donors" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Donor Fund Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {donorFunds.map((donor) => (
                    <div key={donor.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium">{donor.donor}</h4>
                          <p className="text-sm text-gray-600">
                            {donor.purpose}
                          </p>
                        </div>
                        <Badge
                          className={
                            donor.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }
                        >
                          {donor.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Total Funding:</span>
                          <span className="font-medium">
                            ${donor.amount.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Allocated:</span>
                          <span className="font-medium">
                            ${donor.allocated.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Remaining:</span>
                          <span className="font-medium text-green-600">
                            ${donor.remaining.toLocaleString()}
                          </span>
                        </div>
                        <Progress
                          value={(donor.allocated / donor.amount) * 100}
                          className="mt-2"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Fund Allocation by Donor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={donorFunds.map((donor) => ({
                          name: donor.donor,
                          value: donor.amount,
                          color: donor.color,
                        }))}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                      >
                        {donorFunds.map((donor, index) => (
                          <Cell key={`cell-${index}`} fill={donor.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                  {donorFunds.map((donor) => (
                    <div key={donor.id} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: donor.color }}
                      ></div>
                      <span className="text-sm text-gray-600">
                        {donor.donor}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Donor Transparency Report</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-900">
                    {donorFunds.length}
                  </div>
                  <p className="text-sm text-blue-700">Active Donors</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-900">
                    ${totalDonorFunds.toLocaleString()}
                  </div>
                  <p className="text-sm text-green-700">Total Committed</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Wallet className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-900">
                    {((totalAllocated / totalDonorFunds) * 100).toFixed(1)}%
                  </div>
                  <p className="text-sm text-purple-700">Funds Utilized</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

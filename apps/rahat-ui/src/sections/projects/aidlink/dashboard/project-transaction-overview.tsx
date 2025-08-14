'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
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
  AreaChart,
  Area,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  MapPin,
  Activity,
  Target,
  Zap,
  Globe,
} from 'lucide-react';

export function ProjectTransactionOverview() {
  const [timeRange, setTimeRange] = useState('7d');
  const [activeTab, setActiveTab] = useState('overview');

  // Sample data for the overview
  const projectMetrics = {
    totalBeneficiaries: 1250,
    totalDisbursed: 125750.0,
    successRate: 96.8,
    avgProcessingTime: '2.3 min',
    activeTransactions: 45,
    completedTransactions: 1205,
    failedTransactions: 32,
    totalSMSSent: 1180,
    smsDeliveryRate: 94.2,
    offrampSuccessRate: 89.5,
  };

  const transactionFlowData = [
    { stage: 'Onboarded', count: 1250, percentage: 100 },
    { stage: 'Wallet Created', count: 1220, percentage: 97.6 },
    { stage: 'Disbursement Initiated', count: 1205, percentage: 96.4 },
    { stage: 'Approved', count: 1195, percentage: 95.6 },
    { stage: 'Executed', count: 1180, percentage: 94.4 },
    { stage: 'SMS Sent', count: 1175, percentage: 94.0 },
    { stage: 'Offramped', count: 1120, percentage: 89.6 },
  ];

  const dailyTransactionData = [
    { date: 'Jul 1', onboarded: 45, executed: 42, offramped: 38 },
    { date: 'Jul 2', onboarded: 52, executed: 48, offramped: 45 },
    { date: 'Jul 3', onboarded: 38, executed: 51, offramped: 47 },
    { date: 'Jul 4', onboarded: 61, executed: 35, offramped: 49 },
    { date: 'Jul 5', onboarded: 49, executed: 58, offramped: 52 },
    { date: 'Jul 6', onboarded: 55, executed: 46, offramped: 44 },
    { date: 'Jul 7', onboarded: 42, executed: 53, offramped: 48 },
  ];

  const geographicData = [
    {
      region: 'Zone A',
      beneficiaries: 450,
      disbursed: 45000,
      successRate: 98.2,
    },
    {
      region: 'Zone B',
      beneficiaries: 320,
      disbursed: 32000,
      successRate: 95.8,
    },
    {
      region: 'Zone C',
      beneficiaries: 280,
      disbursed: 28000,
      successRate: 94.1,
    },
    {
      region: 'Zone D',
      beneficiaries: 200,
      disbursed: 20750,
      successRate: 97.5,
    },
  ];

  const performanceMetrics = [
    {
      metric: 'Avg Onboarding Time',
      value: '45 sec',
      trend: 'down',
      change: '-12%',
    },
    {
      metric: 'Avg Wallet Creation',
      value: '1.2 min',
      trend: 'down',
      change: '-8%',
    },
    {
      metric: 'Avg Approval Time',
      value: '15 min',
      trend: 'up',
      change: '+5%',
    },
    {
      metric: 'Avg Execution Time',
      value: '2.1 min',
      trend: 'down',
      change: '-15%',
    },
    {
      metric: 'SMS Delivery Time',
      value: '30 sec',
      trend: 'stable',
      change: '0%',
    },
    {
      metric: 'Offramp Processing',
      value: '4.5 min',
      trend: 'down',
      change: '-20%',
    },
  ];

  const errorAnalysis = [
    {
      type: 'Wallet Creation Failed',
      count: 30,
      percentage: 2.4,
      trend: 'down',
    },
    {
      type: 'Insufficient Approvals',
      count: 10,
      percentage: 0.8,
      trend: 'stable',
    },
    { type: 'Transaction Failed', count: 25, percentage: 2.0, trend: 'up' },
    { type: 'SMS Delivery Failed', count: 70, percentage: 5.6, trend: 'down' },
    { type: 'Offramp Failed', count: 130, percentage: 10.4, trend: 'down' },
  ];

  const hourlyActivityData = [
    { hour: '00', transactions: 12 },
    { hour: '01', transactions: 8 },
    { hour: '02', transactions: 5 },
    { hour: '03', transactions: 3 },
    { hour: '04', transactions: 7 },
    { hour: '05', transactions: 15 },
    { hour: '06', transactions: 25 },
    { hour: '07', transactions: 35 },
    { hour: '08', transactions: 45 },
    { hour: '09', transactions: 65 },
    { hour: '10', transactions: 75 },
    { hour: '11', transactions: 68 },
    { hour: '12', transactions: 52 },
    { hour: '13', transactions: 58 },
    { hour: '14', transactions: 72 },
    { hour: '15', transactions: 68 },
    { hour: '16', transactions: 55 },
    { hour: '17', transactions: 42 },
    { hour: '18', transactions: 35 },
    { hour: '19', transactions: 28 },
    { hour: '20', transactions: 22 },
    { hour: '21', transactions: 18 },
    { hour: '22', transactions: 15 },
    { hour: '23', transactions: 10 },
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-red-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-green-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-red-600';
      case 'down':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            Project Transaction Overview
          </h2>
          <p className="text-gray-600 mt-1">
            Comprehensive analytics and insights for the entire project
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            Export Report
          </Button>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-5 bg-white shadow-sm">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="flow"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Transaction Flow
          </TabsTrigger>
          <TabsTrigger
            value="performance"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Performance
          </TabsTrigger>
          <TabsTrigger
            value="geographic"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Geographic
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-700">
                  Total Beneficiaries
                </CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-900">
                  {projectMetrics.totalBeneficiaries.toLocaleString()}
                </div>
                <p className="text-xs text-blue-600 mt-1">Across all regions</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-700">
                  Total Disbursed
                </CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-900">
                  ${projectMetrics.totalDisbursed.toLocaleString()}
                </div>
                <p className="text-xs text-green-600 mt-1">USDC distributed</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-700">
                  Success Rate
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-900">
                  {projectMetrics.successRate}%
                </div>
                <p className="text-xs text-purple-600 mt-1">
                  End-to-end completion
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-orange-700">
                  Avg Processing Time
                </CardTitle>
                <Clock className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-900">
                  {projectMetrics.avgProcessingTime}
                </div>
                <p className="text-xs text-orange-600 mt-1">
                  From initiation to completion
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Status Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Transaction Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Completed</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {projectMetrics.completedTransactions}
                      </div>
                      <div className="text-xs text-gray-500">
                        {(
                          (projectMetrics.completedTransactions /
                            projectMetrics.totalBeneficiaries) *
                          100
                        ).toFixed(1)}
                        %
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm">In Progress</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {projectMetrics.activeTransactions}
                      </div>
                      <div className="text-xs text-gray-500">
                        {(
                          (projectMetrics.activeTransactions /
                            projectMetrics.totalBeneficiaries) *
                          100
                        ).toFixed(1)}
                        %
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-600" />
                      <span className="text-sm">Failed</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {projectMetrics.failedTransactions}
                      </div>
                      <div className="text-xs text-gray-500">
                        {(
                          (projectMetrics.failedTransactions /
                            projectMetrics.totalBeneficiaries) *
                          100
                        ).toFixed(1)}
                        %
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Daily Transaction Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dailyTransactionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="onboarded"
                        stroke="#3b82f6"
                        name="Onboarded"
                      />
                      <Line
                        type="monotone"
                        dataKey="executed"
                        stroke="#10b981"
                        name="Executed"
                      />
                      <Line
                        type="monotone"
                        dataKey="offramped"
                        stroke="#f59e0b"
                        name="Offramped"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="flow" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Flow Analysis</CardTitle>
              <p className="text-sm text-gray-600">
                Track beneficiaries through each stage of the process
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {transactionFlowData.map((stage, index) => (
                  <div key={stage.stage} className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <span className="font-medium">{stage.stage}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">
                          {stage.count.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">
                          {stage.percentage.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                    <div className="ml-11">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${stage.percentage}%` }}
                        ></div>
                      </div>
                      {index < transactionFlowData.length - 1 && (
                        <div className="text-xs text-red-600 mt-1">
                          Drop-off:{' '}
                          {(
                            transactionFlowData[index].count -
                            transactionFlowData[index + 1].count
                          ).toLocaleString()}{' '}
                          beneficiaries
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Conversion Funnel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={transactionFlowData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="stage" type="category" width={120} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {performanceMetrics.map((metric, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {metric.metric}
                      </p>
                      <p className="text-2xl font-bold">{metric.value}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(metric.trend)}
                      <span
                        className={`text-sm font-medium ${getTrendColor(
                          metric.trend,
                        )}`}
                      >
                        {metric.change}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Error Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {errorAnalysis.map((error, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{error.type}</p>
                        <p className="text-sm text-gray-600">
                          {error.count} occurrences ({error.percentage}%)
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        {getTrendIcon(error.trend)}
                        <Badge
                          className={
                            error.trend === 'down'
                              ? 'bg-green-100 text-green-800'
                              : error.trend === 'up'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                          }
                        >
                          {error.trend}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hourly Activity Pattern</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={hourlyActivityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="transactions"
                        stroke="#3b82f6"
                        fill="#3b82f6"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="geographic" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Regional Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {geographicData.map((region, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-blue-600" />
                          <span className="font-medium">{region.region}</span>
                        </div>
                        <Badge
                          className={
                            region.successRate > 97
                              ? 'bg-green-100 text-green-800'
                              : region.successRate > 95
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }
                        >
                          {region.successRate}% Success
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Beneficiaries:</span>
                          <span className="font-medium ml-2">
                            {region.beneficiaries.toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Disbursed:</span>
                          <span className="font-medium ml-2">
                            ${region.disbursed.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Regional Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={geographicData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="region" />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="successRate"
                        fill="#10b981"
                        name="Success Rate %"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-6 text-center">
                <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-900">96.8%</div>
                <p className="text-sm text-green-700">Overall Success Rate</p>
                <p className="text-xs text-green-600 mt-1">Above 95% target</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6 text-center">
                <Zap className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-900">2.3 min</div>
                <p className="text-sm text-blue-700">Avg Processing Time</p>
                <p className="text-xs text-blue-600 mt-1">
                  15% faster than target
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-6 text-center">
                <Globe className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-900">89.6%</div>
                <p className="text-sm text-purple-700">Offramp Success</p>
                <p className="text-xs text-purple-600 mt-1">
                  4 regions covered
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Key Performance Indicators</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Operational Efficiency</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Wallet Creation Success</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: '97.6%' }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">97.6%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Approval Efficiency</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: '95.6%' }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">95.6%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">SMS Delivery Rate</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-yellow-500 h-2 rounded-full"
                            style={{ width: '94.2%' }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">94.2%</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium">Financial Impact</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Cost per Beneficiary</span>
                      <span className="font-medium">$100.60</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Processing Cost</span>
                      <span className="font-medium">$2.45</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Total Project Value</span>
                      <span className="font-medium">$125,750</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

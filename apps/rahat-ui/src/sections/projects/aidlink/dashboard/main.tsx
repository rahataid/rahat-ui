'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import { RealTimeMonitoring } from './real-time-monitoring';
import { FinancialDashboard } from './financial-dashboard';
import { ProjectTransactionOverview } from './project-transaction-overview';
import React from 'react';

const genderData = [
  { name: 'FEMALE', value: 40.0, color: '#10b981' },
  { name: 'OTHER', value: 10.0, color: '#84cc16' },
  { name: 'MALE', value: 36.7, color: '#f59e0b' },
  { name: 'UNKNOWN', value: 13.3, color: '#3b82f6' },
];

const ageData = [
  { name: '0-20', value: 32.1, color: '#10b981' },
  { name: '20-40', value: 53.6, color: '#84cc16' },
  { name: '40-60', value: 3.6, color: '#f59e0b' },
  { name: '60+', value: 10.7, color: '#3b82f6' },
];

const disburseMethodsData = [
  { name: 'Mobile Money', value: 60, color: '#10b981' },
  { name: 'Bank Transfer', value: 40, color: '#84cc16' },
];

// interface ProjectDashboardProps {
//   walletConnected: boolean;
//   setWalletConnected: (connected: boolean) => void;
// }

export default function ProjectDashboard() {
  // const [walletConnected, setWalletConnected] = React.useState(false);
  // const connectWallet = () => {
  //   setWalletConnected(true);
  // };

  return (
    <div className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* <div className="border-b border-gray-200 bg-white shadow-sm px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900">
                  AidLink Dashboard
                </span>
                <p className="text-sm text-gray-600">
                  Humanitarian Aid Distribution Platform
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {!walletConnected ? (
              <Button
                onClick={connectWallet}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              >
                Connect Wallet
              </Button>
            ) : (
              <div className="flex items-center gap-3">
                <Badge className="bg-green-100 text-green-800 px-3 py-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  Wallet Connected
                </Badge>
                <span className="text-sm text-gray-600 font-mono bg-gray-100 px-2 py-1 rounded">
                  0x742d...6C89
                </span>
              </div>
            )}
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full shadow-lg"></div>
          </div>
        </div>
      </div> */}

      <div className="p-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white shadow-sm">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Project Overview
            </TabsTrigger>
            <TabsTrigger
              value="transactions"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Transaction Overview
            </TabsTrigger>
            <TabsTrigger
              value="monitoring"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Real-Time Monitoring
            </TabsTrigger>
            <TabsTrigger
              value="financial"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Financial Management
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Project Overview
              </h1>
              <p className="text-gray-600">
                Comprehensive view of your humanitarian aid distribution project
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardContent className="p-6">
                    <div className="text-blue-600 font-semibold text-lg mb-1">
                      Mar 18, 2025
                    </div>
                    <div className="text-sm text-blue-700">
                      Project Start Date
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <CardContent className="p-6">
                    <div className="text-green-600 font-semibold text-lg mb-1">
                      Test Location
                    </div>
                    <div className="text-sm text-green-700">
                      Project Location
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                  <CardContent className="p-6">
                    <div className="text-purple-600 font-semibold text-lg mb-1">
                      Project Manager
                    </div>
                    <div className="text-sm text-purple-700">Project Lead</div>
                  </CardContent>
                </Card>
              </div>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-xl">Project Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">
                    This humanitarian aid distribution project focuses on
                    providing direct cash assistance to vulnerable populations
                    through blockchain-based disbursement systems. The project
                    leverages USDC stablecoins for transparent, traceable, and
                    efficient aid delivery to beneficiaries in need.
                  </p>
                  <Badge className="mt-3 bg-yellow-100 text-yellow-800">
                    Project Status: Active
                  </Badge>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-center text-xl">
                    Gender Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={genderData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          dataKey="value"
                        >
                          {genderData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <span className="text-3xl font-bold text-gray-900">
                          30
                        </span>
                        <p className="text-sm text-gray-600">Total</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap justify-center gap-4 mt-4">
                    {genderData.map((item) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="text-sm text-gray-600">
                          {item.name}
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {item.value}%
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-center text-xl">
                    Age Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={ageData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          dataKey="value"
                        >
                          {ageData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <span className="text-3xl font-bold text-gray-900">
                          28
                        </span>
                        <p className="text-sm text-gray-600">Avg Age</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap justify-center gap-4 mt-4">
                    {ageData.map((item) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="text-sm text-gray-600">
                          {item.name}
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {item.value}%
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-center text-xl">
                  Disbursement Methods
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={disburseMethodsData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        dataKey="value"
                      >
                        {disburseMethodsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-6 mt-4">
                  {disburseMethodsData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-sm text-gray-600">{item.name}</span>
                      <span className="text-sm font-medium text-gray-900">
                        {item.value}%
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions">
            <ProjectTransactionOverview />
          </TabsContent>

          <TabsContent value="monitoring">
            <RealTimeMonitoring />
          </TabsContent>

          <TabsContent value="financial">
            <FinancialDashboard />
          </TabsContent>

          <TabsContent value="analytics">
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Advanced Analytics
              </h3>
              <p className="text-gray-600">
                Detailed analytics and insights coming soon...
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

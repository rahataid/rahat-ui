'use client';

import React, { useMemo, useCallback } from 'react';
import { Card, CardContent } from '@rahat-ui/shadcn/src/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Heading } from 'apps/rahat-ui/src/common';
import { CheckCircle, Users, Wallet } from 'lucide-react';
import RecentTransaction from './recent-transaction';
import ProjectDetailsCard from './project-details-card';
import {
  useGetDisbursementSafeChart,
  useGetProjectReporting,
} from '@rahat-ui/query';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import { Skeleton } from '@rahat-ui/shadcn/src/components/ui/skeleton';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';

const offRampData = [
  { name: 'Yes', value: 60, color: '#22C55E' }, // green
  { name: 'No', value: 40, color: '#F97316' }, // orange
];

export default function ProjectDashboard() {
  const params = useParams();
  const projectId = params.id as UUID;
  const { data, isPending } = useGetProjectReporting(projectId);
  const { data: disbursementData, isLoading } =
    useGetDisbursementSafeChart(projectId);

  const walletData = useMemo(
    () => [
      {
        name: 'Genosis Wallet',
        value: Number(disbursementData?.safeBalance) || 0,
        color: '#3B82F6',
      },
      {
        name: 'Total Disbursement',
        value: Number(disbursementData?.disbursementAmount) || 0,
        color: '#FACC15',
      },
    ],
    [disbursementData],
  );

  const stats = useMemo(
    () => [
      {
        label: 'Total Beneficiaries',
        value:
          data?.find((item: any) => item.name === 'BENEFICIARY_TOTAL')?.data
            ?.count || '0',
        icon: Users,
        textColor: 'text-blue-600',
        bg: 'from-blue-50 to-blue-100 border-blue-200',
      },
      {
        label: 'Total Disbursed',
        value: `${
          data
            ?.find((item: any) => item.name === 'DISBURSEMENT_TOTAL')
            ?.data?.reduce((sum: number, curr: any) => sum + curr.amount, 0) ||
          0
        } USDC`,
        icon: Wallet,
        textColor: 'text-green-600',
        bg: 'from-green-50 to-green-100 border-green-200',
      },
      {
        label: 'Total Off-ramped',
        value: '0 USDC',
        icon: CheckCircle,
        textColor: 'text-purple-600',
        bg: 'from-purple-50 to-purple-100 border-purple-200',
      },
    ],
    [data],
  );

  return (
    <ScrollArea className="h-[calc(100vh-60px)]">
      <div className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        <div className="p-6">
          <div className="mb-6">
            <Heading
              title="Project Overview"
              description="Overview of your humanitarian aid project"
            />
            <ProjectDetailsCard />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mt-6">
              <div className="col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {isPending
                    ? Array.from({ length: 3 }).map((_, idx) => (
                        <Skeleton
                          key={idx}
                          className="h-24 w-full rounded-xl"
                        />
                      ))
                    : stats.map(
                        ({ label, value, icon: Icon, textColor, bg }) => (
                          <Card
                            key={label}
                            className={`bg-gradient-to-br ${bg} rounded-xl border`}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-1">
                                <p className={`text-sm ${textColor}`}>
                                  {label}
                                </p>
                                <Icon className={`h-6 w-6 ${textColor}`} />
                              </div>
                              <p className={`text-xl font-medium ${textColor}`}>
                                {value}
                              </p>
                            </CardContent>
                          </Card>
                        ),
                      )}
                </div>

                {/*  */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                  {/* Wallet vs Disbursement */}
                  {isLoading ? (
                    <Skeleton className="h-96 rounded-xl" />
                  ) : (
                    <Card className="rounded-xl p-4">
                      <p className="text-lg font-medium">
                        Genosis Wallet vs Total Disbursement
                      </p>

                      <div>
                        <div className="h-64 relative">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={walletData}
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={100}
                                paddingAngle={2}
                                dataKey="value"
                              >
                                {walletData.map((entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                  />
                                ))}
                              </Pie>
                            </PieChart>
                          </ResponsiveContainer>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              <span className="text-3xl font-bold text-gray-900">
                                100
                              </span>
                              <p className="text-sm text-gray-600">Total</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-center justify-center gap-4 mt-4">
                          {walletData.map((item) => (
                            <div
                              key={item.name}
                              className="flex items-center gap-2"
                            >
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: item.color }}
                              />
                              <span className="text-sm text-gray-600">
                                {item.name}
                              </span>
                              <span className="text-sm font-medium text-gray-900">
                                {item.value}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Card>
                  )}

                  {/* Off-ramp Status */}
                  <Card className="rounded-xl p-4">
                    <p className="text-lg font-medium">Off-ramp status</p>

                    <div>
                      <div className="h-64 relative">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={offRampData}
                              cx="50%"
                              cy="50%"
                              innerRadius={70}
                              outerRadius={100}
                              paddingAngle={2}
                              dataKey="value"
                            >
                              {offRampData.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={entry.color}
                                />
                              ))}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <span className="text-3xl font-bold text-gray-900">
                              100
                            </span>
                            <p className="text-sm text-gray-600">Total</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap justify-center gap-4 mt-4">
                        {offRampData.map((item) => (
                          <div
                            key={item.name}
                            className="flex items-center gap-2"
                          >
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="text-sm text-gray-600">
                              {item.name}
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                              {item.value}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              <div className="col-span-1">
                <RecentTransaction />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}

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

import React from 'react';
import { Heading } from 'apps/rahat-ui/src/common';
import {
  Calendar,
  CheckCircle,
  Copy,
  MapPin,
  Shield,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import RecentTransaction from './recent-transaction';

const disburseMethodsData = [
  { name: 'Mobile Money', value: 60, color: '#10b981' },
  { name: 'Bank Transfer', value: 40, color: '#84cc16' },
];

const project = {
  startDate: 'August 19, 2025, 1:38:14 PM',
  location: 'Kanchanpur',
  lead: 'Project Manager',
  status: 'Active',
  description:
    'This humanitarian aid distribution project focuses on providing direct cash assistance to vulnerable populations through blockchain-based disbursement systems. The project leverages USDC stablecoins for transparent, traceable, and efficient aid delivery to beneficiaries in need.',
};

const projectDetails = [
  {
    label: 'Project Start Date',
    value: project.startDate,
    icon: Calendar,
  },
  {
    label: 'Project Location',
    value: project.location,
    icon: MapPin,
  },
  {
    label: 'Project Lead',
    value: project.lead,
    icon: Shield,
  },
  {
    label: 'Project Status',
    value: project.status,
    icon: TrendingUp,
    isStatus: true,
  },
];

const stats = [
  {
    label: 'Total Beneficiaries',
    value: '1,234',
    icon: Users,
    textColor: 'text-blue-600',
    bg: 'from-blue-50 to-blue-100 border-blue-200',
  },
  {
    label: 'Total Disbursed',
    value: '123,456 USDC',
    icon: Wallet,
    textColor: 'text-green-600',
    bg: 'from-green-50 to-green-100 border-green-200',
  },
  {
    label: 'Total Off-ramped',
    value: '1,246 USDC',
    icon: CheckCircle,
    textColor: 'text-purple-600',
    bg: 'from-purple-50 to-purple-100 border-purple-200',
  },
];

const walletData = [
  { name: 'Genosis Wallet', value: 75, color: '#3B82F6' }, // blue
  { name: 'Total Disbursement', value: 25, color: '#FACC15' }, // yellow
];

const offRampData = [
  { name: 'Yes', value: 60, color: '#22C55E' }, // green
  { name: 'No', value: 40, color: '#F97316' }, // orange
];

export default function ProjectDashboard() {
  return (
    <div className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="p-6">
        <div className="mb-6">
          <Heading
            title="Project Overview"
            description="Overview of your humanitarian aid project"
          />

          <Card className="mt-6 rounded-xl p-4">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {projectDetails.map(({ label, value, icon: Icon, isStatus }) => (
                <div key={label} className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
                    <Icon className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className=" text-gray-500">{label}</p>
                    {isStatus ? (
                      <Badge className="mt-1 bg-green-100 text-green-800 ">
                        {value}
                      </Badge>
                    ) : (
                      <p className=" text-gray-600 text-sm font-medium">
                        {value}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-4 text-lg font-medium text-gray-800">
              Project Description
            </p>
            <p className="text-gray-600 leading-relaxed">
              {project.description}
            </p>
          </Card>

          {/*  */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mt-6">
            <div className="col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stats.map(({ label, value, icon: Icon, textColor, bg }) => (
                  <Card
                    key={label}
                    className={`bg-gradient-to-br ${bg} rounded-xl border`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-1">
                        <p className={`text-sm ${textColor}`}>{label}</p>
                        <Icon className={`h-6 w-6 ${textColor}`} />
                      </div>
                      <p className={`text-xl font-medium ${textColor}`}>
                        {value}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/*  */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                {/* Wallet vs Disbursement */}
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
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      {/* Center label */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <span className="text-3xl font-bold text-gray-900">
                            100
                          </span>
                          <p className="text-sm text-gray-600">Total</p>
                        </div>
                      </div>
                    </div>

                    {/* Legend */}
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
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      {/* Center label */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <span className="text-3xl font-bold text-gray-900">
                            100
                          </span>
                          <p className="text-sm text-gray-600">Total</p>
                        </div>
                      </div>
                    </div>

                    {/* Legend */}
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

            {/*  */}
            <div className="col-span-1">
              <RecentTransaction />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

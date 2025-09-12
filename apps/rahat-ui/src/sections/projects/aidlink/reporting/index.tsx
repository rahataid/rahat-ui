import React, { memo, useState } from 'react';
import { Heading } from 'apps/rahat-ui/src/common';
import { Card } from '@rahat-ui/shadcn/src/components/ui/card';
import { DatePicker } from 'apps/rahat-ui/src/components/datePicker';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  FileSpreadsheet,
  Users,
  DollarSign,
  Clock,
  Download,
  FileText,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';

const recentExports = [
  {
    id: 1,
    name: 'Beneficiaries_Report_Aug2025.xlsx',
    date: 'August 19, 2025 at 1:38 PM',
    detail: '1,234 records',
    status: 'success',
  },
  {
    id: 2,
    name: 'Financial_Summary_Aug2025.pdf',
    date: 'August 18, 2025 at 3:22 PM',
    detail: '$123,456 total',
    status: 'failed',
  },
  {
    id: 3,
    name: 'Transaction_History_Aug2025.xlsx',
    date: 'August 17, 2025 at 11:15 AM',
    detail: '2,564 transactions',
    status: 'success',
  },
];

const fileExportData = [
  {
    title: 'Beneficiaries Data',
    desc: 'Complete beneficiary information and demographics',
  },
  {
    title: 'Transaction History',
    desc: 'All blockchain transactions with timestamps',
  },
  {
    title: 'Offramped Transaction',
    desc: 'Cash conversion and off-ramp details',
  },
];

const ReportingPage = () => {
  const handleDateChange = () => {
    console.log('ok');
  };
  return (
    <ScrollArea className="h-[calc(100vh-60px)]">
      <div className="p-4">
        <Heading
          title="Reporting and Analytics"
          description="Export and analyze your humanitarian aid project data"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Top Stats */}
          <Card className="col-span-1 rounded-xl p-4">
            <p className="text-lg font-semibold text-gray-500">
              Total Beneficiaries
            </p>
            <div className="mt-2 flex justify-between items-center">
              <div>
                <p className="text-3xl font-semibold">1,234</p>
                <p className="text-green-600">People helped</p>
              </div>
              <Users size={30} className="text-blue-500" />
            </div>
          </Card>

          <Card className="col-span-1 rounded-xl p-4">
            <p className="text-lg font-semibold text-gray-500">
              Total Disbursement Amount
            </p>
            <div className="mt-2 flex justify-between items-center">
              <div>
                <p className="text-3xl font-semibold">$123,456</p>
                <p className="text-green-600">Successfully distributed</p>
              </div>
              <DollarSign size={30} className="text-green-500" />
            </div>
          </Card>
        </div>

        {/* Generate Report */}
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="p-4 col-span-2 lg:col-span-1 rounded-xl">
            <div className="flex gap-1 items-center">
              <FileText size={20} className="text-blue-500" />
              <p className="text-lg font-semibold">Generate Report</p>
            </div>
            <p className="text-gray-400 text-sm">
              Configure and export your project data
            </p>
            <div className="space-y-4 mt-2">
              <div>
                <h3 className="font-medium text-gray-600">Report Type</h3>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {fileExportData.map((item) => (
                        <SelectItem key={item.title} value={item.title}>
                          {item.title}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 justify-between">
                <div className="flex-1">
                  <p className="font-medium text-gray-600">From Date</p>
                  <DatePicker
                    className="w-full"
                    placeholder="Pick Start Date"
                    handleDateChange={handleDateChange}
                    type="start"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-600">To Date</p>
                  <DatePicker
                    className="w-full"
                    placeholder="Pick End Date"
                    handleDateChange={handleDateChange}
                    type="end"
                  />
                </div>
              </div>
              <div>
                <p className="font-medium text-gray-600">Export Format</p>
                <Button variant="outline" className="w-64" disabled>
                  <FileSpreadsheet className="mr-2 h-4 w-4 text-green-500" />
                  Excel (.xlsx)
                </Button>
              </div>
              <Button className="w-full">Generate & Download Report</Button>
            </div>
          </Card>

          {/* Quick Export */}
          <Card className="p-4 col-span-2 lg:col-span-1 rounded-xl">
            <div className="flex gap-1 items-center">
              <Download size={20} className="text-green-500" />
              <p className="text-lg font-semibold">Quick Export</p>
            </div>
            <p className="text-gray-400 text-sm">
              Pre-configured reports for immediate download
            </p>
            <div className="space-y-4 mt-2">
              {fileExportData.map((item) => (
                <Card
                  key={item.title}
                  className="p-4 rounded-xl flex justify-between gap-4 items-center"
                >
                  <div>
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                  <Button variant="outline" className="rounded-sm" size="sm">
                    <FileSpreadsheet className="mr-1 h-4 w-4" />
                    Excel
                  </Button>
                </Card>
              ))}
            </div>
          </Card>
        </div>

        {/* Recent Exports */}
        <Card className="p-4 mt-4 rounded-xl">
          <div className="flex gap-1 items-center">
            <Clock size={20} className="text-gray-500" />
            <p className="text-lg font-semibold">Recent Exports</p>
          </div>
          <p className="text-gray-400 text-sm">
            Your recently generated reports
          </p>
          <div className="space-y-3 mt-2">
            {recentExports.map((file) => (
              <div
                key={file.id}
                className="flex justify-between items-center border p-3 rounded-xl"
              >
                <div className="flex gap-2 items-center">
                  <FileSpreadsheet
                    size={30}
                    className={`${
                      file?.status?.toLocaleLowerCase() === 'success'
                        ? 'text-green-500'
                        : 'text-red-500'
                    }`}
                  />
                  <div>
                    <p className="font-medium text-gray-600">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Generated on {file.date}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 items-center">
                  <Badge className="">{file.detail}</Badge>
                  <Download
                    size={20}
                    className="hover:cursor-pointer hover:text-gray-600"
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </ScrollArea>
  );
};

export default memo(ReportingPage);

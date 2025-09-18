import React, { memo } from 'react';
import { Heading } from 'apps/rahat-ui/src/common';
import { Card } from '@rahat-ui/shadcn/src/components/ui/card';
import {
  FileSpreadsheet,
  Users,
  DollarSign,
  Clock,
  Download,
} from 'lucide-react';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import GenerateReport from './generate-report';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import {
  PROJECT_SETTINGS_KEYS,
  useProjectSettingsStore,
} from '@rahat-ui/query';
import QuickExportReport from './quick-export-report';

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
    value: 'beneficiaries_data',
    desc: 'Complete beneficiary information and demographics',
  },
  {
    title: 'Transaction History',
    value: 'transaction_history',
    desc: 'All blockchain transactions with timestamps',
  },
  {
    title: 'Offramped Transaction',
    value: 'offramped_transaction',
    desc: 'Cash conversion and off-ramp details',
  },
];

const ReportingPage = () => {
  const projectUUID = useParams().id as UUID;
  const contractSettings = useProjectSettingsStore(
    (state) =>
      state.settings?.[projectUUID]?.[PROJECT_SETTINGS_KEYS.CONTRACT] || null,
  );
  const contractAddress = contractSettings?.c2cproject?.address;

  return (
    <ScrollArea className="h-[calc(100vh-60px)]">
      <div className="p-4 relative">
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
          <GenerateReport
            projectUUID={projectUUID}
            fileExportData={fileExportData}
            contractAddress={contractAddress}
          />

          {/* Quick Export */}
          <Card className="col-span-2 lg:col-span-1 p-4 rounded-xl">
            <QuickExportReport
              fileExportData={fileExportData}
              projectUUID={projectUUID}
              contractAddress={contractAddress}
            />
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

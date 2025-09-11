import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Card } from '@rahat-ui/shadcn/src/components/ui/card';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  BadgeCheck,
  CalendarIcon,
  CheckCircleIcon,
  CopyIcon,
  UsersIcon,
} from 'lucide-react';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import {
  useGetDisbursement,
  useGetDisbursementApprovals,
  useGetDisbursementTransactions,
} from '@rahat-ui/query';
import { Heading } from 'apps/rahat-ui/src/common';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import React from 'react';
import { capitalizeFirstLetter } from 'apps/rahat-ui/src/utils';
import { dateFormat } from 'apps/rahat-ui/src/utils/dateFormate';

interface Transaction {
  id: string;
  amount: string;
  from: string;
  to: string;
  date: string;
  status: 'Completed' | 'Pending';
}

interface Approval {
  id: string;
  name: string;
  submission: string;
  status: 'Pending' | 'Approved';
}

const transactions: Transaction[] = [
  {
    id: '1',
    amount: '$1,000',
    from: '0x3ad4...f54',
    to: '0x3ad4...f54',
    date: 'August 19, 2025, 1:38:14 PM',
    status: 'Completed',
  },
  {
    id: '2',
    amount: '$1,000',
    from: '0x3ad4...f54',
    to: '0x3ad4...f54',
    date: 'August 19, 2025, 1:38:14 PM',
    status: 'Completed',
  },
  {
    id: '3',
    amount: '$1,000',
    from: '0x3ad4...f54',
    to: '0x3ad4...f54',
    date: 'August 19, 2025, 1:38:14 PM',
    status: 'Completed',
  },
];

const approvals: Approval[] = [
  {
    id: '1',
    name: 'Aadarsha Lamichhane',
    submission: 'August 19, 2025, 1:38:14 PM',
    status: 'Pending',
  },
  {
    id: '2',
    name: 'Aadarsha Lamichhane',
    submission: 'August 19, 2025, 1:38:14 PM',
    status: 'Pending',
  },
  {
    id: '3',
    name: 'Aadarsha Lamichhane',
    submission: 'August 19, 2025, 1:38:14 PM',
    status: 'Pending',
  },
  {
    id: '4',
    name: 'Aadarsha Lamichhane',
    submission: 'August 19, 2025, 1:38:14 PM',
    status: 'Pending',
  },
  {
    id: '5',
    name: 'Aadarsha Lamichhane',
    submission: 'August 19, 2025, 1:38:14 PM',
    status: 'Pending',
  },
];

export default function DisbursementHistoryDetail() {
  const { id: projectUUID, disbursementId } = useParams() as {
    id: UUID;
    disbursementId: UUID;
  };

  const { data: disbursement } = useGetDisbursement(
    projectUUID,
    disbursementId,
  );

  const { data: transactionss } = useGetDisbursementTransactions({
    projectUUID: projectUUID,
    disbursementUUID: disbursementId,
    page: 1,
    perPage: 10,
  });

  const { data: approvalss } = useGetDisbursementApprovals({
    projectUUID: projectUUID,
    disbursementUUID: disbursementId,
    page: 1,
    perPage: 10,
    transactionHash: disbursement?.transactionHash,
  });

  console.log({
    disbursement,
    transactionss,
    approvalss,
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const colorCardData = React.useMemo(
    () => [
      {
        icon: (
          <UsersIcon className="text-blue-600" size={20} strokeWidth={2.5} />
        ),
        label: 'Total Beneficiaries',
        value: disbursement?._count?.DisbursementBeneficiary || 'N/A',
        color: 'blue',
      },
      {
        icon: (
          <CheckCircleIcon
            className="text-green-600"
            size={20}
            strokeWidth={2.5}
          />
        ),
        label: 'Total Disbursed Amount',
        value: disbursement?.amount || 'N/A',
        color: 'green',
      },
      {
        icon: (
          <UsersIcon className="text-teal-600" size={20} strokeWidth={2.5} />
        ),
        label: 'Disbursement Type',
        value: capitalizeFirstLetter(disbursement?.type) || 'N/A',
        color: 'teal',
      },
    ],
    [disbursement],
  );

  return (
    <div className="p-4 bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Heading
          title="Disbursement History"
          description="List of all your disbursement history"
        />
        <div className="px-4 py-2 rounded-full flex items-center gap-2 bg-blue-50">
          <span className="text-[10px]/4 tracking-widest font-semibold text-primary">
            SAFEWALLET
          </span>
          <BadgeCheck className="w-4 h-4 fill-primary text-white" />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="rounded-sm bg-card p-4 border">
          <h1 className="text-sm/6 font-medium text-gray-800 mb-2">Status</h1>
          <Badge variant="secondary">
            {capitalizeFirstLetter(disbursement?.status) || 'N/A'}
          </Badge>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <CalendarIcon className="w-4 h-4" />
            <span>{dateFormat(disbursement?.updatedAt)}</span>
          </div>
        </div>

        {colorCardData?.map((d) => (
          <div
            key={d.label}
            className={`p-4 rounded-sm border border-${d.color}-200 bg-${d.color}-50/50`}
          >
            <div className="flex items-center justify-between mb-6">
              <p className={`text-sm text-${d.color}-600 font-medium`}>
                {d.label}
              </p>
              {d.icon}
            </div>
            <div className={`text-xl font-semibold text-${d.color}-600`}>
              {d.value}
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Transactions Section */}
        <div className="p-4 border rounded-sm bg-card ">
          <Heading
            title="TRANSACTIONS"
            titleStyle="tracking-wider"
            description="List of all transactions made"
          />
          <ScrollArea className="h-[calc(100vh-500px)]">
            <div className="space-y-4">
              {transactions?.map((transaction) => (
                <Card key={transaction.id} className="p-4 rounded-sm">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="text-l font-medium">
                        {transaction.amount}
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <span>From:</span>
                          <span className="font-mono">{transaction.from}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0"
                            onClick={() => copyToClipboard(transaction.from)}
                          >
                            <CopyIcon className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>To:</span>
                          <span className="font-mono">{transaction.to}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0"
                            onClick={() => copyToClipboard(transaction.to)}
                          >
                            <CopyIcon className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {transaction.date}
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800 hover:bg-green-100"
                    >
                      {transaction.status}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Approvals Section */}
        <div className="p-4 border rounded-sm bg-card ">
          <Heading
            title="APPROVALS"
            titleStyle="tracking-wider"
            description="Approved: 8 Required: 10"
          />
          <ScrollArea className="h-[calc(100vh-500px)]">
            <div className="space-y-4">
              {approvals?.map((approval) => (
                <Card key={approval.id} className="p-4 rounded-sm">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="font-medium">{approval.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Submission: {approval.submission}
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="border-orange-200 text-orange-700 bg-orange-50"
                    >
                      {approval.status}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}

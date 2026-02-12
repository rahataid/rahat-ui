import { useRouter, useParams } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Eye } from 'lucide-react';

import { isCompleteBgStatus } from 'apps/rahat-ui/src/utils/get-status-bg';
import { dateFormat } from 'apps/rahat-ui/src/utils/dateFormate';

import { TruncatedCell } from '../../stakeholders/component/TruncatedCell';
interface PayoutTransactionLogRow {
  groupName: string;
  totalBeneficiaries: number;
  totalTokenAssigned: number;
  totalSuccessAmount: number;
  payoutType: string;
  payoutMode: string;
  status: string;
  timeStamp: string;
  uuid: string;
}

export default function usePayoutTransactionLogTableColumn() {
  const { id: projectID } = useParams();
  const router = useRouter();

  const handleEyeClick = (beneficiaryGroupDetailsId: any) => {
    router.push(
      `/projects/aa/${projectID}/payout/details/${beneficiaryGroupDetailsId}`,
    );
  };

  const columns: ColumnDef<PayoutTransactionLogRow>[] = [
    {
      accessorKey: 'groupName',
      header: 'Group Name',
      cell: ({ row }) => (
        <TruncatedCell text={row.getValue('groupName')} maxLength={15} />
      ),
    },
    {
      accessorKey: 'totalBeneficiaries',
      header: 'Total Beneficiaries',
      cell: ({ row }) => (
        <div className="w-5">{row.getValue('totalBeneficiaries')}</div>
      ),
    },

    {
      accessorKey: 'totalTokenAssigned',
      header: 'Total Amount Disbursed',
      cell: ({ row }) => (
        <div className="">Rs. {row.original.totalSuccessAmount}</div>
      ),
    },
    {
      accessorKey: 'amountperBenef',
      header: 'Amount per beneficiary',
      cell: ({ row }) => (
        <div>
          Rs. {''}
          {(row.original.totalTokenAssigned * 1) /
            row.original.totalBeneficiaries}
        </div>
      ),
    },
    {
      accessorKey: 'payoutType',
      header: 'Payout Type',
      cell: ({ row }) => (
        <div>
          {row.getValue('payoutType') === 'VENDOR'
            ? 'CVA'
            : row.getValue('payoutType')}
        </div>
      ),
    },
    {
      accessorKey: 'payoutMode',
      header: 'Payout Method',
      cell: ({ row }) => (
        <TruncatedCell
          text={row.getValue('payoutMode')}
          maxLength={30}
          className="break-words line-clamp-2"
        />
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row?.original?.status;
        return (
          <Badge
            className={`rounded-xl capitalize ${isCompleteBgStatus(status)}`}
          >
            {status
              .toLowerCase()
              .replace(/_/g, ' ')
              .replace(/^./, (char) => char.toUpperCase())}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'timeStamp',
      header: 'Timestamp',
      cell: ({ row }) => {
        const time = row.getValue('timeStamp') as string;
        return (
          <div className="flex gap-1 text-[10px]">
            <TruncatedCell text={dateFormat(time)} maxLength={30} />
          </div>
        );
      },
    },

    {
      id: 'actions',
      header: 'Actions',
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <div className="flex items-center space-x-2">
            <Eye
              className="hover:text-primary cursor-pointer"
              size={20}
              strokeWidth={1.5}
              onClick={() => handleEyeClick(row?.original?.uuid)}
            />
          </div>
        );
      },
    },
  ];

  return columns;
}

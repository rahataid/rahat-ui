import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { RotateCcwIcon, TriangleAlertIcon } from 'lucide-react';
import { useTriggerForPayoutFailed } from '@rahat-ui/query';
import { useCallback } from 'react';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
function getTransactionStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'bg-green-200 text-green-800';
    case 'pending':
      return 'bg-blue-200 text-blue-800';
    case 'rejected':
      return 'bg-red-200 text-red-800';
    default:
      return 'bg-gray-200 text-gray-800';
  }
}

export default function useBeneficiaryGroupDetailsLogColumns() {
  const { id } = useParams();
  const triggerForPayoutFailed = useTriggerForPayoutFailed();

  const handleTriggerPayoutFailed = useCallback(
    async (uuid: string) => {
      triggerForPayoutFailed.mutateAsync({
        projectUUID: id as UUID,
        payload: {
          beneficiaryRedeemUuid: uuid,
        },
      });
    },
    [triggerForPayoutFailed],
  );

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'beneficiaryWalletAddress',
      header: 'Beneficiary Wallet Address',
      cell: ({ row }) => (
        <div className="truncate w-48">
          {row.getValue('beneficiaryWalletAddress')}
        </div>
      ),
    },
    {
      accessorKey: 'transactionWalletId',
      header: 'Transaction Wallet ID',
      cell: ({ row }) => <div>{row.getValue('transactionWalletId')}</div>,
    },
    {
      accessorKey: 'bankTransactionId',
      header: 'Bank Transaction ID',
      cell: ({ row }) => <div>{row.getValue('bankTransactionId')}</div>,
    },

    {
      accessorKey: 'transactionType',
      header: 'Transaction Type',
      cell: ({ row }) => {
        const type = row?.original?.transactionType;
        return (
          <Badge
            className={`rounded-xl capitalize ${getTransactionStatusColor(
              type,
            )}`}
          >
            {type
              .toLowerCase()
              .split('_')
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ')}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'tokensAssigned',
      header: 'Tokens Assigned',
      cell: ({ row }) => <div>{row.getValue('tokensAssigned')}</div>,
    },
    {
      accessorKey: 'fspId',
      header: 'FSP',
      cell: ({ row }) => <div>{row.getValue('fspId')}</div>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row?.original?.status;
        return (
          <Badge
            className={`rounded-xl capitalize ${getTransactionStatusColor(
              status,
            )}`}
          >
            {status
              .toLowerCase()
              .split('_')
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ')}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Timestamp',
      cell: ({ row }) => (
        <div className="flex items-center gap-4">
          {new Date(row.getValue('createdAt')).toLocaleString()}{' '}
          {row.original?.isCompleted === false && (
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger>
                  <RotateCcwIcon
                    size={16}
                    strokeWidth={1.5}
                    color="red"
                    onClick={() => handleTriggerPayoutFailed(row.original.uuid)}
                  />
                </TooltipTrigger>
                <TooltipContent side="left" className="rounded-sm w-auto">
                  <div className="flex space-x-2 items-center">
                    <TriangleAlertIcon
                      size={16}
                      strokeWidth={1.5}
                      color="red"
                    />
                    <span className="font-semibold text-sm/6">
                      Transaction Failed
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm mt-1">
                    {row.original?.info?.error ?? 'Something went wrong!!'}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      ),
    },
  ];

  return columns;
}

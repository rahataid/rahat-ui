import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import {
  Copy,
  CopyCheck,
  Eye,
  RotateCcwIcon,
  TriangleAlertIcon,
} from 'lucide-react';
import {
  usePaymentProviders,
  useTriggerForOnePayoutFailed,
} from '@rahat-ui/query';
import { useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { UUID } from 'crypto';
import useCopy from 'apps/rahat-ui/src/hooks/useCopy';
import { transactionBgStatus } from 'apps/rahat-ui/src/utils/get-status-bg';
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
  const router = useRouter();
  const triggerForPayoutFailed = useTriggerForOnePayoutFailed();
  const fspName = usePaymentProviders({ projectUUID: id as UUID });
  const { clickToCopy, copyAction } = useCopy();
  const handleTriggerSinglePayoutFailed = useCallback(
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
  const handleEyeClick = (uuid: any) => {
    router.push(`/projects/aa/${id}/payout/transaction-details/${uuid}`);
  };
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'beneficiaryWalletAddress',
      header: 'Beneficiary Wallet Address',
      cell: ({ row }) => (
        <div className="truncate w-24">
          {row.getValue('beneficiaryWalletAddress')}
        </div>
      ),
    },
    {
      accessorKey: 'transactionWalletId',
      header: 'Transaction Wallet ID',
      cell: ({ row }) => {
        return (
          <div
            onClick={() =>
              clickToCopy(
                row?.original?.info?.offrampWalletAddress,
                row?.original?.uuid,
              )
            }
            className="flex items-center gap-2"
          >
            <p className="truncate w-20 ">
              {row?.original?.info?.offrampWalletAddress || 'N/A'}
            </p>
            {copyAction === row?.original?.uuid ? (
              <CopyCheck size={15} strokeWidth={1.5} />
            ) : (
              <Copy
                className="text-slate-500 cursor-pointer"
                size={15}
                strokeWidth={1.5}
              />
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'txHash',
      header: 'Transaction Hash',
      cell: ({ row }) => {
        return (
          <div
            onClick={() =>
              clickToCopy(row?.original?.txHash, row?.original?.id)
            }
            className="flex items-center gap-2"
          >
            <p className="truncate w-20 ">{row?.original?.txHash || 'N/A'}</p>
            {copyAction === row?.original?.id ? (
              <CopyCheck size={15} strokeWidth={1.5} />
            ) : (
              <Copy
                className="text-slate-500 cursor-pointer"
                size={15}
                strokeWidth={1.5}
              />
            )}
          </div>
        );
      },
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
      cell: ({ row }) => <div>{row.original?.amount}</div>,
    },
    {
      accessorKey: 'fspId',
      header: 'FSP',
      cell: ({ row }) => (
        <div>
          {fspName.data?.find((a) => a.id === row.original.fspId)?.name}
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row?.original?.status;
        return (
          <Badge className={`rounded-xl w-auto ${transactionBgStatus(status)}`}>
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
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild className="hover:cursor-pointer py-0">
                  <RotateCcwIcon
                    className="w-6 h-6 xl:w-4 xl:h-4  text-red-500"
                    strokeWidth={2.5}
                    onClick={() =>
                      handleTriggerSinglePayoutFailed(row.original.uuid)
                    }
                  />
                </TooltipTrigger>
                <TooltipContent
                  side="left"
                  className="w-96 rounded-sm p-4 max-h-60 overflow-auto"
                >
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
                  <p className="text-gray-500 text-sm mt-1 break-words">
                    {row.original?.info?.error ?? 'Something went wrong!!'}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      ),
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

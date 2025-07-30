'use client';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import {
  CheckIcon,
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
import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { UUID } from 'crypto';
import useCopy from 'apps/rahat-ui/src/hooks/useCopy';
import {
  PayoutTransactionStatus,
  transactionBgStatus,
} from 'apps/rahat-ui/src/utils/get-status-bg';
import { intlFormatDate } from 'apps/rahat-ui/src/utils';
import { AARoles, RoleAuth } from '@rahat-ui/auth';
import { ONE_TOKEN_VALUE } from 'apps/rahat-ui/src/constants/aa.constants';
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

const editableStatuses = [
  PayoutTransactionStatus.FIAT_TRANSACTION_INITIATED,
  PayoutTransactionStatus.PENDING,
  PayoutTransactionStatus.TOKEN_TRANSACTION_INITIATED,
] as const;
export default function useBeneficiaryGroupDetailsLogColumns(
  payoutType: string,
) {
  const { id, detailID } = useParams();
  const router = useRouter();
  const triggerForPayoutFailed = useTriggerForOnePayoutFailed();
  const [pendingUuid, setPendingUuid] = useState<string | null>(null);

  const fspName = usePaymentProviders({ projectUUID: id as UUID });
  const { clickToCopy, copyAction } = useCopy();

  const handleTriggerSinglePayoutFailed = useCallback(
    async (uuid: string) => {
      setPendingUuid(uuid); // Start tracking this row
      try {
        await triggerForPayoutFailed.mutateAsync({
          projectUUID: id as UUID,
          payload: {
            beneficiaryRedeemUuid: uuid,
          },
        });
        setPendingUuid(null); // Clear after it's done
      } catch (error) {
        console.error(error);
      }
    },
    [triggerForPayoutFailed, id],
  );

  const handleEyeClick = (uuid: any) => {
    router.push(
      `/projects/aa/${id}/payout/transaction-details/${uuid}?groupId=${detailID}`,
    );
  };
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'beneficiaryWalletAddress',
      header: 'Beneficiary Wallet Address',
      cell: ({ row }) => (
        <div
          onClick={() =>
            clickToCopy(
              row?.original?.beneficiaryWalletAddress,
              row?.original?.id,
            )
          }
          className="flex items-center gap-2"
        >
          <p className="truncate w-20 ">
            {row?.original?.beneficiaryWalletAddress || 'N/A'}
          </p>
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
          <div>
            {row?.original?.txHash ? (
              <a
                href={`https://stellar.expert/explorer/testnet/tx/${row?.original?.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base text-blue-500 hover:underline cursor-pointer"
              >
                <p className="truncate w-20">{row?.original?.txHash}</p>
              </a>
            ) : (
              'N/A'
            )}
          </div>
        );
      },
    },

    {
      accessorKey: 'tokensAssigned',
      header: 'Amount Disbursed',
      cell: ({ row }) => (
        <div>Rs. {row.original?.amount * ONE_TOKEN_VALUE}</div>
      ),
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
      accessorKey: 'status',
      header: 'Payout Status',
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
        <div className="flex  flex-col text-[10px]">
          <span>{intlFormatDate(row?.original?.createdAt)}</span>

          {row?.original?.status.endsWith('COMPLETED') && (
            <span>{intlFormatDate(row.original?.updatedAt)}</span>
          )}
        </div>
      ),
    },

    {
      id: 'actions',
      header: 'Actions',
      enableHiding: false,
      cell: ({ row }) => {
        console.log('row', row);
        return (
          <div className="flex items-center space-x-2">
            {row.original?.isCompleted === false &&
              !editableStatuses.includes(row.original.status) && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger
                      asChild
                      className="hover:cursor-pointer py-0"
                    >
                      <TriangleAlertIcon
                        className="w-6 h-6 xl:w-4 xl:h-4  text-red-500"
                        strokeWidth={2.5}
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

            {row.original?.isCompleted === false &&
              payoutType === 'FSP' &&
              !editableStatuses.includes(row.original.status) &&
              (pendingUuid === row.original.uuid ? (
                <CheckIcon
                  className="w-6 h-6 xl:w-4 xl:h-4 text-green-500"
                  strokeWidth={2.5}
                />
              ) : (
                <RoleAuth roles={[AARoles.ADMIN]} hasContent={false}>
                  <RotateCcwIcon
                    className="w-6 h-6 xl:w-4 xl:h-4 text-blue-400 cursor-pointer"
                    strokeWidth={2.5}
                    onClick={() =>
                      handleTriggerSinglePayoutFailed(row.original.uuid)
                    }
                  />
                </RoleAuth>
              ))}

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

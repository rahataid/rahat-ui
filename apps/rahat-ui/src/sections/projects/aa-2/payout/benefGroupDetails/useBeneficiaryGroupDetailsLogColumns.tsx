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
  PROJECT_SETTINGS_KEYS,
  useProjectSettingsStore,
  useTriggerForOnePayoutFailed,
} from '@rahat-ui/query';
import { useCallback, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { UUID } from 'crypto';
import useCopy from 'apps/rahat-ui/src/hooks/useCopy';
import {
  PayoutTransactionStatus,
  transactionBgStatus,
} from 'apps/rahat-ui/src/utils/get-status-bg';
import { getExplorerUrl, intlFormatDate } from 'apps/rahat-ui/src/utils';
import { AARoles, RoleAuth } from '@rahat-ui/auth';
import { ONE_TOKEN_VALUE } from 'apps/rahat-ui/src/constants/aa.constants';
import { TruncatedCell } from '../../stakeholders/component/TruncatedCell';
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

const editableStatuses: PayoutTransactionStatus[] = [
  PayoutTransactionStatus.FIAT_TRANSACTION_INITIATED,
  PayoutTransactionStatus.PENDING,
  PayoutTransactionStatus.TOKEN_TRANSACTION_INITIATED,
];

type BeneficiaryGroupDetailsLogRow = {
  id: string;
  beneficiaryWalletAddress: string;
  uuid: UUID;
  txHash?: string;
  amount?: number;
  status: PayoutTransactionStatus;
  transactionType?: string;
  createdAt?: string;
  updatedAt?: string;
  payout?: {
    type?: string;
  };
  info?: {
    offrampWalletAddress?: string;
    error?: string;
  };
  isCompleted?: boolean;
};

export default function useBeneficiaryGroupDetailsLogColumns(
  payoutType: string,
) {
  const { id, detailID } = useParams();
  const router = useRouter();
  const triggerForPayoutFailed = useTriggerForOnePayoutFailed();
  const [pendingUuid, setPendingUuid] = useState<UUID | null>(null);
  const searchParams = useSearchParams();
  const navigation = searchParams.get('from');
  const { clickToCopy, copyAction } = useCopy();
  const { settings } = useProjectSettingsStore((s) => ({
    settings: s.settings,
  }));
  const handleTriggerSinglePayoutFailed = useCallback(
    async (uuid: UUID) => {
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

  const handleEyeClick = (uuid: UUID) => {
    router.push(
      `/projects/aa/${id}/payout/transaction-details/${uuid}?groupId=${detailID}&${
        navigation ? `from=${navigation}` : ''
      }`,
    );
  };
  const columns: ColumnDef<BeneficiaryGroupDetailsLogRow>[] = [
    {
      accessorKey: 'beneficiaryWalletAddress',
      header: 'Beneficiary Wallet Address',
      cell: ({ row }) => (
        <div
          // onClick={() =>
          //   clickToCopy(
          //     row?.original?.beneficiaryWalletAddress,
          //     row?.original?.id,
          //   )
          // }
          className="flex items-center gap-2"
        >
          <TruncatedCell
            text={row?.original?.beneficiaryWalletAddress || 'N/A'}
            maxLength={10}
          />
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger
                className="flex items-center gap-3 cursor-pointer"
                onClick={() =>
                  clickToCopy(
                    row?.original?.beneficiaryWalletAddress || '',
                    row?.original?.id,
                  )
                }
              >
                {copyAction === row?.original?.id ? (
                  <CopyCheck size={15} strokeWidth={1.5} />
                ) : (
                  <Copy
                    className="text-slate-500"
                    size={15}
                    strokeWidth={1.5}
                  />
                )}
              </TooltipTrigger>
              <TooltipContent className=" rounded-sm" side="bottom">
                <p className="text-xs font-medium">
                  {copyAction === row?.original?.id
                    ? 'copied'
                    : 'click to copy'}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {/* {copyAction === row?.original?.id ? (
            <CopyCheck size={15} strokeWidth={1.5} />
          ) : (
            <Copy
              className="text-slate-500 cursor-pointer"
              size={15}
              strokeWidth={1.5}
            />
          )} */}
        </div>
      ),
    },
    {
      accessorKey: 'transactionWalletId',
      header: 'Transaction Wallet ID',
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <TruncatedCell
              text={row?.original?.info?.offrampWalletAddress || 'N/A'}
              maxLength={10}
            />
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() =>
                    clickToCopy(
                      row?.original?.info?.offrampWalletAddress || '',
                      row?.original?.uuid,
                    )
                  }
                >
                  {copyAction === row?.original?.uuid ? (
                    <CopyCheck size={15} strokeWidth={1.5} />
                  ) : (
                    <Copy
                      className="text-slate-500"
                      size={15}
                      strokeWidth={1.5}
                    />
                  )}
                </TooltipTrigger>
                <TooltipContent className=" rounded-sm" side="bottom">
                  <p className="text-xs font-medium">
                    {copyAction === row?.original?.uuid
                      ? 'copied'
                      : 'click to copy'}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      },
    },
    {
      accessorKey: 'txHash',
      header: 'Transaction Hash',
      cell: ({ row }) => {
        const txUrl = getExplorerUrl({
          chainSettings:
            settings?.[id as UUID]?.[PROJECT_SETTINGS_KEYS.CHAIN_SETTINGS],
          target: 'tx',
          value: row?.original?.txHash || '',
        });
        return (
          <div>
            {row?.original?.txHash ? (
              <a
                href={txUrl ? txUrl : '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base text-blue-500 hover:underline cursor-pointer"
              >
                <TruncatedCell text={row?.original?.txHash} maxLength={10} />
              </a>
            ) : (
              'N/A'
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'amount',
      header: 'Amount Disbursed',
      cell: ({ row }) => {
        if (payoutType === 'FSP')
          return (
            <div>
              <TruncatedCell
                text={`Rs. ${
                  row?.original?.status === 'FIAT_TRANSACTION_COMPLETED' ||
                  row.original?.status === 'COMPLETED'
                    ? row.original?.amount! * ONE_TOKEN_VALUE
                    : 0
                }`}
                maxLength={15}
              />
            </div>
          );
        else {
          const status = row.original?.status;
          return status === 'COMPLETED' ? (
            row.original?.amount ? (
              <TruncatedCell
                text={`Rs. ${row.original.amount * ONE_TOKEN_VALUE}`}
                maxLength={15}
              />
            ) : (
              'Rs. 0'
            )
          ) : (
            'Rs. 0'
          );
        }
      },
    },
    {
      accessorKey: 'transactionType',
      header: 'Transaction Type',
      cell: ({ row }) => {
        const type = row?.original?.transactionType ?? 'unknown';
        return (
          <Badge
            className={`rounded-xl capitalize ${getTransactionStatusColor(
              type,
            )}`}
          >
            <TruncatedCell
              text={type
                .toLowerCase()
                .split('_')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')}
              maxLength={20}
            />
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
            <TruncatedCell
              text={status
                .toLowerCase()
                .split('_')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')}
              maxLength={20}
            />
          </Badge>
        );
      },
    },
    {
      accessorKey: 'updatedAt',
      header: 'Timestamp',
      cell: ({ row }) => {
        const { createdAt, updatedAt, payout, status } = row?.original || {};

        if (payout?.type === 'FSP') {
          return (
            <div className="flex flex-col text-[10px]">
              <span>
                <TruncatedCell
                  text={intlFormatDate(createdAt)}
                  maxLength={25}
                />
              </span>
              {status?.includes('COMPLETED') && (
                <span>
                  <TruncatedCell
                    text={intlFormatDate(updatedAt)}
                    maxLength={25}
                  />
                </span>
              )}
            </div>
          );
        } else {
          return (
            <div className="flex flex-col text-[10px]">
              {status === 'COMPLETED' ? (
                <span>
                  <TruncatedCell
                    text={intlFormatDate(updatedAt)}
                    maxLength={25}
                  />
                </span>
              ) : (
                <span>
                  <TruncatedCell
                    text={intlFormatDate(createdAt)}
                    maxLength={25}
                  />
                </span>
              )}
            </div>
          );
        }
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      enableHiding: false,
      cell: ({ row }) => {
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
                <RoleAuth
                  roles={[AARoles.ADMIN, AARoles.Municipality]}
                  hasContent={false}
                >
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

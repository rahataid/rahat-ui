'use client';
import { useTranslations, useLocale } from 'next-intl';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/i18n/number';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { CheckIcon, Eye, RotateCcwIcon, TriangleAlertIcon } from 'lucide-react';
import TooltipComponent from 'apps/rahat-ui/src/components/tooltip';
import {
  PROJECT_SETTINGS_KEYS,
  useProjectSettingsStore,
  useTriggerForOnePayoutFailed,
} from '@rahat-ui/query';
import { useCallback, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { UUID } from 'crypto';
import {
  PayoutTransactionStatus,
  transactionBgStatus,
} from 'apps/rahat-ui/src/utils/get-status-bg';
import { getExplorerUrl, intlFormatDate } from 'apps/rahat-ui/src/utils';
import { AARoles, RoleAuth } from '@rahat-ui/auth';
import { ONE_TOKEN_VALUE } from 'apps/rahat-ui/src/constants/aa.constants';
import { TruncatedCell } from 'apps/rahat-ui/src/sections/projects/aa-2/stakeholders/component/TruncatedCell';
import CopyTooltip from 'apps/rahat-ui/src/common/copyTooltip';
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
  const t = useTranslations('AA_PROJECT');
  const tv = useTranslations('AA_PROJECT_WITH_CASH_TRACKER');
  const tg = useTranslations('GLOBAL');
  const locale = useLocale();
  const formatNum = useNumberFormat();
  const { id, detailID } = useParams();
  const router = useRouter();
  const triggerForPayoutFailed = useTriggerForOnePayoutFailed();
  const [pendingUuid, setPendingUuid] = useState<UUID | null>(null);
  const searchParams = useSearchParams();
  const navigation = searchParams.get('from');
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
      header: tv('BENEFICIARY_WALLET_ADDRESS'),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <TruncatedCell
            text={row?.original?.beneficiaryWalletAddress || tg('N_A')}
            maxLength={10}
          />

          <CopyTooltip
            value={row?.original?.beneficiaryWalletAddress || ''}
            uniqueKey={row?.original?.id}
          />
        </div>
      ),
    },
    {
      accessorKey: 'transactionWalletId',
      header: tv('TRANSACTION_WALLET_ID'),
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <TruncatedCell
              text={row?.original?.info?.offrampWalletAddress || tg('N_A')}
              maxLength={10}
            />
            <CopyTooltip
              value={row?.original?.info?.offrampWalletAddress || ''}
              uniqueKey={row?.original?.uuid}
            />
          </div>
        );
      },
    },
    {
      accessorKey: 'txHash',
      header: tv('TRANSACTION_HASH'),
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
              tg('N_A')
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'amount',
      header: tv('AMOUNT_DISBURSED'),
      cell: ({ row }) => {
        const amount =
          row?.original?.status === 'FIAT_TRANSACTION_COMPLETED' ||
          row.original?.status === 'COMPLETED'
            ? row.original?.amount! * ONE_TOKEN_VALUE
            : 0;

        if (payoutType === 'FSP')
          return (
            <div>
              <TruncatedCell text={`${t('RS')} ${formatNum(amount)}`} maxLength={15} />
            </div>
          );
        else {
          const status = row.original?.status;
          const amount = row.original?.amount! * ONE_TOKEN_VALUE;

          return status === 'COMPLETED' ? (
            row.original?.amount ? (
              <TruncatedCell text={`${t('RS')} ${formatNum(amount)}`} maxLength={15} />
            ) : (
              `${t('RS')} ${formatNum(0)}`
            )
          ) : (
            `${t('RS')} ${formatNum(0)}`
          );
        }
      },
    },
    {
      accessorKey: 'transactionType',
      header: tv('TRANSACTION_TYPE'),
      cell: ({ row }) => {
        const type = row?.original?.transactionType ?? 'unknown';
        const prettified = type
          .toLowerCase()
          .split('_')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        return (
          <Badge
            className={`rounded-xl capitalize ${getTransactionStatusColor(
              type,
            )}`}
          >
            <TruncatedCell
              text={prettified}
              maxLength={15}
            />
          </Badge>
        );
      },
    },
    {
      accessorKey: 'status',
      header: tv('PAYOUT_STATUS'),
      cell: ({ row }) => {
        const status = row?.original?.status;
        return (
          <Badge className={`rounded-xl w-auto ${transactionBgStatus(status)}`}>
            <TruncatedCell
              text={status ? tg(status) : ''}
              className="text-[10px]"
            />
          </Badge>
        );
      },
    },
    {
      accessorKey: 'updatedAt',
      header: tg('TIMESTAMP'),
      cell: ({ row }) => {
        const { createdAt, updatedAt, payout, status } = row?.original || {};

        if (payout?.type === 'FSP') {
          return (
            <div className="flex flex-col text-[10px]">
              <span>
                <TruncatedCell
                  text={intlFormatDate(createdAt, locale)}
                  maxLength={25}
                />
              </span>
              {status?.includes('COMPLETED') && (
                <span>
                  <TruncatedCell
                    text={intlFormatDate(updatedAt, locale)}
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
                    text={intlFormatDate(updatedAt, locale)}
                    maxLength={25}
                  />
                </span>
              ) : (
                <span>
                  <TruncatedCell
                    text={intlFormatDate(createdAt, locale)}
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
      header: tg('ACTIONS'),
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
                          {tv('TRANSACTION_FAILED')}
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm mt-1 break-words">
                        {row.original?.info?.error ?? t('SOMETHING_WENT_WRONG')}
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
                  <TooltipComponent
                    Icon={RotateCcwIcon}
                    tip={tg('UPDATE')}
                    iconStyle="w-6 h-6 xl:w-4 xl:h-4 text-blue-400 cursor-pointer"
                    handleOnClick={() =>
                      handleTriggerSinglePayoutFailed(row.original.uuid)
                    }
                  />
                </RoleAuth>
              ))}

            <TooltipComponent
              Icon={Eye}
                    tip={tg('VIEW_DETAILS')}
              iconStyle="hover:text-primary cursor-pointer"
              handleOnClick={() => handleEyeClick(row?.original?.uuid)}
            />
          </div>
        );
      },
    },
  ];

  return columns;
}

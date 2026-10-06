import { useTranslations } from 'next-intl';
import { useRouter, useParams } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Eye, TriangleAlertIcon } from 'lucide-react';
import TooltipComponent from 'apps/rahat-ui/src/components/tooltip';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';

import { isCompleteBgStatus } from 'apps/rahat-ui/src/utils/get-status-bg';
import { useDateFormat } from 'apps/rahat-ui/src/utils/i18n/date';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/i18n/number';
import { translateValue } from 'apps/rahat-ui/src/utils/i18n/translateValue';

import { TruncatedCell } from 'apps/rahat-ui/src/sections/projects/aa-2/stakeholders/component/TruncatedCell';
interface PayoutTransactionLogRow {
  groupName: string;
  totalBeneficiaries: number;
  totalTokenAssigned: number;
  totalSuccessAmount: number;
  beneficiaryGroupToken: {
    beneficiaryGroup: {
      _count: {
        beneficiaries: number;
      };
    };
  };
  payoutType: string;
  payoutMode: string;
  status: string;
  timeStamp: string;
  uuid: string;
  extras?: any;
}

export default function usePayoutTransactionLogTableColumn() {
  const t = useTranslations('AA_PROJECT');
  const tv = useTranslations('AA_PROJECT_WITH_CASH_TRACKER');
  const tg = useTranslations('GLOBAL');
  const formatNum = useNumberFormat();
  const formatDate = useDateFormat();
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
      header: t('GROUP'),
      cell: ({ row }) => (
        <TruncatedCell text={row.getValue('groupName')} maxLength={15} />
      ),
    },
    {
      accessorKey: 'totalBeneficiaries',
      header: tg('TOTAL_BENEFICIARIES'),
      cell: ({ row }) => (
        <TruncatedCell
          text={formatNum(row.getValue('totalBeneficiaries'))}
          maxLength={15}
        />
      ),
    },

    {
      accessorKey: 'totalTokenAssigned',
      header: tv('AMOUNT_DISBURSED'),
      cell: ({ row }) => (
        <TruncatedCell
          text={`${t('RS')} ${formatNum(row.original.totalSuccessAmount)}`}
          maxLength={10}
        />
      ),
    },
    {
      accessorKey: 'amountperBenef',
      header: tv('AMOUNT_PER_BENEFICIARY'),
      cell: ({ row }) => {
        const amountPerBeneficiary =
          (row.original.totalTokenAssigned * 1) /
          row.original.totalBeneficiaries;
        return (
          <TruncatedCell
            text={`${t('RS')} ${formatNum(amountPerBeneficiary)}`}
            maxLength={10}
          />
        );
      },
    },
    {
      accessorKey: 'payoutType',
      header: tv('PAYOUT_TYPE'),
      cell: ({ row }) => (
        <TruncatedCell
          text={translateValue(
            tg,
            row.getValue('payoutType') === 'VENDOR'
              ? 'CVA'
              : (row.getValue('payoutType') as string),
            { fallbackStyle: 'raw' },
          )}
          maxLength={10}
        />
      ),
    },
    {
      accessorKey: 'payoutMode',
      header: tv('PAYOUT_METHOD'),
      cell: ({ row }) => (
        <TruncatedCell
          text={row.getValue('payoutMode')}
          maxLength={30}
          className="break-words line-clamp-2"
        />
      ),
    },
    {
      header: tg('STATUS'),
      meta: { className: 'w-[15%]' },
      cell: ({ row }) => {
        const status = row?.original?.status;
        // const totalBeneficiaries = row.original.totalBeneficiaries;
        // const totalSuccess = row?.original?.totalSuccessAmount;
        return (
          <div className="flex gap-2 w-full">
            <Badge
              className={`rounded-xl text-[10px] capitalize ${isCompleteBgStatus(
                status,
              )}`}
            >
              {translateValue(tg, status, {
                fallback: status
                  ?.toLowerCase()
                  .replace(/_/g, ' ')
                  .replace(/^./, (char: string) => char.toUpperCase()),
              })}
            </Badge>

            {/* {totalBeneficiaries != null && totalSuccess != null && (
              <span className="text-[12px]">
                {totalSuccess} / {totalBeneficiaries}
              </span>
            )} */}
          </div>
        );
      },
    },
    {
      accessorKey: 'timeStamp',
      header: tg('TIMESTAMP'),
      cell: ({ row }) => {
        const time = row.getValue('timeStamp') as string;
        return (
          <div className="flex gap-1 text-[10px]">
            <TruncatedCell text={formatDate(time)} maxLength={15} />
          </div>
        );
      },
    },

    {
      id: 'actions',
      header: tg('ACTIONS'),
      enableHiding: false,
      meta: { className: 'w-[7%]' },
      cell: ({ row }) => {
        const cancelledBy = row.original?.extras?.cancelledBy;
        return (
          <div className="flex items-center space-x-2">
            {row.original?.extras?.cancelledBy && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild className="hover:cursor-pointer py-0">
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
                        {t('PAYOUT_CANCELLED')}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm mt-1 break-words">
                      {t('PAYOUT_CANCELLED_BY', { cancelledBy }) ||
                        t('SOMETHING_WENT_WRONG')}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
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

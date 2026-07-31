import { useTranslations } from 'next-intl';
import { useRouter, useParams } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Eye } from 'lucide-react';
import TooltipComponent from 'apps/rahat-ui/src/components/tooltip';

import { isCompleteBgStatus } from 'apps/rahat-ui/src/utils/get-status-bg';
import { useDateFormat } from 'apps/rahat-ui/src/utils/useDateFormat';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/useNumberFormat';

import { TruncatedCell } from 'apps/rahat-ui/src/sections/projects/aa-2/stakeholders/component/TruncatedCell';
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
          text={`Rs. ${formatNum(row.original.totalSuccessAmount)}`}
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
          <TruncatedCell text={`Rs. ${formatNum(amountPerBeneficiary)}`} maxLength={10} />
        );
      },
    },
    {
      accessorKey: 'payoutType',
      header: tv('PAYOUT_TYPE'),
      cell: ({ row }) => (
        <TruncatedCell
          text={
            row.getValue('payoutType') === 'VENDOR'
              ? 'CVA'
              : row.getValue('payoutType')
          }
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
      accessorKey: 'status',
      header: tg('STATUS'),
      cell: ({ row }) => {
        const status = row?.original?.status;
        return (
          <Badge
            className={`rounded-xl text-[10px] capitalize ${isCompleteBgStatus(
              status,
            )}`}
          >
            {tg.has(status as never)
              ? tg(status as never)
              : status
                  .toLowerCase()
                  .replace(/_/g, ' ')
                  .replace(/^./, (char) => char.toUpperCase())}
          </Badge>
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
      cell: ({ row }) => {
        return (
          <div className="flex items-center space-x-2">
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

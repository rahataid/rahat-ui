import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import TooltipComponent from 'apps/rahat-ui/src/components/tooltip';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/useNumberFormat';

import { TruncatedCell } from 'apps/rahat-ui/src/sections/projects/aa-2/stakeholders/component/TruncatedCell';
import CopyTooltip from 'apps/rahat-ui/src/common/copyTooltip';

export const useFMDetailTableColumns = (tokensPerBeneficiary?: number) => {
  const { id, fundId } = useParams();
  const router = useRouter();
  const tg = useTranslations('GLOBAL');
  const t = useTranslations('AA_PROJECT');
  const formatNum = useNumberFormat();
  const handleViewClick = (fmId: string) => {
    console.log('benefwallet', fmId);
    router.push(`/projects/aa/${id}/beneficiary/${fmId}?fundId=${fundId}`);
  };
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'walletAddress',
      header: tg('WALLET_ADDRESS'),
      accessorFn: (row) => row.Beneficiary?.walletAddress ?? 'N/A',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <TruncatedCell
            text={row.original?.Beneficiary?.walletAddress}
            maxLength={15}
          />
          <CopyTooltip
            value={row.original?.Beneficiary?.walletAddress}
            uniqueKey={row.original?.uuid}
          />
        </div>
      ),
    },
    {
      accessorKey: 'tokensAssigned',
      header: t('TOKEN_AMOUNT'),
      cell: () => <div>{tokensPerBeneficiary != null ? formatNum(tokensPerBeneficiary) : tg('N_A')}</div>,
    },
    {
      id: 'actions',
      header: tg('ACTIONS'),
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <TooltipComponent
              Icon={Eye}
              tip={tg('VIEW_DETAILS')}
              iconStyle="hover:text-primary cursor-pointer"
              handleOnClick={() => handleViewClick(row.original.beneficiaryId)}
            />
          </div>
        );
      },
    },
  ];
  return columns;
};

'use client';
import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';

import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { TruncatedCell } from 'apps/rahat-ui/src/sections/projects/aa-2/stakeholders/component/TruncatedCell';

import CopyTooltip from 'apps/rahat-ui/src/common/copyTooltip';
import TooltipComponent from 'apps/rahat-ui/src/components/tooltip';

export const useProjectBeneficiaryTableColumns = () => {
  const router = useRouter();
  const { id } = useParams();
  const tg = useTranslations('GLOBAL');

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'wallet',
      header: tg('WALLET_ADDRESS'),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <TruncatedCell text={row?.original?.walletAddress} maxLength={15} />
          <CopyTooltip
            value={row.original?.walletAddress}
            uniqueKey={row.original?.uuid}
          />
        </div>
      ),
    },
    {
      header: tg('GENDER'),
      cell: ({ row }) => {
        const gender =
          row.original?.projectData?.gender?.trim() ||
          row.original?.gender?.trim() ||
          tg('N_A');
        return <div>{gender}</div>;
      }
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
              handleOnClick={() =>
                router.push(
                  `/projects/aa/${id}/beneficiary/${row.original.uuid}`,
                )
              }
            />
          </div>
        );
      },
    },
  ];

  return columns;
};

export const useProjectBeneficiaryGroupDetailsTableColumns = () => {
  const router = useRouter();
  const { id, groupId } = useParams();
  const tg = useTranslations('GLOBAL');

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'walletAddress',
      header: tg('WALLET_ADDRESS'),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <TruncatedCell text={row?.original?.walletAddress} maxLength={15} />
          <CopyTooltip
            value={row.original?.walletAddress}
            uniqueKey={row.original?.uuid}
          />
        </div>
      ),
    },
    {
      id: 'actions',
      header: tg('ACTIONS'),
      enableHiding: false,
      cell: ({ row }) => {
        console.log(row);

        return (
          <div className="flex items-center gap-2">
            <TooltipComponent
              Icon={Eye}
              tip={tg('VIEW_DETAILS')}
              iconStyle="hover:text-primary cursor-pointer"
              handleOnClick={() =>
                router.push(
                  `/projects/aa/${id}/beneficiary/${row?.original?.benefId}?groupId=${groupId}`,
                )
              }
            />
          </div>
        );
      },
    },
  ];

  return columns;
};

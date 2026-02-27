'use client';
import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';

import { useParams, useRouter } from 'next/navigation';
import { TruncatedCell } from 'apps/rahat-ui/src/sections/projects/aa-2/stakeholders/component/TruncatedCell';

import CopyTooltip from 'apps/rahat-ui/src/common/copyTooltip';
import TooltipComponent from 'apps/rahat-ui/src/components/tooltip';

export const useProjectBeneficiaryTableColumns = () => {
  const router = useRouter();
  const { id } = useParams();

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'wallet',
      header: 'Wallet',
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
      accessorKey: 'gender',
      header: 'Gender',
      cell: ({ row }) => <div> {row.getValue('gender')}</div>,
    },
    {
      id: 'actions',
      header: 'Action',
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <TooltipComponent
              Icon={Eye}
              tip="View Details"
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

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'walletAddress',
      header: 'Wallet',
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
      header: 'Action',
      enableHiding: false,
      cell: ({ row }) => {
        console.log(row);

        return (
          <div className="flex items-center gap-2">
            <TooltipComponent
              Icon={Eye}
              tip="View Details"
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

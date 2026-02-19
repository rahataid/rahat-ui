import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

import { TruncatedCell } from 'apps/rahat-ui/src/sections/projects/aa-2/stakeholders/component/TruncatedCell';
import CopyTooltip from 'apps/rahat-ui/src/common/copyTooltip';

export const useFMDetailTableColumns = () => {
  const { id, fundId } = useParams();
  const router = useRouter();
  const handleViewClick = (fmId: string) => {
    console.log('benefwallet', fmId);
    router.push(`/projects/aa/${id}/beneficiary/${fmId}?fundId=${fundId}`);
  };
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'walletAddress',
      header: 'Wallet Address',
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
      header: 'Tokens Assigned',
      cell: ({ row }) => <div>{row.original?.tokensReserved || 'N/A'}</div>,
    },
    {
      id: 'actions',
      header: 'Actions',
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <Eye
              className="hover:text-primary cursor-pointer"
              size={16}
              strokeWidth={1.5}
              onClick={() => handleViewClick(row.original.beneficiaryId)}
            />
          </div>
        );
      },
    },
  ];
  return columns;
};

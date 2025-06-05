import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Copy, CopyCheck, Eye } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import useCopy from 'apps/rahat-ui/src/hooks/useCopy';

export const useFMDetailTableColumns = () => {
  const { id, fundId } = useParams();
  const router = useRouter();
  const { clickToCopy, copyAction } = useCopy();
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
        <div
          onClick={() =>
            clickToCopy(
              row.original?.Beneficiary?.walletAddress,
              row?.original?.uuid,
            )
          }
          className="flex items-center gap-2"
        >
          <p className="truncate w-20 ">
            {row.original?.Beneficiary?.walletAddress || 'N/A'}
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

import { useAAVendorsStore } from '@rahat-ui/query';
import { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { IProjectRedemption } from '../types';

export const useRedemptionRequestColumn = () => {
  const columns: ColumnDef<IProjectRedemption>[] = [
    {
      accessorKey: 'tokenAmount',
      header: 'Token Amount',
      cell: ({ row }) => <div>{row.original.tokenAmount}</div>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <div>{row.original.status || 'N/A'}</div>,
    },
    {
      accessorKey: 'approvedBy',
      header: 'Approved By',
      cell: ({ row }) => <div>{row.original.approvedBy || 'N/A'}</div>,
    },
    {
      accessorKey: 'approvedDate',
      header: 'Approved Date',
      cell: ({ row }) => {
        const time = row.original.approvedDate;
        return (
          <div className="flex gap-1">{new Date(time).toLocaleString()}</div>
        );
      },
    },
  ];
  return columns;
};

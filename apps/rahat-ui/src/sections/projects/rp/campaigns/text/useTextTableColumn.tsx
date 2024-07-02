'use client';

import { Badge } from '@rahat-ui/shadcn/components/badge';
import { ICampaignItemApiResponse } from '@rahat-ui/types';
import { ColumnDef } from '@tanstack/react-table';

export default function useTextTableColumn() {
  const columns: ColumnDef<ICampaignItemApiResponse>[] = [
    {
      accessorKey: 'to',
      header: 'To',
      cell: ({ row }) => (
        <div className="cursor-pointer">{row.getValue('to')}</div>
      ),
      filterFn: 'includesString',
    },
    // {
    //   accessorKey: 'startTime',
    //   header: 'Start Time',
    //   cell: ({ row }) => (
    //     <div className="capitalize">
    //       {new Date(row.getValue('startTime')).toLocaleString()}
    //     </div>
    //   ),
    // },
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('date')}</div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant="secondary" className="rounded-md capitalize">
          {row.getValue('status')}
        </Badge>
      ),
    },
    // {
    //   id: 'actions',
    //   enableHiding: false,
    //   cell: ({ row }) => {
    //     return (
    //       <Eye
    //         className="hover:text-primary cursor-pointer"
    //         size={20}
    //         strokeWidth={1.5}
    //         onClick={() => openSplitDetailView(row.original)}
    //       />
    //     );
    //   },
    // },
  ];

  return columns;
}

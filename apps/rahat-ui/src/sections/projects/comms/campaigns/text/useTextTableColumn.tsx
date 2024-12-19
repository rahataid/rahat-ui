'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@rahat-ui/shadcn/components/badge';
import { ICampaignItemApiResponse } from '@rahat-ui/types';

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
  ];

  return columns;
}

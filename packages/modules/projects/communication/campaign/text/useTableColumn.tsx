import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { ICampaignItemApiResponse } from 'libs/types/src';
import { Badge } from 'libs/shadcn/src/components/ui/badge';

export default function useTextTableColumn() {
  const columns: ColumnDef<ICampaignItemApiResponse>[] = [
    {
      accessorKey: 'address',
      header: 'To',
      cell: ({ row }) => (
        <div className="cursor-pointer">{row.getValue('address')}</div>
      ),
      filterFn: 'includesString',
    },

    {
      accessorKey: 'createdAt',
      header: 'Date',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('createdAt')}</div>
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

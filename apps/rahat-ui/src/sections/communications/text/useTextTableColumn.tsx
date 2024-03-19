'use client';

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { Badge } from '@rahat-ui/shadcn/components/badge';
import { ICampaignItemApiResponse } from '@rumsan/communication';

type IProps = {
  handleSplitDetail: (item: ICampaignItemApiResponse) => void;
};

export default function useTextTableColumn({ handleSplitDetail }: IProps) {
  const columns: ColumnDef<ICampaignItemApiResponse>[] = [
    {
      accessorKey: 'name',
      header: 'Campaigns',
      cell: ({ row }) => <div>{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'startTime',
      header: 'Start Time',
      cell: ({ row }) => (
        <div className="capitalize">
          {new Date(row.getValue('startTime')).toLocaleString()}
        </div>
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
    {
      accessorKey: 'transport',
      header: 'Transport',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('transport')}</div>
      ),
    },
    {
      accessorKey: 'totalAudiences',
      header: 'Total Audiences',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('totalAudiences')}</div>
      ),
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <Eye
            className="hover:text-primary cursor-pointer"
            size={20}
            strokeWidth={1.5}
            onClick={() => handleSplitDetail(row.original)}
          />
        );
      },
    },
  ];

  return columns;
}

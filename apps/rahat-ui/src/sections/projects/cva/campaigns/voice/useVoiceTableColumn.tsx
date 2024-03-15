'use client';

import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@rahat-ui/shadcn/components/dropdown-menu';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';
import VoiceTableData from '../../../../../app/communications/voice/voiceData.json';
import { paths } from '../../../../../routes/paths';

const data: Voice[] = VoiceTableData;

export type Voice = {
  id: number;
  campaign: string;
  startTime: string;
  status: string;
  transport: string;
  totalAudiences: number;
};

export const useVoiceTableColumn = () => {
  const router = useRouter();

  const columns: ColumnDef<Voice>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: 'Voice Campaigns',
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() =>
                  router.push(
                    paths.dashboard.communication.voiceDetail(row.original.id),
                  )
                }
              >
                View Details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Edit</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  return columns;
};

import { ColumnDef } from '@tanstack/react-table';
import { useParams, useRouter } from 'next/navigation';
import { Badge } from '@rahat-ui/shadcn/components/badge';
import { Eye } from 'lucide-react';
import React from 'react';
import Link from 'next/link';
import { targetTypeMap } from '../const';

export const useScheduledTableColumn = () => {
  const { id } = useParams();
  const router = useRouter();

  const getChannelColor = (channel: string) => {
    switch (channel) {
      case 'SMS':
        return 'bg-blue-100 text-blue-800';
      case 'WhatsApp':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Sent':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => <div>{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'transportName',
      header: 'Channel',
      cell: ({ row }) => (
        <Badge
          className={getChannelColor(row.getValue('transportName'))}
          variant="secondary"
        >
          {row.getValue('transportName')}
        </Badge>
      ),
    },
    {
      accessorKey: 'targetType',
      header: 'Group',
      cell: ({ row }) => {
        const value = row.getValue('targetType') as keyof typeof targetTypeMap;

        return <div>{targetTypeMap[value] || 'N/A'}</div>;
      },
    },
    {
      accessorKey: 'recipientCount',
      header: 'Recipients',
      cell: ({ row }) => <div>{row.getValue('recipientCount') || 'N/A'}</div>,
    },
    {
      id: 'scheduledTimestamp',
      header: 'Scheduled Date',
      accessorFn: (row) => row.options?.scheduledTimestamp,
      cell: ({ getValue }) => {
        const value = getValue<string>();
        return <div> {new Date(value).toLocaleString()}</div>;
      },
    },
    {
      id: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const scheduledTime = row.original?.options?.scheduledTimestamp;
        const sessionId = row.original?.sessionId;

        let status = 'Draft';

        if (scheduledTime && new Date(scheduledTime) > new Date()) {
          status = 'Scheduled';
        } else if (sessionId) {
          status = 'Sent';
        }

        return <Badge className={getStatusColor(status)}>{status}</Badge>;
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <Link
            href={`/projects/el-crm/${id}/communications/scheduled/${row.original.uuid}`}
          >
            <Eye className="h-4 w-4 rounded-full hover:bg-gray-300" />
          </Link>
        );
      },
    },
  ];
  return columns;
};

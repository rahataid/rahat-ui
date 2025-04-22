import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { BroadcastStatus } from '@rumsan/connect/src/types';

export default function useCommsLogsTableColumns() {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'audience',
      header: 'Audience',
      cell: ({ row }) => <div className="">{row?.original?.address}</div>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        return (
          <Badge className={renderBadgeBg(row?.original?.status)}>
            {row?.original?.status}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'attempts',
      header: 'Attempts',
      cell: ({ row }) => {
        return <div className="ml-8">{row?.original?.attempts}</div>;
      },
    },
    {
      accessorKey: 'timeStamp',
      header: 'Timestamp',
      cell: ({ row }) => <div>{renderDateTime(row?.original?.createdAt)}</div>,
    },
  ];
  return columns;
}

function renderDateTime(dateTime: string) {
  if (dateTime) {
    const d = new Date(dateTime);
    const localeDate = d.toLocaleDateString();
    const localeTime = d.toLocaleTimeString();
    return `${localeDate} ${localeTime}`;
  }
  return 'N/A';
}

function renderBadgeBg(status: string) {
  if (status === BroadcastStatus.FAIL) {
    return 'bg-red-200';
  }
  if (status === BroadcastStatus.SUCCESS) {
    return 'bg-green-200';
  }
  if (status === BroadcastStatus.PENDING) {
    return 'bg-yellow-200';
  }
  return 'bg-gray-200';
}

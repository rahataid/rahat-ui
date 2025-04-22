import { useRouter, useParams } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Eye } from 'lucide-react';
import { IActivitiesItem } from 'apps/rahat-ui/src/types/activities';
import { setPaginationToLocalStorage } from 'apps/rahat-ui/src/utils/prev.pagination.storage';

function getStatusBg(status: string) {
  if (status === 'NOT_STARTED') {
    return 'bg-gray-200';
  }

  if (status === 'WORK_IN_PROGRESS') {
    return 'bg-orange-200';
  }

  if (status === 'COMPLETED') {
    return 'bg-green-200';
  }

  if (status === 'DELAYED') {
    return 'bg-red-200';
  }

  return '';
}

export default function usePayoutTransactionLogTableColumn() {
  const { id: projectID } = useParams();
  const router = useRouter();

  const handleEyeClick = (activityId: any) => {
    setPaginationToLocalStorage();
    router.push(`/projects/aa/${projectID}/activities/${activityId}`);
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'groupName',
      header: 'Group Name',
      cell: ({ row }) => (
        <div className="w-80">{row.getValue('groupName')}</div>
      ),
    },
    {
      accessorKey: 'totalBeneficiaries',
      header: 'Total Beneficiaries',
      cell: ({ row }) => <div>{row.getValue('totalBeneficiaries')}</div>,
    },

    {
      accessorKey: 'totalTokenAssigned',
      header: 'Total Token Assigned',
      cell: ({ row }) => <div>{row.getValue('totalTokenAssigned')}</div>,
    },
    {
      accessorKey: 'payoutType',
      header: 'Payout Type',
      cell: ({ row }) => <div>{row.getValue('payoutType')}</div>,
    },
    {
      accessorKey: 'payoutMode',
      header: 'Payout Mode',
      cell: ({ row }) => <div>{row.getValue('payoutMode')}</div>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        const bgColor = getStatusBg(status);
        return (
          <Badge className={`rounded-xl capitalize ${bgColor}`}>{status}</Badge>
        );
      },
    },
    {
      accessorKey: 'timeStamp',
      header: 'Timestamp',
      cell: ({ row }) => {
        const time = row.getValue('timeStamp') as string;
        return <div className="flex gap-1">{time || 'N/A'}</div>;
      },
    },

    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <div className="flex items-center space-x-2">
            <Eye
              className="hover:text-primary cursor-pointer"
              size={20}
              strokeWidth={1.5}
              onClick={() => handleEyeClick(row.original.id)}
            />
          </div>
        );
      },
    },
  ];

  return columns;
}

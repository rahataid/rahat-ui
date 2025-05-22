import { useRouter, useParams } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Eye } from 'lucide-react';

function getTransactionStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'bg-green-200 text-green-800';
    case 'pending':
      return 'bg-blue-200 text-blue-800';
    case 'rejected':
      return 'bg-red-200 text-red-800';
    default:
      return 'bg-gray-200 text-gray-800';
  }
}

export default function usePayoutTransactionLogTableColumn() {
  const { id: projectID } = useParams();
  const router = useRouter();

  const handleEyeClick = (beneficiaryGroupDetailsId: any) => {
    router.push(
      `/projects/aa/${projectID}/payout/details/${beneficiaryGroupDetailsId}`,
    );
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
        const status = row?.original?.status;
        return (
          <Badge
            className={`rounded-xl capitalize ${getTransactionStatusColor(
              status,
            )}`}
          >
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'timeStamp',
      header: 'Timestamp',
      cell: ({ row }) => {
        const time = row.getValue('timeStamp') as string;
        return (
          <div className="flex gap-1">{new Date(time).toLocaleString()}</div>
        );
      },
    },

    {
      id: 'actions',
      header: 'Actions',
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <div className="flex items-center space-x-2">
            <Eye
              className="hover:text-primary cursor-pointer"
              size={20}
              strokeWidth={1.5}
              onClick={() => handleEyeClick(row?.original?.uuid)}
            />
          </div>
        );
      },
    },
  ];

  return columns;
}

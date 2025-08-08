import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { useUserStore } from '@rumsan/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { IProjectRedemption } from '../types';

export const useRedemptionRequestColumn = () => {
  const { user } = useUserStore((s) => ({ user: s.user }));
  const columns: ColumnDef<IProjectRedemption>[] = [
    {
      accessorKey: 'tokenAmount',
      header: 'Token Amount',
      cell: ({ row }) => <div>{row.original.tokenAmount}</div>,
    },
    {
      accessorKey: 'totalAmount',
      header: 'Total Amount',
      cell: ({ row }) => <div>{`Rs. ${row.original.tokenAmount}`}</div>,
    },
    {
      accessorKey: 'redemptionStatus',
      header: 'Status',
      cell: ({ row }) => (
        <Badge
          className="text-xs font-normal"
          style={{
            backgroundColor:
              row.original?.redemptionStatus === 'APPROVED'
                ? '#ECFDF3'
                : '#EFF8FF',
            color:
              row.original?.redemptionStatus === 'APPROVED'
                ? '#027A48'
                : '#175CD3',
          }}
        >
          {row.original?.redemptionStatus === 'APPROVED'
            ? 'Approved'
            : 'Pending'}
        </Badge>
      ),
    },
    {
      accessorKey: 'approvedBy',
      header: 'Approved By',
      cell: ({ row }) => (
        <div className="flex gap-1">{user?.data?.name || 'N/A'}</div>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Requested Date',
      cell: ({ row }) => (
        <div className="flex gap-1">
          {new Date(row.original?.createdAt).toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: 'approvedAt',
      header: 'Approved Date',
      cell: ({ row }) => (
        <div className="flex gap-1">
          {new Date(row.original?.approvedAt).toLocaleString()}
        </div>
      ),
    },
  ];
  return columns;
};

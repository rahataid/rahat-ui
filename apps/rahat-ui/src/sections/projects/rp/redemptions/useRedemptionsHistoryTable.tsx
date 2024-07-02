import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { RedemptionApprovalModal } from './redemption.approval.modal';

export type Redeptions = {
  id: string;
  name: string;
  amount: number;
  status: string;
  action: string;
};

export const useRedemptionTableHistoryColumn = () => {
  const columns: ColumnDef<Redeptions>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => <div>{row.getValue('amount')}</div>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status');
        return status === 'Paid' ? (
          <Badge className="bg-green-200 text-green-600">Paid</Badge>
        ) : (
          <Badge className="bg-red-200 text-red-600">Pending</Badge>
        );
      },
    },
  ];
  return columns;
};

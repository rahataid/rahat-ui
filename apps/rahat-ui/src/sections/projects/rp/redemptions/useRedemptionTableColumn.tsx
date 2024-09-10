import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { RedemptionApprovalModal } from './redemption.approval.modal';
import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';

export type Redeptions = {
  id: string;
  name: string;
  amount: number;
  status: string;
  action: string;
  uuid: string;
  tokenAddress: string;
  walletAddress: string;
};

type IProps = {
  handleApprove: (data: any) => void;
};

export const useRedemptionTableColumn = ({ handleApprove }: IProps) => {
  const columns: ColumnDef<Redeptions>[] = [
    {
      id: 'select',
      header: '',
      cell: ({ row }) => {
        const isDisabled = row.getValue('status') === 'APPROVED';
        const isChecked = row.getIsSelected() && !isDisabled;
        return !isDisabled ? (
          <Checkbox
            checked={isChecked}
            onCheckedChange={() => row.toggleSelected(!isChecked)} // directly pass the negated state
            aria-label="Select row"
          />
        ) : (
          <></>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
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
        return status === 'APPROVED' ? (
          <Badge className="bg-green-200 text-green-600">Paid</Badge>
        ) : (
          <Badge className="bg-red-200 text-red-600">Pending</Badge>
        );
      },
    },

    {
      id: 'actions',
      enableHiding: true,
      cell: ({ row }) => {
        const rowData = row.original;
        const handleSubmit = () => {
          const data = {
            uuid: rowData.uuid,
            amount: rowData.amount,
            tokenAddress: rowData.tokenAddress,
            walletAddress: rowData.walletAddress,
          };
          handleApprove(data);
        };
        return rowData.status === 'REQUESTED' ? (
          <RedemptionApprovalModal handleSubmit={handleSubmit} />
        ) : (
          <Button className="h-6 w-14 text-xs p-2" disabled>
            Approved
          </Button>
        );
      },
    },
  ];
  return columns;
};

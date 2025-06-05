import { Disbursement } from '@rahat-ui/query';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { formatdbDate } from 'apps/rahat-ui/src/utils';
import { Eye } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

export const useDisburseTableColumns = () => {
  const { id } = useParams();
  const router = useRouter();
  const columns: ColumnDef<Disbursement>[] = [
    {
      accessorKey: 'date',
      header: 'Date/Time',
      cell: ({ row }) => (
        <div className="capitalize">
          {formatdbDate(row.original?.createdAt || row.original?.updatedAt)
            .split(' ')
            .slice(0, 5)
            .join(' ')}
        </div>
      ),
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => <div>{row.original?.type}</div>,
    },
    {
      accessorKey: 'totalAmount',
      header: () => <div>Total Amount</div>,
      cell: ({ row }) => {
        const totalAmount = row.original?.amount;

        if (totalAmount !== undefined && !isNaN(totalAmount)) {
          // Format as a decimal with two decimal places
          const formatted = new Intl.NumberFormat('en-US', {
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(totalAmount);

          return <div>{formatted} USDC</div>;
        } else {
          return <div>N/A</div>;
        }
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <div>{row.original?.status}</div>,
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const payment = row.original;

        return (
          <Button
            onClick={() =>
              router.push(`/projects/c2c/${id}/disbursement/${payment.uuid}`)
            }
            variant="ghost"
            className="h-8 w-8 p-0"
          >
            <span className="sr-only">Open menu</span>
            <Eye className="h-4 w-4" />
          </Button>
        );
      },
    },
  ];
  return columns;
};

import { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';

export const useBeneficiaryTableColumns = () => {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: 'sentTo',
      cell: ({ row }) => <div>{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'voucherStatus',
      header: 'Voucher Status',
      cell: ({ row }) => <div>{row.getValue('voucherStatus')}</div>,
    },
    {
      id: 'actions',
      header: 'Action',
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <Eye
            size={20}
            strokeWidth={1.5}
            className="cursor-pointer hover:text-primary"
            // onClick={() => openSplitDetailView(row.original)}
          />
        );
      },
    },
  ];
  return columns;
};

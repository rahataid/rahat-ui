import { ColumnDef } from '@tanstack/react-table';
import { Eye, Pencil, Trash } from 'lucide-react';

export const useVendorsTableColumns = () => {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ row }) => <div>{row.getValue('phone')}</div>,
    },
    {
      accessorKey: 'voucherType',
      header: 'Voucher Type',
      cell: ({ row }) => <div>{row.getValue('voucherType')}</div>,
    },
    {
      id: 'actions',
      header: 'Action',
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <Trash
            size={20}
            strokeWidth={1.5}
            className="cursor-pointer text-red-500"
            // onClick={() => openSplitDetailView(row.original)}
          />
        );
      },
    },
  ];
  return columns;
};

import { ColumnDef } from '@tanstack/react-table';
import { Eye, Pencil, Trash } from 'lucide-react';

export const useVendorsTableColumns = () => {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ row }) => <div>{row.getValue('phone') ?? '-'}</div>,
    },
    {
      accessorKey: 'voucherType',
      header: 'Voucher Type',
      cell: ({ row }) => <div>{row.getValue('voucherType') ?? '-'}</div>,
    },
  ];
  return columns;
};

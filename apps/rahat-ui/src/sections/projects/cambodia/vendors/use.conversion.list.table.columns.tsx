import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { ColumnDef } from '@tanstack/react-table';

export const useConversionListTableColumns = () => {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: 'Beneficiary Name',
      cell: ({ row }) => <div>{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'voucherStatus',
      header: 'Voucher Status',
      cell: ({ row }) => <Badge>{row.getValue('voucherStatus')}</Badge>,
    },
    {
      accessorKey: 'glassStatus',
      header: 'Glass Status',
      cell: ({ row }) => <Badge>{row.getValue('glassStatus')}</Badge>,
    },
  ];
  return columns;
};

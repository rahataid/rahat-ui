import { ColumnDef } from '@tanstack/react-table';

export const useBeneficiaryTableColumns = () => {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => <div>{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'voucherType',
      header: 'Voucher Type',
      cell: ({ row }) => <div>{row.getValue('voucherType')}</div>,
    },
  ];
  return columns;
};

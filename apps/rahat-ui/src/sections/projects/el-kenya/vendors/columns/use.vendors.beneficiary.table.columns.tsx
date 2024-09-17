import { ColumnDef } from '@tanstack/react-table';

export const useElkenyaVendorsBeneficiaryTableColumns = () => {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: 'Beneficiary Name',
      cell: ({ row }) => <div>{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'beneficiaryType',
      header: 'Beneficiary Type',
      cell: ({ row }) => <div>{row.getValue('beneficiaryType')}</div>,
    },
    {
      accessorKey: 'voucherStatus',
      header: 'Voucher Status',
      cell: ({ row }) => <div>{row.getValue('voucherStatus')}</div>,
    },
    {
      accessorKey: 'glassesStatus',
      header: 'Glasses Status',
      cell: ({ row }) => <div>{row.getValue('glassesStatus')}</div>,
    },
  ];
  return columns;
};

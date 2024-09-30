import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
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
      cell: ({ row }) => <Badge>{row.getValue('beneficiaryType')}</Badge>,
    },
    {
      accessorKey: 'voucherStatus',
      header: 'Voucher Status',
      cell: ({ row }) => <Badge>{row.getValue('voucherStatus')}</Badge>,
    },
    {
      accessorKey: 'glassesStatus',
      header: 'Glasses Status',
      cell: ({ row }) => <Badge>{row.getValue('glassesStatus')}</Badge>,
    },
  ];
  return columns;
};

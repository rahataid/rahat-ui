import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { ColumnDef } from '@tanstack/react-table';

export const useElkenyaVendorsBeneficiaryTableColumns = () => {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'phone',
      header: 'Beneficiary Phone',
      cell: ({ row }) => <div>{row.getValue('phone') || 'N/A'}</div>,
    },
    {
      accessorKey: 'type',
      header: 'Beneficiary Type',
      cell: ({ row }) => <Badge>{row.getValue('type') || 'N/A'}</Badge>,
    },
    {
      accessorKey: 'voucherStatus',
      header: 'Voucher Status',
      cell: ({ row }) => (
        <Badge>{row.getValue('voucherStatus') || 'N/A'}</Badge>
      ),
    },
    {
      accessorKey: 'glassesStatus',
      header: 'Glasses Status',
      cell: ({ row }) => (
        <Badge>{row.getValue('glassesStatus') || 'N/A'}</Badge>
      ),
    },
  ];
  return columns;
};

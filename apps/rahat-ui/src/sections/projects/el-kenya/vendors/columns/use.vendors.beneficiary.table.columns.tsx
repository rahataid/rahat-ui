import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { ColumnDef } from '@tanstack/react-table';

export const useElkenyaVendorsBeneficiaryTableColumns = () => {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'phone',
      header: 'Number',
      cell: ({ row }) => <div>{row.getValue('phone') || 'N/A'}</div>,
    },
    {
      accessorKey: 'voucherStatus',
      header: 'Voucher Status',
      cell: ({ row }) => <div>{row.getValue('voucherStatus') || 'N/A'}</div>,
    },
    {
      accessorKey: 'eyeCheckupStatus',
      header: 'Voucher Usage',
      cell: ({ row }) => (
        <Badge>{row.getValue('eyeCheckupStatus') || 'N/A'}</Badge>
      ),
    },
    {
      accessorKey: 'voucherType',
      header: 'Glasses Purchase Type',
      cell: ({ row }) => <Badge>{row.getValue('voucherType') || 'N/A'}</Badge>,
    },
  ];
  return columns;
};

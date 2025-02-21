import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { ColumnDef } from '@tanstack/react-table';
import { mapStatus } from '../../const';

export const useElkenyaVendorsBeneficiaryTableColumns = () => {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'phone',
      header: 'Number',
      cell: ({ row }) => <div>{row.getValue('phone') || '-'}</div>,
    },
    {
      accessorKey: 'voucherStatus',
      header: 'Voucher Status',
      cell: ({ row }) => (
        <div>{mapStatus(row.getValue('voucherStatus')) || '-'}</div>
      ),
    },
    {
      accessorKey: 'eyeCheckupStatus',
      header: 'Voucher Usage',
      cell: ({ row }) => (
        <Badge>
          {row.original.eyeCheckupStatus === 'NOT_CHECKED'
            ? '-'
            : mapStatus(row.original.eyeCheckupStatus)}
        </Badge>
      ),
    },
    {
      accessorKey: 'voucherType',
      header: 'Glasses Purchase Type',
      cell: ({ row }) => (
        <Badge>{mapStatus(row.getValue('voucherType')) || '-'}</Badge>
      ),
    },
  ];
  return columns;
};

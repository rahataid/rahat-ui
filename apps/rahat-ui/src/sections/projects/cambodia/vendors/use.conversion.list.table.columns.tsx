import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { ColumnDef } from '@tanstack/react-table';

export const useConversionListTableColumns = () => {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: 'Beneficiary Name',
      cell: ({ row }) => <div>{row?.original?.pii?.name ?? '-'}</div>,
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ row }) => <Badge>{row?.original?.pii?.phone ?? '-'}</Badge>,
    },
    {
      accessorKey: 'wallet',
      header: 'Wallet',
      cell: ({ row }) => (
        <Badge>{row?.original?.beneficiary?.walletAddress ?? '-'}</Badge>
      ),
    },
  ];
  return columns;
};

import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';

export const useBeneficiaryTableColumns = () => {
  const columns: ColumnDef<any>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'phone',
      header: 'sentTo',
      cell: ({ row }) => <div>{row.getValue('phone')}</div>,
    },
    {
      accessorKey: 'walletAddress',
      header: 'WalletAddress',
      cell: ({ row }) => <Badge>{row.getValue('walletAddress')}</Badge>,
    },
    // {
    //   id: 'actions',
    //   header: 'Action',
    //   enableHiding: false,
    //   cell: ({ row }) => {
    //     return (
    //       <Pencil
    //         size={20}
    //         strokeWidth={1.5}
    //         className="cursor-pointer text-primary"
    //         // onClick={() => openSplitDetailView(row.original)}
    //       />
    //     );
    //   },
    // },
  ];
  return columns;
};

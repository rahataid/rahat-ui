import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';

export const useTableColumns = () => {
  const columns: ColumnDef<any>[] = [
    // {
    //   id: 'select',
    //   header: ({ table }) => (
    //     <Checkbox
    //       // className={members ? '' : 'hidden'}
    //       checked={
    //         table.getIsAllPageRowsSelected() ||
    //         (table.getIsSomePageRowsSelected() && 'indeterminate')
    //       }
    //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    //       aria-label="Select all"
    //     />
    //   ),
    //   cell: ({ row }) => {
    //     return (
    //       <Checkbox
    //         checked={row.getIsSelected()}
    //         disabled={!row.getCanSelect()}
    //         onCheckedChange={(value) => row.toggleSelected(!!value)}
    //         aria-label="Select row"
    //       />
    //     );
    //   },
    //   enableSorting: false,
    //   enableHiding: false,
    // },
    {
      accessorKey: 'to',
      accessorFn: (row) => row.address,
      header: 'Send To',
      cell: ({ row }) => <div>{row.original.address}</div>,
    },
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => {
        const date = new Date(row.original.createdAt);
        const formattedDate = date.toLocaleDateString();

        return <div>{formattedDate}</div>;
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <Badge>{row.getValue('status')}</Badge>,
    },
  ];
  return columns;
};

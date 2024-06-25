import { ColumnDef } from '@tanstack/react-table';

export default function useDetailsBeneficiaryTableColumn() {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => row.getValue('name') || '-',
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ row }) => row.getValue('phone') || '-',
    },
    {
      accessorKey: 'email',
      header: 'Email Address',
      cell: ({ row }) => row.getValue('email') || '-',
    },
    {
      accessorKey: 'location',
      header: 'Location',
      cell: ({ row }) => row.getValue('location') || '-',
    },
  ];

  return columns;
}

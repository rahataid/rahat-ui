import { ColumnDef } from '@tanstack/react-table';

const headerCell = (label: string) => () =>
  (
    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
      {label}
    </span>
  );

const dash = <span className="text-muted-foreground/60">—</span>;

export const useConsumersTableColumn = () => {
  const columns: ColumnDef<any>[] = [
    {
      id: 'name',
      accessorFn: (row) => row?.extras?.name ?? '',
      header: headerCell('Consumer Name'),
      cell: ({ row }) => {
        const name = row.original?.extras?.name as string | undefined;
        return (
          <span className="text-sm font-medium text-foreground">
            {name || dash}
          </span>
        );
      },
    },
    {
      id: 'phone',
      accessorFn: (row) => row?.extras?.phone ?? '',
      header: headerCell('Phone Number'),
      cell: ({ row }) => {
        const val = row.original?.extras?.phone as string | undefined;
        return (
          <span className="text-sm tabular-nums">{val || dash}</span>
        );
      },
    },
    {
      id: 'gender',
      accessorFn: (row) => row?.extras?.gender ?? '',
      header: headerCell('Gender'),
      cell: ({ row }) => {
        const val = row.original?.extras?.gender as string | undefined;
        return (
          <span className="text-sm capitalize">
            {val ? val.toLowerCase() : dash}
          </span>
        );
      },
    },
    {
      id: 'consent',
      accessorFn: (row) => row?.extras?.consent ?? '',
      header: headerCell('Consent'),
      cell: ({ row }) => {
        const val = row.original?.extras?.consent as string | undefined;
        if (!val) return dash;
        const yes = val.toLowerCase() === 'yes';
        return (
          <span
            className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${
              yes
                ? 'bg-success/10 text-success'
                : 'bg-destructive/10 text-destructive'
            }`}
          >
            {yes ? 'Yes' : 'No'}
          </span>
        );
      },
    },
    {
      id: 'vendorName',
      accessorFn: (row) => row?.extras?.vendorName ?? '',
      header: headerCell('Vendor'),
      cell: ({ row }) => {
        const val = row.original?.extras?.vendorName as string | undefined;
        return <span className="text-sm">{val || dash}</span>;
      },
    },
    {
      accessorKey: 'createdAt',
      header: headerCell('Created'),
      cell: ({ row }) => {
        const value = row.getValue('createdAt');
        if (!value) return dash;
        return (
          <span className="text-sm tabular-nums">
            {new Date(value as string).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        );
      },
    },
  ];
  return columns;
};

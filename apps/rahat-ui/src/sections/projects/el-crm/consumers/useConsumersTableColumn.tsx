import { ColumnDef } from '@tanstack/react-table';
import { useParams, useRouter } from 'next/navigation';

export const useConsumersTableColumn = () => {
  const { id } = useParams();
  const router = useRouter();
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: () => (
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Consumer Name
        </span>
      ),
      cell: ({ row }) => (
        <span className="text-sm font-medium text-foreground">
          {row.getValue('name')}
        </span>
      ),
    },
    {
      accessorKey: 'phone',
      header: () => (
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Phone Number
        </span>
      ),
      cell: ({ row }) => {
        const val = row.getValue('phone') as string;
        return (
          <span className="text-sm tabular-nums">
            {val || (<span className="text-muted-foreground/60">—</span>)}
          </span>
        );
      },
    },
    {
      accessorKey: 'lastRedemptionDate',
      header: () => (
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Last Redemption
        </span>
      ),
      cell: ({ row }) => {
        const value = row.getValue('lastRedemptionDate');
        if (!value)
          return <span className="text-muted-foreground/60">—</span>;
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

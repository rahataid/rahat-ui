import { CustomerCategory, CustomerSource } from '@rahat-ui/query';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { ColumnDef } from '@tanstack/react-table';
import { useParams, useRouter } from 'next/navigation';

interface CustomerTableRow {
  bde: string;
  bdm: string;
  customerCode: string;
  name: string;
  phone: string;
  email: string;
  channel: string;
  location: string;
  source: CustomerSource;
  lastPurchaseDate: Date;
  category: CustomerCategory;
}

export const useCustomersTableColumn = () => {
  const { id } = useParams();
  const router = useRouter();

  const getCategoryBadgeVariant = (category: string) => {
    switch (category) {
      case CustomerCategory.ACTIVE:
        return 'success' as const;
      case CustomerCategory.INACTIVE:
        return 'secondary' as const;
      case CustomerCategory.NEWLY_INACTIVE:
        return 'destructive' as const;
      default:
        return 'secondary' as const;
    }
  };

  const columns: ColumnDef<CustomerTableRow>[] = [
    {
      accessorKey: 'bde',
      header: () => (
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          BDE
        </span>
      ),
      cell: ({ row }) => {
        const value = row.getValue('bde') as string;
        return (
          <span className="text-sm font-medium">
            {value || (
              <span className="text-muted-foreground/60">—</span>
            )}
          </span>
        );
      },
    },
    {
      accessorKey: 'bdm',
      header: () => (
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          BDM
        </span>
      ),
      cell: ({ row }) => {
        const value = row.getValue('bdm') as string;
        return (
          <span className="text-sm font-medium">
            {value || (
              <span className="text-muted-foreground/60">—</span>
            )}
          </span>
        );
      },
    },
    {
      accessorKey: 'customerCode',
      header: () => (
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Code
        </span>
      ),
      cell: ({ row }) => (
        <span className="text-sm font-mono text-muted-foreground">
          {row.getValue('customerCode')}
        </span>
      ),
    },
    {
      accessorKey: 'name',
      header: () => (
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Customer Name
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
          Phone
        </span>
      ),
      cell: ({ row }) => {
        const val = row.getValue('phone') as string;
        return (
          <span className="text-sm tabular-nums">
            {val || <span className="text-muted-foreground/60">—</span>}
          </span>
        );
      },
    },
    {
      accessorKey: 'email',
      header: () => (
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Email
        </span>
      ),
      cell: ({ row }) => {
        const email = row.getValue('email') as string;
        if (!email)
          return <span className="text-muted-foreground/60">—</span>;
        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-sm truncate max-w-[180px] block cursor-default">
                {email}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>{email}</p>
            </TooltipContent>
          </Tooltip>
        );
      },
    },
    {
      accessorKey: 'channel',
      header: () => (
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Channel
        </span>
      ),
      cell: ({ row }) => {
        const val = row.getValue('channel') as string;
        return val ? (
          <span className="text-sm">{val}</span>
        ) : (
          <span className="text-muted-foreground/60">—</span>
        );
      },
    },
    {
      accessorKey: 'location',
      header: () => (
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Region
        </span>
      ),
      cell: ({ row }) => {
        const val = row.getValue('location') as string;
        return val ? (
          <span className="text-sm">{val}</span>
        ) : (
          <span className="text-muted-foreground/60">—</span>
        );
      },
    },
    {
      accessorKey: 'source',
      header: () => (
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Source
        </span>
      ),
      cell: ({ row }) => {
        const source = row.getValue('source') as string;
        return (
          <Badge variant={source === CustomerSource.PRIMARY ? 'default' : 'secondary'}>
            {source}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'lastPurchaseDate',
      header: () => (
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Last Purchase
        </span>
      ),
      cell: ({ row }) => {
        const date = row.getValue('lastPurchaseDate') as string;
        if (!date)
          return <span className="text-muted-foreground/60">—</span>;
        const formatted = new Date(date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
        return <span className="text-sm tabular-nums">{formatted}</span>;
      },
    },
    {
      accessorKey: 'category',
      header: () => (
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Category
        </span>
      ),
      cell: ({ row }) => {
        const category = row.getValue('category') as string;
        const variant = getCategoryBadgeVariant(category);
        return (
          <Badge variant={variant}>
            {category?.split('_').join(' ')}
          </Badge>
        );
      },
    },
  ];
  return columns;
};

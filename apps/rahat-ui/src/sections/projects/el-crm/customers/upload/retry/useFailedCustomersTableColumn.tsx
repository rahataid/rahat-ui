import { CustomerCategory, useRetryCustomerImport } from '@rahat-ui/query';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { UUID } from 'crypto';
import { Eye } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

export const useFailedCustomersTableColumn = () => {
  const { id: projectUUID } = useParams() as {
    id: UUID;
  };
  const router = useRouter();

  const getCategoryBgColor = (category: string) => {
    switch (category) {
      case CustomerCategory.ACTIVE:
        return 'blue';
      case CustomerCategory.INACTIVE:
        return 'gray';
      case CustomerCategory.NEWLY_INACTIVE:
        return 'red';
      default:
        return 'gray';
    }
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'customerCode',
      header: 'Customer Code',
      cell: ({ row }) => <div>{row.getValue('customerCode') || 'N/A'}</div>,
    },
    {
      accessorKey: 'name',
      header: 'Customer Name',
      cell: ({ row }) => <div>{row.getValue('name') || 'N/A'}</div>,
    },
    {
      accessorKey: 'email',
      header: 'Email ID',
      cell: ({ row }) => <div>{row.getValue('email') || 'N/A'}</div>,
    },
    {
      accessorKey: 'phone',
      header: 'Phone Number',
      cell: ({ row }) => <div>{row.getValue('phone') || 'N/A'}</div>,
    },
    {
      accessorKey: 'lastPurchaseDate',
      header: 'Last Purchase Date',
      cell: ({ row }) => (
        <div>
          {row.getValue('lastPurchaseDate')
            ? new Date(row.getValue('lastPurchaseDate')).toLocaleDateString()
            : 'N/A'}
        </div>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => {
        const category = row.getValue('category') as string;
        const color = getCategoryBgColor(category);
        return category ? (
          <Badge className={`bg-${color}-200`}>
            {category?.split('_').join(' ')}
          </Badge>
        ) : (
          'N/A'
        );
      },
    },
    {
      accessorKey: 'source',
      header: 'Source',
      cell: ({ row }) => <div>{row.getValue('source') || 'N/A'}</div>,
    },
    {
      accessorKey: 'error',
      header: 'Error',
      cell: ({ row }) => {
        const errorObj = row.original?.error as
          | Record<string, string[]>
          | undefined;
        if (!errorObj || Object.keys(errorObj).length === 0) return 'N/A';

        return (
          <div className="flex flex-col space-y-1">
            {Object.entries(errorObj).map(([field, messages], idx) =>
              (messages as string[]).map((msg, msgIdx) => (
                <div key={`${idx}-${msgIdx}`} className="text-sm text-red-600">
                  {msg}
                </div>
              )),
            )}
          </div>
        );
      },
    },
    // {
    //   id: 'actions',
    //   header: 'Actions',
    //   enableHiding: false,
    //   cell: ({ row }) => {
    //     return (
    //       <div className="flex items-center space-x-2">
    //         <Button size="sm" variant="outline">
    //           <Eye />
    //         </Button>
    //       </div>
    //     );
    //   },
    // },
  ];
  return columns;
};

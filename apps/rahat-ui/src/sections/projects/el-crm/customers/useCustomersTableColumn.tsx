import { CustomerCategory, CustomerSource } from '@rahat-ui/query';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { ColumnDef } from '@tanstack/react-table';
import { useParams, useRouter } from 'next/navigation';

interface CustomerTableRow {
  name: string;
  email: string;
  phone: string;
  lastPurchaseDate: Date;
  category: CustomerCategory;
  source: CustomerSource;
}

export const useCustomersTableColumn = () => {
  const { id } = useParams();
  const router = useRouter();

  const getCategoryVariant = (category: string) => {
    switch (category) {
      case 'Active':
        return 'default';
      case 'Inactive':
        return 'secondary';
      case 'Newly Inactive':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const columns: ColumnDef<CustomerTableRow>[] = [
    {
      accessorKey: 'name',
      header: 'Customer Name',
      cell: ({ row }) => <div>{row.getValue('name')}</div>,
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
      cell: ({ row }) => (
        <Badge variant={getCategoryVariant(row.getValue('category'))}>
          {row.getValue('category')}
        </Badge>
      ),
    },
    {
      accessorKey: 'source',
      header: 'Source',
      cell: ({ row }) => <div>{row.getValue('source') || 'N/A'}</div>,
    },
  ];
  return columns;
};

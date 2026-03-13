import { CustomerCategory, CustomerSource } from '@rahat-ui/query';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { ColumnDef } from '@tanstack/react-table';
import { useParams, useRouter } from 'next/navigation';

interface CustomerTableRow {
  bde: string;
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

  const columns: ColumnDef<CustomerTableRow>[] = [
    {
      accessorKey: 'bde',
      header: 'BDE/BDM',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('bde') || 'N/A'}</div>
      ),
    },
    {
      accessorKey: 'customerCode',
      header: 'Customer Code',
      cell: ({ row }) => <div>{row.getValue('customerCode')}</div>,
    },
    {
      accessorKey: 'name',
      header: 'Customer Name',
      cell: ({ row }) => <div>{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'phone',
      header: 'Phone Number',
      cell: ({ row }) => <div>{row.getValue('phone') || 'N/A'}</div>,
    },
    {
      accessorKey: 'email',
      header: 'Email ID',
      cell: ({ row }) => <div>{row.getValue('email') || 'N/A'}</div>,
    },
    {
      accessorKey: 'channel',
      header: 'Channel',
      cell: ({ row }) => <div>{row.getValue('channel') || 'N/A'}</div>,
    },
    {
      accessorKey: 'location',
      header: 'Region',
      cell: ({ row }) => <div>{row.getValue('location') || 'N/A'}</div>,
    },
    {
      accessorKey: 'source',
      header: 'Source',
      cell: ({ row }) => {
        const source = row.getValue('source') as string;
        return <Badge>{source}</Badge>;
      },
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
        return (
          <Badge className={`bg-${color}-200`}>
            {category?.split('_').join(' ')}
          </Badge>
        );
      },
    },
  ];
  return columns;
};

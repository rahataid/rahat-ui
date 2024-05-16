import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import Jdenticon from 'react-jdenticon';

const useAduitColumns = () => {
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const formattedDate = date.toISOString().split('T')[0];
    const formattedTime = date.toISOString().split('T')[1].split('.')[0];
    return { formattedDate, formattedTime };
  };

  const getOperationBadge = (operation: string) => {
    let badgeVariant = '';
    switch (operation) {
      case 'CREATE':
        badgeVariant = 'bg-green-200 text-green-700';
        break;
      case 'UPDATE':
        badgeVariant = 'bg-orange-200 text-orange-700';
        break;
      default:
        badgeVariant = 'bg-red-200 text-red-700';
        break;
    }
    return badgeVariant;
  };

  const columns = [
    {
      accessorKey: 'user',
      header: 'User',
      cell: ({ row }) => (
        <div className="capitalize flex items-center gap-4">
          <div className="rounded-full">
            <Jdenticon size="38" value={row.original.id} />
          </div>
          {row.original.user.name}
        </div>
      ),
    },
    {
      accessorKey: 'tableName',
      header: 'Table Name',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('tableName')}</div>
      ),
    },
    {
      accessorKey: 'operation',
      header: 'Operation',
      cell: ({ row }) => (
        <div className="capitalize">
          <Badge
            className={getOperationBadge(row.original.operation)}
            variant="secondary"
          >
            {row.original.operation}
          </Badge>
          <br />
          <p className="text-muted-foreground text-sm mt-1">
            {' '}
            {row.original.fieldName}
          </p>
        </div>
      ),
    },
    {
      accessorKey: 'timestamp',
      header: 'Timestamp',
      cell: ({ row }) => {
        const { formattedDate, formattedTime } = formatDate(
          row.original.timestamp,
        );
        return (
          <div>
            <div>{formattedDate}</div>
            <div className="text-muted-foreground">{formattedTime}</div>
          </div>
        );
      },
    },
  ];

  return columns;
};

export default useAduitColumns;

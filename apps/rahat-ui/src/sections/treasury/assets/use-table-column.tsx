import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { Eye } from 'lucide-react';

export const useAssetsTableColumn = () => {
  const tg = useTranslations('GLOBAL');
  const t = useTranslations('Treasury – Assets');
  const columns: ColumnDef<Assets>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value: any) =>
            table.toggleAllPageRowsSelected(!!value)
          }
          aria-label={tg('SELECT_ALL')}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value: any) => row.toggleSelected(!!value)}
          aria-label={tg('SELECT_ROW')}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: tg('NAME'),
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'amount',
      header: t('AMOUNT'),
      cell: ({ row }) => <div>{row.getValue('amount')}</div>,
    },
    {
      accessorKey: 'status',
      header: tg('STATUS'),
      cell: ({ row }) => {
        const status = row.getValue('status');
        return status === 'Paid' ? (
          <Badge className="bg-green-200 text-green-600">{t('PAID')}</Badge>
        ) : (
          <Badge className="bg-red-200 text-red-600">{t('PENDING')}</Badge>
        );
      },
    },

    {
      id: 'actions',
      enableHiding: true,
      cell: () => {
        return (
          <Eye
            className="cursor-pointer"
            size={18}
            strokeWidth={1.5}
          />
        );
      },
    },
  ];
  return columns;
};

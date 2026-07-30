import { DemoTable } from 'apps/rahat-ui/src/common';
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnDef,
} from '@tanstack/react-table';
import { Badge } from '@rahat-ui/shadcn/components/badge';
import { useTranslations } from 'next-intl';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/useNumberFormat';

interface InKindItem {
  inkindName: string;
  availableAmount: number;
  assignedAmount?: number;
  inkindType: string;
  redeemedAmount: number;
  status: string;
}

const InkindDetails = ({
  filteredInkinds,
}: {
  filteredInkinds: InKindItem[];
}) => {
  const t = useTranslations('AA_PROJECT');
  const tg = useTranslations('GLOBAL');
  const formatNum = useNumberFormat();
  const columns: ColumnDef<InKindItem>[] = [
    {
      header: t('INKIND_ITEM'),
      accessorKey: 'inkindName',
    },
    {
      header: tg('TYPE'),
      accessorKey: 'inkindType',
      cell: ({ row }) => {
        const type = row.original.inkindType.replace('_', ' ');
        return <div className="capitalize text-sm">{type}</div>;
      },
    },
    {
      header: t('ASSIGNED'),
      accessorKey: 'assignedAmount',
      cell: ({ row }) => {
        const assigned = row.original.assignedAmount;
        return <>{assigned != null ? formatNum(assigned) : '-'}</>;
      },
    },
    {
      header: t('REDEEMED'),
      accessorKey: 'redeemedAmount',
      cell: ({ row }) => <>{formatNum(row.original.redeemedAmount)}</>,
    },
    {
      header: t('AVAILABLE'),
      accessorKey: 'availableAmount',
      cell: ({ row }) => <>{formatNum(row.original.availableAmount)}</>,
    },
    {
      header: tg('STATUS'),
      accessorKey: 'status',
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge className="text-xs w-full">
            {status === 'REDEEMED' ? t('REDEEMED') : ` ${t('NOT_REDEEMED')}`}
          </Badge>
        );
      },
    },
  ];

  const table = useReactTable({
    data: filteredInkinds,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <>
      <h3 className="text-md font-semibold mb-3">{t('INKIND_BENEFITS')}</h3>
      <DemoTable table={table} tableHeight="h-[calc(100vh-600px)]" />
    </>
  );
};

export default InkindDetails;

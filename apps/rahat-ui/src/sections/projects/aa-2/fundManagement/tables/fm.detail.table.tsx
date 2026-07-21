import React from 'react';
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { useFMDetailTableColumns } from '../columns/useFMDetailColumns';
import { useTranslations } from 'next-intl';
import {
  ClientSidePagination,
  DemoTable,
  Heading,
  SearchInput,
} from 'apps/rahat-ui/src/common';

interface IProps {
  group: any[];
  loading?: boolean;
  title: string;
  status?: string;
}

export default function FundManagementDetailTable({
  group,
  loading,
  title,
}: IProps) {
  const t = useTranslations('AA Project');
  const tg = useTranslations('GLOBAL');
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const columns = useFMDetailTableColumns();
  const table = useReactTable({
    data: group || [],
    columns,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnVisibility,
      columnFilters,
    },
  });

  return (
    <div className="border rounded-sm p-4">
      <Heading
        title={title}
        titleStyle="text-lg"
        description={t('DETAILED_VIEW_OF_THE_SELECTED_BENEFICIARY2')}
      />
      <SearchInput
        className="w-full mb-2"
        name={tg('WALLET_ADDRESS')}
        value={
          (table.getColumn('walletAddress')?.getFilterValue() as string) ?? ''
        }
        onSearch={(event) =>
          table.getColumn('walletAddress')?.setFilterValue(event.target.value)
        }
      />
      <DemoTable
        table={table}
        tableHeight="h-[calc(100vh-550px)]"
        loading={loading}
        message={tg('NO_DATA_AVAILABLE')}
      />
      <ClientSidePagination table={table} />
    </div>
  );
}

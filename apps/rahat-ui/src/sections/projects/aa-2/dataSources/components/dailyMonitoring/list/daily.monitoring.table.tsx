import { Table, flexRender } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';

import {
  Table as TableComponent,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@rahat-ui/shadcn/components/table';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { NoResult, SpinnerLoader } from 'apps/rahat-ui/src/common';

type IProps = {
  table: Table<any>;
  loading: boolean;
};

export default function DailyMonitoringTable({ table, loading }: IProps) {
  const t = useTranslations('AA_PROJECT');
  return (
    <TableComponent>
      <ScrollArea className="h-[calc(100vh-322px)]">
        <TableHeader className="sticky top-0 bg-gray-100">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={table.getAllColumns().length}
                className="h-24 text-center"
              >
                {loading ? (
                  <SpinnerLoader />
                ) : (
                  <NoResult message={t('NO_DAILY_MONITORING_AVAILABLE')} />
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </ScrollArea>
    </TableComponent>
  );
}

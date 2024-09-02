import * as React from 'react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table as TableComponent,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@rahat-ui/shadcn/components/table';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { useTriggerStatementTableColumns } from './useTriggerStatementsColumns';
import TableLoader from 'apps/rahat-ui/src/components/table.loader';
import CustomPagination from 'apps/rahat-ui/src/components/customPagination';
import { useAATriggerStatements, usePagination } from '@rahat-ui/query';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';

export default function TriggerStatementsList() {
  const columns = useTriggerStatementTableColumns();

  const { id } = useParams();
  const projectId = id as UUID;

  const {
    pagination,
    setNextPage,
    setPrevPage,
    setPerPage,
    setPagination,
    filters,
  } = usePagination();

  React.useEffect(() => {
    setPagination({ page: 1, perPage: 10 });
  }, []);

  const { data, isLoading } = useAATriggerStatements(projectId, {
    ...pagination,
    ...filters,
  });

  const tableData = data?.httpReponse.data?.data;
  const tableMeta = data?.httpReponse.data?.meta;

  const table = useReactTable({
    manualPagination: true,
    data: tableData ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) return <TableLoader />;

  return (
    <div className="border bg-card rounded">
      <TableComponent>
        <ScrollArea className={'h-[calc(100vh-344px)]'}>
          <TableHeader className="sticky top-0 bg-slate-50">
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </ScrollArea>
      </TableComponent>
      <CustomPagination
        meta={
          tableMeta || {
            total: 0,
            currentPage: 0,
            lastPage: 0,
            perPage: 0,
            next: null,
            prev: null,
          }
        }
        handleNextPage={setNextPage}
        handlePrevPage={setPrevPage}
        handlePageSizeChange={setPerPage}
        currentPage={pagination.page}
        perPage={pagination.perPage}
        total={tableMeta?.lastPage || 0}
      />
    </div>
  );
}

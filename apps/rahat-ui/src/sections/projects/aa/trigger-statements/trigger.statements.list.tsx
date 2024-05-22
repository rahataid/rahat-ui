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
import { usePagination } from '@rahat-ui/query';
import CustomPagination from '../../../../components/customPagination';
import TableLoader from 'apps/rahat-ui/src/components/table.loader';

type IProps = {
  isLoading: boolean
  tableData: any
  tableScrollAreaHeight: string
}

export default function TriggerStatementsList({ isLoading, tableData, tableScrollAreaHeight }: IProps) {
  const { pagination, setNextPage, setPrevPage, setPerPage, setPagination } =
    usePagination();

  React.useEffect(() => {
    setPagination({ page: 1, perPage: 10 });
  }, []);

  const columns = useTriggerStatementTableColumns();

  const table = useReactTable({
    manualPagination: true,
    data: tableData || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) return <TableLoader />;

  return (
    <div className='border bg-card rounded'>
      <TableComponent>
        <ScrollArea className={tableScrollAreaHeight}>
          <TableHeader className="sticky top-0">
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
      {/* Custom Pagination  */}
      <CustomPagination
        meta={{
          total: 0,
          currentPage: 0,
          lastPage: 0,
          perPage: 0,
          next: null,
          prev: null,
        }}
        handleNextPage={setNextPage}
        handlePrevPage={setPrevPage}
        handlePageSizeChange={setPerPage}
        currentPage={pagination.page}
        perPage={pagination.perPage}
        total={0}
      />
    </div>
  );
}

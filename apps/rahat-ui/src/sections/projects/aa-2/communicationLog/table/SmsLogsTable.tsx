import {
  Table ,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@rahat-ui/shadcn/components/table';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import useSmsLogsTableColumns from './useSmsLogsTableColumns';
import {
  ScrollArea,
  ScrollBar,
} from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import SearchAndFilterToolbar from '../components/SearchAndFilterToolbar';
import { useState } from 'react';
import { usePagination } from '@rahat-ui/query';
import CustomPagination from 'apps/rahat-ui/src/components/customPagination';

export default function SmsLogsTable({ data }: { data: any[] }) {
  const columns = useSmsLogsTableColumns();
  const [filters, setFilters] = useState({});
    const { pagination, setNextPage, setPrevPage, setPerPage, setPagination } =
         usePagination();
          // Static data for pagination
     const mockMeta = {
        
         total: 0,
         currentPage: 0,
         lastPage: 0,
         perPage: 0,
         next: null,
         prev: null,
       
     };
   

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
 <>
  <div className="flex justify-between gap-2">
         <SearchAndFilterToolbar
           table={table}
           filters={filters}
           setFilters={setFilters}
           setPagination={setPagination}
           pagination={pagination}
         />
       </div>
 
 <div className=" bg-card border rounded mt-4">
    <ScrollArea className="h-[calc(100vh-320px)]">
      <Table>
        <TableHeader className="sticky top-0 bg-card">
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
                colSpan={columns.length}
                className="h-24 text-center"
              >
                {/* {isLoading ? <SpinnerLoader /> : <NoResult />} */}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>

          <CustomPagination
          meta={mockMeta} // Pass the static pagination metadata
          handleNextPage={() => {
            if (pagination.page < mockMeta.lastPage) {
              setPagination({ ...pagination, page: pagination.page + 1 });
            }
          }}
          handlePrevPage={() => {
            if (pagination.page > 1) {
              setPagination({ ...pagination, page: pagination.page - 1 });
            }
          }}
        
          handlePageSizeChange={(value) => {
            setPagination({ ...pagination, perPage: Number(value), page: 1 });
          }}
          currentPage={pagination.page}
          perPage={pagination.perPage}
        />
    
    {/* <ClientSidePagination table={table} /> */}
  </div>
 
 
 
 </>
  );
}

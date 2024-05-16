'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@rahat-ui/shadcn/src/components/ui/table';
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import * as React from 'react';
import useAduitColumns from './useAduitColumns';
import {
  // useAuditList,
  useQuery,
  useRSQuery,
} from '@rumsan/react-query';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';

// const data = [
//   {
//     id: 'm5gr84i9',
//     tableName: 'tbl_beneficiaries',
//     operation: 'CREATE',
//     fieldName:
//       'gender, location, age, bankedStatus, internetStatus, phoneStatus, walletAddress',
//     timestamp: '2024-05-08T11:59:26.026Z',
//     userName: 'Jon doe',
//   },
//   {
//     id: 'm5gr84i1',
//     tableName: 'tbl_beneficiaries',
//     operation: 'CREATE',
//     fieldName:
//       'gender, location, age, bankedStatus, internetStatus, phoneStatus, walletAddress',
//     timestamp: '2024-05-08T11:59:26.026Z',
//     userName: 'Jon doe',
//   },
//   {
//     id: 'm5gr84i2',
//     tableName: 'tbl_beneficiaries',
//     operation: 'CREATE',
//     fieldName:
//       'gender, location, age, bankedStatus, internetStatus, phoneStatus, walletAddress',
//     timestamp: '2024-05-08T11:59:26.026Z',
//     userName: 'Jon doe',
//   },
//   {
//     id: 'm5gr84i3',
//     tableName: 'tbl_beneficiaries',
//     operation: 'CREATE',
//     fieldName:
//       'gender, location, age, bankedStatus, internetStatus, phoneStatus, walletAddress',
//     timestamp: '2024-05-08T11:59:26.026Z',
//     userName: 'Jon doe',
//   },
//   {
//     id: 'm5gr84i4',
//     tableName: 'tbl_beneficiaries',
//     operation: 'CREATE',
//     fieldName:
//       'gender, location, age, bankedStatus, internetStatus, phoneStatus, walletAddress',
//     timestamp: '2024-05-08T11:59:26.026Z',
//     userName: 'Jon doe',
//   },
// ];

const useAuditList = (payload?: any) => {
  const { queryClient, rumsanService } = useRSQuery();
  const [isFetched, setIsFetched] = React.useState(false);
  // const setAudit = useAuditStore((state) => state.setAuditList);

  const query = useQuery(
    {
      queryKey: ['get_audits'], // [TAGS.GET_ALL_AUDIT],
      enabled: !isFetched,
      queryFn: async () => {
        const res = await rumsanService.client.get('/audits');
        return res.data;
      },
    },
    queryClient,
  );

  React.useEffect(() => {
    if (query.isFetched) {
      setIsFetched(true);
    }
  }, [query.isFetched]);

  return query;
};

export function AuditTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const columns = useAduitColumns();
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const { data } = useAuditList();

  const table = useReactTable({
    data: data?.data || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="rounded border bg-card h-[calc(100vh-80px)]">
      <Table>
        <ScrollArea className="h-table1">
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </ScrollArea>
      </Table>
    </div>
  );
}

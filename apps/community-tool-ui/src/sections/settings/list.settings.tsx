'use client';

import React, { useMemo, useState } from 'react';
import { useRumsanService } from '../../providers/service.provider';
import {
  ColumnDef,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { SettingList } from '@rahataid/community-tool-sdk/settings/settings.types';

import {
  TableBody,
  TableCell,
  Table as TableComponent,
  TableHead,
  TableHeader,
  TableRow,
} from '@rahat-ui/shadcn/components/table';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import CustomPagination from '../../components/customPagination';
import { useCommunitySettingList } from '@rahat-ui/community-query';
import { usesettingTableColumns } from './useSettingColumns';

// interface BeneficiaryData {
//   name: string;
//   dataType: string;
//   isPrivate: boolean;
//   isReadOnly: boolean;
//   requiredFields: [];
// }

// const columns: ColumnDef<BeneficiaryData>[] = [
//   {
//     header: 'Name',
//     accessorKey: 'name',
//     cell: ({ row }) => <div>{row.getValue('name')}</div>,
//   },
//   {
//     header: 'DataType',
//     accessorKey: 'dataType',
//     cell: ({ row }) => <div>{row.getValue('dataType')}</div>,
//   },
//   {
//     header: 'IsPrivate',
//     accessorKey: 'isPrivate',
//     cell: ({ row }) => <div>{row.original.isPrivate ? 'Yes' : 'No'}</div>,
//   },
//   {
//     header: 'IsReadOnly',
//     accessorKey: 'isReadOnly',
//     cell: ({ row }) => <div>{row.original.isReadOnly ? 'Yes' : 'No'}</div>,
//   },
//   {
//     header: 'RequiredFields',
//     accessorKey: 'requiredFields',
//     cell: ({ row }) => {
//       return (
//         <div>
//           {row.original.requiredFields.map((field, index) => (
//             <li key={index}>{field}</li>
//           ))}
//         </div>
//       );
//     },
//   },
// ];

export default function ListSetting() {
  const [perPage, setPerPage] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const columns = usesettingTableColumns();

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const startIndex = (currentPage - 1) * perPage;
  const endIndex = currentPage * perPage;
  const handleNextPage = () => setCurrentPage(currentPage + 1);
  const handlePrevPage = () => setCurrentPage(currentPage - 1);

  const { data } = useCommunitySettingList();

  const pagedData = useMemo(() => {
    return data?.data?.slice(startIndex, endIndex) || [];
  }, [data?.data, startIndex, endIndex]);

  const meta = {
    total: data?.data?.length,
    currentPage,
    lastPage: Math.ceil(data?.data?.length / perPage),
  };

  const table = useReactTable({
    manualPagination: true,
    data: pagedData || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full mt-1 p-1 bg-secondary">
      <div className="rounded border bg-white">
        <TableComponent>
          <ScrollArea className="h-[calc(100vh-135px)]">
            <TableHeader className="bg-card sticky top-0">
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
          <CustomPagination
            meta={data?.response?.meta || meta}
            handleNextPage={handleNextPage}
            handlePrevPage={handlePrevPage}
            handlePageSizeChange={(value) => setPerPage(Number(value))}
            currentPage={currentPage}
            perPage={perPage}
            total={data?.response?.meta?.total || 0}
          />
        </TableComponent>
      </div>
    </div>
  );
}

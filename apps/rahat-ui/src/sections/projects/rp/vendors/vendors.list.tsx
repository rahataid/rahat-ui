'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  useBeneficiaryStore,
  usePagination,
  useProjectAction,
} from '@rahat-ui/query';
import { MS_ACTIONS } from '@rahataid/sdk';
import { useVendorTable } from './useVendorTable';
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

import { Input } from '@rahat-ui/shadcn/components/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@rahat-ui/shadcn/src/components/ui/table';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import TableLoader from 'apps/rahat-ui/src/components/table.loader';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import CustomPagination from 'apps/rahat-ui/src/components/customPagination';

const VendorList = () => {
  const uuid = useParams().id;
  const router = useRouter();
  const [currentPage, setCurrentPage] = React.useState(1);
  // const [perPage, setPerPage] = React.useState(5);
  const [data, setData] = React.useState([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [meta, setMeta] = React.useState();

  const handleViewClick = (rowData: any) => {
    router.push(
      `/projects/rp/${uuid}/vendors/${rowData.walletAddress}?name=${rowData.name}&&walletAddress=${rowData.walletAddress} &&vendorId=${rowData.uuid}`,
    );
  };

  const {
    pagination,
    filters,
    setFilters,
    setNextPage,
    setPrevPage,
    setPerPage,
    selectedListItems,
    setSelectedListItems,
    resetSelectedListItems,
  } = usePagination();

  const columns = useVendorTable({ handleViewClick });

  const tableData = React.useMemo(() => {
    if (data) return data;
    else return [];
  }, [data]);

  const getVendors = useProjectAction();
  const table = useReactTable({
    data: tableData,
    columns,
    manualPagination: true,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  const fetchVendors = async () => {
    const result = await getVendors.mutateAsync({
      uuid,
      data: {
        action: MS_ACTIONS.VENDOR.LIST_BY_PROJECT,
        payload: {
          page: pagination.page,
          perPage: pagination.perPage,
        },
      },
    });
    console.log({ result });

    const filteredData = result?.data;

    console.log({ filteredData });
    setMeta(result.response.meta);
    setData(filteredData);
  };

  React.useEffect(() => {
    fetchVendors();
  }, [pagination]);

  return (
    <div className="w-full h-full p-2 bg-secondary">
      <div className="flex items-center mb-2">
        <Input
          placeholder="Filter Vendors..."
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="w-full"
        />
      </div>
      <div className="rounded bg-card">
        <Table>
          <ScrollArea className="h-table1">
            <TableHeader className="bg-card sticky top-0">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : (
                          <>
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                          </>
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
                    {getVendors.isPending ? (
                      <TableLoader />
                    ) : (
                      'No Data Available'
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </ScrollArea>
        </Table>
        <CustomPagination
          currentPage={pagination.page}
          handleNextPage={setNextPage}
          handlePageSizeChange={setPerPage}
          handlePrevPage={setPrevPage}
          perPage={pagination.perPage}
          meta={meta || { total: 0, currentPage: 0 }}
        />
      </div>
    </div>
  );
};

export default VendorList;

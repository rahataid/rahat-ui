'use client';
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
import Loader from 'apps/community-tool-ui/src/components/Loader';

import { PROJECT_SETTINGS_KEYS, useProjectAction, useProjectSettingsStore } from '@rahat-ui/query';
import { Button } from '@rahat-ui/shadcn/components/button';
import { Input } from '@rahat-ui/shadcn/components/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@rahat-ui/shadcn/components/table';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { MS_ACTIONS } from '@rahataid/sdk';
import { useParams, useRouter } from 'next/navigation';
import { useVendorTable } from './useVendorTable';
import TableLoader from 'apps/rahat-ui/src/components/table.loader';
import { useAllVendorVoucher, useProjectVoucher, useVendorVoucher } from 'apps/rahat-ui/src/hooks/el/subgraph/querycall';
import SpinnerLoader from '../../components/spinner.loader';

export type Transaction = {
  id: string;
  topic: string;
  beneficiary: number;
  voucherId: string;
  timestamp: string;
  txHash: string;
};

export default function VendorsList() {
  const router = useRouter();
  const uuid = useParams().id;

  const vendorList = useAllVendorVoucher()

  const handleViewClick = (rowData: any) => {
    router.push(
      `/projects/el/${uuid}/vendors/${rowData.walletaddress}?phone=${rowData.phone}&&name=${rowData.name}&&walletAddress=${rowData.walletaddress} &&vendorId=${rowData.vendorId}`,
    );
  };

  const contractSettings = useProjectSettingsStore(
    (state) => state.settings?.[uuid]?.[PROJECT_SETTINGS_KEYS.CONTRACT] || null,
  );
  const voucherDetail = useProjectVoucher(
    contractSettings?.elproject?.address || '',
    contractSettings?.eyevoucher?.address || '',
  );

  const voucherPrice = Number(voucherDetail?.data?.freeVoucherPrice);

  const columns = useVendorTable({ handleViewClick, voucherPrice });
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [data, setData] = React.useState([]);

  const getVendors = useProjectAction();

  const table = useReactTable({
    data,
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

  const [perPage, setPerPage] = React.useState<number>(5);
  const [currentPage, setCurrentPage] = React.useState<number>(1);

  const fetchVendors = async () => {

    const result = await getVendors.mutateAsync({
      uuid,
      data: {
        action: MS_ACTIONS.VENDOR.LIST_BY_PROJECT,
        payload: {
          page: currentPage,
          perPage,
        },
      },
    });
    
    const filteredData = result?.data.map((row: any) => {
      return {
        name: row.User.name,
        walletaddress: row.User.wallet,
        phone: row.User.phone,
        vendorId: row.User.uuid,
        redemptionNumber: row.redemptionNumber
      };
    });

    let totalVoucher:number;

    const vendorListArray = Object.values(vendorList?.data?.voucherArray || {});

    const filteredDataWithVoucher = filteredData?.map((row:any) => {
      totalVoucher = 0;
      vendorListArray?.map((voucherRow:any) => {
        
          if(row?.walletaddress?.toLowerCase() === voucherRow?.id?.toLowerCase()){
            totalVoucher = Number(voucherRow?.freeVoucherRedeemed) + Number(voucherRow?.referredVoucherRedeemed)
          }
        
      })
      return{...row, totalVoucherRedemmed: totalVoucher}
    })

    setData(filteredDataWithVoucher);
  };

  React.useEffect(() => {
    fetchVendors();
  }, [vendorList?.isFetched]);

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
      <div className="rounded  h-[calc(100vh-180px)] bg-card">
        <Table>
          <ScrollArea className="h-table1">
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
            {vendorList?.isFetched ? <TableBody>
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
                      'No data available.'
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>: <div className='w-full h-48 flex justify-center items-center' ><Loader /></div>}
          </ScrollArea>
        </Table>
      </div>
      <div className="sticky bottom-0 flex items-center justify-end space-x-4 px-4 py-1 border-t-2 bg-card">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

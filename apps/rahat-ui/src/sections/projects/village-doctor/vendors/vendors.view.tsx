import {
  useCambodiaVendorsList,
  useCambodiaVendorsStatsByVendorIds,
  usePagination,
} from '@rahat-ui/query';
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { useParams } from 'next/navigation';
import React from 'react';
import SearchInput from '../../components/search.input';
import Pagination from 'apps/rahat-ui/src/components/pagination';
import { useDebounce } from 'apps/rahat-ui/src/utils/useDebouncehooks';
import CambodiaTable from '../table.component';
import { useCambodiaVendorsTableColumns } from './use.vendors.table.columns';
import {
  Card,
  CardContent,
  CardHeader,
} from '@rahat-ui/shadcn/components/card';
import { SlidersHorizontal } from 'lucide-react';

export default function VendorsView() {
  const { id } = useParams() as { id?: string };
  const projectUUID = typeof id === 'string' ? id : undefined;
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const { filters, setFilters } = usePagination();

  const debouncedSearch = useDebounce(filters, 500);
  const { data: vendors, isLoading } = useCambodiaVendorsList({
    projectUUID,
    ...(debouncedSearch as any),
  });

  const vendorIdsForStats = React.useMemo(() => {
    const rows = vendors?.data;
    if (!Array.isArray(rows)) return [] as string[];
    const ids: string[] = [];
    for (const v of rows) {
      const rawId =
        v && typeof v === 'object' && 'vendorId' in v ? v.vendorId : undefined;
      const trimmed =
        rawId != null && typeof rawId === 'string' ? rawId.trim() : '';
      if (trimmed) ids.push(trimmed);
    }
    return ids;
  }, [vendors?.data]);

  const { statsByVendorId } = useCambodiaVendorsStatsByVendorIds({
    projectUUID,
    vendorIds: vendorIdsForStats,
  });

  const tableData: any = React.useMemo(() => {
    if (vendors?.data)
      return vendors?.data.map((vendor) => {
        const vendorKey =
          vendor?.vendorId != null &&
          typeof vendor.vendorId === 'string' &&
          vendor.vendorId.trim()
            ? vendor.vendorId.trim()
            : '';
        const referrals =
          vendorKey !== '' ? statsByVendorId[vendorKey] ?? null : undefined;
        return {
          ...vendor,
          name: vendor.User?.name,
          phone: vendor.User?.phone,
          wallet: vendor.User?.wallet,
          username: vendor.User?.username,
          successfulReferrals: referrals,
        };
      });
    else return [];
  }, [vendors?.data, statsByVendorId]);
  const columns = useCambodiaVendorsTableColumns();
  const table = useReactTable({
    data: tableData || [],
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
  const handleFilterChange = (event: any) => {
    if (event && event.target) {
      const { name, value } = event.target;
      table.getColumn(name)?.setFilterValue(value);
      setFilters({
        ...filters,
        [name]: value,
      });
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <div className="border-b border-border/80 bg-card/95 px-6 py-5 shadow-sm shadow-black/[0.03] backdrop-blur supports-[backdrop-filter]:bg-card/90">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Eye Partners
          </h1>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Manage Eye Partner profiles, assignments, and performance for this
            program.
          </p>
        </div>
      </div>

      <div className="flex-1 space-y-6 overflow-auto p-6">
        <Card className="flex flex-col overflow-hidden">
          <CardHeader className="border-b border-border px-5 py-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
              Search
            </div>
            <SearchInput
              name="name"
              className="w-full lg:max-w-sm"
              value={table.getColumn('name')?.getFilterValue() as string}
              onSearch={(event) => handleFilterChange(event)}
            />
          </CardHeader>
          <CardContent className="space-y-0 p-0">
            <CambodiaTable
              table={table}
              tableHeight="h-[calc(100vh-420px)]"
              loading={isLoading}
              emptyMessage="No eye partner optical store found."
            />
            <div className="border-t border-border/70 bg-muted/15 px-3 py-2">
              <Pagination
                pageIndex={table.getState().pagination.pageIndex}
                pageCount={table.getPageCount()}
                setPageSize={table.setPageSize}
                canPreviousPage={table.getCanPreviousPage()}
                previousPage={table.previousPage}
                canNextPage={table.getCanNextPage()}
                nextPage={table.nextPage}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

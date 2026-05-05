'use client';
import {
  useCambodiaDiscardedBeneficiaries,
  usePagination,
} from '@rahat-ui/query';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import {
  Card,
  CardContent,
  CardHeader,
} from '@rahat-ui/shadcn/components/card';
import { UUID } from 'crypto';
import { SlidersHorizontal } from 'lucide-react';
import { useParams } from 'next/navigation';
import React from 'react';
import SearchInput from '../../components/search.input';
import CambodiaTable from '../table.component';
import { useDiscardedCambodiaBeneficiaryTableColumns } from './use.beneficiary.table.columns';
import { useDebounce } from 'apps/rahat-ui/src/utils/useDebouncehooks';
import CustomPagination from 'apps/rahat-ui/src/components/customPagination';
import { VillageDoctorDetailChrome } from '../page-shell';

export default function DiscardedBeneficiaryView() {
  const { id } = useParams() as { id: UUID };
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const {
    pagination,
    filters,
    setFilters,
    setNextPage,
    setPrevPage,
    setPerPage,
    selectedListItems,
    setSelectedListItems,
  } = usePagination();

  const debouncedSearch = useDebounce(filters, 500);
  const { data, isLoading } = useCambodiaDiscardedBeneficiaries({
    page: pagination.page,
    perPage: pagination.perPage,
    order: 'desc',
    sort: 'createdAt',
    projectUUID: id,
    ...debouncedSearch,
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
  const columns = useDiscardedCambodiaBeneficiaryTableColumns();
  const table = useReactTable({
    manualPagination: true,
    data: data?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setSelectedListItems,
    getFilteredRowModel: getFilteredRowModel(),
    getRowId(originalRow) {
      return originalRow.walletAddress;
    },

    state: {
      columnVisibility,
      rowSelection: selectedListItems,
    },
  });
  return (
    <VillageDoctorDetailChrome
      title="Discarded villagers"
      subtitle="Records removed from active reporting. Use search to investigate specific entries."
      backHref={`/projects/el-village-doctor/${id}/villagers`}
    >
      <Card className="overflow-hidden border-border/80 shadow-sm">
        <CardHeader className="border-b border-border/60 px-5 py-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            Filters
          </div>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <SearchInput
              name="name"
              className="w-full lg:max-w-md"
              value={
                (table.getColumn('name')?.getFilterValue() as string) ??
                filters?.name
              }
              onSearch={(event) => handleFilterChange(event)}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-0 p-0">
          <CambodiaTable
            table={table}
            loading={isLoading}
            tableHeight="h-[calc(100vh-420px)]"
          />
          <CustomPagination
            currentPage={pagination.page}
            handleNextPage={setNextPage}
            handlePrevPage={setPrevPage}
            handlePageSizeChange={setPerPage}
            meta={
              (data?.response?.meta as any) || {
                total: 0,
                currentPage: 0,
              }
            }
            perPage={pagination?.perPage}
            total={data?.response?.meta?.total || 0}
          />
        </CardContent>
      </Card>
    </VillageDoctorDetailChrome>
  );
}

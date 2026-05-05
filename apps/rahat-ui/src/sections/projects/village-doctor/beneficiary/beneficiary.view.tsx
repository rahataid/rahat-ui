'use client';
import { useCambodiaBeneficiaries, usePagination } from '@rahat-ui/query';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import CustomPagination from 'apps/rahat-ui/src/components/customPagination';
import { useDebounce } from 'apps/rahat-ui/src/utils/useDebouncehooks';
import { UUID } from 'crypto';
import { Download, UserRoundX } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import * as XLSX from 'xlsx';
import SearchInput from '../../components/search.input';
import SelectComponent from '../select.component';
import CambodiaTable from '../table.component';
import { useCambodiaBeneficiaryTableColumns } from './use.beneficiary.table.columns';
import {
  Card,
  CardContent,
  CardHeader,
} from '@rahat-ui/shadcn/components/card';
import { SlidersHorizontal } from 'lucide-react';

export default function ELVillageDoctorVillagerView() {
  const { id } = useParams() as { id: UUID };
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const router = useRouter();
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
  // const { name, type, ...otherFilters } = filters;
  const debouncedSearch = useDebounce(filters, 500);

  const { data, isLoading } = useCambodiaBeneficiaries({
    page: pagination.page,
    perPage: pagination.perPage,
    order: 'desc',
    sort: 'createdAt',
    projectUUID: id,
    ...(debouncedSearch as any),
  });
  const { data: allData } = useCambodiaBeneficiaries({
    page: pagination.page,
    perPage: data?.response?.meta?.total,
    order: 'desc',
    sort: 'createdAt',
    projectUUID: id,
    ...(debouncedSearch as any),
  });

  useEffect(() => {
    return () => {
      router.refresh();
    };
  }, [router]);

  const processedData = {
    ...data,
    data: data?.data.map((benef) => ({
      ...benef,
      name: benef?.piiData?.name,
    })),
  };
  const handleFilterChange = (event: any) => {
    if (event && event.target) {
      const { name, value } = event.target;
      const filterValue = value === 'ALL' ? '' : value;
      table.getColumn(name)?.setFilterValue(filterValue);
      setFilters({
        ...filters,
        [name]: filterValue,
      });
    }
  };

  const columns = useCambodiaBeneficiaryTableColumns();
  const table = useReactTable({
    manualPagination: true,
    manualFiltering: true,
    data: processedData?.data || [],
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
  const handleDownload = async () => {
    const rowsToDownload = allData?.data || [];
    const workbook = XLSX.utils.book_new();
    const worksheetData = rowsToDownload?.map((item: any) => {
      const ex = item?.extras || {};
      const vd =
        item.healthWorker?.name ??
        item.health_worker?.name ??
        item.HealthWorker?.name ??
        ex.healthWorkerName ??
        ex.Health_Worker_Name ??
        ex.meta?.Health_Worker_Name ??
        '-';
      return {
        Name: item.piiData?.name,
        Phone: item.piiData?.phone,
        Type: item.type,
        Gender: item.projectData?.gender,
        'Village Doctor': vd,
        TimeStamp: new Date(item.createdAt).toLocaleDateString(),
      };
    });
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Villagers');

    XLSX.writeFile(workbook, 'Villagers.xlsx');
  };
  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <div className="border-b border-border/80 bg-card/95 px-6 py-5 shadow-sm shadow-black/[0.03] backdrop-blur supports-[backdrop-filter]:bg-card/90">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Villagers
            </h1>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
              Track all villagers and referral outcomes for this project.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/projects/el-village-doctor/${id}/villagers/discardedvillager`}
            >
              <Button variant="outline" size="sm">
                <UserRoundX className="mr-2 h-4 w-4" /> Discarded Villagers
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={() => handleDownload()}>
              <Download className="mr-2 h-4 w-4" /> Download Villagers
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-6 overflow-auto p-6">
        <Card className="flex flex-col overflow-hidden">
          <CardHeader className="border-b border-border px-5 py-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
              Filters
            </div>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <SearchInput
                isDisabled={true}
                name="name"
                className="w-full lg:max-w-md cursor-not-allowed"
                value={
                  (table.getColumn('name')?.getFilterValue() as string) ??
                  filters?.name
                }
                onSearch={(event) => handleFilterChange(event)}
              />
              {/* <div className="w-full lg:max-w-xs">
                <SelectComponent
                  name="Type"
                  options={['ALL', 'Sale', 'Lead']}
                  onChange={(value) =>
                    handleFilterChange({
                      target: { name: 'type', value },
                    })
                  }
                  value={filters?.type || ''}
                />
              </div> */}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <CambodiaTable
              table={table}
              loading={isLoading}
              tableHeight="h-[calc(100vh-480px)]"
            />
            <CustomPagination
              currentPage={pagination.page}
              handleNextPage={setNextPage}
              handlePrevPage={setPrevPage}
              handlePageSizeChange={setPerPage}
              meta={
                (processedData?.response?.meta as any) || {
                  total: 0,
                  currentPage: 0,
                }
              }
              perPage={pagination?.perPage}
              total={processedData?.response?.meta?.total || 0}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

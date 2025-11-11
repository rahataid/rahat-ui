import {
  useCambodiaHealthWorkersStats,
  useCHWList,
  usePagination,
  useProjectBeneficiaries,
} from '@rahat-ui/query';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import React from 'react';
import SearchInput from '../../components/search.input';
import AddButton from '../../components/add.btn';
import { useCambodiaChwTableColumns } from './use.chw.table.columns';
import SelectComponent from '../select.component';
import CambodiaTable from '../table.component';
import CustomPagination from 'apps/rahat-ui/src/components/customPagination';
import { filter } from 'lodash';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Coins, Download, Home, Search, Settings2, Users } from 'lucide-react';
import { useDebounce } from 'apps/rahat-ui/src/utils/useDebouncehooks';
import DataCard from 'apps/rahat-ui/src/components/dataCard';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import ViewColumns from '../../components/view.columns';
import * as XLSX from 'xlsx';
import DropdownComponent from '../../components/dropdownComponent';
import MONTHS from '../../../../utils/months.json';
export default function CHWView() {
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
    setPagination,
    resetSelectedListItems,
  } = usePagination();
  const { data: stats } = useCambodiaHealthWorkersStats({
    projectUUID: id,
  }) as any;
  const debouncedSearch = useDebounce(filters, 500);
  const { data } = useCHWList({
    page: pagination.page,
    perPage: pagination.perPage,
    order: 'desc',
    sort: 'createdAt',
    projectUUID: id,
    ...(debouncedSearch as any),
  });

  const { fetchAllData } = useCHWList({
    page: pagination.page,
    perPage: 0,
    order: 'desc',
    sort: 'createdAt',
    projectUUID: id,
    ...(debouncedSearch as any),
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
  const columns = useCambodiaChwTableColumns();
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
  const handleDownload = async () => {
    const rowsToDownload = (await fetchAllData()) || [];
    const workbook = XLSX.utils.book_new();
    const worksheetData = rowsToDownload?.map((item: any) => ({
      healthWorkerName: item.name,
      koboUserName: item.koboUsername,
      sales: item._count.SALE,
      villagersReferred: item._count.LEAD,
      eyeCheckup: item._count.LeadConversions,
      visionCenter: item.vendor.name,
    }));
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'HealthWorkers');

    XLSX.writeFile(workbook, 'HealthWorkers.xlsx');
  };
  const currentYear = new Date().getFullYear();

  const currentMonth = new Date().getMonth() + 1;
  const currentMonthName = MONTHS.find(
    (month) => month.value === currentMonth.toString(),
  );

  const transformedYearData = Array.from({ length: 5 }, (_, index) => {
    const year = currentYear + index;
    return {
      label: year.toString(),
      value: year.toString(),
    };
  });
  const transformedMonthData =
    MONTHS.map((item) => ({
      label: item.label.toString(),
      value: item.value.toString(),
    })) || [];

  const handleSelect = (key: string, value: string) => {
    if (key === 'Months') {
      if (filters.year === undefined) {
        setFilters({ ...filters, month: parseInt(value), year: currentYear });
        return;
      }
      setFilters({ ...filters, month: parseInt(value) });
    }
    if (key === 'Years') {
      setFilters({ ...filters, year: parseInt(value) });
    }
  };
  React.useEffect(() => {
    setFilters({
      ...filters,
      month: undefined,
      year: undefined,
    });
  }, []);
  return (
    <>
      <div className="p-4 bg-white ">
        <div className="mb-4">
          <h1 className="font-semibold text-2xl mb-">Health Workers</h1>
          <p className="text-muted-foreground">
            Track all the health workers here.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-7">
          <DataCard
            title="Sales by CHW"
            number={stats?.data?.sales}
            Icon={Coins}
            className="rounded-lg border-solid "
          />
          <DataCard
            title="Villagers Referred"
            number={stats?.data?.leads}
            Icon={Users}
            className="rounded-lg border-solid"
          />
          <DataCard
            title="Eye Checkup in VC"
            number={stats?.data?.leads_converted}
            Icon={Users}
            className="rounded-lg border-solid"
          />
        </div>
        <div className="rounded-lg border bg-card p-4 ">
          <div className="flex justify-between space-x-2 mb-2">
            <SearchInput
              name="koboUsername"
              className="w-full"
              value={
                (table.getColumn('koboUsername')?.getFilterValue() as string) ??
                filters?.koboUsername
              }
              onSearch={(event) => handleFilterChange(event)}
            />
            <div className="flex">
              <DropdownComponent
                transformedData={transformedMonthData}
                title={'Months'}
                handleSelect={handleSelect}
                current={currentMonthName?.label}
              />
              <DropdownComponent
                transformedData={transformedYearData}
                title={'Years'}
                handleSelect={handleSelect}
                current={currentYear}
              />
            </div>

            <ViewColumns table={table} />
            <Button
              variant="outline"
              className="text-muted-foreground"
              onClick={handleDownload}
            >
              <Download className="w-4 h-4 mr-1" /> Download
            </Button>
          </div>

          <CambodiaTable table={table} tableHeight="h-[calc(100vh-460px)] " />
        </div>
      </div>
      <CustomPagination
        currentPage={pagination.page}
        handleNextPage={setNextPage}
        handlePrevPage={setPrevPage}
        handlePageSizeChange={setPerPage}
        meta={(data?.response?.meta as any) || { total: 0, currentPage: 0 }}
        perPage={pagination?.perPage}
        total={data?.response?.meta?.total || 0}
      />
    </>
  );
}

import {
  useCambodiaHealthWorkersStats,
  useCHWList,
  usePagination,
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
import { useCambodiaChwTableColumns } from './use.chw.table.columns';
import CambodiaTable from '../table.component';
import CustomPagination from 'apps/rahat-ui/src/components/customPagination';
import {
  Download,
  ShoppingBag,
  SlidersHorizontal,
  UserCheck,
  Users,
} from 'lucide-react';
import { useDebounce } from 'apps/rahat-ui/src/utils/useDebouncehooks';
import DataCard from 'apps/rahat-ui/src/components/dataCard';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
} from '@rahat-ui/shadcn/components/card';
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
    perPage: pagination.perPage,
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
      villageDoctorName: item.name,
      koboUserName: item.koboUsername,
      successfulReferrals: item._count?.SALE || 0,
      villagersReferred: item._count?.LEAD || 0,
      eyeCheckup: item._count?.LeadConversions || 0,
      glassesPurchased:
        item.extras?.glassesPurchased || item.extras?.purchaseEyewearCount || 0,
      purchaseAmountRmb:
        item.extras?.purchaseAmountRmb || item.extras?.purchaseAmount || 0,
      eyePartner: item.vendor?.name || '-',
    }));
    const summaryByEyePartner = worksheetData.reduce((acc: any, item: any) => {
      const key = item.eyePartner;
      acc[key] = acc[key] || {
        eyePartner: key,
        villagersReferred: 0,
        successfulReferrals: 0,
        glassesPurchased: 0,
        purchaseAmountRmb: 0,
      };
      acc[key].villagersReferred += item.villagersReferred;
      acc[key].successfulReferrals += item.successfulReferrals;
      acc[key].glassesPurchased += item.glassesPurchased;
      acc[key].purchaseAmountRmb += item.purchaseAmountRmb;
      return acc;
    }, {});
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const summaryWorksheet = XLSX.utils.json_to_sheet(
      Object.values(summaryByEyePartner),
    );
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Raw Data');
    XLSX.utils.book_append_sheet(workbook, summaryWorksheet, 'Summary');

    XLSX.writeFile(workbook, 'VillageDoctorReport.xlsx');
  };
  const currentYear = new Date().getFullYear();
  const START_YEAR = 2025;

  const currentMonth = new Date().getMonth() + 1;
  const currentMonthName = MONTHS.find(
    (month) => month.value === currentMonth.toString(),
  );

  const transformedYearData = Array.from(
    { length: currentYear + 5 - START_YEAR + 1 },
    (_, index) => {
      const year = START_YEAR + index;
      return {
        label: year.toString(),
        value: year.toString(),
      };
    },
  );

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
    <div className="flex h-full min-h-0 flex-col bg-background">
      <div className="border-b border-border/80 bg-card/95 px-6 py-5 shadow-sm shadow-black/[0.03] backdrop-blur supports-[backdrop-filter]:bg-card/90">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Village Doctors
          </h1>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Monitor village doctors (referrers), filter by period, and export
            program reports.
          </p>
        </div>
      </div>

      <div className="flex-1 space-y-6 overflow-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-7">
          <DataCard
            title="Successful Referrals"
            number={stats?.data?.sales}
            Icon={UserCheck}
            className="rounded-lg border-solid "
          />
          <DataCard
            title="Villagers Referred"
            number={stats?.data?.leads}
            Icon={Users}
            className="rounded-lg border-solid"
          />
          <DataCard
            title="Eye Checkups"
            number={stats?.data?.leads_converted}
            Icon={ShoppingBag}
            className="rounded-lg border-solid"
          />
        </div>

        <Card className="flex flex-col overflow-hidden">
          <CardHeader className="border-b border-border px-5 py-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
              Filters
            </div>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <SearchInput
                name="koboUsername"
                className="w-full lg:max-w-sm"
                value={
                  (table
                    .getColumn('koboUsername')
                    ?.getFilterValue() as string) ?? filters?.koboUsername
                }
                onSearch={(event) => handleFilterChange(event)}
              />
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <DropdownComponent
                  transformedData={transformedMonthData}
                  title={'Months'}
                  handleSelect={handleSelect}
                  current={currentMonthName?.label}
                  className="w-full sm:w-[160px]"
                />
                <DropdownComponent
                  transformedData={transformedYearData}
                  title={'Years'}
                  handleSelect={handleSelect}
                  current={currentYear}
                  className="w-full sm:w-[140px]"
                />
                <ViewColumns table={table} />
                <Button
                  variant="outline"
                  className="text-muted-foreground rounded-sm"
                  onClick={handleDownload}
                >
                  <Download className="w-4 h-4 mr-1" /> Download
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <CambodiaTable table={table} tableHeight="h-[calc(100vh-520px)]" />
            <CustomPagination
              currentPage={pagination.page}
              handleNextPage={setNextPage}
              handlePrevPage={setPrevPage}
              handlePageSizeChange={setPerPage}
              meta={(data?.response?.meta as any) || {
                total: 0,
                currentPage: 0,
              }}
              perPage={pagination?.perPage}
              total={data?.response?.meta?.total || 0}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

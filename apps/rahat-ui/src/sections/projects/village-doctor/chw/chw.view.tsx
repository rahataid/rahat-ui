import {
  useCHWList,
  useCambodiaVendorsStats,
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
  Glasses,
  SlidersHorizontal,
  Stethoscope,
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
import { DateRangePicker } from 'apps/rahat-ui/src/components/datePickerRange';
import * as XLSX from 'xlsx';
import { VillageDoctorPageShell } from '../page-shell';
import { DateRange } from 'react-day-picker';
import { toast } from 'react-toastify';

const formatLocalDate = (value: Date) => {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const INVALID_RANGE_MSG = '"To" date cannot be less than "From" date.';

export default function CHWView() {
  const { id } = useParams() as { id: UUID };
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [filterResetKey, setFilterResetKey] = React.useState(0);
  const [dateRangeError, setDateRangeError] = React.useState<string | null>(
    null,
  );

  const showDateRangeError = React.useCallback((message: string) => {
    setDateRangeError(message);
    toast.error(message);
  }, []);

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

  /** CHW API: `from`/`to` are `YYYY-MM-DD` (calendar days in browser local time — server aligns via `reportingUtcOffsetMinutes`). Strip legacy month/year filters and empty dates. */
  const chwListFilters = React.useMemo(() => {
    const raw = (debouncedSearch || {}) as Record<string, unknown>;
    const next: Record<string, unknown> = { ...raw };
    delete next.month;
    delete next.year;
    const from = typeof next.from === 'string' ? next.from.trim() : '';
    const to = typeof next.to === 'string' ? next.to.trim() : '';
    if (from) next.from = from;
    else delete next.from;
    if (to) next.to = to;
    else delete next.to;
    if ((from || to) && typeof window !== 'undefined') {
      next.reportingUtcOffsetMinutes = -new Date().getTimezoneOffset();
    }
    return next;
  }, [debouncedSearch]);

  /** Program-wide totals — not scoped by table date filters. */
  const { data: programStats, isFetching: programStatsFetching } =
    useCambodiaVendorsStats({ projectUUID: id }) as any;
  const { data, fetchAllData } = useCHWList({
    page: pagination.page,
    perPage: pagination.perPage,
    order: 'desc',
    sort: 'createdAt',
    projectUUID: id,
    ...(chwListFilters as any),
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
    let rowsToDownload = (await fetchAllData()) || [];
    if (
      !rowsToDownload.length &&
      Array.isArray(data?.data) &&
      data.data.length
    ) {
      rowsToDownload = data.data;
    }
    const workbook = XLSX.utils.book_new();
    const worksheetData = rowsToDownload?.map((item: any) => ({
      'Village Doctor Name': item.name,
      'Kobo Username': item.koboUsername,
      /** Matches table: conversions in period (not SALE-type beneficiaries). */
      'Total Successful Referrals':
        item._count?.LeadConversions ?? item._count?.SALE ?? 0,
      'Total Villagers Referred': item._count?.LEAD || 0,
      'Total Eyewear Sold':
        item.extras?.glassesPurchased ?? item.extras?.purchaseEyewearCount ?? 0,
      'Total Sales (RMB)':
        item.extras?.purchaseAmountRmb ?? item.extras?.purchaseAmount ?? 0,
      'Eye Partner': item.vendor?.name || '-',
    }));
    const summaryByEyePartner = worksheetData.reduce((acc: any, item: any) => {
      const key = item['Eye Partner'];
      acc[key] = acc[key] || {
        'Eye Partner': key,
        'Total Villagers Referred': 0,
        'Total Successful Referrals': 0,
        'Total Eyewear Sold': 0,
        'Total Sales (RMB)': 0,
      };
      acc[key]['Total Villagers Referred'] += item['Total Villagers Referred'];
      acc[key]['Total Successful Referrals'] +=
        item['Total Successful Referrals'];
      acc[key]['Total Eyewear Sold'] += item['Total Eyewear Sold'];
      acc[key]['Total Sales (RMB)'] += item['Total Sales (RMB)'];
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
  return (
    <VillageDoctorPageShell
      title="Village Doctors"
      subtitle="Monitor village doctors (referrers), filter by period, and export program reports."
      contentClassName="space-y-6"
    >
      <div
        className={`grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-7 ${
          programStatsFetching
            ? 'opacity-70 transition-opacity duration-200'
            : ''
        }`}
      >
        <DataCard
          title="Total Eyewear Sold"
          number={String(programStats?.data?.sales ?? 0)}
          Icon={Glasses}
          className="rounded-xl border border-border/80 shadow-sm shadow-black/[0.03]"
          titleClassName="text-sm font-medium text-muted-foreground"
          cardHeaderClassName="px-5 pb-2 pt-5"
          cardContentClassName="px-5 pb-5 pt-0"
          numberClassName="text-2xl font-semibold tracking-tight text-foreground"
        />
        <DataCard
          title="Total Village Doctors"
          number={String(programStats?.data?.healthWorkers ?? 0)}
          Icon={Stethoscope}
          className="rounded-xl border border-border/80 shadow-sm shadow-black/[0.03]"
          titleClassName="text-sm font-medium text-muted-foreground"
          cardHeaderClassName="px-5 pb-2 pt-5"
          cardContentClassName="px-5 pb-5 pt-0"
          numberClassName="text-2xl font-semibold tracking-tight text-foreground"
        />
        <DataCard
          title="Total Villagers Referred"
          number={String(programStats?.data?.leadsRecieved ?? 0)}
          Icon={Users}
          className="rounded-xl border border-border/80 shadow-sm shadow-black/[0.03]"
          titleClassName="text-sm font-medium text-muted-foreground"
          cardHeaderClassName="px-5 pb-2 pt-5"
          cardContentClassName="px-5 pb-5 pt-0"
          numberClassName="text-2xl font-semibold tracking-tight text-foreground"
        />
        <DataCard
          title="Total Successful Referrals"
          number={String(programStats?.data?.leadsConverted ?? 0)}
          Icon={UserCheck}
          className="rounded-xl border border-border/80 shadow-sm shadow-black/[0.03]"
          titleClassName="text-sm font-medium text-muted-foreground"
          cardHeaderClassName="px-5 pb-2 pt-5"
          cardContentClassName="px-5 pb-5 pt-0"
          numberClassName="text-2xl font-semibold tracking-tight text-foreground"
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
                (table.getColumn('koboUsername')?.getFilterValue() as string) ??
                filters?.koboUsername
              }
              onSearch={(event) => handleFilterChange(event)}
            />
            <div className="flex flex-col items-end gap-1">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <DateRangePicker
                  key={filterResetKey}
                  placeholder="Select date range"
                  type="range"
                  className={`h-9 w-auto${
                    dateRangeError ? ' border-destructive' : ''
                  }`}
                  handleDateChange={(range: DateRange | undefined) => {
                    const from = range?.from
                      ? formatLocalDate(range.from)
                      : undefined;
                    const to = range?.to
                      ? formatLocalDate(range.to)
                      : undefined;

                    if (from && to && to < from) {
                      showDateRangeError(INVALID_RANGE_MSG);
                      return;
                    }

                    setDateRangeError(null);
                    const { from: _f, to: _t, ...rest } = filters;
                    setFilters({
                      ...rest,
                      ...(from ? { from } : {}),
                      ...(to ? { to } : {}),
                    });
                  }}
                  handleClearDate={() => {
                    const { from, to, ...rest } = filters;
                    setFilters(rest);
                    setDateRangeError(null);
                    setFilterResetKey((k) => k + 1);
                  }}
                  onInvalidRange={() => {
                    showDateRangeError(INVALID_RANGE_MSG);
                  }}
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
              {dateRangeError && (
                <p
                  className="w-[280px] self-start text-left text-[11px] leading-tight text-destructive"
                  aria-live="polite"
                >
                  {dateRangeError}
                </p>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <CambodiaTable
            table={table}
            tableHeight="h-[calc(100vh-520px)]"
            emptyMessage="No village doctors found."
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
    </VillageDoctorPageShell>
  );
}

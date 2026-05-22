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
  BadgeDollarSign,
  Coins,
  Download,
  Glasses,
  SlidersHorizontal,
  Stethoscope,
  UserCheck,
  UserCog,
  Users,
  X,
} from 'lucide-react';
import { useDebounce } from 'apps/rahat-ui/src/utils/useDebouncehooks';
import DataCard from 'apps/rahat-ui/src/components/dataCard';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
} from '@rahat-ui/shadcn/components/card';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import ViewColumns from '../../components/view.columns';
import * as XLSX from 'xlsx';
export default function CHWView() {
  const { id } = useParams() as { id: UUID };
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [dateRangeError, setDateRangeError] = React.useState<string | null>(
    null,
  );
  const [filterResetKey, setFilterResetKey] = React.useState(0);
  const todayStr = new Date().toISOString().split('T')[0];

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
        <div
          className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-7 ${
            programStatsFetching ? 'opacity-70 transition-opacity' : ''
          }`}
        >
          <DataCard
            title="Total Eyewear Sold"
            number={String(programStats?.data?.sales ?? 0)}
            Icon={Glasses}
            className="rounded-lg border-solid"
          />
          <DataCard
            title="Total Village Doctors"
            number={String(programStats?.data?.healthWorkers ?? 0)}
            Icon={Stethoscope}
            className="rounded-lg border-solid"
          />
          <DataCard
            title="Total Number of Villagers Referred"
            number={String(programStats?.data?.leadsRecieved ?? 0)}
            Icon={Users}
            className="rounded-lg border-solid"
          />
          <DataCard
            title="Total Number of Successful Referrals"
            number={String(programStats?.data?.leadsConverted ?? 0)}
            Icon={UserCheck}
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
              <div className="flex flex-wrap items-start gap-2 sm:flex-row sm:gap-3">
                <div className={`relative${filters.from ? ' pb-[18px]' : ''}`}>
                  <div className="flex flex-wrap items-end gap-2 sm:gap-3">
                    <div className="flex flex-col gap-1">
                      <Label
                        htmlFor="vd-chw-from"
                        className="text-xs font-normal !text-[#6b7c94]"
                      >
                        From
                      </Label>
                      <Input
                        key={`vd-chw-from-${filterResetKey}`}
                        id="vd-chw-from"
                        type="date"
                        className={`h-9 w-full sm:w-[155px]${
                          dateRangeError ? ' border-destructive' : ''
                        }${
                          !(filters.from ?? '') ? ' text-muted-foreground' : ''
                        }`}
                        value={filters.from ?? ''}
                        max={todayStr}
                        onChange={(e) => {
                          setFilters({ ...filters, from: e.target.value });
                          setDateRangeError(null);
                        }}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <Label
                        htmlFor="vd-chw-to"
                        className="text-xs font-normal !text-[#6b7c94]"
                      >
                        To
                      </Label>
                      <Input
                        key={`vd-chw-to-${filterResetKey}`}
                        id="vd-chw-to"
                        type="date"
                        className={`h-9 w-full sm:w-[155px]${
                          dateRangeError ? ' border-destructive' : ''
                        }${
                          !(filters.to ?? '') ? ' text-muted-foreground' : ''
                        }`}
                        value={filters.to ?? ''}
                        max={todayStr}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (filters.from && val < filters.from) {
                            const { to, ...rest } = filters;
                            setFilters(rest);
                            setDateRangeError(
                              '"To" date cannot be less than "From" date.',
                            );
                          } else {
                            setFilters({ ...filters, to: val });
                            setDateRangeError(null);
                          }
                        }}
                      />
                    </div>
                  </div>
                  {filters.from && (
                    <p
                      className="absolute bottom-0 left-0 min-h-[14px] text-[11px] leading-tight text-destructive"
                      aria-live="polite"
                    >
                      {dateRangeError ?? '\u00A0'}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap items-end gap-2 pt-5 sm:gap-3">
                  {(filters.from || filters.to || dateRangeError) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-9 px-2 text-muted-foreground hover:text-foreground"
                      onClick={() => {
                        const { from, to, ...rest } = filters;
                        setFilters(rest);
                        setDateRangeError(null);
                        setFilterResetKey((k) => k + 1);
                      }}
                      title="Clear date filter"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
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
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <CambodiaTable
              table={table}
              tableHeight="h-[calc(100vh-520px)]"
              emptyMessage="No village doctos found."
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
      </div>
    </div>
  );
}

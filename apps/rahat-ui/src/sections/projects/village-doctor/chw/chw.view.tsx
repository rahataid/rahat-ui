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
  UserCog,
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
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import ViewColumns from '../../components/view.columns';
import * as XLSX from 'xlsx';
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

  /** Same `cambodia.vendor.stats` payload as Eye Partner (omit `vendorId` = program totals). */
  const vendorProgramStatsPayload = React.useMemo(() => {
    const payload: { projectUUID: string; from?: string; to?: string } = {
      projectUUID: id,
    };
    const from =
      typeof chwListFilters.from === 'string' ? chwListFilters.from.trim() : '';
    const to =
      typeof chwListFilters.to === 'string' ? chwListFilters.to.trim() : '';
    if (from) {
      payload.from = new Date(`${from}T00:00:00`).toISOString();
    }
    if (to) {
      payload.to = new Date(`${to}T23:59:59.999`).toISOString();
    }
    return payload;
  }, [id, chwListFilters.from, chwListFilters.to]);

  const { data: programStats, isFetching: programStatsFetching } =
    useCambodiaVendorsStats(vendorProgramStatsPayload) as any;
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
    if (!rowsToDownload.length && Array.isArray(data?.data) && data.data.length) {
      rowsToDownload = data.data;
    }
    const workbook = XLSX.utils.book_new();
    const worksheetData = rowsToDownload?.map((item: any) => ({
      villageDoctorName: item.name,
      koboUserName: item.koboUsername,
      /** Matches table: conversions in period (not SALE-type beneficiaries). */
      successfulReferrals: item._count?.LeadConversions ?? item._count?.SALE ?? 0,
      villagersReferred: item._count?.LEAD || 0,
      glassesPurchased:
        item.extras?.glassesPurchased ??
        item.extras?.purchaseEyewearCount ??
        0,
      purchaseAmountRmb:
        item.extras?.purchaseAmountRmb ?? item.extras?.purchaseAmount ?? 0,
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
            Icon={UserCog}
            className="rounded-lg border-solid"
          />
          <DataCard
            title="Total Number of Successful Referrals"
            number={String(programStats?.data?.leadsRecieved ?? 0)}
            Icon={Users}
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
              <div className="flex flex-wrap items-end gap-2 sm:flex-row sm:gap-3">
                <div className="flex flex-col gap-1">
                  <Label
                    htmlFor="vd-chw-from"
                    className="text-xs font-normal text-muted-foreground"
                  >
                    From
                  </Label>
                  <Input
                    id="vd-chw-from"
                    type="date"
                    className="h-9 w-full sm:w-[155px]"
                    value={filters.from ?? ''}
                    onChange={(e) =>
                      setFilters({ ...filters, from: e.target.value })
                    }
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label
                    htmlFor="vd-chw-to"
                    className="text-xs font-normal text-muted-foreground"
                  >
                    To
                  </Label>
                  <Input
                    id="vd-chw-to"
                    type="date"
                    className="h-9 w-full sm:w-[155px]"
                    value={filters.to ?? ''}
                    onChange={(e) =>
                      setFilters({ ...filters, to: e.target.value })
                    }
                  />
                </div>
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

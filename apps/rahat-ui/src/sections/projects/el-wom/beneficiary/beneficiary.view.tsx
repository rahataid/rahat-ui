import {
  useExportBeneficiaryReferral,
  usePagination,
  useProjectBeneficiaries,
  useSyncLegacyImported,
} from '@rahat-ui/query';
import {
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { UUID } from 'crypto';
import { useParams, useRouter } from 'next/navigation';
import { useElkenyaBeneficiaryTableColumns } from './use.beneficiary.table.columns';
import React, { useEffect } from 'react';
import ElkenyaTable from '../table.component';
import SearchInput from '../../components/search.input';
import SelectComponent from '../select.component';
import ViewColumns from '../../components/view.columns';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dropdown-menu';
import {
  ChevronDown,
  ChevronUp,
  CloudDownload,
  MoreVertical,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import SmsVoucherFiltersTags from '../filtersTags';
import DataTablePagination from '../serverSidePagination';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@rahat-ui/shadcn/src/components/ui/collapsible';
import { cn } from '@rahat-ui/shadcn/src';
import { toast } from 'react-toastify';
import { DateRangePicker } from 'apps/rahat-ui/src/components/datePickerRange';
import { DateRange } from 'react-day-picker';

const toUtcStartOfDayIso = (date: Date) =>
  new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0, 0),
  ).toISOString();

const toUtcEndOfDayIso = (date: Date) =>
  new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      23,
      59,
      59,
      999,
    ),
  ).toISOString();

function buildConsumerDetailQuery(rowData: any): string {
  const p = new URLSearchParams();
  p.set('name', String(rowData?.extras?.vendorName ?? ''));
  p.set('walletAddress', String(rowData?.walletAddress ?? ''));
  p.set('gender', String(rowData?.gender ?? ''));
  p.set('voucherStatus', String(rowData?.voucherStatus ?? ''));
  p.set('eyeCheckupStatus', String(rowData?.eyeCheckupStatus ?? ''));
  p.set('glassesStatus', String(rowData?.glassesStatus ?? ''));
  p.set('voucherType', String(rowData?.voucherType ?? ''));
  p.set('phone', String(rowData?.phone ?? ''));
  p.set('type', String(rowData?.type ?? ''));
  p.set('location', String(rowData?.projectData?.location ?? ''));
  p.set('serialNumber', String(rowData?.extras?.serialNumber ?? ''));
  p.set('age', String(rowData?.extras?.age ?? 0));
  p.set('consent', String(rowData?.extras?.consent ?? ''));
  if (rowData?.createdAt != null) {
    p.set('createdAt', String(rowData.createdAt));
  }
  return p.toString();
}

export default function BeneficiaryView() {
  const { id } = useParams() as { id: UUID };
  const router = useRouter();
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [enabled, setEnabled] = React.useState(false);
  const [filtersOpen, setFiltersOpen] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const apply = () => {
      setFiltersOpen(mq.matches);
    };
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  const {
    pagination,
    filters,
    setFilters,
    setNextPage,
    setPrevPage,
    setFirstPage,
    setLastPage,
    setPerPage,
    selectedListItems,
    setSelectedListItems,
  } = usePagination();

  React.useEffect(() => {
    setFilters({});
  }, [setFilters]);

  const handleDateRangeChange = React.useCallback(
    (date: DateRange | undefined) => {
      const nextFilters: Record<string, any> = { ...filters };

      if (date?.from) {
        nextFilters.startDate = toUtcStartOfDayIso(date.from);
      } else {
        delete nextFilters.startDate;
      }

      if (date?.to) {
        nextFilters.endDate = toUtcEndOfDayIso(date.to);
      } else {
        delete nextFilters.endDate;
      }

      setFilters(nextFilters);
    },
    [filters, setFilters],
  );

  const handleClearDateRange = React.useCallback(() => {
    const nextFilters: Record<string, any> = { ...filters };
    delete nextFilters.startDate;
    delete nextFilters.endDate;
    setFilters(nextFilters);
  }, [filters, setFilters]);

  const isImportedFilterValue =
    typeof (filters as any)?.isImported === 'boolean'
      ? (filters as any).isImported
        ? 'imported'
        : 'non_imported'
      : 'all';

  const handleIsImportedFilterChange = React.useCallback(
    (value: string) => {
      const nextFilters: Record<string, any> = { ...filters };

      if (value === 'imported') {
        nextFilters.isImported = true;
      } else if (value === 'non_imported') {
        nextFilters.isImported = false;
      } else {
        delete nextFilters.isImported;
      }

      setFilters(nextFilters);
    },
    [filters, setFilters],
  );

  const {
    data: beneficiaries,
    isLoading,
    isFetching,
  } = useProjectBeneficiaries({
    page: pagination.page,
    perPage: pagination.perPage,
    order: 'desc',
    sort: 'createdAt',
    projectUUID: id,
    ...filters,
  });
  const { data: referralExportData, isSuccess } = useExportBeneficiaryReferral(
    {
      projectUUID: id,
      ...filters,
    },
    enabled,
  );
  const { mutateAsync: syncLegacyImport, isPending: isSyncingLegacy } =
    useSyncLegacyImported(id);

  const meta = beneficiaries?.response?.meta;

  const handleViewClick = (rowData: any) => {
    const qs = buildConsumerDetailQuery(rowData);
    router.push(`/projects/el-wom/${id}/beneficiary/${rowData.uuid}?${qs}`);
  };

  const columns = useElkenyaBeneficiaryTableColumns({ handleViewClick });
  const table = useReactTable({
    manualPagination: true,
    data: beneficiaries?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getSubRows: (row: any) =>
      row?.isReferrer && row?.referralsMade?.length
        ? row.referralsMade.map((e: any) => ({
            ...e.Referral,
            gender: e.Referral?.gender ?? e.Referral?.extras?.gender,
          }))
        : undefined,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setSelectedListItems,
    getFilteredRowModel: getFilteredRowModel(),
    getRowId(originalRow, index, parent) {
      const base =
        originalRow.walletAddress || originalRow.uuid || String(index);
      return parent ? `${parent.id}.${base}` : base;
    },

    state: {
      columnVisibility,
      rowSelection: selectedListItems,
    },
  });

  const handleDownload = () => {
    if (!meta?.total) {
      toast.error('No data to download.');
      return;
    }
    setEnabled(true);
  };

  const handleSyncLegacyImport = async () => {
    const shouldSync = window.confirm(
      'Sync legacy beneficiaries now? This may take a while based on source data size.',
    );
    if (!shouldSync) return;

    try {
      const result = await syncLegacyImport();
      if (result?.status === 'completed') {
        toast.success(
          `Legacy sync complete. Fetched ${result.fetched || 0}, inserted ${
            result.inserted || 0
          }.`,
        );
        return;
      }
      toast.info(
        result?.reason
          ? `Legacy sync skipped: ${result.reason}`
          : 'Legacy sync skipped.',
      );
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to sync legacy beneficiaries.';
      toast.error(message);
    }
  };

  useEffect(() => {
    if (enabled && isSuccess) {
      if (!referralExportData?.data?.length) {
        toast.error('No data to download.');
      } else {
        generateExcel(referralExportData.data, 'BeneficiaryReferral', 10);
      }
      setEnabled(false);
    }
  }, [enabled, isSuccess, referralExportData?.data]);

  const generateExcel = (data: any, title: string, numberOfColumns: number) => {
    const wb = XLSX.utils.book_new();

    const ws = XLSX.utils.json_to_sheet(data);

    const columnWidths = 25;
    ws['!cols'] = Array(numberOfColumns).fill({ wch: columnWidths });

    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, `${title}.xlsx`);
  };

  const filterFields = (
    <div className="flex gap-2">
      <DateRangePicker
        type="date-range"
        placeholder="Created date range"
        handleDateChange={handleDateRangeChange}
        handleClearDate={handleClearDateRange}
        className="flex-1 w-full"
      />

      <SelectComponent
        onChange={handleIsImportedFilterChange}
        name="Imported"
        options={[
          { value: 'all', label: 'All' },
          { value: 'imported', label: 'Imported' },
          { value: 'non_imported', label: 'Non-Imported' },
        ]}
        value={isImportedFilterValue}
        className="flex-1"
        showSelect={false}
      />

      <SelectComponent
        onChange={(e) => setFilters({ ...filters, consentStatus: e })}
        name="Consent"
        options={[
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
        ]}
        value={filters?.consentStatus || ''}
        className="flex-1"
        showSelect={false}
      />

      <SelectComponent
        onChange={(e) => setFilters({ ...filters, voucherStatus: e })}
        name="Voucher Status"
        options={[
          { value: 'REDEEMED', label: 'Redeemed' },
          { value: 'NOT_REDEEMED', label: 'Not Redeemed' },
        ]}
        value={filters?.voucherStatus || ''}
        className="flex-1"
        showSelect={false}
      />

      <SelectComponent
        onChange={(e) => setFilters({ ...filters, eyeCheckupStatus: e })}
        name="Voucher Usage"
        options={[
          { value: 'CHECKED', label: 'Eye Checkup' },
          {
            value: 'PURCHASE_OF_GLASSES',
            label: 'Purchase of Glasses',
          },
        ]}
        value={filters?.eyeCheckupStatus || ''}
        className="flex-1"
        showSelect={false}
      />

      <SelectComponent
        onChange={(e) => setFilters({ ...filters, voucherType: e })}
        name="Glass Type"
        options={[
          { value: 'READING_GLASSES', label: 'Reading Glasses' },
          { value: 'SUN_GLASSES', label: 'Sun Glasses' },
          { value: 'PRESCRIBED_LENSES', label: 'Prescribed Lenses' },
        ]}
        value={filters?.voucherType || ''}
        className="flex-1"
        showSelect={false}
      />
      <SelectComponent
        onChange={(e) => setFilters({ ...filters, noOfReferrals: e })}
        name="No. of Referrals"
        options={Array.from({ length: 10 }, (_, i) => ({
          value: String(i + 1),
          label: String(i + 1),
        }))}
        value={filters?.noOfReferrals || ''}
        className="flex-1"
        showSelect={false}
      />
    </div>
  );

  const hasServerFilters = Object.keys(filters).length > 0;

  return (
    <div className="p-4">
      <div className="mb-4">
        <h1 className="font-semibold text-2xl md:text-[28px] mb-2">
          Consumers
        </h1>
        <p className="text-muted-foreground text-base">
          Search and filter consumer records; open a row to see full details.
        </p>
      </div>

      <div className="rounded-lg border bg-card p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 mb-4">
          <SearchInput
            className="w-full sm:flex-1 min-w-0"
            name="phone number"
            value={filters?.phoneNumber || ''}
            onSearch={(event) =>
              setFilters({ ...filters, phoneNumber: event.target.value })
            }
          />
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <ViewColumns table={table} />
            <Button
              type="button"
              variant="outline"
              onClick={handleDownload}
              disabled={enabled}
              className="rounded-sm"
            >
              <CloudDownload size={18} className="mr-1" />
              {enabled ? 'Downloading...' : 'Download Referrals'}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  className="p-0"
                  aria-label="More actions"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={handleSyncLegacyImport}
                  disabled={isSyncingLegacy}
                >
                  {isSyncingLegacy ? 'Syncing...' : 'Sync Legacy'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
          <CollapsibleTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={cn(
                'lg:hidden mb-2 -ml-2 text-muted-foreground',
                filtersOpen && 'text-foreground',
              )}
            >
              {filtersOpen ? (
                <ChevronUp className="mr-1 h-4 w-4" />
              ) : (
                <ChevronDown className="mr-1 h-4 w-4" />
              )}
              Filters
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="lg:hidden mb-4 space-y-2">
            {filterFields}
          </CollapsibleContent>
        </Collapsible>

        <div className="hidden lg:block mb-4">{filterFields}</div>

        {hasServerFilters && (
          <SmsVoucherFiltersTags
            filters={filters}
            setFilters={setFilters}
            total={meta?.total || 0}
            labelMapping={{
              phoneNumber: 'Phone Number',
              startDate: 'Start Date',
              endDate: 'End Date',
              isImported: 'Imported',
              consentStatus: 'Consent',
              voucherStatus: 'Voucher Status',
              eyeCheckupStatus: 'Voucher Usage',
              voucherType: 'Glass Type',
              noOfReferrals: 'No. of Referrals',
            }}
          />
        )}

        <ElkenyaTable
          table={table}
          tableHeight={
            hasServerFilters ? 'h-[calc(100vh-420px)]' : 'h-[calc(100vh-360px)]'
          }
          loading={isLoading || isFetching}
        />
      </div>

      <DataTablePagination
        meta={meta || { total: 0, currentPage: 0 }}
        handleNextPage={setNextPage}
        handlePrevPage={setPrevPage}
        handleFirstPage={setFirstPage}
        handleLastPage={setLastPage}
        handlePageSizeChange={setPerPage}
        currentPage={pagination.page}
        perPage={pagination.perPage}
        total={0}
      />
    </div>
  );
}

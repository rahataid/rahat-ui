import {
  useExportBeneficiaryReferral,
  usePagination,
  useProjectBeneficiaries,
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
import { ChevronDown, ChevronUp, CloudDownload } from 'lucide-react';
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
    setFilters('');
  }, [setFilters]);

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
              {enabled ? 'Downloading...' : 'Download'}
            </Button>
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

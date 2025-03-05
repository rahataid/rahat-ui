import {
  useListConsentConsumer,
  usePagination,
  useProjectBeneficiaries,
  useProjectStore,
} from '@rahat-ui/query';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { UUID } from 'crypto';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useElkenyaBeneficiaryTableColumns } from './use.beneficiary.table.columns';
import React, { useEffect } from 'react';
import ElkenyaTable from '../table.component';
import SearchInput from '../../components/search.input';
import AddButton from '../../components/add.btn';
import SelectComponent from '../select.component';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { CloudDownload } from 'lucide-react';
import CustomPagination from 'apps/rahat-ui/src/components/customPagination';
import * as XLSX from 'xlsx';
import SmsVoucherFiltersTags from '../filtersTags';
import DataTablePagination from '../serverSidePagination';

export default function BeneficiaryView() {
  const { id } = useParams() as { id: UUID };
  const router = useRouter();
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const [defaultValue, setDefaultValue] = React.useState<string>('beneficiary');

  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || 'beneficiary';

  const projectClosed = useProjectStore(
    (state) => state.singleProject?.projectClosed,
  );

  useEffect(() => {
    setDefaultValue(tab);
  }, [tab]);
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
    resetSelectedListItems,
  } = usePagination();

  React.useEffect(() => {
    setFilters('');
  }, []);

  const { data: beneficiaries, isLoading } = useProjectBeneficiaries({
    page: pagination.page,
    perPage: pagination.perPage,
    order: 'desc',
    sort: 'createdAt',
    projectUUID: id,
    ...filters,
  });
  const { data: consumerData } = useListConsentConsumer({
    projectUUID: id,
    ...filters,
  });

  const meta = beneficiaries?.response?.meta;

  const handleViewClick = (rowData: any) => {
    router.push(
      `/projects/sms-voucher/${id}/beneficiary/${rowData.uuid}?name=${
        rowData?.extras?.vendorName
      }&&walletAddress=${rowData.walletAddress}&&gender=${
        rowData.gender
      }&&voucherStatus=${rowData.voucherStatus}&&eyeCheckupStatus=${
        rowData.eyeCheckupStatus
      }&&glassesStatus=${rowData.glassesStatus}&&voucherType=${
        rowData.voucherType
      }&&phone=${encodeURIComponent(rowData.phone)}&&type=${
        rowData.type
      }&&location=${rowData?.projectData?.location}&&serialNumber=${
        rowData?.extras?.serialNumber
      }&&age=${rowData?.extras?.age || 0}&&consent=${rowData?.extras?.consent}`,
    );
  };

  const columns = useElkenyaBeneficiaryTableColumns({ handleViewClick });
  const table = useReactTable({
    manualPagination: true,
    data: beneficiaries?.data || [],
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
  const onTabChange = (value) => {
    setDefaultValue(value);
  };

  const handleDownload = () => {
    generateExcel(consumerData.data, 'Consumer', 8);
  };

  const generateExcel = (data: any, title: string, numberOfColumns: number) => {
    const wb = XLSX.utils.book_new();

    const ws = XLSX.utils.json_to_sheet(data);

    const columnWidths = 25;
    ws['!cols'] = Array(numberOfColumns).fill({ wch: columnWidths });

    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, `${title}.xlsx`);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4 ml-4">
        <div>
          <h1 className="font-semibold text-2xl mb-">Consumers</h1>
          <p className="text-muted-foreground">
            Track all the consumer reports here.
          </p>
        </div>
      </div>
      <div className="p-4 pt-2">
        <div className="rounded border bg-card p-4">
          <div className="flex justify-between gap-2 mb-2">
            <SearchInput
              className="w-full"
              name="phone number"
              value={
                (table.getColumn('phone')?.getFilterValue() as string) ?? ''
              }
              onSearch={(event) =>
                table.getColumn('phone')?.setFilterValue(event.target.value)
              }
            />

            <SelectComponent
              onChange={(e) => setFilters({ ...filters, consentStatus: e })}
              name="Consent"
              options={[
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' },
                { value: 'skip', label: 'Skip' },
              ]}
              value={filters?.consentStatus || ''}
            />
            <SelectComponent
              onChange={(e) => setFilters({ ...filters, voucherStatus: e })}
              name="Voucher Status"
              options={[
                { value: 'REDEEMED', label: 'Redeemed' },
                { value: 'NOT_REDEEMED', label: 'Not Redeemed' },
              ]}
              value={filters?.voucherStatus || ''}
            />
            <SelectComponent
              onChange={(e) => setFilters({ ...filters, eyeCheckupStatus: e })}
              name="Voucher Usage"
              options={[
                { value: 'CHECKED', label: 'Eye Checkup' },
                { value: 'PURCHASE_OF_GLASSES', label: 'Purchase of Glasses' },
              ]}
              value={filters?.eyeCheckupStatus || ''}
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
            />
            <Button type="button" variant="outline" onClick={handleDownload}>
              <CloudDownload size={18} className="mr-1" />
              Download
            </Button>
          </div>
          {Object.keys(filters).length != 0 && (
            <SmsVoucherFiltersTags
              filters={filters}
              setFilters={setFilters}
              total={meta?.total || 0}
              labelMapping={{
                consentStatus: 'Consent',
                voucherStatus: 'Voucher Status',
                eyeCheckupStatus: 'Voucher Usage',
                voucherType: 'Glass Type',
              }}
            />
          )}
          <ElkenyaTable
            table={table}
            tableHeight={
              Object.keys(filters).length
                ? 'h-[calc(100vh-389px)]'
                : 'h-[calc(100vh-323px)]'
            }
            loading={isLoading}
          />
        </div>
      </div>
      {/* <CustomPagination
        meta={meta || { total: 0, currentPage: 0 }}
        handleNextPage={setNextPage}
        handlePrevPage={setPrevPage}
        handlePageSizeChange={setPerPage}
        currentPage={pagination.page}
        perPage={pagination.perPage}
        total={0}
      /> */}
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

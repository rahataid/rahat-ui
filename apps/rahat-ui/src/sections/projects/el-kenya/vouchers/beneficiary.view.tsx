import {
  useBulkCreateDisbursement,
  usePagination,
  useFindUnSyncedBenefiicaries,
} from '@rahat-ui/query';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { UUID } from 'crypto';
import { useParams, useRouter } from 'next/navigation';
import { useBeneficiaryTableColumns } from './use.beneficiary.table.columns';
import React, { useEffect } from 'react';
import ElkenyaTable from '../table.component';
import SearchInput from '../../components/search.input';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Plus } from 'lucide-react';
import BenBulkVouchersAssignModel from './beneficiary.bulk.assign.voucher.model';
import CustomPagination from 'apps/rahat-ui/src/components/customPagination';

export type Payment = {
  name: string;
};

interface BeneficiaryViewProps {
  handleStepDataChange: (e) => void;
  handleNext: any;
}

export default function BeneficiaryView({
  handleNext,
  handleStepDataChange,
}: BeneficiaryViewProps) {
  const router = useRouter();
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
    resetSelectedListItems,
  } = usePagination();

  const benData = useFindUnSyncedBenefiicaries(id, {
    page: pagination.page,
    perPage: pagination.perPage,
    order: 'desc',
    sort: 'updatedAt',
    projectUUID: id,
    ...filters,
  });

  const [rowData, setRowData] = React.useState<Payment[]>([]);
  const [rowSelection, setRowSelection] = React.useState({});

  const meta = benData?.data?.response?.meta;

  const columns = useBeneficiaryTableColumns();
  const table = useReactTable({
    manualPagination: true,
    data: rowData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    // onRowSelectionChange: setSelectedListItems,
    getFilteredRowModel: getFilteredRowModel(),
    getRowId(originalRow) {
      return originalRow.walletAddress;
    },
    onRowSelectionChange: (e) => {
      setRowSelection(e);
    },
    state: {
      columnVisibility,
      rowSelection,
    },
  });
  useEffect(() => {
    handleStepDataChange({
      target: {
        name: 'selectedBeneficiaries',
        value: table.getSelectedRowModel().rows.map((value) => value.original),
      },
    });
  }, [rowSelection]);

  useEffect(() => {
    if (benData?.isSuccess) {
      const unSyncedBeneficiaries = benData?.data?.data?.map((beneficiary) => {
        return {
          name: beneficiary?.piiData?.name,
          phone: beneficiary?.piiData?.phone,
          disbursementAmount: beneficiary?.Disbursements[0]?.amount || '0',
          walletAddress: beneficiary?.walletAddress,
          voucherStatus: beneficiary?.voucherStatus,
        };
      });
      if (JSON.stringify(unSyncedBeneficiaries) !== JSON.stringify(rowData)) {
        setRowData(unSyncedBeneficiaries);
      }
    }
  }, [benData?.data, benData?.isSuccess, rowData]);

  // const handleBulkAssign = async () => {
  //   await bulkAssignDisbursement.mutateAsync({
  //     amount: 1,
  //     beneficiaries: table
  //       .getSelectedRowModel()
  //       .rows.map((row) => row.original.walletAddress),
  //   });
  // };

  return (
    <>
      <div className="p-4">
        <div className="rounded border bg-card p-4">
          <div className="flex justify-between space-x-2 mb-2">
            <SearchInput
              className="w-full"
              name="beneficiary"
              onSearch={(e) => setFilters({ ...filters, name: e.target.value })}
            />
            <Button type="button" onClick={() => handleNext()}>
              <Plus size={18} className="mr-1" />
              Bulk Assign
            </Button>
          </div>
          <ElkenyaTable table={table} tableHeight="h-[calc(100vh-640px)]" />
        </div>
      </div>
      <CustomPagination
        meta={meta || { total: 0, currentPage: 0 }}
        handleNextPage={setNextPage}
        handlePrevPage={setPrevPage}
        handlePageSizeChange={setPerPage}
        currentPage={pagination.page}
        perPage={pagination.perPage}
        total={0}
      />
    </>
  );
}

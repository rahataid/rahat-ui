import { usePagination, useProjectBeneficiaries } from '@rahat-ui/query';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { UUID } from 'crypto';
import { useParams, useRouter } from 'next/navigation';
import { useElkenyaBeneficiaryTableColumns } from './use.beneficiary.table.columns';
import React from 'react';
import ElkenyaTable from '../table.component';
import SearchInput from '../../components/search.input';
import AddButton from '../../components/add.btn';
import SelectComponent from '../select.component';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { CloudDownload } from 'lucide-react';
import CustomPagination from 'apps/rahat-ui/src/components/customPagination';
import ViewColumns from '../../components/view.columns';

export default function BeneficiaryView() {
  const { id } = useParams() as { id: UUID };
  const router = useRouter();
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

  const beneficiaries = useProjectBeneficiaries({
    page: pagination.page,
    perPage: pagination.perPage,
    order: 'desc',
    sort: 'createdAt',
    projectUUID: id,
    ...filters,
  });
  const meta = beneficiaries.data.response?.meta;

  const handleViewClick = (rowData: any) => {
    router.push(
      `/projects/el-kenya/${id}/beneficiary/${rowData.uuid}?name=${rowData.name}&&walletAddress=${rowData.walletAddress}&&gender=${rowData.gender}&&voucherStatus=${rowData.voucherStatus}&&eyeCheckupStatus=${rowData.eyeCheckupStatus}&&glassesStatus=${rowData.glassesStatus}&&voucherType=${rowData.voucherType}&&phone=${rowData.phone}&&uuid=${rowData.uuid}`,
    );
  };

  const columns = useElkenyaBeneficiaryTableColumns({ handleViewClick });
  const table = useReactTable({
    manualPagination: true,
    data: beneficiaries.data?.data || [],
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
  return (
    <>
      <div className="p-4">
        <div className="mb-4 flex justify-between items-center">
          <div>
            <h1 className="font-semibold text-[28px]">Beneficiaries</h1>
            <p className="text-muted-foreground text-base">
              Track all the beneficiaries reports here.
            </p>
          </div>
          <Button variant="outline">
            <CloudDownload className="mr-1" /> Import beneficiaries
          </Button>
        </div>
        <div className="rounded border bg-card p-4">
          <div className="flex justify-between space-x-2 mb-2">
            <SearchInput
              className="w-full"
              name="beneficiary"
              onSearch={() => {}}
            />
            <AddButton
              name="Beneficiary"
              path={`/projects/el-kenya/${id}/beneficiary/add`}
            />
          </div>
          <div className="flex justify-between gap-2 mb-4">
            <SelectComponent name="Voucher Type" />
            <SelectComponent name="Beneficiary Type" />
            <SelectComponent name="Eye Checkup Status" />
            <SelectComponent name="Glasses Status" />
            <SelectComponent name="Voucher Status" />
            <ViewColumns table={table} />
          </div>
          <ElkenyaTable table={table} tableHeight="h-[calc(100vh-360px)]" />
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

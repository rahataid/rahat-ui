import { useParams, useRouter, useSearchParams } from 'next/navigation';
import HeaderWithBack from '../../components/header.with.back';
import { UUID } from 'crypto';
import { DatePicker } from 'apps/rahat-ui/src/components/datePicker';
import SearchInput from '../../components/search.input';
import {
  useBeneficiaryList,
  usePagination,
  useProjectBeneficiaries,
  useRpSingleBeneficiaryGroup,
  useUpdateBeneficiaryGroup,
} from '@rahat-ui/query';
import React from 'react';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import ViewColumns from '../../components/view.columns';
import DemoTable from 'apps/rahat-ui/src/components/table';
import CustomPagination from 'apps/rahat-ui/src/components/customPagination';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { useBeneficiaryTableColumns } from '../../../beneficiary/useBeneficiaryColumns';
import { useKenyaGroupedBeneficiaryTableColumns } from './use.grouped.beneficiary.table.columns';

export default function SelectBeneficiaryView() {
  const { id, groupid } = useParams() as { id: UUID; groupid: UUID };
  const router = useRouter();

  const {
    pagination,
    selectedListItems,
    setSelectedListItems,
    setNextPage,
    setPrevPage,
    setPerPage,
    setPagination,
    setFilters,
    filters,
  } = usePagination();

  const searchParams = useSearchParams();

  const name = searchParams.get('name');
  React.useEffect(() => {
    setPagination({ page: 1, perPage: 10, order: 'desc', sort: 'createdAt' });
  }, []);
  const { data } = useRpSingleBeneficiaryGroup(id, groupid);
  const groupedBeneficiariesIds = data?.groupedBeneficiaries?.map((ben) => ({
    uuid: ben?.Beneficiary?.uuid,
  }));

  const beneficiaries = useProjectBeneficiaries({
    page: pagination.page,
    perPage: pagination.perPage,
    order: 'desc',
    sort: 'createdAt',
    projectUUID: id,
    ...filters,
  });
  const meta = beneficiaries.data.response?.meta;

  const tableData = React.useMemo(() => {
    if (beneficiaries) {
      return beneficiaries?.data?.data.filter((ben) => {
        if (!groupedBeneficiariesIds?.find((b) => b.uuid === ben.uuid)) {
          return {
            uuid: ben?.uuid,
            phone: ben?.extras?.phone,
            walletAddress: ben?.walletAddress,
            location: ben?.projectData?.location || ben?.extras?.location,
          };
        }
      });
    } else return [];
  }, [beneficiaries, data]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  // const columns = useBeneficiaryTableColumns();
  const columns = useKenyaGroupedBeneficiaryTableColumns();

  const table = useReactTable({
    manualPagination: true,
    data: tableData,
    columns,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setSelectedListItems,
    getRowId: (row) => row.uuid,
    state: {
      columnVisibility,
      rowSelection: selectedListItems,
    },
  });

  const updateBeneficiaryGroup = useUpdateBeneficiaryGroup();

  const handleUpdateBeneficiaryGroup = async () => {
    const payload = {
      uuid: groupid,
      name,
      beneficiaries: [
        ...Object.keys(selectedListItems).map((uuid) => ({ uuid })),
        ...groupedBeneficiariesIds,
      ],
    };
    try {
      await updateBeneficiaryGroup.mutateAsync(payload);
    } catch (e) {
      console.error('Error while updating beneficiary group::', e);
    }
  };

  React.useEffect(() => {
    if (updateBeneficiaryGroup.isSuccess)
      router.push(`/projects/el-kenya/${id}/beneficiary/group/${groupid}`);
  }, [updateBeneficiaryGroup]);
  return (
    <>
      <div className="p-4">
        <HeaderWithBack
          title="Select Beneficiary"
          subtitle="Select beneficiaries from the list below to them assign to the selected group"
          path={`/projects/el-kenya/${id}/beneficiary/group/${groupid}`}
        />
        <div className="border rounded shadow p-3">
          <div className="flex space-x-2 items-center mb-2">
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
            <ViewColumns table={table} />
          </div>
          <DemoTable
            loading={beneficiaries.isFetching}
            table={table}
            tableHeight="h-[calc(100vh-354px)]"
          />
          <CustomPagination
            currentPage={pagination.page}
            handleNextPage={setNextPage}
            handlePageSizeChange={setPerPage}
            handlePrevPage={setPrevPage}
            perPage={pagination.perPage}
            meta={meta || { total: 0, currentPage: 0 }}
          />
        </div>
      </div>
      <div className="flex justify-between items-center py-2 px-4 border-t">
        <p>Selected: {Object.keys(selectedListItems).length ?? 0}</p>
        <div className="flex space-x-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              router.push(
                `/projects/el-kenya/${id}/beneficiary/group/${groupid}`,
              )
            }
          >
            Cancel
          </Button>

          <Button
            className="px-10"
            onClick={() => handleUpdateBeneficiaryGroup()}
          >
            Add ({Object.keys(selectedListItems).length ?? 0} Beneficiaries )
          </Button>
        </div>
      </div>
    </>
  );
}

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
  getPaginationRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import ViewColumns from '../../components/view.columns';
import DemoTable from 'apps/rahat-ui/src/components/table';
import CustomPagination from 'apps/rahat-ui/src/components/customPagination';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { useBeneficiaryTableColumns } from '../../../beneficiary/useBeneficiaryColumns';

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
  console.log({ groupedBeneficiariesIds }, data);

  const beneficiaries = useProjectBeneficiaries({
    page: pagination.page,
    perPage: pagination.perPage,
    order: 'desc',
    sort: 'createdAt',
    projectUUID: id,
    ...filters,
  });
  const tableData = React.useMemo(() => {
    if (beneficiaries) {
      return beneficiaries?.data?.data.filter((ben) => {
        if (!groupedBeneficiariesIds?.find((b) => b.uuid === ben.uuid)) {
          return ben;
        }
      });
    } else return [];
  }, [beneficiaries, data]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const columns = useBeneficiaryTableColumns();

  const table = useReactTable({
    manualPagination: true,
    data: tableData,
    columns,
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
    const members = table
      .getSelectedRowModel()
      .rows?.map((data) => ({ uuid: data?.original?.uuid }));
    const payload = {
      uuid: groupid,
      name,
      beneficiaries: [...members, ...groupedBeneficiariesIds],
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
              name="beneficiary"
              value={
                (table.getColumn('name')?.getFilterValue() as string) ?? ''
              }
              onSearch={(event) =>
                table.getColumn('name')?.setFilterValue(event.target.value)
              }
              className="rounded w-full"
            />
            <ViewColumns table={table} />
          </div>
          <DemoTable table={table} tableHeight="h-[calc(100vh-307px)]" />
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
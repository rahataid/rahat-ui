import { useParams, useRouter, useSearchParams } from 'next/navigation';
import HeaderWithBack from '../../projects/components/header.with.back';
import { UUID } from 'crypto';
import { DatePicker } from 'apps/rahat-ui/src/components/datePicker';
import SearchInput from '../../projects/components/search.input';
import {
  useBeneficiaryList,
  usePagination,
  useUpdateBeneficiaryGroup,
} from '@rahat-ui/query';
import React from 'react';
import {
  getCoreRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { useBeneficiaryTableColumns } from '../useBeneficiaryColumns';
import ViewColumns from '../../projects/components/view.columns';
import DemoTable from 'apps/rahat-ui/src/components/table';
import CustomPagination from 'apps/rahat-ui/src/components/customPagination';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';

export default function SelectBeneficiaryView() {
  const { Id } = useParams() as { Id: UUID };
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

  React.useEffect(() => {
    setPagination({ page: 1, perPage: 10, order: 'desc', sort: 'createdAt' });
  }, []);
  const { data: Beneficiaries } = useBeneficiaryList({
    ...pagination,
    ...filters,
  });
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const columns = useBeneficiaryTableColumns();

  const table = useReactTable({
    manualPagination: true,
    data: Beneficiaries?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setSelectedListItems,
    getRowId: (row) => row.uuid,
    state: {
      columnVisibility,
      rowSelection: selectedListItems,
    },
  });

  const searchParams = useSearchParams();

  const name = searchParams.get('name');

  const updateBeneficiaryGroup = useUpdateBeneficiaryGroup();

  const handleUpdateBeneficiaryGroup = async () => {
    const members = table
      .getSelectedRowModel()
      .rows?.map((data) => ({ uuid: data?.original?.uuid }));
    const payload = {
      uuid: Id,
      name,
      beneficiaries: members,
    };
    console.log(payload);
    try {
      await updateBeneficiaryGroup.mutateAsync(payload);
    } catch (e) {
      console.error('Error while updating beneficiary group::', e);
    }
  };

  React.useEffect(() => {
    if (updateBeneficiaryGroup.isSuccess)
      router.push(`/beneficiary/groups/${Id}`);
  }, [updateBeneficiaryGroup]);
  return (
    <>
      <div className="p-4">
        <HeaderWithBack
          title="Select Beneficiary"
          subtitle="Select beneficiaries from the list below to them assign to the selected group"
          path={`/beneficiary/groups/${Id}`}
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
            {/* <DatePicker
            placeholder="Pick Start Date"
            handleDateChange={handleDateChange}
            type="start"
          />
          <DatePicker
            placeholder="Pick End Date"
            handleDateChange={handleDateChange}
            type="end"
          /> */}
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
            onClick={() => router.push(`/beneficiary/groups/${Id}`)}
          >
            Cancel
          </Button>
          {/* {addBeneficiary.isPending ? (
        <Button disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Please wait
        </Button>
        ) : ( */}

          <Button className="px-10" onClick={handleUpdateBeneficiaryGroup}>
            Add ({Object.keys(selectedListItems).length ?? 0} Beneficiaries )
          </Button>
          {/* )} */}
        </div>
      </div>
    </>
  );
}

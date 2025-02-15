import * as React from 'react';
import { useParams } from 'next/navigation';
import { useSingleBeneficiaryGroup } from '@rahat-ui/query';
import {
  ColumnFiltersState,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';
import ClientSidePagination from '../../../../components/client.side.pagination';
import Back from '../../../../components/back';
import { UUID } from 'crypto';
import Loader from 'apps/rahat-ui/src/components/table.loader';
import SearchInput from '../../../../components/search.input';
import useDetailsBeneficiaryTableColumn from './table/useDetailsBeneficiaryTableColumn';
import BeneficiaryTable from './table/beneficiary.table';

export default function BeneficiaryGroupDetailView() {
  const params = useParams();
  const projectId = params.id as UUID;
  const groupId = params.groupId as UUID;

  const { data: groupDetails, isLoading } = useSingleBeneficiaryGroup(
    projectId,
    groupId,
  );

  const groupPath = `/projects/aa/${projectId}/groups`;

  const columns = useDetailsBeneficiaryTableColumn();

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );

  const tableData = React.useMemo(() => {
    if (groupDetails) {
      return groupDetails?.groupedBeneficiaries?.map((d: any) => ({
        name: d?.Beneficiary?.pii?.name,
        phone: d?.Beneficiary?.pii?.phone,
        email: d?.Beneficiary?.pii?.email,
        location: d?.Beneficiary?.location,
      }));
    } else return [];
  }, [groupDetails]);

  const table = useReactTable({
    data: tableData ?? [],
    columns,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  });

  return (
    <div className="p-2 bg-secondary h-[calc(100vh-65px)]">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="flex justify-between mb-2">
            <div className=" flex gap-4 items-center">
              <Back path={groupPath.concat('?backFromDetail=true')} />
              <h1 className="text-2xl font-semibold">{groupDetails?.name}</h1>
            </div>
          </div>
          {/* Table Starts  */}
          <div className="flex justify-between gap-2">
            <SearchInput
              name="Beneficiary"
              className="mb-2 w-full"
              value={
                (table.getColumn('name')?.getFilterValue() as string) ?? ''
              }
              onSearch={(event: React.ChangeEvent<HTMLInputElement>) =>
                table.getColumn('name')?.setFilterValue(event.target.value)
              }
            />
            <SearchInput
              name="Location"
              className="mb-2 w-full"
              value={
                (table.getColumn('location')?.getFilterValue() as string) ?? ''
              }
              onSearch={(event: React.ChangeEvent<HTMLInputElement>) =>
                table.getColumn('location')?.setFilterValue(event.target.value)
              }
            />
          </div>
          <div className="bg-card border rounded">
            <BeneficiaryTable
              table={table}
              tableScrollAreaHeight="h-[calc(100vh-232px)]"
            />
            <ClientSidePagination table={table} />
          </div>
          {/* Table Ends  */}
        </>
      )}
    </div>
  );
}

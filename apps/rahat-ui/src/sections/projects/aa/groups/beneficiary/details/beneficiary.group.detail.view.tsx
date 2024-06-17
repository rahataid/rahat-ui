import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  useSingleStakeholdersGroup,
  useDeleteStakeholdersGroups,
} from '@rahat-ui/query';
import {
  ColumnFiltersState,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';
import StakeholdersTable from '../../../stakeholders/stakeholders.table';
import ClientSidePagination from '../../../../components/client.side.pagination';
import EditButton from '../../../../components/edit.btn';
import DeleteButton from '../../../../components/delete.btn';
import Back from '../../../../components/back';
import { UUID } from 'crypto';
import Loader from 'apps/rahat-ui/src/components/table.loader';
import SearchInput from '../../../../components/search.input';
import useDetailsBeneficiaryTableColumn from './table/useDetailsBeneficiaryTableColumn';
import BeneficiaryTable from './table/beneficiary.table';

export default function BeneficiaryGroupDetailView() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as UUID;
  const groupId = params.groupId as UUID;

  const { data: groupDetails, isLoading } = useSingleStakeholdersGroup(
    projectId,
    groupId,
  );

  const deleteStakeholdersGroup = useDeleteStakeholdersGroups();

  const groupPath = `/projects/aa/${projectId}/groups`;
  const editPath = `/projects/aa/${projectId}/groups/stakeholders/${groupId}/edit`;

  const columns = useDetailsBeneficiaryTableColumn();

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );

  const table = useReactTable({
    data: groupDetails?.stakeholders ?? [],
    columns,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  });

  const handleDelete = () => {
    deleteStakeholdersGroup.mutateAsync({
      projectUUID: projectId,
      stakeholdersGroupPayload: { uuid: groupId },
    });
  };

  React.useEffect(() => {
    deleteStakeholdersGroup.isSuccess && router.push(groupPath);
  }, [deleteStakeholdersGroup.isSuccess]);

  return (
    <div className="p-2 bg-secondary h-[calc(100vh-65px)]">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="flex justify-between mb-2">
            <div className=" flex gap-4 items-center">
              <Back path={groupPath} />
              <h1 className="text-2xl font-semibold">{groupDetails?.name}</h1>
            </div>
            <div className="flex gap-4 items-center">
              <EditButton path={editPath} />
              <DeleteButton
                name="Stakeholders Group"
                handleContinueClick={handleDelete}
              />
            </div>
          </div>
          {/* Table Starts  */}
          <div className="flex justify-between gap-2">
            <SearchInput
              name="Stakeholder"
              className="mb-2 w-full"
              value={
                (table.getColumn('name')?.getFilterValue() as string) ?? ''
              }
              onSearch={(event: React.ChangeEvent<HTMLInputElement>) =>
                table.getColumn('name')?.setFilterValue(event.target.value)
              }
            />
            <SearchInput
              name="Organization"
              className="mb-2 w-full"
              value={
                (table.getColumn('organization')?.getFilterValue() as string) ??
                ''
              }
              onSearch={(event: React.ChangeEvent<HTMLInputElement>) =>
                table
                  .getColumn('organization')
                  ?.setFilterValue(event.target.value)
              }
            />
            <SearchInput
              name="Municipality"
              className="mb-2 w-full"
              value={
                (table.getColumn('municipality')?.getFilterValue() as string) ??
                ''
              }
              onSearch={(event: React.ChangeEvent<HTMLInputElement>) =>
                table
                  .getColumn('municipality')
                  ?.setFilterValue(event.target.value)
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

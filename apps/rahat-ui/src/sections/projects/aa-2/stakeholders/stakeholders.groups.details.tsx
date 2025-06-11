import React, { useState } from 'react';

import { useSingleStakeholdersGroup } from '@rahat-ui/query';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import {
  ClientSidePagination,
  DataCard,
  DemoTable,
  HeaderWithBack,
  SearchInput,
} from 'apps/rahat-ui/src/common';
import { UUID } from 'crypto';
import { Plus, User } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useProjectStakeholdersGroupTableColumns } from './columns';

type Props = {};

const StakeholdersGroupsDetails = (props: Props) => {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as UUID;
  const groupId = params.groupId as UUID;
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const columns = useProjectStakeholdersGroupTableColumns();
  const { data: groupDetails, isLoading } = useSingleStakeholdersGroup(
    projectId,
    groupId,
  );

  const table = useReactTable({
    data: groupDetails?.stakeholders || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    // onRowSelectionChange: setSelectedListItems,
    getRowId: (row) => row.uuid,
    state: {
      columnVisibility,
      // rowSelection: selectedListItems,
    },
  });

  return (
    <div className="p-4 ">
      <div className="flex justify-between items-center">
        <HeaderWithBack
          title={groupDetails?.name}
          subtitle="Detailed view of the selected stakeholders group"
          path={`/projects/aa/${projectId}/stakeholders?tab=stakeholdersGroup`}
        />
      </div>
      <div className="flex gap-6 mb-3">
        <DataCard
          className="border-solid w-1/4  h-1/4 rounded-md"
          iconStyle="bg-white text-secondary-muted"
          title="Total Stakeholders"
          Icon={User}
          number={groupDetails?.stakeholders?.length}
        />
      </div>
      <div className="p-4 rounded-sm border">
        <div className="flex justify-between space-x-2 items-center mb-3 ">
          <SearchInput
            className="w-full"
            name="stakeholders name"
            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
            onSearch={(event: React.ChangeEvent<HTMLInputElement>) =>
              table.getColumn('name')?.setFilterValue(event.target.value)
            }
          />
          <SearchInput
            className="w-full"
            name="organization"
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
            className="w-full"
            name="municipality"
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

          <Button
            variant="default"
            type="button"
            onClick={() =>
              router.push(
                `/projects/aa/${projectId}/stakeholders/groups/edit/${groupId}`,
              )
            }
            className=""
          >
            <Plus size={18} className="mr-1" /> Add StakeHolder
          </Button>
        </div>

        <DemoTable
          table={table}
          tableHeight="h-[calc(100vh-500px)]"
          loading={isLoading}
        />

        <ClientSidePagination table={table} />
      </div>
    </div>
  );
};

export default StakeholdersGroupsDetails;

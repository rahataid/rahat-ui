import React, { useState } from 'react';

import {
  useDeleteStakeholdersGroups,
  useSingleStakeholdersGroup,
} from '@rahat-ui/query';
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
  DeleteButton,
  DemoTable,
  HeaderWithBack,
  SearchInput,
} from 'apps/rahat-ui/src/common';
import { UUID } from 'crypto';
import { RefreshCw, User } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useProjectStakeholdersGroupTableColumns } from './columns';
import { AARoles, RoleAuth } from '@rahat-ui/auth';
import { ConflictDialog } from './component/conflict-dialog';
import { useBoolean } from 'apps/rahat-ui/src/hooks/use-boolean';
import Loader from 'apps/community-tool-ui/src/components/Loader';

const StakeholdersGroupsDetails = () => {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as UUID;
  const groupId = params.groupId as UUID;
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [conflictActivities, setConflictActivities] = useState<string[]>([]);
  const conflictDialogOpen = useBoolean();

  const columns = useProjectStakeholdersGroupTableColumns();
  const { data: groupDetails, isLoading } = useSingleStakeholdersGroup(
    projectId,
    groupId,
  );
  const { mutateAsync: deleteGroup, isPending: isDeleting } =
    useDeleteStakeholdersGroups();

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

  const handleDeleteClick = async () => {
    const response = await deleteGroup({
      projectUUID: projectId,
      stakeholdersGroupPayload: {
        uuid: groupId,
      },
    });

    // Check if response has isSuccess flag and activities
    if (response?.isSuccess === false && response?.activities) {
      // Show conflict modal with activities list
      setConflictActivities(response.activities);
      conflictDialogOpen.onTrue();
    } else if (response?.isSuccess !== false) {
      // Delete was successful, navigate back
      router.push(
        `/projects/aa/${projectId}/stakeholders?tab=stakeholdersGroup`,
      );
    }
  };

  return (
    <div className="p-4 ">
      {isDeleting && (
        <div className="absolute inset-0 bg-gray-900 bg-opacity-30 flex items-center justify-center z-50">
          <Loader />
        </div>
      )}
      <ConflictDialog
        open={conflictDialogOpen.value}
        onOpenChange={conflictDialogOpen.setValue}
        activities={conflictActivities}
        groupName={groupDetails?.name || 'Stakeholder Group'}
      />

      <div className="flex justify-between items-center">
        <HeaderWithBack
          title={groupDetails?.name}
          subtitle="Detailed view of the selected stakeholders group"
          path={`/projects/aa/${projectId}/stakeholders?tab=stakeholdersGroup`}
        />
        <div className="flex gap-2">
          <RoleAuth
            roles={[AARoles.ADMIN, AARoles.MANAGER, AARoles.Municipality]}
            hasContent={false}
          >
            <DeleteButton
              name="stakeholders group"
              handleContinueClick={handleDeleteClick}
              className="rounded-sm w-full flex gap-1 items-center p-1"
              label="Delete Group"
              disabled={isDeleting}
            />
          </RoleAuth>
        </div>
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

          <SearchInput
            className="w-full"
            name="supportArea"
            value={
              (table.getColumn('supportArea')?.getFilterValue() as string) ?? ''
            }
            onSearch={(event: React.ChangeEvent<HTMLInputElement>) =>
              table.getColumn('supportArea')?.setFilterValue(event.target.value)
            }
          />

          <RoleAuth
            roles={[AARoles.ADMIN, AARoles.MANAGER, AARoles.Municipality]}
            hasContent={false}
          >
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
              <RefreshCw size={18} className="mr-1" /> Update StakeHolder Group
            </Button>
          </RoleAuth>
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

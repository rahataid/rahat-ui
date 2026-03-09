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
  Back,
  ClientSidePagination,
  DeleteButton,
  DemoTable,
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
    <div
      className="p-4 compact:p-2 flex flex-col"
      style={{ height: 'calc(100vh - 80px)' }}
    >
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

      <div className="flex justify-between items-start mb-2 compact:mb-1 shrink-0">
        <div className="mb-2 compact:mb-0">
          <div className="compact:hidden">
            <Back
              path={`/projects/aa/${projectId}/stakeholders?tab=stakeholdersGroup`}
            />
            <div>
              <h1 className="font-semibold text-[28px]">
                {groupDetails?.name}
              </h1>
              <p className="ml-1 text-muted-foreground text-base">
                Detailed view of the selected stakeholders group
              </p>
            </div>
          </div>
          <div className="hidden compact:flex items-center gap-2 [&>div]:mb-0">
            <Back
              path={`/projects/aa/${projectId}/stakeholders?tab=stakeholdersGroup`}
              className="border border-gray-300 text-gray-500 rounded px-2 py-0.5 mb-0 w-auto"
            />
            <div>
              <h1 className="font-semibold text-base leading-tight">
                {groupDetails?.name}
              </h1>
              <p className="text-muted-foreground text-xs">
                Detailed view of the selected stakeholders group
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-2 shrink-0 mt-2 compact:mt-0">
          <RoleAuth
            roles={[AARoles.ADMIN, AARoles.MANAGER, AARoles.Municipality]}
            hasContent={false}
          >
            <DeleteButton
              name="stakeholders group"
              handleContinueClick={handleDeleteClick}
              className="rounded-sm w-full flex gap-1 items-center p-1 compact:text-xs compact:px-2 compact:h-7"
              label="Delete Group"
              disabled={isDeleting}
            />
          </RoleAuth>
        </div>
      </div>

      {/* Minimal stats card */}
      <div className="flex gap-4 mb-3 compact:mb-2 shrink-0">
        <div className="flex items-center gap-3 border rounded-sm px-4 py-2 compact:px-3 compact:py-1.5 bg-card">
          <div className="bg-secondary rounded-full p-1.5 compact:p-1">
            <User
              size={16}
              className="compact:w-3.5 compact:h-3.5 text-muted-foreground"
            />
          </div>
          <div>
            <p className="text-xs text-muted-foreground leading-tight">
              Total Stakeholders
            </p>
            <p className="text-xl font-bold text-primary compact:text-base leading-tight">
              {groupDetails?.stakeholders?.length ?? 0}
            </p>
          </div>
        </div>
      </div>

      {/* Table card - flex-1 so it fills remaining vertical space */}
      <div className="p-4 compact:p-2 rounded-sm border flex flex-col flex-1 min-h-0">
        <div className="flex justify-between space-x-2 items-center mb-3 compact:mb-2 shrink-0">
          <SearchInput
            className="w-full compact:[&_input]:h-7 compact:[&_input]:text-xs"
            name="stakeholders name"
            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
            onSearch={(event: React.ChangeEvent<HTMLInputElement>) =>
              table.getColumn('name')?.setFilterValue(event.target.value)
            }
          />
          <SearchInput
            className="w-full compact:[&_input]:h-7 compact:[&_input]:text-xs"
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
            className="w-full compact:[&_input]:h-7 compact:[&_input]:text-xs"
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
            className="w-full compact:[&_input]:h-7 compact:[&_input]:text-xs"
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
              className="shrink-0 compact:h-7 compact:text-xs compact:px-2"
            >
              <RefreshCw
                size={18}
                className="mr-1 compact:w-3.5 compact:h-3.5"
              />{' '}
              Update StakeHolder Group
            </Button>
          </RoleAuth>
        </div>

        <div className="flex-1 min-h-0 compact:[&_th]:h-8 compact:[&_th]:px-2 compact:[&_th]:text-xs compact:[&_td]:px-2 compact:[&_td]:py-1 compact:[&_td]:text-xs">
          <DemoTable table={table} tableHeight="h-full" loading={isLoading} />
        </div>

        <ClientSidePagination table={table} />
      </div>
    </div>
  );
};

export default StakeholdersGroupsDetails;

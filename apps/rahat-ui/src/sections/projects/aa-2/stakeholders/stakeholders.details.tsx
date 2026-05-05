'use client';
import {
  DeleteButton,
  EditButton,
  HeaderWithBack,
} from 'apps/rahat-ui/src/common';
import { UUID } from 'crypto';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import StakeHolderInfo from './staholders.info';
import { useDeleteStakeholders, useStakeholderDetails } from '@rahat-ui/query';
import { AARoles, RoleAuth } from '@rahat-ui/auth';
import { ConflictDialog } from './component/conflict-dialog';
import { useBoolean } from 'apps/rahat-ui/src/hooks/use-boolean';
import { useState } from 'react';
const StakeholdersDetail = () => {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as UUID;
  const stakeholderId = params.stakeholdersId as UUID;
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('groupId');
  const details = useStakeholderDetails(projectId, { uuid: stakeholderId });
  const removeStakeholder = useDeleteStakeholders();

  // Conflict dialog state
  const [conflictGroupNames, setConflictGroupNames] = useState<string[]>([]);
  const stakeholderConflictDialog = useBoolean();

  const routeNav = redirectTo
    ? `/projects/aa/${projectId}/stakeholders/groups/${redirectTo}`
    : `/projects/aa/${projectId}/stakeholders`;

  const handleDelete = async () => {
    try {
      const response = await removeStakeholder.mutateAsync({
        projectUUID: projectId,
        stakeholderPayload: { uuid: stakeholderId },
      });

      // Check if response indicates a conflict
      if (response?.data?.isSuccess === false && response?.data?.groupNames) {
        // Show conflict dialog with group names
        setConflictGroupNames(response.data.groupNames);
        stakeholderConflictDialog.onTrue();
        return; // Don't navigate if there's a conflict
      }

      // Only navigate if deletion was successful
      router.replace(routeNav);
    } catch (error) {
      // Error handler in the mutation will show error toast
      console.error('Error deleting stakeholder:', error);
    }
  };
  return (
    <div className="p-4 ">
      <ConflictDialog
        open={stakeholderConflictDialog.value}
        onOpenChange={stakeholderConflictDialog.setValue}
        groupNames={conflictGroupNames}
        stakeholderName={details?.data?.name || 'Stakeholder'}
        conflictType="stakeholder"
      />
      <div className="flex justify-between items-center p-4 ">
        <HeaderWithBack
          title={'Stakeholders Details'}
          subtitle="Detailed view of the selected stakeholder"
          path={routeNav}
        />
        <RoleAuth
          roles={[AARoles.ADMIN, AARoles.MANAGER, AARoles.Municipality]}
        >
          <div className=" flex flex-end justify-end gap-3 mt-auto">
            {/* <Button
            variant="outline"
            style={{ borderColor: 'red' }}
            className="flex items-center gap-3 rounded-md w-36 text-red-600"
          >
            <Trash2 size={16} />
            <span className="text-lg font-thin">Delete</span>
          </Button> */}

            <DeleteButton
              className="rounded flex gap-1 items-center text-sm font-medium"
              name="stakeholder"
              label="Delete"
              handleContinueClick={handleDelete}
            />
            <EditButton
              className="rounded flex gap-1 items-center text-sm font-medium"
              label="Edit"
              onFallback={() =>
                router.push(
                  `/projects/aa/${projectId}/stakeholders/${stakeholderId}/edit`,
                )
              }
            />

            {/* <Button
            variant="outline"
            className="flex  rounded-md  items-center gap-3 w-36"
          >
            <Edit2 size={16} />
            <span className="text-lg font-thin">Edit</span>
          </Button> */}
          </div>
        </RoleAuth>
      </div>

      <div className="flex">
        <div className="flex border rounded-sm flex-col gap-4 p-4 mx-4  w-full">
          <StakeHolderInfo stakeholder={details} />
        </div>
      </div>
    </div>
  );
};

export default StakeholdersDetail;

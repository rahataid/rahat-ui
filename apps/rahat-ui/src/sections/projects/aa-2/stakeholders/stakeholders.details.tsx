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
      <div className="flex justify-between items-center">
        <HeaderWithBack
          title={'Stakeholders Details'}
          subtitle="Detailed view of the selected stakeholder"
          path={routeNav}
        />
        <RoleAuth
          roles={[AARoles.ADMIN, AARoles.MANAGER, AARoles.Municipality]}
        >
          <div className="flex flex-end justify-end gap-[clamp(4px,0.6vw,12px)] mt-auto">
            <DeleteButton
              className="rounded-sm flex gap-1 items-center p-[clamp(4px,0.8vw,8px)] h-[clamp(28px,3vw,36px)] text-[clamp(11px,1vw,14px)] [&_svg]:size-[clamp(14px,1.4vw,18px)]"
              name="stakeholder"
              label="Delete"
              handleContinueClick={handleDelete}
            />
            <EditButton
              className="rounded-sm flex gap-1 items-center p-[clamp(4px,0.8vw,8px)] h-[clamp(28px,3vw,36px)] text-[clamp(11px,1vw,14px)] [&_svg]:size-[clamp(14px,1.4vw,18px)]"
              label="Edit"
              onFallback={() =>
                router.push(
                  `/projects/aa/${projectId}/stakeholders/${stakeholderId}/edit`,
                )
              }
            />
          </div>
        </RoleAuth>
      </div>

      <div className="flex">
        <div className="flex border rounded-sm flex-col gap-[clamp(8px,1vw,16px)] p-[clamp(8px,1.5vw,16px)] mt-[clamp(4px,0.6vw,8px)] w-full">
          <StakeHolderInfo stakeholder={details} />
        </div>
      </div>
    </div>
  );
};

export default StakeholdersDetail;

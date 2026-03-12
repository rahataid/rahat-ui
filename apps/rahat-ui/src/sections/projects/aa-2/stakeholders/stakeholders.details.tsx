'use client';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Back, DeleteButton, EditButton } from 'apps/rahat-ui/src/common';
import { UUID } from 'crypto';
import { Edit2, Trash2 } from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import StakeHolderInfo from './staholders.info';
import { useDeleteStakeholders, useStakeholderDetails } from '@rahat-ui/query';
import { AARoles, RoleAuth } from '@rahat-ui/auth';
const StakeholdersDetail = () => {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as UUID;
  const stakeholderId = params.stakeholdersId as UUID;
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('groupId');
  const details = useStakeholderDetails(projectId, { uuid: stakeholderId });
  const removeStakeholder = useDeleteStakeholders();
  const routeNav = redirectTo
    ? `/projects/aa/${projectId}/stakeholders/groups/${redirectTo}`
    : `/projects/aa/${projectId}/stakeholders`;
  const handleDelete = async () => {
    await removeStakeholder.mutateAsync({
      projectUUID: projectId,
      stakeholderPayload: { uuid: stakeholderId },
    });
    router.push(routeNav);
  };
  return (
    <div
      className="p-4 compact:p-2 flex flex-col"
      style={{ height: 'calc(100vh - 80px)' }}
    >
      <div className="shrink-0 mb-2 compact:mb-1">
        <div className="compact:hidden">
          <Back path={routeNav} />
          <h1 className="font-semibold text-[28px]">Stakeholders Details</h1>
          <p className="ml-1 text-muted-foreground text-base">
            Detailed view of the selected stakeholder
          </p>
        </div>
        <div className="hidden compact:flex items-center gap-2 [&>div]:mb-0">
          <Back
            path={routeNav}
            className="border border-gray-300 text-gray-500 rounded px-2 py-0.5 mb-0 w-auto"
          />
          <div>
            <h1 className="font-semibold text-base leading-tight">
              Stakeholders Details
            </h1>
            <p className="text-muted-foreground text-xs">
              Detailed view of the selected stakeholder
            </p>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <RoleAuth roles={[AARoles.ADMIN, AARoles.MANAGER, AARoles.Municipality]}>
        <div className="flex justify-end gap-3 mb-2 compact:mb-1 shrink-0">
          <DeleteButton
            className="rounded flex gap-1 items-center text-sm font-medium compact:text-xs compact:h-7 compact:px-2"
            name="stakeholder"
            label="Delete"
            handleContinueClick={handleDelete}
          />
          <EditButton
            className="rounded flex gap-1 items-center text-sm font-medium compact:text-xs compact:h-7 compact:px-2"
            label="Edit"
            onFallback={() =>
              router.push(
                `/projects/aa/${projectId}/stakeholders/${stakeholderId}/edit`,
              )
            }
          />
        </div>
      </RoleAuth>

      {/* Content */}
      <div className="flex flex-1 min-h-0">
        <div className="flex border rounded-sm flex-col gap-4 p-4 compact:p-2 w-full overflow-auto">
          <StakeHolderInfo stakeholder={details} />
        </div>
      </div>
    </div>
  );
};

export default StakeholdersDetail;

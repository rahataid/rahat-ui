'use client';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  DeleteButton,
  EditButton,
  HeaderWithBack,
} from 'apps/rahat-ui/src/common';
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
    <div className="p-4 ">
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
        <div className="flex border rounded-lg flex-col gap-4 p-4 mx-4  w-full">
          <StakeHolderInfo stakeholder={details} />
        </div>
      </div>
    </div>
  );
};

export default StakeholdersDetail;

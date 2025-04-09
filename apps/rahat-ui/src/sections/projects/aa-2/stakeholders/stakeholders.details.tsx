'use client';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { HeaderWithBack } from 'apps/rahat-ui/src/common';
import { UUID } from 'crypto';
import { Edit2, Trash2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import StakeHolderInfo from './staholders.info';
import { useStakeholderDetails } from '@rahat-ui/query';
const StakeholdersDetail = () => {
  const params = useParams();
  const projectId = params.id as UUID;
  const stakeholderId = params.stakeholdersId as UUID;

  const details = useStakeholderDetails(projectId, { uuid: stakeholderId });
  return (
    <div className="p-4 ">
      <div className="flex justify-between items-center p-4 ">
        <HeaderWithBack
          title={'Stakeholders Details'}
          subtitle="Detailed view of the selected stakeholder"
          path={`/projects/aa/${projectId}/stakeholders`}
        />
        <div className=" flex flex-end justify-end gap-3 mt-auto">
          <Button
            variant="outline"
            style={{ borderColor: 'red' }}
            className="flex items-center gap-3 rounded-md w-36 text-red-600"
          >
            <Trash2 size={16} />
            <span className="text-lg font-thin">Delete</span>
          </Button>

          <Button
            variant="outline"
            className="flex  rounded-md  items-center gap-3 w-36"
          >
            <Edit2 size={16} />
            <span className="text-lg font-thin">Edit</span>
          </Button>
        </div>
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

'use client';

import { memo } from 'react';

import { AARoles, RoleAuth } from '@rahat-ui/auth';
import { Heading, IconLabelBtn } from 'apps/rahat-ui/src/common';
import { CloudDownloadIcon, Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import GrievancesTabs from './grievances.tabs';

function GrievancesView() {
  const router = useRouter();
  const { id } = useParams();

  const handleDownloadReport = () => {
    console.log('Download report');
  };

  return (
    <div>
      <div className="p-4 pb-2 flex justify-between items-center space-x-4">
        <Heading
          title="Grievances"
          description="Track all the grievances in the project"
        />
        <div className="flex flex-end gap-2">
          <RoleAuth roles={[AARoles.ADMIN]} hasContent={false}>
            <IconLabelBtn
              Icon={CloudDownloadIcon}
              handleClick={handleDownloadReport}
              name="Download Report"
              variant="outline"
            />
          </RoleAuth>
          <RoleAuth roles={[AARoles.ADMIN]} hasContent={false}>
            <IconLabelBtn
              Icon={Plus}
              handleClick={() =>
                router.push(`/projects/aa/${id}/grievances/add`)
              }
              name="Create Grievance"
            />
          </RoleAuth>
        </div>
      </div>

      <div className="px-4">
        <GrievancesTabs />
      </div>
    </div>
  );
}

export default memo(GrievancesView);

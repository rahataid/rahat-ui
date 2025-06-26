import React from 'react';
import GrievanceInfo from './grievances.info';
import { EditButton, HeaderWithBack } from 'apps/rahat-ui/src/common';
import { useParams, useSearchParams } from 'next/navigation';
import { UUID } from 'crypto';
import { useGrievanceDetails } from '@rahat-ui/query';

const GrievancesDetail = () => {
  const params = useParams();
  const projectId = params.id as UUID;
  const grievanceId = params.uuid as UUID;
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('groupId');
  const redirectToFund = searchParams.get('fundId');
  const details = useGrievanceDetails({
    projectUUID: projectId,
    grievanceUUID: grievanceId,
  });
  const navRoute = redirectTo
    ? `/projects/aa/${projectId}/grievances/${redirectTo}`
    : redirectToFund
    ? `/projects/aa/${projectId}/grievances/${redirectToFund}`
    : `/projects/aa/${projectId}/grievances`;

  return (
    <div className="p-4 ">
      <div className="flex justify-between items-center">
        <HeaderWithBack
          title={'Grievance Details'}
          subtitle="Detailed view of the selected grievance"
          path={navRoute}
        />
        <EditButton
          className="rounded flex gap-1 items-center text-sm font-medium"
          label="Edit"
          path={`/projects/aa/${projectId}/grievances/${grievanceId}/edit`}
        />
      </div>

      <div className="flex">
        <div className="flex border rounded-lg flex-col gap-4 p-4 mx-4  w-full">
          <GrievanceInfo grievance={details?.data?.data} />
        </div>
      </div>
    </div>
  );
};

export default GrievancesDetail;

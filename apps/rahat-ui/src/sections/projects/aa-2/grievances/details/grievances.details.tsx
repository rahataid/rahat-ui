import { useGrievanceDetails } from '@rahat-ui/query';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Back, Heading } from 'apps/rahat-ui/src/common';
import { UUID } from 'crypto';
import { PencilIcon } from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import GrievanceInfo from './grievances.info';

const GrievancesDetail = () => {
  const params = useParams();
  const projectId = params.id as UUID;
  const grievanceId = params.uuid as UUID;
  const router = useRouter();
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
    <div className="p-4 mb-2">
      <div className="mb-2 flex flex-col space-y-0">
        <Back path={navRoute} />

        <div className="mt-4 flex justify-between items-center">
          <div>
            <Heading
              title={`Grievance Details`}
              description="Detailed view of the selected grievance"
            />
          </div>
          <Button
            className="rounded flex gap-1 items-center text-sm font-medium w-auto"
            onClick={() =>
              router.push(
                `/projects/aa/${projectId}/grievances/${grievanceId}/edit`,
              )
            }
          >
            <PencilIcon className="h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>

      <div className="flex">
        <div className="flex border rounded-xl flex-col gap-4 p-4 w-full">
          <GrievanceInfo grievance={details?.data?.data} />
        </div>
      </div>
    </div>
  );
};

export default GrievancesDetail;

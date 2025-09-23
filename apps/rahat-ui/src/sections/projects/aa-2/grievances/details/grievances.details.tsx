import { useGrievanceDetails, useGrievanceEditStatus } from '@rahat-ui/query';
import { GrievanceStatus } from '@rahat-ui/query/lib/grievance/types/grievance';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dropdown-menu';
import { Back, Heading } from 'apps/rahat-ui/src/common';
import { grievanceStatus } from 'apps/rahat-ui/src/constants/aa.grievances.constants';
import { UUID } from 'crypto';
import { Check, ChevronDown, PencilIcon } from 'lucide-react';
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
  const { data: details, refetch } = useGrievanceDetails({
    projectUUID: projectId,
    grievanceUUID: grievanceId,
  });

  const { mutateAsync: updateGrievanceStatus } = useGrievanceEditStatus();

  const handleStatusChange = async (status: GrievanceStatus) => {
    try {
      await updateGrievanceStatus({
        projectUUID: projectId,
        grievancePayload: {
          uuid: grievanceId,
          status,
        },
      });
      refetch();
    } catch (error) {
      console.error('Error updating grievance status:', error);
    }
  };
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
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="rounded flex gap-1 items-center text-sm font-medium w-auto"
                >
                  Update Status
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {grievanceStatus.map((status) => {
                  const isCurrentStatus =
                    status.value === details?.data?.status;
                  return (
                    <DropdownMenuItem
                      key={status.value}
                      onClick={() =>
                        handleStatusChange(status.value as GrievanceStatus)
                      }
                      className={`cursor-pointer flex items-center justify-between ${
                        isCurrentStatus ? 'bg-accent' : ''
                      }`}
                    >
                      <span>{status.label}</span>
                      {isCurrentStatus && <Check className="h-4 w-4 ml-2" />}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
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
      </div>

      <div className="flex">
        <div className="flex-col gap-4 w-full">
          <GrievanceInfo grievance={details?.data} />
        </div>
      </div>
    </div>
  );
};

export default GrievancesDetail;

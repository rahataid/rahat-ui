'use client';

import { memo } from 'react';

import { AARoles, RoleAuth } from '@rahat-ui/auth';
import { Heading, IconLabelBtn } from 'apps/rahat-ui/src/common';
import { CloudDownloadIcon, Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import GrievancesTabs from './grievances.tabs';
import { toast } from 'react-toastify';
import { generateExcel } from 'apps/rahat-ui/src/utils';
import { useGrievanceListForDownload } from '@rahat-ui/query';
import { UUID } from 'crypto';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';

function GrievancesView() {
  const router = useRouter();
  const { id } = useParams();

  const projectGrievances = useGrievanceListForDownload(id as UUID);

  const handleDownloadReport = async () => {
    // Check if data is still loading or fetching
    if (projectGrievances.isLoading || projectGrievances.isFetching) {
      return toast.info('Please wait while data is being loaded...');
    }

    // Check if there was an error fetching data
    if (projectGrievances.isError) {
      return toast.error('Failed to load grievance data. Please try again.');
    }

    // Check if data is available
    const grievanceList = projectGrievances?.data?.data;
    if (!grievanceList || grievanceList.length < 1) {
      return toast.error('No grievance data available to download.');
    }

    const mappedData = grievanceList.map((item) => {
      const createdDate = new Date(item.createdAt);
      const updatedDate = new Date(item.updatedAt);
      return {
        Title: item.title || 'N/A',
        Description: item.description || 'N/A',
        Type: item.type || 'N/A',
        Status: item.status || 'N/A',
        Priority: item.priority || 'N/A',
        'Reported By': item.reportedBy || 'N/A',
        'Reporter Contact': item.reporterContact || 'N/A',
        Tags: item.tags?.join(', ') || 'N/A',
        'Created By': item.createdByUser?.name || 'N/A',
        'Created At': createdDate.toLocaleString(),
        'Updated At': updatedDate.toLocaleString(),
      };
    });

    generateExcel(mappedData, 'Grievances_Report', 11);
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
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="inline-block">
                    <IconLabelBtn
                      Icon={CloudDownloadIcon}
                      handleClick={handleDownloadReport}
                      name={
                        projectGrievances.isLoading ||
                        projectGrievances.isFetching
                          ? 'Loading...'
                          : 'Download Report'
                      }
                      variant="outline"
                      className="px-3 py-2"
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {projectGrievances.isLoading || projectGrievances.isFetching
                      ? 'Please wait while grievance data is being loaded...'
                      : 'Download grievance data as Excel file'}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </RoleAuth>
          <RoleAuth roles={[AARoles.ADMIN]} hasContent={false}>
            <IconLabelBtn
              Icon={Plus}
              handleClick={() =>
                router.push(`/projects/aa/${id}/grievances/add`)
              }
              name="Create Grievance"
              className="px-3 py-2"
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

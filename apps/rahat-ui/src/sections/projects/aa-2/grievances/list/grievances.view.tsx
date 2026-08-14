'use client';

import { memo } from 'react';

import { AARoles, RoleAuth } from '@rahat-ui/auth';
import { Heading, IconLabelBtn } from 'apps/rahat-ui/src/common';
import { CloudDownloadIcon, Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import GrievancesTabs from './grievances.tabs';
import { toast } from 'react-toastify';
import { generateExcel } from 'apps/rahat-ui/src/utils';
import {
  mapGrievancePriorityToLabel,
  mapGrievanceStatusToLabel,
  useGrievanceListForDownload,
  mapGrievanceTypeToLabel,
} from '@rahat-ui/query';
import { UUID } from 'crypto';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { useDateFormat } from 'apps/rahat-ui/src/utils/i18n/date';
import { useTranslations } from 'next-intl';

function GrievancesView() {
  const formatDate = useDateFormat();
  const t = useTranslations('AA_PROJECT');
  const tg = useTranslations('GLOBAL');
  const router = useRouter();
  const { id } = useParams();

  const projectGrievances = useGrievanceListForDownload(id as UUID);

  const handleDownloadReport = async () => {
    // Check if data is still loading or fetching
    if (projectGrievances.isLoading || projectGrievances.isFetching) {
      return toast.info(t('PLEASE_WAIT_WHILE_DATA_IS_BEING_LOADED'));
    }

    // Check if there was an error fetching data
    if (projectGrievances.isError) {
      return toast.error(t('FAILED_TO_LOAD_GRIEVANCE_DATA'));
    }

    // Check if data is available
    const grievanceList = projectGrievances?.data?.data;
    if (!grievanceList || grievanceList.length < 1) {
      return toast.error(t('NO_GRIEVANCE_DATA_AVAILABLE_TO_DOWNLOAD'));
    }

    const mappedData = grievanceList.map((item) => {
      return {
        Title: item.title || tg('N_A'),
        Description: item.description || tg('N_A'),
        Type: mapGrievanceTypeToLabel(item.type) || tg('N_A'),
        Status: mapGrievanceStatusToLabel(item.status) || tg('N_A'),
        Priority: mapGrievancePriorityToLabel(item.priority) || tg('N_A'),
        'Reported By': item.reportedBy || tg('N_A'),
        'Reporter Contact': item.reporterContact || tg('N_A'),
        Tags: item.tags?.join(', ') || tg('N_A'),
        'Created By': item.createdByUser?.name || tg('N_A'),
        'Created At': item?.createdAt ? formatDate(item.createdAt, 'MMM d, yyyy, h:mm a') : tg('N_A'),
        'Updated At': item?.updatedAt ? formatDate(item.updatedAt, 'MMM d, yyyy, h:mm a') : tg('N_A'),
        'Closed At': item?.closedAt ? formatDate(item.closedAt, 'MMM d, yyyy, h:mm a') : tg('N_A'),
        'Resolved At': item?.resolvedAt
          ? formatDate(item.resolvedAt, 'MMM d, yyyy, h:mm a')
          : tg('N_A'),
      };
    });

    generateExcel(mappedData, t('GRIEVANCES_REPORT'), 11);
  };

  return (
    <div>
      <div className="p-4 pb-2 flex justify-between items-center space-x-4">
        <Heading
          title={t('GRIEVANCES')}
          description={t('TRACK_ALL_THE_GRIEVANCES_IN_THE')}
        />
        <div className="flex flex-end gap-2">
          <RoleAuth
            roles={[AARoles.ADMIN, AARoles.Municipality]}
            hasContent={false}
          >
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
                          ? t('LOADING')
                          : t('DOWNLOAD_REPORT')
                      }
                      variant="outline"
                      className="px-3 py-2"
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {projectGrievances.isLoading || projectGrievances.isFetching
                      ? t('PLEASE_WAIT_WHILE_DATA_IS_BEING_LOADED')
                      : t('DOWNLOAD_GRIEVANCE_DATA_AS_EXCEL')}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </RoleAuth>
          <RoleAuth
            roles={[AARoles.ADMIN, AARoles.Municipality]}
            hasContent={false}
          >
            <IconLabelBtn
              Icon={Plus}
              handleClick={() =>
                router.push(`/projects/aa/${id}/grievances/add`)
              }
              name={t('CREATE_GRIEVANCE')}
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

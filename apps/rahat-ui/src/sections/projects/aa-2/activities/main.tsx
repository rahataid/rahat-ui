'use client';
import { useActivities } from '@rahat-ui/query';
import { Heading, IconLabelBtn } from 'apps/rahat-ui/src/common';
import { generateExcel } from 'apps/rahat-ui/src/utils';
import { UUID } from 'crypto';
import { CloudDownloadIcon, Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import PhaseContent from './components/phase-content';
import { AARoles, RoleAuth } from '@rahat-ui/auth';
import { useMemo } from 'react';

export default function ActivitiesView() {
  const { id: projectID } = useParams();

  const router = useRouter();
  const { data, activitiesData, isLoading } = useActivities(projectID as UUID, {
    perPage: 9999,
  });
  const preparednessData = useMemo(() => {
    return activitiesData?.filter((d) => d.phase === 'PREPAREDNESS') || [];
  }, [activitiesData]);

  const readinesssData = useMemo(() => {
    return activitiesData?.filter((d) => d.phase === 'READINESS') || [];
  }, [activitiesData]);

  const activationData = useMemo(() => {
    return activitiesData?.filter((d) => d.phase === 'ACTIVATION') || [];
  }, [activitiesData]);

  const handleDownloadReport = () => {
    if (activitiesData.length < 1) return toast.error('No data to download.');
    const mappedData = activitiesData?.map((item: Record<string, any>) => {
      let timeStamp;
      if (item?.completedAt) {
        const d = new Date(item.completedAt);
        const localeDate = d.toLocaleDateString();
        const localeTime = d.toLocaleTimeString();
        timeStamp = `${localeDate} ${localeTime}`;
      }
      return {
        Title: item.title || 'N/A',
        'Early Action': item.category || 'N/A',
        Phase: item.phase || 'N/A',
        Type: item.isAutomated ? 'Automated' : 'Manual' || 'N/A',
        Responsibility: item.responsibility,
        'Responsible Station': item.source || 'N/A',
        Status: item.status || 'N/A',
        Timestamp: timeStamp || 'N/A',
        'Completed by': item.completedBy || 'N/A',
        'Difference in trigger and activity completion':
          item.timeDifference || 'N/A',
      };
    });

    generateExcel(mappedData, 'Activities_Report', 10);
  };
  return (
    <div className="p-4 ">
      <div className="flex justify-between items-center space-x-4">
        <Heading
          title="Activities"
          description="Track all the activities reports here"
        />
        <div className="flex flex-end gap-2">
          <RoleAuth
            roles={[AARoles.ADMIN, AARoles.MANAGER, AARoles.Municipality]}
            hasContent={false}
          >
            <IconLabelBtn
              Icon={CloudDownloadIcon}
              handleClick={handleDownloadReport}
              name="Download Report"
              variant="outline"
            />
          </RoleAuth>
          <RoleAuth
            roles={[AARoles.ADMIN, AARoles.MANAGER, AARoles.Municipality]}
            hasContent={false}
          >
            <IconLabelBtn
              Icon={Plus}
              handleClick={() =>
                router.push(
                  `/projects/aa/${projectID}/activities/add?nav=mainPage`,
                )
              }
              name="Add Activity"
              variant="default"
            />
          </RoleAuth>
        </div>
      </div>
      <div className="grid  lg:grid-cols-1 xl:grid-cols-3  gap-4">
        <PhaseContent
          title="Preparedness"
          description="Overview of preparedness phase"
          phases={preparednessData}
          loading={isLoading}
        />

        <PhaseContent
          title="Readiness"
          description="Overview of readiness phase"
          phases={readinesssData}
          loading={isLoading}
        />

        <PhaseContent
          title="Activation"
          description="Overview of activation phase"
          phases={activationData}
          loading={isLoading}
        />
      </div>
    </div>
  );
}

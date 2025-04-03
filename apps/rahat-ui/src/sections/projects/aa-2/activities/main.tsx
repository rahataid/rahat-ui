'use client';
import { Heading, IconLabelBtn } from 'apps/rahat-ui/src/common';
import { CloudDownloadIcon, Plus } from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useActivities, usePagination } from '@rahat-ui/query';
import { UUID } from 'crypto';
import PhaseContent from './components/phase-content';

export default function ActivitiesView() {
  const { id: projectID } = useParams();
  const searchParams = useSearchParams();

  const router = useRouter();
  const { data, activitiesData, activitiesMeta, isLoading } = useActivities(
    projectID as UUID,
    { perPage: 9999 },
  );
  const preparednessData =
    activitiesData?.filter((d) => d.phase === 'PREPAREDNESS') || [];

  const readinesssData =
    activitiesData?.filter((d) => d.phase === 'READINESS') || [];

  const activationData =
    activitiesData?.filter((d) => d.phase === 'ACTIVATION') || [];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center space-x-4">
        <Heading
          title="Activities"
          description="Track all the activities reports here"
        />
        <div className="flex flex-end gap-2">
          <IconLabelBtn
            Icon={CloudDownloadIcon}
            handleClick={() => {}}
            name="Download Report"
            variant="outline"
          />

          <IconLabelBtn
            Icon={Plus}
            handleClick={() => {}}
            name="Add Activity"
            variant="outline"
          />
        </div>
      </div>
      <div className="grid  lg:grid-cols-1 xl:grid-cols-3  gap-4  items-center   ">
        <PhaseContent
          title="Preparedness"
          description="OverView of preparedness phase"
          phases={preparednessData}
          loading={isLoading}
        />

        <PhaseContent
          title="Readiness"
          description="OverView of readiness phase"
          phases={readinesssData}
          loading={isLoading}
        />

        <PhaseContent
          title="Activation"
          description="OverView of activation phase"
          phases={activationData}
          loading={isLoading}
        />
      </div>
    </div>
  );
}

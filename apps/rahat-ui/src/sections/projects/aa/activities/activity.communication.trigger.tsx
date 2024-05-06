'use client';

import { useParams } from 'next/navigation';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';

import {
  useStakeholdersGroups,
  useTriggerCommunication,
} from '@rahat-ui/query';
import { UUID } from 'crypto';

type IProps = {
  campaignId: string;
};

export default function ActivityCommunicationTrigger({ campaignId }: IProps) {
  const { id } = useParams();
  useStakeholdersGroups(id as UUID, {});

  const triggerCommunication = useTriggerCommunication();

  const handleTriggerCommunication = async () => {
    triggerCommunication.mutateAsync({
      projectUUID: id as UUID,
      activityCommunicationPayload: { campaignId },
    });
  };
  return (
    <div className="flex flex-col gap-2 m-2 p-2 border rounded">
      <h1 className="p-2 font-semibold text-lg bg-secondary">
        Trigger: Activity Communication
      </h1>

      <div className="flex justify-end">
        <Button onClick={() => handleTriggerCommunication()}>Submit</Button>
      </div>
    </div>
  );
}

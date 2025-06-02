import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import DynamicTriggersList from './dynamic.triggers.list';
import {
  useAAStationsStore,
  useAATriggerStatements,
  usePhaseHistory,
} from '@rahat-ui/query';
import React from 'react';
import { UUID } from 'crypto';

type IProps = {
  projectId: string;
  phaseId: string;
};

export default function TriggersListTabs({ projectId, phaseId }: IProps) {
  useAATriggerStatements(projectId as UUID, { perPage: 9999, phaseId: phaseId });
  const triggers = useAAStationsStore((state) => state.triggers);

  const { data: phaseHistory } = usePhaseHistory(projectId as UUID, {
    phaseUuid: phaseId as UUID,
  });

  // const all = React.useMemo(
  //   () => triggers?.filter((t) => t?.phase?.uuid === phaseId),
  //   [triggers, phaseId],
  // );

  const triggered = React.useMemo(
    () =>
      triggers?.filter(
        (t) => t?.isTriggered === true,
      ),
    [triggers],
  );
  const notTriggered = React.useMemo(
    () =>
      triggers?.filter(
        (t) => t?.isTriggered === false,
      ),
    [triggers],
  );

  return (
    <Tabs defaultValue="All">
      <TabsList className="border bg-secondary rounded mb-2">
        <TabsTrigger
          className="w-full data-[state=active]:bg-white"
          value="All"
        >
          All
        </TabsTrigger>
        <TabsTrigger
          className="w-full data-[state=active]:bg-white"
          value="Not Triggered"
        >
          Not Triggered
        </TabsTrigger>
        <TabsTrigger
          className="w-full data-[state=active]:bg-white"
          value="Triggered"
        >
          Triggered
        </TabsTrigger>
        <TabsTrigger
          className="w-full data-[state=active]:bg-white"
          value="History"
        >
          History
        </TabsTrigger>
      </TabsList>
      <TabsContent value="All">
        <DynamicTriggersList projectId={projectId} triggers={triggers} />
      </TabsContent>
      <TabsContent value="Not Triggered">
        <DynamicTriggersList projectId={projectId} triggers={notTriggered} />
      </TabsContent>
      <TabsContent value="Triggered">
        <DynamicTriggersList projectId={projectId} triggers={triggered} />
      </TabsContent>
      <TabsContent value="History">
        <DynamicTriggersList projectId={projectId} history={phaseHistory} />
      </TabsContent>
    </Tabs>
  );
}

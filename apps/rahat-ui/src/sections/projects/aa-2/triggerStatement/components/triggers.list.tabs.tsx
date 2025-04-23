import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import DynamicTriggersList from './dynamic.triggers.list';
import { useAAStationsStore } from '@rahat-ui/query';
import React from 'react';

type IProps = {
  projectId: string;
  phaseId: string;
};

export default function TriggersListTabs({ projectId, phaseId }: IProps) {
  const triggers = useAAStationsStore((state) => state.triggers);

  const all = React.useMemo(
    () => triggers?.filter((t) => t?.phase?.uuid === phaseId),
    [triggers, phaseId],
  );

  const triggered = React.useMemo(
    () =>
      triggers?.filter(
        (t) => t?.isTriggered === true && t?.phase?.uuid === phaseId,
      ),
    [triggers, phaseId],
  );
  const notTriggered = React.useMemo(
    () =>
      triggers?.filter(
        (t) => t?.isTriggered === false && t?.phase?.uuid === phaseId,
      ),
    [triggers, phaseId],
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
        <DynamicTriggersList projectId={projectId} triggers={all} />
      </TabsContent>
      <TabsContent value="Not Triggered">
        <DynamicTriggersList projectId={projectId} triggers={notTriggered} />
      </TabsContent>
      <TabsContent value="Triggered">
        <DynamicTriggersList projectId={projectId} triggers={triggered} />
      </TabsContent>
      <TabsContent value="History">
        <DynamicTriggersList projectId={projectId} triggers={[]} />
      </TabsContent>
    </Tabs>
  );
}

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
};

export default function TriggersListTabs({ projectId }: IProps) {
  const all = useAAStationsStore((state) => state.triggers);
  const triggered = React.useMemo(
    () => all?.filter((t) => t?.isTriggered === true),
    [all],
  );
  const notTriggered = React.useMemo(
    () => all?.filter((t) => t?.isTriggered === false),
    [all],
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
        <DynamicTriggersList projectId={projectId} triggers={triggered} />
      </TabsContent>
    </Tabs>
  );
}

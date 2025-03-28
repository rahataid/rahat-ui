import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import DynamicTriggersList from './dynamic.triggers.list';

type IProps = {
  projectId: string;
};

export default function TriggersListTabs({ projectId }: IProps) {
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
        <DynamicTriggersList projectId={projectId} />
      </TabsContent>
      <TabsContent value="Not Triggered">
        <DynamicTriggersList projectId={projectId} />
      </TabsContent>
      <TabsContent value="Triggered">
        <DynamicTriggersList projectId={projectId} />
      </TabsContent>
      <TabsContent value="History">
        <DynamicTriggersList projectId={projectId} />
      </TabsContent>
    </Tabs>
  );
}

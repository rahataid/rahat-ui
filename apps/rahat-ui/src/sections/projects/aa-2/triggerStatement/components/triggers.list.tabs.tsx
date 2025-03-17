import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import DynamicTriggersList from './dynamic.triggers.list';

export default function TriggersListTabs() {
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
        <DynamicTriggersList />
      </TabsContent>
      <TabsContent value="Not Triggered">
        <DynamicTriggersList />
      </TabsContent>
      <TabsContent value="Triggered">
        <DynamicTriggersList />
      </TabsContent>
      <TabsContent value="History">
        <DynamicTriggersList />
      </TabsContent>
    </Tabs>
  );
}

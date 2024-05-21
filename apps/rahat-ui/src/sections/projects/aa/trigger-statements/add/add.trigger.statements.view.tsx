import { useParams } from 'next/navigation';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import {
  useActivities,
  useActivitiesHazardTypes,
  useActivitiesPhase,
} from '@rahat-ui/query';
import AddAutomatedTriggerForm from './automated.trigger.add.form';
import AddManualTriggerForm from './manual.trigger.add.form';
import { UUID } from 'crypto';

export default function AddTriggerStatementView() {
  const { id: projectID } = useParams();
  useActivities(projectID as UUID, {});
  useActivitiesHazardTypes(projectID as UUID);
  // useActivitiesPhase(projectID as UUID);

  return (
    <div className="p-4 h-[calc(100vh-65px)]">
      <h1 className="text-lg font-semibold mb-6">Add Trigger Statement</h1>
      <div className="border rounded p-4 shadow-md">
        <Tabs defaultValue="automatedTrigger">
          <TabsList>
            <TabsTrigger value="automatedTrigger" className="border w-52">
              Automated Trigger
            </TabsTrigger>
            <TabsTrigger value="manualTrigger" className="ml-2 border w-52">
              Manual Trigger
            </TabsTrigger>
          </TabsList>
          <TabsContent value="automatedTrigger">
            <AddAutomatedTriggerForm />
          </TabsContent>
          <TabsContent value="manualTrigger">
            <AddManualTriggerForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

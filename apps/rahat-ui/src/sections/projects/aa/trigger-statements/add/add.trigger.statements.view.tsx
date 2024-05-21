import { useParams } from 'next/navigation';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import { useActivities, useActivitiesHazardTypes } from '@rahat-ui/query';
import AddAutomatedTriggerForm from './automated.trigger.add.form';
import AddManualTriggerForm from './manual.trigger.add.form';
import { UUID } from 'crypto';
import { UseFormReturn } from 'react-hook-form';

type IProps = {
  activeTab: string;
  onTabChange: (tab: string) => void;
  next: VoidFunction;
  manualForm: UseFormReturn<
    {
      title: string;
      hazardTypeId: string;
    },
    any,
    undefined
  >;
  automatedForm: UseFormReturn<
    {
      title: string;
      hazardTypeId: string;
      dataSource: string;
      location: string;
      readinessLevel?: string | undefined;
      activationLevel?: string | undefined;
    },
    any,
    undefined
  >;
};

export default function AddTriggerStatementView({
  manualForm,
  activeTab,
  onTabChange,
  automatedForm,
}: IProps) {
  const { id: projectID } = useParams();
  useActivities(projectID as UUID, {});
  useActivitiesHazardTypes(projectID as UUID);

  return (
    <>
      <h1 className="text-lg font-semibold mb-6">Add Trigger Statement</h1>
      <Tabs defaultValue={activeTab} onValueChange={onTabChange}>
        <TabsList>
          <TabsTrigger value="automatedTrigger" className="border w-52">
            Automated Trigger
          </TabsTrigger>
          <TabsTrigger value="manualTrigger" className="ml-2 border w-52">
            Manual Trigger
          </TabsTrigger>
        </TabsList>
        <TabsContent value="automatedTrigger">
          <AddAutomatedTriggerForm form={automatedForm} />
        </TabsContent>
        <TabsContent value="manualTrigger">
          <AddManualTriggerForm form={manualForm} />
        </TabsContent>
      </Tabs>
    </>
  );
}

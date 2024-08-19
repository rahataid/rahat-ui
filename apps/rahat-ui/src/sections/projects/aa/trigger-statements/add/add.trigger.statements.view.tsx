import Link from 'next/link';
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
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';

type IProps = {
  nextStep: VoidFunction;
  activeTab: string;
  onTabChange: (tab: string) => void;
  manualForm: UseFormReturn<
    {
      title: string;
      // hazardTypeId: string;
      isMandatory?: boolean | undefined;
    },
    any,
    undefined
  >;
  automatedForm: UseFormReturn<
    {
      title: string;
      // hazardTypeId: string;
      dataSource: string;
      // location: string;
      isMandatory?: boolean | undefined;
      minLeadTimeDays: string;
      maxLeadTimeDays: string;
      probability: string;

      // readinessLevel?: string | undefined;
      // waterLevel: string;
    },
    any,
    undefined
  >;
};

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

export default function AddTriggerStatementView({
  manualForm,
  activeTab,
  onTabChange,
  automatedForm,
  nextStep,
}: IProps) {
  const { id: projectID } = useParams();
  useActivities(projectID as UUID, {});
  // useActivitiesHazardTypes(projectID as UUID);

  const selectedPhase = JSON.parse(
    localStorage.getItem('selectedPhase') as string,
  );

  return (
    <>
      <h1 className="text-lg font-semibold mb-6">
        Add {capitalizeFirstLetter(selectedPhase.name)} Trigger Statement
      </h1>
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
      <div className="flex justify-end mt-8">
        <div className="flex gap-2">
          <Link href={`/projects/aa/${projectID}/trigger-statements`}>
            <Button
              type="button"
              variant="secondary"
              className="bg-red-100 text-red-600 w-36 hover:bg-red-200"
            >
              Cancel
            </Button>
          </Link>
          <Button className="px-8" onClick={nextStep}>
            Next
          </Button>
        </div>
      </div>
    </>
  );
}

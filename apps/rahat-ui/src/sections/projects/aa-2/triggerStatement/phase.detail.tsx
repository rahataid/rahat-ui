import { Back, Heading, IconLabelBtn } from 'apps/rahat-ui/src/common';
import { Plus, Undo2 } from 'lucide-react';
import { TriggersListTabs, TriggersPhaseCard } from './components';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';

export default function PhaseDetail() {
  const params = useParams();
  const projectId = params.id as UUID;
  return (
    <div className="p-4">
      <Back />
      <div className="flex justify-between items-center">
        <Heading
          title="Activation"
          description="Detailed view of the activation phase"
        />
        <div className="flex space-x-2">
          <IconLabelBtn
            variant="outline"
            className="text-primary border-primary"
            Icon={Plus}
            name="Add Trigger"
            handleClick={() => {}}
          />
          <IconLabelBtn Icon={Undo2} name="Revert" handleClick={() => {}} />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <TriggersPhaseCard
          title="Phase Overview"
          subtitle="Overview of activation phase"
          chartLabels={['Mandatory', 'Optional']}
          chartSeries={[10, 2]}
          mandatoryTriggers={10}
          optionalTriggers={2}
          triggeredMandatoryTriggers={8}
          triggeredOptionalTriggers={1}
          hideAddTrigger={true}
          hideViewDetails={true}
        />
        <div className="p-4 border rounded-sm shadow col-span-2">
          <Heading
            title="Triggers"
            titleStyle="text-xl/6"
            description="List of all triggers in the activation phase"
          />
          <TriggersListTabs projectId={projectId} />
        </div>
      </div>
    </div>
  );
}

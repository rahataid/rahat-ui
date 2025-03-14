import { Heading } from 'apps/rahat-ui/src/common';
import { TriggersListCard, TriggersPhaseCard } from './components';

export default function TriggerStatementView() {
  return (
    <div className="p-4">
      <Heading
        title="Trigger Statement"
        description="Track all the trigger reports here"
      />
      <div className="grid grid-cols-3 gap-4">
        <TriggersPhaseCard
          title="Readiness"
          subtitle="Overview of readiness phase"
          handleAddTrigger={() => {}}
          chartLabels={['Mandatory', 'Optional']}
          chartSeries={[10, 2]}
          mandatoryTriggers={10}
          optionalTriggers={2}
          triggeredMandatoryTriggers={8}
          triggeredOptionalTriggers={1}
          handleViewDetails={() => {}}
        />
        <TriggersPhaseCard
          title="Activation"
          subtitle="Overview of activation phase"
          handleAddTrigger={() => {}}
          chartLabels={['Mandatory', 'Optional']}
          chartSeries={[10, 2]}
          mandatoryTriggers={10}
          optionalTriggers={2}
          triggeredMandatoryTriggers={8}
          triggeredOptionalTriggers={1}
          handleViewDetails={() => {}}
        />
        <TriggersListCard />
      </div>
    </div>
  );
}

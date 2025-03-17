import { Heading } from 'apps/rahat-ui/src/common';
import { TriggersListCard, TriggersPhaseCard } from './components';
import { useParams, useRouter } from 'next/navigation';

export default function TriggerStatementView() {
  const router = useRouter();
  const { id } = useParams();
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
          handleAddTrigger={() => {
            router.push(`/projects/aa/${id}/trigger-statements/add`);
          }}
          chartLabels={['Mandatory', 'Optional']}
          chartSeries={[10, 2]}
          mandatoryTriggers={10}
          optionalTriggers={2}
          triggeredMandatoryTriggers={8}
          triggeredOptionalTriggers={1}
          handleViewDetails={() => {
            router.push(`/projects/aa/${id}/trigger-statements/111`);
          }}
        />
        <TriggersPhaseCard
          title="Activation"
          subtitle="Overview of activation phase"
          handleAddTrigger={() => {
            router.push(`/projects/aa/${id}/trigger-statements/add`);
          }}
          chartLabels={['Mandatory', 'Optional']}
          chartSeries={[10, 2]}
          mandatoryTriggers={10}
          optionalTriggers={2}
          triggeredMandatoryTriggers={8}
          triggeredOptionalTriggers={1}
          handleViewDetails={() => {
            router.push(`/projects/aa/${id}/trigger-statements/111`);
          }}
        />
        <TriggersListCard />
      </div>
    </div>
  );
}

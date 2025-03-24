import { Heading } from 'apps/rahat-ui/src/common';
import { TriggersListCard, TriggersPhaseCard } from './components';
import { useParams, useRouter } from 'next/navigation';
import { useActivitiesPhase, useActivitiesStore } from '@rahat-ui/query';
import { UUID } from 'crypto';

export default function TriggerStatementView() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as UUID;

  useActivitiesPhase(projectId);
  const phases = useActivitiesStore((state) => state.phases);

  return (
    <div className="p-4">
      <Heading
        title="Trigger Statement"
        description="Track all the trigger reports here"
      />
      <div className="grid grid-cols-3 gap-4">
        {phases
          .filter((p) => p.name !== 'PREPAREDNESS')
          .map((d) => (
            <TriggersPhaseCard
              key={d.id}
              title={d.name}
              subtitle={`Overview of ${d.name.toLowerCase()} phase`}
              handleAddTrigger={() => {
                localStorage.setItem(
                  'selectedPhase',
                  JSON.stringify({ id: d.uuid, name: d.name }),
                );
                router.push(`/projects/aa/${projectId}/trigger-statements/add`);
              }}
              chartLabels={['Mandatory', 'Optional']}
              chartSeries={[10, 2]}
              mandatoryTriggers={10}
              optionalTriggers={2}
              triggeredMandatoryTriggers={8}
              triggeredOptionalTriggers={1}
              handleViewDetails={() => {
                router.push(
                  `/projects/aa/${projectId}/trigger-statements/${d.uuid}`,
                );
              }}
            />
          ))}
        <TriggersListCard />
      </div>
    </div>
  );
}

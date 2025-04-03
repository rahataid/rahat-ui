import { Heading } from 'apps/rahat-ui/src/common';
import { TriggersListCard, TriggersPhaseCard } from './components';
import { useParams, useRouter } from 'next/navigation';
import {
  useAAStationsStore,
  useAATriggerStatements,
  usePhases,
  usePhasesStore,
} from '@rahat-ui/query';
import { UUID } from 'crypto';

export default function TriggerStatementView() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as UUID;

  usePhases(projectId);
  const phases = usePhasesStore((state) => state.phases);

  useAATriggerStatements(projectId, {});
  const triggers = useAAStationsStore((state) => state.triggers);

  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

  const setPhase = (phase: any) => {
    localStorage.setItem(
      'selectedPhase',
      JSON.stringify({
        id: phase?.uuid,
        name: phase?.name,
        source: phase?.source?.source,
        riverBasin: capitalizeFirstLetter(phase?.source?.riverBasin),
      }),
    );
  };

  const handleAddTrigger = (phase: any) => {
    setPhase(phase);
    router.push(`/projects/aa/${projectId}/trigger-statements/add`);
  };

  const handleViewDetails = (phase: any) => {
    setPhase(phase);
    router.push(`/projects/aa/${projectId}/phase/${phase?.uuid}`);
  };
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
              handleAddTrigger={() => handleAddTrigger(d)}
              chartLabels={['Mandatory', 'Optional']}
              chartSeries={[10, 2]}
              mandatoryTriggers={10}
              optionalTriggers={2}
              triggeredMandatoryTriggers={8}
              triggeredOptionalTriggers={1}
              handleViewDetails={() => handleViewDetails(d)}
            />
          ))}
        <TriggersListCard projectId={projectId} triggers={triggers} />
      </div>
    </div>
  );
}

import React from 'react';
import { Heading } from 'apps/rahat-ui/src/common';
import { TriggersListCard, TriggersPhaseCard } from './components';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { useParams, useRouter } from 'next/navigation';
import {
  useAAStationsStore,
  useAATriggerStatements,
  usePhases,
  usePhasesStore,
} from '@rahat-ui/query';
import { UUID } from 'crypto';
import { capitalizeFirstLetter } from 'apps/rahat-ui/src/utils';

export default function TriggerStatementView() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as UUID;

  usePhases(projectId);
  const phases = usePhasesStore((state) => state.phases);

  useAATriggerStatements(projectId, { perPage: 9999 });
  const triggers = useAAStationsStore((state) => state.triggers);

  const triggeredTriggers = React.useMemo(
    () => triggers?.filter((t) => t.isTriggered),
    [triggers],
  );

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
    router.push(
      `/projects/aa/${projectId}/trigger-statements/phase/${phase?.uuid}`,
    );
  };
  return (
    <div className="p-4 h-[calc(100vh-64px)] flex flex-col overflow-hidden">
      <Heading
        title="Trigger Statement"
        description="Track all the trigger reports here"
      />
      <div className="flex gap-4 flex-1 overflow-hidden mt-4">
        {/* Left section – phase cards in a 2-column grid, scrollable */}
        <ScrollArea className="flex-1 ">
          <div className="grid grid-cols-2 gap-4 pr-2">
            {phases
              .filter((p) => p.name !== 'PREPAREDNESS')
              .map((d) => (
                <TriggersPhaseCard
                  key={d.id}
                  title={d.name}
                  subtitle={`Overview of ${d.name.toLowerCase()} phase`}
                  handleAddTrigger={() => handleAddTrigger(d)}
                  chartLabels={['Mandatory', 'Optional']}
                  chartSeries={[
                    d?.phaseStats?.totalMandatoryTriggers || 0,
                    d?.phaseStats?.totalOptionalTriggers || 0,
                  ]}
                  requiredMandatoryTriggers={d?.requiredMandatoryTriggers || 0}
                  requiredOptionalTriggers={d?.requiredOptionalTriggers || 0}
                  mandatoryTriggers={d?.phaseStats?.totalMandatoryTriggers || 0}
                  optionalTriggers={d?.phaseStats?.totalOptionalTriggers || 0}
                  triggeredMandatoryTriggers={
                    d?.phaseStats?.totalMandatoryTriggersTriggered || 0
                  }
                  triggeredOptionalTriggers={
                    d?.phaseStats?.totalOptionalTriggersTriggered || 0
                  }
                  handleViewDetails={() => handleViewDetails(d)}
                  isActive={d?.isActive}
                />
              ))}
          </div>
        </ScrollArea>

        {/* Right section – recent triggers list */}
        <div className="w-[380px] shrink-0">
          <TriggersListCard
            projectId={projectId}
            triggers={triggeredTriggers}
          />
        </div>
      </div>
    </div>
  );
}

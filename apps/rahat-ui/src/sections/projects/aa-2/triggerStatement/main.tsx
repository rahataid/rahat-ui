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
import { AARoles, RoleAuth } from '@rahat-ui/auth';
import { UUID } from 'crypto';
import { capitalizeFirstLetter } from 'apps/rahat-ui/src/utils';
import { Card, CardContent } from '@rahat-ui/shadcn/src/components/ui/card';
import { Plus } from 'lucide-react';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { IconLabelBtn } from 'apps/rahat-ui/src/common';

const TRIGGER_PIN_PHASE = 'TRIGGER_PIN_PHASE';

const loadPinnedPhases = (projectId: string): string[] => {
  try {
    const stored = localStorage.getItem(TRIGGER_PIN_PHASE);
    if (!stored) return [];
    const central = JSON.parse(stored);
    return Array.isArray(central[projectId]) ? central[projectId] : [];
  } catch {
    console.error('Failed to load pinned phases');
    return [];
  }
};

const savePinnedPhases = (projectId: string, ids: string[]) => {
  try {
    const stored = localStorage.getItem(TRIGGER_PIN_PHASE);
    const central = stored ? JSON.parse(stored) : {};
    central[projectId] = ids;
    localStorage.setItem(TRIGGER_PIN_PHASE, JSON.stringify(central));
  } catch {
    console.error('Failed to save pinned phases');
  }
};

export default function TriggerStatementView() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as UUID;

  usePhases(projectId);
  const phases = usePhasesStore((state) => state.phases);

  useAATriggerStatements(projectId, { perPage: 9999 });
  const triggers = useAAStationsStore((state) => state.triggers);

  const [pinnedPhaseIds, setPinnedPhaseIds] = React.useState<string[]>(() =>
    loadPinnedPhases(projectId),
  );

  const togglePinPhase = (phaseId: string) => {
    setPinnedPhaseIds((prev) => {
      const updated = prev.includes(phaseId)
        ? prev.filter((id) => id !== phaseId)
        : [phaseId, ...prev];
      savePinnedPhases(projectId, updated);
      return updated;
    });
  };

  const sortedPhases = React.useMemo(() => {
    return [
      ...phases.filter((p) => pinnedPhaseIds.includes(p.uuid)),
      ...phases.filter((p) => !pinnedPhaseIds.includes(p.uuid)),
    ];
  }, [phases, pinnedPhaseIds]);

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

  const handleAddPhase = () => {
    router.push(
      `/projects/aa/${projectId}/trigger-statements/phase/add?from=trigger-statements`,
    );
  };

  return (
    <div className="p-4 h-[calc(100vh-64px)] flex flex-col overflow-hidden">
      <div className="flex justify-between items-center">
        <Heading
          title="Trigger Statement"
          description="Track all the trigger reports here"
        />
        <RoleAuth
          roles={[AARoles.ADMIN, AARoles.Municipality]}
          hasContent={false}
        >
          <IconLabelBtn
            Icon={Plus}
            name="Add Phase"
            handleClick={handleAddPhase}
          />
        </RoleAuth>
      </div>
      <div className="flex gap-1 flex-1 overflow-hidden mt-4">
        {/* Left section – phase cards in a 2-column grid, scrollable */}
        <ScrollArea className="flex-1 ">
          <div className="grid grid-cols-2 gap-4 pr-2">
            {sortedPhases.map((d) => (
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
                isPinned={pinnedPhaseIds.includes(d.uuid)}
                onTogglePin={() => togglePinPhase(d.uuid)}
                hasExtendedLogic={!!d?.extendedTriggerLogic}
              />
            ))}

            {sortedPhases.length === 3 && (
              <div>
                <Card className="flex flex-col rounded-xl h-full min-h-[calc(100vh-410px)] w-full items-center justify-center border-dashed border-2 border-blue-300 bg-gray-50">
                  <CardContent className="flex flex-col items-center justify-center gap-4 p-6 text-center">
                    <div className="flex flex-col gap-1 items-center ">
                      <Button
                        onClick={handleAddPhase}
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100"
                      >
                        <div className="flex items-center justify-center w-4 h-4">
                          <Plus
                            className="  text-blue-500 hover:text-white"
                            size={'2rem'}
                          />
                        </div>
                      </Button>
                      <p className="text-base font-medium text-blue-500 ">
                        Add Phase
                      </p>
                      <p className="text-sm text-blue-400">
                        Click here to add new phase
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            {/* } */}
          </div>
        </ScrollArea>

        {/* Right section – recent triggers list */}
        <div className="w-[350px] shrink-0">
          <TriggersListCard
            projectId={projectId}
            triggers={triggeredTriggers}
          />
        </div>
      </div>
    </div>
  );
}

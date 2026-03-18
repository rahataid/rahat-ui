'use client';
import { useActivities } from '@rahat-ui/query';
import { Heading, IconLabelBtn } from 'apps/rahat-ui/src/common';
import { generateExcel } from 'apps/rahat-ui/src/utils';
import { IActivitiesItem } from 'apps/rahat-ui/src/types/activities';
import { UUID } from 'crypto';
import { CloudDownloadIcon, Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import PhaseContent from './components/phase-content';
import { AARoles, RoleAuth } from '@rahat-ui/auth';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSidebar } from '@rahat-ui/shadcn/src/components/ui/sidebar';
import { Card, CardContent } from '@rahat-ui/shadcn/src/components/ui/card';

const PHASE_DESCRIPTIONS: Record<string, string> = {
  PREPAREDNESS: 'Overview of preparedness phase',
  READINESS: 'Overview of readiness phase',
  ACTIVATION: 'Overview of activation phase',
};

export default function ActivitiesView() {
  const { id: projectID } = useParams();
  const { state } = useSidebar();
  const router = useRouter();
  const { activitiesData, isLoading } = useActivities(projectID as UUID, {
    perPage: 9999,
  });

  const storageKey = projectID ? `aa_pinned_phases_${projectID}` : null;

  const [pinnedPhases, setPinnedPhases] = useState<string[]>([]);

  useEffect(() => {
    if (!storageKey) return;
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) setPinnedPhases(JSON.parse(stored));
    } catch (error) {
      console.error('Failed to parse pinned phases from localStorage', error);
    }
  }, [storageKey]);

  const togglePin = useCallback(
    (phase: string) => {
      const isCurrentlyPinned = pinnedPhases.includes(phase);
      if (!isCurrentlyPinned && pinnedPhases.length >= 3) {
        toast.error(
          'You can only pin up to 3 cards at a time. Please unpin another card before pinning this one.',
        );
        return;
      }
      const next = isCurrentlyPinned
        ? pinnedPhases.filter((p) => p !== phase)
        : [phase, ...pinnedPhases];
      setPinnedPhases(next);
      if (storageKey) {
        try {
          localStorage.setItem(storageKey, JSON.stringify(next));
        } catch (error) {
          console.error('Failed to save pinned phases', error);
        }
      }
    },
    [storageKey, pinnedPhases],
  );

  const uniquePhases = useMemo(() => {
    if (!activitiesData) return [];
    const seen = new Set<string>();
    activitiesData.forEach((d: IActivitiesItem) => {
      if (d.phase) seen.add(d.phase);
    });
    return Array.from(seen);
  }, [activitiesData]);

  // For testing the design
  // const sortedPhases = [
  //   'PREPAREDNESS',
  //   'ACTIVATION',
  //   'READINESS',
  //   'POST-ACTIVATION',
  //   'PRE-ACTIVATION',
  // ];
  const sortedPhases = useMemo(() => {
    const pinned = pinnedPhases.filter((p) => uniquePhases.includes(p));
    const unpinned = uniquePhases.filter((p) => !pinnedPhases.includes(p));
    return [...pinned, ...unpinned];
  }, [pinnedPhases, uniquePhases]);

  const phaseDataMap = useMemo(() => {
    const map: Record<string, IActivitiesItem[]> = {};
    if (!activitiesData) return map;
    activitiesData.forEach((d: IActivitiesItem) => {
      if (d.phase) {
        if (!map[d.phase]) map[d.phase] = [];
        map[d.phase].push(d);
      }
    });
    return map;
  }, [activitiesData]);

  const handleDownloadReport = () => {
    if (!activitiesData?.length) {
      return toast.error('No data to download.');
    }
    const mappedData =
      activitiesData?.map((item: IActivitiesItem) => {
        let timeStamp;
        if (item?.completedAt) {
          const d = new Date(item.completedAt);
          const localeDate = d.toLocaleDateString();
          const localeTime = d.toLocaleTimeString();
          timeStamp = `${localeDate} ${localeTime}`;
        }
        return {
          Title: item.title || 'N/A',
          'Early Action': item.category || 'N/A',
          Phase: item.phase || 'N/A',
          Type: item.isAutomated ? 'Automated' : 'Manual',
          Responsibility: item.responsibility,
          'Responsible Station': item.source || 'N/A',
          Status: item.status || 'N/A',
          Timestamp: timeStamp || 'N/A',
          'Completed by': item.completedBy || 'N/A',
          'Difference in trigger and activity completion':
            item.timeDifference || 'N/A',
        };
      }) ?? [];

    generateExcel(mappedData, 'Activities_Report', 10);
  };
  return (
    <>
      <div className="p-4">
        <div className="w-full">
          <div className="pr-52">
            <Heading
              title="Activities"
              description="Track all the activities reports here"
            />
          </div>
          <div className="fixed top-[72px] right-6 z-40 flex gap-2">
            <RoleAuth
              roles={[AARoles.ADMIN, AARoles.MANAGER, AARoles.Municipality]}
              hasContent={false}
            >
              <IconLabelBtn
                Icon={CloudDownloadIcon}
                handleClick={handleDownloadReport}
                name="Download Report"
                variant="outline"
              />
            </RoleAuth>
            <RoleAuth
              roles={[AARoles.ADMIN, AARoles.MANAGER, AARoles.Municipality]}
              hasContent={false}
            >
              <IconLabelBtn
                Icon={Plus}
                handleClick={() =>
                  router.push(
                    `/projects/aa/${projectID}/activities/add?nav=mainPage`,
                  )
                }
                name="Add Activity"
                variant="default"
              />
            </RoleAuth>
          </div>
        </div>
        <div
          className={`flex gap-4 ${
            state === 'expanded'
              ? 'w-[calc(100vw-18rem)]'
              : 'w-[calc(100vw-5rem)]'
          } transition-[width] duration-300 overflow-x-auto  [&::-webkit-scrollbar]:h-1.5  [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300`}
          style={{ scrollbarGutter: 'stable' }}
        >
          {sortedPhases.map((phase) => (
            <div key={phase} className="min-w-[320px] w-full">
              <PhaseContent
                title={phase.charAt(0) + phase.slice(1).toLowerCase()}
                description={
                  PHASE_DESCRIPTIONS[phase] ??
                  `Overview of ${phase.toLowerCase()} phase`
                }
                phases={phaseDataMap[phase] ?? []}
                loading={isLoading}
                isPinned={pinnedPhases.includes(phase)}
                onTogglePin={() => togglePin(phase)}
              />
            </div>
          ))}
          {sortedPhases.length === 2 && (
            <div className="min-w-[320px]">
              <Card className="flex flex-col rounded-xl h-[calc(100vh-180px)] w-full items-center justify-center border-dashed border-2 border-blue-300 bg-gray-50">
                <CardContent className="flex flex-col items-center justify-center gap-4 p-6 text-center">
                  <div className="flex flex-col gap-1 items-center ">
                    <p className="text-base font-medium text-blue-500 ">
                      Add Phase
                    </p>
                    <p className="text-sm text-blue-400">
                      Click here to add new phase
                    </p>
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100">
                      <Plus className="w-6 h-6 text-blue-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

'use client';
import { useActivities } from '@rahat-ui/query';
import { Heading, IconLabelBtn } from 'apps/rahat-ui/src/common';
import { generateExcel } from 'apps/rahat-ui/src/utils';
import { UUID } from 'crypto';
import { CloudDownloadIcon, Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import PhaseContent from './components/phase-content';
import { AARoles, RoleAuth } from '@rahat-ui/auth';
import { useCallback, useEffect, useMemo, useState } from 'react';

const PHASE_DESCRIPTIONS: Record<string, string> = {
  PREPAREDNESS: 'Overview of preparedness phase',
  READINESS: 'Overview of readiness phase',
  ACTIVATION: 'Overview of activation phase',
};

export default function ActivitiesView() {
  const { id: projectID } = useParams();

  const router = useRouter();
  const { data, activitiesData, isLoading } = useActivities(projectID as UUID, {
    perPage: 9999,
  });

  const storageKey = projectID ? `aa_pinned_phases_${projectID}` : null;

  const [pinnedPhases, setPinnedPhases] = useState<string[]>([]);

  useEffect(() => {
    if (!storageKey) return;
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) setPinnedPhases(JSON.parse(stored));
    } catch {
      // ignore parse errors
    }
  }, [storageKey]);

  const togglePin = useCallback(
    (phase: string) => {
      setPinnedPhases((prev) => {
        const next = prev.includes(phase)
          ? prev.filter((p) => p !== phase)
          : [...prev, phase];
        if (storageKey) {
          try {
            localStorage.setItem(storageKey, JSON.stringify(next));
          } catch {
            // ignore storage errors
          }
        }
        return next;
      });
    },
    [storageKey],
  );

  const uniquePhases = useMemo(() => {
    if (!activitiesData) return [];
    const seen = new Set<string>();
    activitiesData.forEach((d: Record<string, any>) => {
      if (d.phase) seen.add(d.phase);
    });
    return Array.from(seen);
  }, [activitiesData]);

  const sortedPhases = useMemo(() => {
    return [...uniquePhases].sort((a, b) => {
      const aPinned = pinnedPhases.includes(a);
      const bPinned = pinnedPhases.includes(b);
      if (aPinned && !bPinned) return -1;
      if (!aPinned && bPinned) return 1;
      return 0;
    });
  }, [uniquePhases, pinnedPhases]);

  const phaseDataMap = useMemo(() => {
    const map: Record<string, any[]> = {};
    if (!activitiesData) return map;
    activitiesData.forEach((d: Record<string, any>) => {
      if (d.phase) {
        if (!map[d.phase]) map[d.phase] = [];
        map[d.phase].push(d);
      }
    });
    return map;
  }, [activitiesData]);

  const handleDownloadReport = () => {
    if (activitiesData.length < 1) return toast.error('No data to download.');
    const mappedData = activitiesData?.map((item: Record<string, any>) => {
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
        Type: item.isAutomated ? 'Automated' : 'Manual' || 'N/A',
        Responsibility: item.responsibility,
        'Responsible Station': item.source || 'N/A',
        Status: item.status || 'N/A',
        Timestamp: timeStamp || 'N/A',
        'Completed by': item.completedBy || 'N/A',
        'Difference in trigger and activity completion':
          item.timeDifference || 'N/A',
      };
    });

    generateExcel(mappedData, 'Activities_Report', 10);
  };
  return (
    <div className="p-4 overflow-hidden">
      <div className="flex justify-between items-center space-x-4 ">
        <Heading
          title="Activities"
          description="Track all the activities reports here"
        />
        <div className="flex flex-end gap-2">
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
      <div className="flex gap-4 overflow-x-auto ">
        {sortedPhases.map((phase) => (
          <div key={phase} className="min-w-[320px] flex-shrink-0">
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
      </div>
    </div>
  );
}

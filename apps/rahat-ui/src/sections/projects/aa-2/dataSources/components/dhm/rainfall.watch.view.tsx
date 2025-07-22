import {
  PROJECT_SETTINGS_KEYS,
  useDhmRainfallLevels,
  useProjectSettingsStore,
} from '@rahat-ui/query';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Heading, NoResult, TableLoader } from 'apps/rahat-ui/src/common';
import { UUID } from 'crypto';
import { MapPin, RadioTower, Skull, TriangleAlert, Waves } from 'lucide-react';
import { useParams } from 'next/navigation';
import React from 'react';
import { RainFallMonitor } from './rainfall.monitor';
import { format } from 'date-fns';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';

export default function RainfallWatchView() {
  const params = useParams();
  const projectId = params.id as UUID;
  const formattedDate = format(new Date(), 'yyyy/MM/dd');
  const { settings } = useProjectSettingsStore((state) => ({
    settings: state.settings,
  }));
  const { data: rainfallWatch, isLoading } = useDhmRainfallLevels(projectId, {
    riverBasin:
      settings?.[projectId]?.[PROJECT_SETTINGS_KEYS.PROJECT_INFO]?.[
        'river_basin'
      ],
    type: 'HOURLY',
    from: formattedDate,
    to: formattedDate,
  });

  const rainfallWatchInfoList = rainfallWatch?.info ?? [];

  const hoursList = [1, 3, 6, 12, 24];

  if (isLoading) {
    return <TableLoader />;
  }

  if (!rainfallWatch || !rainfallWatchInfoList?.length) {
    return (
      <div className="p-4">
        <NoResult message="No Rainfall Watch Data" />
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-276px)]">
      <div className="flex flex-col space-y-4 ">
        {rainfallWatchInfoList?.map((info) => {
          const timeIntervals = hoursList.map((hours) => {
            const dataPoint = info?.history[hours];
            return {
              hours,
              warningLevel: dataPoint?.value,
            };
          });
          return (
            <RainFallMonitor
              name={info?.name}
              description={info?.description}
              warningStatus={info?.status}
              stationIndex={info?.stationIndex}
              district={info?.district}
              timeIntervals={timeIntervals}
            />
          );
        })}
      </div>
    </ScrollArea>
  );
}

import { Back, Heading, TableLoader } from 'apps/rahat-ui/src/common';
import { Info, WaterLevelView } from './components';
import RiverWatchMap from './components/dhm/river.watch.map';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import { useDhmSingleSeriesWaterLevels } from '@rahat-ui/query';
import React from 'react';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { format } from 'date-fns';

export default function RiverWatchDetails() {
  const { id: projectId, riverWatchId: seriesId } = useParams() as {
    id: UUID;
    riverWatchId: string;
  };

  const [activeTab, setActiveTab] = React.useState<string>('Point');
  const [pickedDate, setPickedDate] = React.useState<Date | undefined>(
    new Date(),
  );

  const formattedDate = React.useMemo(
    () => format(pickedDate ?? new Date(), 'yyyy/MM/dd'),
    [pickedDate],
  );

  const { data: riverWatch, isLoading } = useDhmSingleSeriesWaterLevels(
    projectId,
    activeTab,
    { date: formattedDate, seriesId },
  );

  const updatedAt = riverWatch?.info?.waterLevel?.datetime;

  return (
    <div className="p-4">
      <Back />
      <Heading
        title="River Watch"
        description="Detailed view of the selected station"
      />
      <ScrollArea className="h-[calc(100vh-205px)]">
        {isLoading ? (
          <TableLoader />
        ) : (
          <div className="flex flex-col gap-4">
            <Info riverWatch={riverWatch?.info} updatedAt={updatedAt} />
            <WaterLevelView
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              data={riverWatch?.info}
              selectedDate={pickedDate}
              setSelectedDate={setPickedDate}
            />
            <RiverWatchMap
              coordinates={[
                {
                  latitude: riverWatch?.info?.latitude,
                  longitude: riverWatch?.info?.longitude,
                  name: riverWatch?.info?.name,
                  stationIndex: riverWatch?.info?.stationIndex,
                },
              ]}
            />
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

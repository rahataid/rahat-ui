import { Back, Heading, TableLoader } from 'apps/rahat-ui/src/common';
import { Info, WaterLevelView } from './components';
import RiverWatchMap from './components/dhm/river.watch.map';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import { useDhmWaterLevels } from '@rahat-ui/query';
import React from 'react';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { format } from 'date-fns';

export default function RiverWatchDetails() {
  const params = useParams();
  const projectId = params.id as UUID;

  const [activeTab, setActiveTab] = React.useState<string>('Point');

  const formattedDate = format(new Date(), 'yyyy/MM/dd');

  const { data: riverWatch, isLoading } = useDhmWaterLevels(
    projectId,
    {
      riverBasin: 'Mahakali',
      type: activeTab?.toUpperCase(),
      from: formattedDate,
      to: formattedDate,
    },
    activeTab,
  );
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
            <Info riverWatch={riverWatch} />
            <WaterLevelView
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              data={riverWatch}
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

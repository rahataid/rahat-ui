import { Back, Heading, TableLoader } from 'apps/rahat-ui/src/common';
import { Info, WaterLevelView } from './components';
import RiverWatchMap from './components/dhm/river.watch.map';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import {
  PROJECT_SETTINGS_KEYS,
  useDhmWaterLevels,
  useProjectSettingsStore,
} from '@rahat-ui/query';
import React from 'react';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { addDays, format, min, subDays } from 'date-fns';

export default function RiverWatchDetails() {
  const params = useParams();
  const projectId = params.id as UUID;

  const { settings } = useProjectSettingsStore((state) => ({
    settings: state.settings,
  }));

  const [activeTab, setActiveTab] = React.useState<string>('Point');
  const [pickedDate, setPickedDate] = React.useState<Date | undefined>(
    new Date(),
  );

  const formattedDate = React.useMemo(
    () => format(pickedDate ?? new Date(), 'yyyy/MM/dd'),
    [pickedDate],
  );

  function getFormattedDateRange(selectedDate: Date): {
    startDate: string;
    endDate: string;
  } {
    const today = new Date();
    const threeDaysAfter = addDays(selectedDate, 3);

    const end = min([threeDaysAfter, today]); // choose whichever is earlier
    const start = subDays(end, 6); // 7-day range

    return {
      startDate: format(start, 'yyyy/MM/dd'),
      endDate: format(end, 'yyyy/MM/dd'),
    };
  }

  const { startDate, endDate } = React.useMemo(() => {
    return getFormattedDateRange(pickedDate ?? new Date());
  }, [pickedDate]);

  const { data: riverWatch, isLoading } = useDhmWaterLevels(
    projectId,
    {
      riverBasin:
        settings?.[projectId]?.[PROJECT_SETTINGS_KEYS.PROJECT_INFO]?.[
          'river_basin'
        ],
      type: activeTab?.toUpperCase(),
      // from: activeTab === 'Daily' ? startDate : formattedDate,
      // to: activeTab === 'Daily' ? endDate : formattedDate,
      from: formattedDate,
      to: formattedDate,
    },
    activeTab,
  );

  const riverWatchInfoList = riverWatch?.info ?? [];

  // This can be modified later to handle multiple rivers if needed
  const primaryRiverWatchInfo = riverWatchInfoList[0] ?? null;

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
            <Info riverWatch={primaryRiverWatchInfo} />
            <WaterLevelView
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              data={primaryRiverWatchInfo}
              selectedDate={pickedDate}
              setSelectedDate={setPickedDate}
            />
            <RiverWatchMap
              coordinates={[
                {
                  latitude: primaryRiverWatchInfo?.latitude,
                  longitude: primaryRiverWatchInfo?.longitude,
                  name: primaryRiverWatchInfo?.name,
                  stationIndex: primaryRiverWatchInfo?.stationIndex,
                },
              ]}
            />
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

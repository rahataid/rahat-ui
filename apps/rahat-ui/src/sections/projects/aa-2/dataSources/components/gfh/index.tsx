import React, { useMemo } from 'react';
import {
  useGFHWaterLevels,
  PROJECT_SETTINGS_KEYS,
  useProjectSettingsStore,
} from '@rahat-ui/query';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import Loader from 'apps/community-tool-ui/src/components/Loader';
import { CircleAlert } from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import GfhStationDetails from './gfhStationDetails';
import { IRiverData } from './types';

const GFHDetails = () => {
  const params = useParams();
  const projectId = params.id as UUID;

  const { settings } = useProjectSettingsStore((state) => ({
    settings: state.settings,
  }));

  const { data: GfhData, isLoading } = useGFHWaterLevels(projectId, {
    riverBasin:
      settings?.[projectId]?.[PROJECT_SETTINGS_KEYS.PROJECT_INFO]?.[
        'river_basin'
      ],
  });

  const defaultTabValue = useMemo(() => GfhData?.[0]?.id, [GfhData]);

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!GfhData && GfhData?.length === 0) {
    return (
      <div className="h-[80vh] w-full flex items-center justify-center">
        <div className="text-center ">
          <div className="flex items-center gap-1 text-gray-500 ">
            <CircleAlert />
            <p className="text-gray-500 text-2xl">No data available</p>
          </div>
          <p className="text-gray-400 text-sm">
            River forecast data is currently unavailable
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Tabs defaultValue={defaultTabValue}>
        <TabsList className="flex justify-start">
          {GfhData?.map((river: IRiverData) => (
            <TabsTrigger
              key={river.id}
              value={river.id}
              className="text-gray-700 !bg-white data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none"
            >
              {river?.info?.stationName}
            </TabsTrigger>
          ))}
        </TabsList>
        {GfhData?.map((river: IRiverData) => (
          <TabsContent key={river.id} value={river.id}>
            <GfhStationDetails riverInfo={river.info} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default GFHDetails;

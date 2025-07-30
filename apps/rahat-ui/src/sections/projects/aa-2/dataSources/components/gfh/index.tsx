import React from 'react';
import { Heading } from 'apps/rahat-ui/src/common';
import TimeSeriesChart from '../dhm/chart';
import GFHCard from './gfhCard';
import {
  useGFHWaterLevels,
  PROJECT_SETTINGS_KEYS,
  useProjectSettingsStore,
} from '@rahat-ui/query';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import Loader from 'apps/community-tool-ui/src/components/Loader';
import { CircleAlert } from 'lucide-react';

const GFHDetails = () => {
  const params = useParams();
  const projectId = params.id as UUID;

  const { settings } = useProjectSettingsStore((state) => ({
    settings: state.settings,
  }));

  const { data: riverWatch, isLoading } = useGFHWaterLevels(projectId, {
    riverBasin:
      settings?.[projectId]?.[PROJECT_SETTINGS_KEYS.PROJECT_INFO]?.[
        'river_basin'
      ],
  });

  const riverInfo = React.useMemo(() => {
    return riverWatch?.info || null;
  }, [riverWatch?.info]);

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!riverInfo) {
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
      <GFHCard
        riverGaugeId={riverInfo.riverGaugeId}
        source={riverInfo.source}
        latitude={riverInfo.latitude}
        longitude={riverInfo.longitude}
        stationName={riverInfo.stationName}
        forecastDate={riverInfo.forecastDate}
        basinSize={riverInfo.basinSize}
      />

      <div className="p-4 rounded-sm border shadow">
        <Heading
          title="River Forecast"
          titleStyle="text-xl capitalize"
          description="Chart showing river forecast data"
        />
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-3">
            <TimeSeriesChart
              warningLevel={riverInfo.warningLevel}
              dangerLevel={riverInfo.dangerLevel}
              extremeLevel={riverInfo.extremeDangerLevel}
              data={riverInfo.history}
              xDateFormat="MMMM d"
              yaxisTitle="Discharge in m³/s"
            />
          </div>

          <div className="col-span-1 flex flex-col gap-7 justify-center items-center">
            <div className="flex gap-1">
              <div className="h-2 w-2 rounded-full bg-[#FFA500] mt-2" />
              <div>
                <p className="text-gray-500">Warning </p>
                <p>{riverInfo.warningLevel || 'N/A'}</p>
              </div>
            </div>

            <div className="flex gap-1">
              <div className="h-2 w-2 rounded-full bg-[#FF0000] mt-2" />
              <div>
                <p className="text-gray-500">Danger </p>
                <p>{riverInfo.dangerLevel || 'N/A'}</p>
              </div>
            </div>

            <div className="flex gap-1">
              <div className="h-2 w-2 rounded-full bg-[#A51D1D] mt-2" />
              <div>
                <p className="text-gray-500">Extreme </p>
                <p>{riverInfo.extremeDangerLevel || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GFHDetails;

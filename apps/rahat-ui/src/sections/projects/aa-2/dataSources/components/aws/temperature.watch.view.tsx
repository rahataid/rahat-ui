import { useDhmTemperatureLevels } from '@rahat-ui/query';
import { Heading, NoResult, TableLoader } from 'apps/rahat-ui/src/common';
import { dateFormat } from 'apps/rahat-ui/src/utils/dateFormate';
import { Globe, RadioTower } from 'lucide-react';
import React, { useMemo } from 'react';
import { UUID } from 'crypto';
import { format } from 'date-fns';
import { useParams } from 'next/navigation';
import { getTemperatureColor, roundValue } from './utils/color.utils';


type TemperatureColors = {
  bg: string;
  border: string;
  textValue: string;
  badge: string;
  statusLabel: string;
  statusColor: string;
};


export default function TemperatureWatchView() {
  const params = useParams();
  const projectId = params.id as UUID;
  const formattedDate = format(new Date(), 'yyyy/MM/dd');
  const riverBasin = 'Doda river at East-West Highway';

  const payload = {
    riverBasin,
    from: formattedDate,
  };

  const { data, isLoading, error } = useDhmTemperatureLevels(
    projectId,
    payload,
  );

  console.log('Temperature Watch Data:', data);

  const tn1dData = useMemo(() => {
    if (!data?.info || !Array.isArray(data.info)) return [];
    return data.info.filter((item: any) => item?.parameter_code === 'TN_1D');
  }, [data]);

  const updatedAt = data?.updatedAt;
  console.log('Filtered TN_1D Data:', updatedAt);

  if (isLoading) {
    return <TableLoader />;
  }

  if (error) {
    return (
      <div className="p-4">
        <h2 className="text-lg font-medium">AWS Temperature Watch</h2>
        <p className="text-sm text-red-500">
          Error loading data: {error.message || String(error)}
        </p>
      </div>
    );
  }

  if (tn1dData.length === 0) {
    return (
      <div className="p-4">
        <NoResult message="No Temperature Data (TN_1D)" />
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6">
      {tn1dData.map((tempInfo: any, index: number) => {
        const colors = getTemperatureColor(tempInfo?.value);

        return (
          <div
            key={index}
            className="p-4 rounded-sm border shadow flex justify-between space-x-4"
          >
            <div className="w-full">
              <div className="flex justify-between gap-4">
                <Heading
                  title={tempInfo?.name || 'Unknown Station'}
                  titleStyle="text-xl/6 font-semibold"
                  description={`${
                    tempInfo?.parameter_name || 'Air Temperature Daily Min'
                  }`}
                  updatedAt={updatedAt}
                />

                <div>
                  <span
                    className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mt-2 ${colors.statusColor}`}
                  >
                    {colors.statusLabel}
                  </span>{' '}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="flex space-x-3 items-center">
                  <RadioTower className="text-gray-500" size={20} />
                  <div>
                    <p className="text-sm/6 font-medium mb-1">Station</p>
                    <p className="text-sm/4 text-gray-600">
                      {tempInfo?.name || '--'}
                    </p>
                  </div>
                </div>

                <div className="flex space-x-3 items-center">
                  <Globe className="text-gray-500" size={20} />
                  <div>
                    <p className="text-sm/6 font-medium mb-1">Latitude</p>
                    <p className="text-sm/4 text-gray-600">
                      {tempInfo?.latitude !== undefined
                        ? tempInfo.latitude
                        : '--'}
                    </p>
                  </div>
                </div>

                <div className="flex space-x-3 items-center">
                  <Globe className="text-gray-500" size={20} />
                  <div>
                    <p className="text-sm/6 font-medium mb-1">Longitude</p>
                    <p className="text-sm/4 text-gray-600">
                      {tempInfo?.longitude !== undefined
                        ? tempInfo.longitude
                        : '--'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Big Temperature Card */}
            <div
              className={`p-4 rounded-sm border shadow text-center w-64 flex-shrink-0 ${colors.bg} ${colors.border}`}
            >
              <p className={`font-semibold text-3xl/10 ${colors.textValue}`}>
                {roundValue(tempInfo?.value)}
              </p>
              <p className="text-sm/6 font-medium">Average Temperature</p>
              <p className="text-gray-500 text-sm/6">
                {dateFormat(updatedAt, 'eee, MMM d yyyy, hh:mm:ss a')}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

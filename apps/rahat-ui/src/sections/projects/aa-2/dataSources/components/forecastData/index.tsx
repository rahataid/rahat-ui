import { useGaugeForecast } from '@rahat-ui/query';
import {
  Back,
  HeaderWithBack,
  Heading,
  NoResult,
  TableLoader,
} from 'apps/rahat-ui/src/common';
import { UUID } from 'crypto';
import { useParams, useSearchParams } from 'next/navigation';
import React, { useMemo } from 'react';
import GaugeForecastCard from '../gaugeReading/gaugeForecastCard';
import TimeSeriesChart from '../dhm/chart';
import WaterLevelTable from '../dhm/table';
import { usePointTableColumns } from '../../columns/usePointTableColumns';
import { getGaugeUnit } from 'apps/rahat-ui/src/utils/getGaugeUnit';

interface SearchParams {
  sourceId: string | null;
  station: string | null;
  date: string | null;
  gaugeForecast: string | null;
  riverBasin: string | null;
  latestGaugeReading: string | null;
  dataEntryBy: string | null;
  filterDate: string | null;
}

const ForeCastData = () => {
  const params = useParams();
  const projectId = params.id as UUID;
  const searchParams = useSearchParams();

  // Extract search parameters with proper typing
  const extractedParams: SearchParams = useMemo(
    () => ({
      sourceId: searchParams.get('sourceId'),
      station: searchParams.get('station'),
      date: searchParams.get('date'),
      gaugeForecast: searchParams.get('gaugeForecast'),
      riverBasin: searchParams.get('riverBasin'),
      latestGaugeReading: searchParams.get('latestGaugeReading'),
      dataEntryBy: searchParams.get('dataEntryBy'),
      filterDate: searchParams.get('filterDate'),
    }),
    [searchParams],
  );

  const { data, isLoading } = useGaugeForecast(projectId, {
    sourceId: extractedParams.sourceId,
    station: extractedParams.station,
    date: extractedParams.filterDate,
    gaugeForecast: extractedParams.gaugeForecast,
  });

  const unit = getGaugeUnit(extractedParams.gaugeForecast || '');
  const columns = usePointTableColumns({ unit });
  const forecastTitle = `${
    extractedParams.gaugeForecast === 'riverWatch' ? 'water' : 'rain'
  } level`;

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <TableLoader />
      </div>
    );
  }

  if (!data?.data?.length) {
    return (
      <div className="p-4 ">
        <Back
          path={`/projects/aa/${projectId}/data-sources?tab=gaugeReading`}
        />
        <NoResult message="No Gauge Reading Data" />
      </div>
    );
  }

  return (
    <div className="p-4">
      <HeaderWithBack
        title={'Gauge Reading Details'}
        subtitle="Detailed view of the selected gauge reading"
        path={`/projects/aa/${projectId}/data-sources?tab=gaugeReading`}
      />
      <GaugeForecastCard
        riverBasin={extractedParams.riverBasin || ''}
        gaugeForecast={extractedParams.gaugeForecast}
        station={extractedParams.station}
        latestGaugeReading={Number(extractedParams.latestGaugeReading)}
        dataEntryBy={extractedParams.dataEntryBy}
        date={extractedParams.date}
        unit={unit}
      />
      <div className="p-4 rounded-sm border shadow">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Heading
              title={forecastTitle}
              titleStyle="text-xl capitalize"
              description={`Chart and table showing ${forecastTitle}`}
            />
            <TimeSeriesChart
              data={data?.data}
              yaxisTitle={`${
                extractedParams.gaugeForecast === 'riverWatch'
                  ? 'Water Level'
                  : 'Rainfall'
              } (${unit})`}
            />
          </div>
          <WaterLevelTable tableData={data?.data} columns={columns} />
        </div>
      </div>
    </div>
  );
};

export default ForeCastData;

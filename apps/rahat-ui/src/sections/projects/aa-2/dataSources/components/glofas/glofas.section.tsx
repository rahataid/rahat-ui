import {
  PROJECT_SETTINGS_KEYS,
  useGlofasWaterLevels,
  useProjectSettingsStore,
} from '@rahat-ui/query';
import GlofasInfoCard from './glofas.info.card';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import React from 'react';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { NoResult, TableLoader } from 'apps/rahat-ui/src/common';
import GlofasPeriodDataTable from './glofas.periodData.table';

export function GlofasSection() {
  const params = useParams();
  const projectId = params.id as UUID;

  const { settings } = useProjectSettingsStore((state) => ({
    settings: state.settings,
  }));

  const { data: glofasData, isLoading } = useGlofasWaterLevels(projectId, {
    riverBasin:
      settings?.[projectId]?.[PROJECT_SETTINGS_KEYS.PROJECT_INFO]?.[
        'river_basin'
      ],
    page: 1,
    perPage: 9999,
  });

  const returnPeriodHeaders2yr = React.useMemo(
    () => glofasData?.info?.returnPeriodTable2yr?.returnPeriodHeaders,
    [glofasData],
  );

  const returnPeriodData2yr = React.useMemo(
    () => glofasData?.info?.returnPeriodTable2yr?.returnPeriodData,
    [glofasData],
  );

  const returnPeriodHeaders5yr = React.useMemo(
    () => glofasData?.info?.returnPeriodTable5yr?.returnPeriodHeaders,
    [glofasData],
  );

  const returnPeriodData5yr = React.useMemo(
    () => glofasData?.info?.returnPeriodTable5yr?.returnPeriodData,
    [glofasData],
  );

  const returnPeriodHeaders20yr = React.useMemo(
    () => glofasData?.info?.returnPeriodTable20yr?.returnPeriodHeaders,
    [glofasData],
  );

  const returnPeriodData20yr = React.useMemo(
    () => glofasData?.info?.returnPeriodTable20yr?.returnPeriodData,
    [glofasData],
  );

  if (isLoading) {
    return <TableLoader />;
  }

  if (!glofasData || !glofasData?.info?.pointForecastData?.maxProbability) {
    return (
      <div className="p-4">
        <NoResult message="No GLOFAS Data" />
      </div>
    );
  }
  return (
    <ScrollArea className="h-[calc(100vh-220px)]">
      <GlofasInfoCard glofas={glofasData} />
      <div className="bg-card overflow-hidden p-4 border shadow rounded-sm mt-4">
        <img
          src={glofasData?.info?.hydrographImageUrl}
          alt="hydrograph-chart"
        />
      </div>

      <GlofasPeriodDataTable
        headerData={returnPeriodHeaders2yr}
        bodyData={returnPeriodData2yr}
        title="ECMWF-ENS > 2 yr RP"
      />

      <GlofasPeriodDataTable
        headerData={returnPeriodHeaders5yr}
        bodyData={returnPeriodData5yr}
        title="ECMWF-ENS > 5 yr RP"
      />

      <GlofasPeriodDataTable
        headerData={returnPeriodHeaders20yr}
        bodyData={returnPeriodData20yr}
        title="ECMWF-ENS > 20 yr RP"
      />
    </ScrollArea>
  );
}

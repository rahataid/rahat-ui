import React from 'react';
import GlofasInfoCard from '../glofas.info.card';
import {
  PROJECT_SETTINGS_KEYS,
  useGlofasProbFloodDetails,
  useProjectSettingsStore,
} from '@rahat-ui/query';
import { UUID } from 'crypto';
import GlofasPeriodDataTable from '../glofas.periodData.table';
import GlofasHydrographChart from '../glofas.hydrograph.chart';
import { Back, Heading, NoResult, TableLoader } from 'apps/rahat-ui/src/common';
import { useParams } from 'next/navigation';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';

const GlofasDetails = () => {
  const params = useParams();
  const projectId = params.id as UUID;

  const returnPeriod = decodeURIComponent(params?.probabilityId as string);

  const { settings } = useProjectSettingsStore((state) => ({
    settings: state.settings,
  }));

  const { data, isLoading, error } = useGlofasProbFloodDetails(projectId, {
    riverBasin:
      settings?.[projectId]?.[PROJECT_SETTINGS_KEYS.PROJECT_INFO]?.[
        'river_basin'
      ],
    returnPeriod: returnPeriod,
    page: 1,
    perPage: 9999,
  });

  if (error) {
    return (
      <div className="p-4">
        <NoResult message="No Glofas Data" />
      </div>
    );
  }

  if (isLoading) {
    return <TableLoader />;
  }

  return (
    <div className="p-4">
      <Back />
      <Heading
        title={`GLOFAS ${returnPeriod}`}
        description="Details view of the selected station"
      />

      <ScrollArea className="h-[calc(100vh-200px)]">
        <GlofasInfoCard glofas={data} />

        <GlofasPeriodDataTable
          headerData={data?.info?.returnPeriodTable?.returnPeriodHeaders}
          bodyData={data?.info?.returnPeriodTable?.returnPeriodData}
          title={`ECMWF-ENS > ${returnPeriod} RP`}
        />

        <GlofasHydrographChart series={data?.info?.dischargeSeries} />
      </ScrollArea>
    </div>
  );
};

export default GlofasDetails;

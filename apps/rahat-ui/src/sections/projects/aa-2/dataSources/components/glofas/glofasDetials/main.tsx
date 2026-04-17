import React from 'react';
import GlofasInfoCard from '../glofas.info.card';
import {
  PROJECT_SETTINGS_KEYS,
  useGlofasProbFloodDetails,
  useProjectSettingsStore,
} from '@rahat-ui/query';
import { UUID } from 'crypto';
import Image from 'next/image';
import GlofasPeriodDataTable from '../glofas.periodData.table';
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

        <div className="bg-card overflow-hidden p-4 border shadow rounded-sm mt-4">
          <div className="relative w-full min-h-[600px] overflow-hidden">
            <Image
              src={data?.info?.hydrographImageUrl}
              alt="hydrograph-chart"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default GlofasDetails;

import React from 'react';
import GlofasInfoCard from '../glofas.info.card';
import {
  PROJECT_SETTINGS_KEYS,
  useGlofasWaterLevels,
  useProjectSettingsStore,
} from '@rahat-ui/query';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import GlofasPeriodDataTable from '../glofas.periodData.table';
import { Back, Heading } from 'apps/rahat-ui/src/common';

const GlofasDetails = () => {
  const params = useParams();
  const projectId = params.id as UUID;
  const probabilityYears = params.probabilityId as string;

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

  return (
    <div className="p-4">
      <Back />
      <Heading
        title={`GLOFAS ${probabilityYears} years`}
        description="Details view of the selected station"
      />
      <GlofasInfoCard glofas={glofasData} />

      <div className="bg-card overflow-hidden p-4 border shadow rounded-sm mt-4">
        <Image
          src={glofasData?.info?.hydrographImageUrl}
          alt="hydrograph-chart"
          layout="responsive"
          width={0}
          height={0}
          className="w-full h-auto"
        />
      </div>

      <GlofasPeriodDataTable
        headerData={returnPeriodHeaders2yr}
        bodyData={returnPeriodData2yr}
        title={`ECMWF-ENS > ${probabilityYears} yr RP`}
      />
    </div>
  );
};

export default GlofasDetails;

import React from 'react';
import { useTranslations } from 'next-intl';

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
import { useLabelDigits } from 'apps/rahat-ui/src/utils/i18n/number';

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

  const t = useTranslations('AA_PROJECT');
  const formatDigits = useLabelDigits();

  // Backend sends this as an opaque "<number> years" string via the route
  // param (e.g. "5 years") rather than a numeric value, so the unit word is
  // localized by pattern-matching rather than via a structured value — same
  // approach as glofas.info.card.tsx's formatReturnPeriod.
  const formatReturnPeriod = (value: string) => {
    const match = value.match(/^(\d+)\s*years?$/i);
    if (!match) return value;
    return `${formatDigits(match[1])} ${t('YEARS')}`;
  };
  const returnPeriodDisplay = formatReturnPeriod(returnPeriod);

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
        title={`GLOFAS ${returnPeriodDisplay}`}
        description={t('DETAILS_VIEW_OF_THE_SELECTED_STATION')}
      />

      <ScrollArea className="h-[calc(100vh-200px)]">
        <GlofasInfoCard glofas={data} />

        <GlofasPeriodDataTable
          headerData={data?.info?.returnPeriodTable?.returnPeriodHeaders}
          bodyData={data?.info?.returnPeriodTable?.returnPeriodData}
          title={`ECMWF-ENS > ${returnPeriodDisplay} RP`}
        />

        <GlofasHydrographChart series={data?.info?.dischargeSeries} />
      </ScrollArea>
    </div>
  );
};

export default GlofasDetails;

import React from 'react';
import { useTranslations } from 'next-intl';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/i18n/number';

import GFHCard from './gfhCard';
import { Heading } from 'apps/rahat-ui/src/common';
import TimeSeriesChart from '../dhm/chart';
import { IRiverInfoData } from './types';

interface IRiverInfoProps {
  riverInfo: IRiverInfoData;
  updatedAt: string
}
const GfhStationDetails = ({ riverInfo, updatedAt }: IRiverInfoProps) => {
  const t = useTranslations('AA_PROJECT');
  const formatNum = useNumberFormat();
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
        updatedAt={updatedAt}

      />

      <div className="p-4 rounded-sm border shadow">
        <Heading
          title={t('RIVER_FORECAST')}
          titleStyle="text-xl capitalize"
          description={t('CHART_SHOWING_RIVER_FORECAST_DATA')}
        />
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-3">
            <TimeSeriesChart
              warningLevel={riverInfo.warningLevel}
              dangerLevel={riverInfo.dangerLevel}
              extremeLevel={riverInfo.extremeDangerLevel}
              data={riverInfo.history}
              xDateFormat="MMMM d"
              yaxisTitle={t('DISCHARGE_IN_M3S')}
            />
          </div>

          <div className="col-span-1 flex flex-col gap-7 justify-center items-center">
            <div className="flex gap-1">
              <div className="h-2 w-2 rounded-full bg-[#FFA500] mt-2" />
              <div>
                <p className="text-gray-500">{t('WARNING')}</p>
                <p>{riverInfo.warningLevel != null ? formatNum(riverInfo.warningLevel) : 'N/A'}</p>
              </div>
            </div>

            <div className="flex gap-1">
              <div className="h-2 w-2 rounded-full bg-[#FF0000] mt-2" />
              <div>
                <p className="text-gray-500">{t('DANGER')}</p>
                <p>{riverInfo.dangerLevel != null ? formatNum(riverInfo.dangerLevel) : 'N/A'}</p>
              </div>
            </div>

            <div className="flex gap-1">
              <div className="h-2 w-2 rounded-full bg-[#A51D1D] mt-2" />
              <div>
                <p className="text-gray-500">{t('EXTREME')}</p>
                <p>{riverInfo.extremeDangerLevel != null ? formatNum(riverInfo.extremeDangerLevel) : 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GfhStationDetails;

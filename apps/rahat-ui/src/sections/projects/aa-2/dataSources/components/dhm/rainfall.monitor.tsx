import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { useTranslations } from 'next-intl';

import { Heading } from 'apps/rahat-ui/src/common';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/useNumberFormat';
import { MapPin, Radio } from 'lucide-react';

interface RainFallMonitorProps {
  name: string;
  description: string;
  warningStatus: string;
  stationIndex: string;
  updatedAt: string;
  district: string;
  timeIntervals: {
    hours: number;
    warningLevel: number;
  }[];
}

export function RainFallMonitor({
  name,
  description,
  warningStatus,
  stationIndex,
  district,
  updatedAt,
  timeIntervals,
}: RainFallMonitorProps) {
  const t = useTranslations('AA_PROJECT');
  const formatNum = useNumberFormat();
  return (
    <div className="p-4 rounded-sm border shadow flex justify-between space-x-4 ">
      <div className="flex-[1]">
        <div className=" flex  gap-4 ">
          <Heading
            title={name}
            titleStyle="text-xl/6 font-semibold"
            description={description}
            updatedAt={updatedAt}
          />
          <div>
            <Badge
              className={`text-xs font-normal  py-1 px-auto rounded-full min-w-[160px] text-center whitespace-nowrap${
                warningStatus === 'BELOW WARNING LEVEL'
                  ? 'bg-green-100 text-green-600'
                  : 'bg-red-100 text-red-500'
              }`}
            >
              {warningStatus?.charAt(0).toUpperCase() +
                warningStatus?.slice(1).toLowerCase() || 'N/A'}
            </Badge>
          </div>
        </div>
        <div className="flex text-sm gap-6">
          <div className="flex items-center mr-8">
            <Radio className="w-4 h-4 mr-2 text-gray-500" />
            <div>
              <div className="text-gray-600">{t('STATION_INDEX')}</div>
              <div>{formatNum(stationIndex) || 'N/A'}</div>
            </div>
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-gray-500" />
            <div>
              <div className="text-gray-600">{t('DISTRICT')}</div>
              <div>{district || 'N/A'}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-[2] md:flex-[3]">
        <div className="border grid grid-cols-5 rounded-sm shadow-sm">
          {timeIntervals.map((interval, index) => (
            <div key={index} className="p-4   text-center">
              <div className="text-primary font-medium text-sm">
                {interval.warningLevel !== undefined
                  ? `${formatNum(interval.warningLevel)}mm`
                  : 'N/A'}
              </div>
              <div className="text-sm mt-1">
                {formatNum(interval.hours)}{' '}
                {interval.hours === 1 ? t('HOUR_LABEL') : t('HOURS_LABEL')}
              </div>
              <div className="text-xs text-gray-600 mt-2">
                {t('WARNING_LEVEL')}:{' '}
                {interval?.hours === 1
                  ? `${formatNum(60)}`
                  : interval?.hours === 3
                  ? `${formatNum(80)}`
                  : interval?.hours === 6
                  ? `${formatNum(100)}`
                  : interval?.hours === 12
                  ? `${formatNum(120)}`
                  : `${formatNum(140)}`}
                mm
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { useTranslations } from 'next-intl';

import { Heading } from 'apps/rahat-ui/src/common';
import { useDateFormat } from 'apps/rahat-ui/src/utils/i18n/date';
import {
  renderCardColor,
  renderStatusColor,
} from 'apps/rahat-ui/src/utils/getColorCard';
import { Globe, MapPin, RadioTower, TrendingUp } from 'lucide-react';
import React from 'react';
import { truncateValue } from '../aws/utils/color.utils';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/i18n/number';
interface InfoProp {
  riverWatch: {
    stationIndex: number;
    latitude: number;
    longitude: number;
    description: string;
    elevation: number;
    district: string;
    name: string;
    basin: string;
    steady: string;
    status: string;
    unit: string;
    waterLevel: { value: number; datetime: string };
  };
  updatedAt: string;
}

export function Info({ riverWatch, updatedAt }: InfoProp) {
  const t = useTranslations('AA_PROJECT');
  const formatNum = useNumberFormat();
  const formatDate = useDateFormat();
  const cardData = React.useMemo(
    () => [
      {
        icon: RadioTower,
        label: t('STATION_INDEX'),
        value: riverWatch?.stationIndex,
      },
      {
        icon: Globe,
        label: t('LATITUDE'),
        value: riverWatch?.latitude,
      },
      {
        icon: Globe,
        label: t('LONGITUDE'),
        value: riverWatch?.longitude,
      },
      {
        icon: TrendingUp,
        label: t('ELEVATION'),
        value: riverWatch?.elevation,
      },
      {
        icon: MapPin,
        label: t('DISTRICT'),
        value: riverWatch?.district,
      },
    ],
    [riverWatch],
  );

  return (
    <div className="flex justify-between space-x-4">
      <div className="p-4 rounded-sm border shadow w-full">
        <div className="flex justify-between gap-4">
          <Heading
            title={riverWatch?.basin}
            titleStyle="text-xl/6 font-semibold"
            description={riverWatch?.name}
            updatedAt={updatedAt}
          />
          <div>
            <Badge>{riverWatch?.steady}</Badge>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {cardData?.map((d) => {
            const Icon = d.icon;
            return (
              <div className="flex space-x-3 items-center" key={d.label}>
                <div>
                  <Icon className="text-gray-500" size={20} />
                </div>
                <div>
                  <p className="text-sm/6 font-medium mb-1">{d.label}</p>
                  <p className="text-sm/4 text-gray-600">{formatNum(d.value)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div
        className={`p-4 rounded-sm border shadow text-center w-64 ${renderCardColor(
          riverWatch?.status,
        )}`}
      >
        <p className="text-primary font-semibold text-3xl/10">
          {formatNum(truncateValue(riverWatch?.waterLevel?.value, 2))}
          {riverWatch?.unit}
        </p>
        <p className="text-sm/6 font-medium">{t('WATER_LEVEL')}</p>
        <p className="text-gray-500 text-sm/6">
          {formatDate(
            riverWatch?.waterLevel?.datetime,
            'eee, MMM d yyyy, hh:mm:ss a',
          )}
        </p>
        <Badge className={`${renderStatusColor(riverWatch?.status)}`}>
          {riverWatch?.status}
        </Badge>
      </div>
    </div>
  );
}

import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import React from 'react';
import { calculateRemainingTriggers } from '../utils';
import { useTranslations } from 'next-intl';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/i18n/number';

interface IProps {
  title: string;
  color: string;
  bgColor: string;
  totalTriggers: number;
  totalTriggered: number;
  totalRequiredTriggers: number;
}

const TriggerDetailsCard = ({
  title,
  color,
  bgColor,
  totalTriggers,
  totalTriggered,
  totalRequiredTriggers,
}: IProps) => {
  const t = useTranslations('AA_PROJECT');
  const formatNum = useNumberFormat();
  return (
    <div className={`${bgColor} rounded-xl p-4 space-y-1`}>
      <p className="text-sm/4">{title} {t('TRIGGERS')}</p>
      <div className="flex items-center gap-1">
        <p className={`text-2xl font-medium text-${color}-500`}>
          {formatNum(totalTriggered)}
        </p>
        <p className="text-gray-500">{t('TRIGGERED')}</p>
      </div>
      <div>
        <div
          className={`bg-slate-50 p-2 rounded text-sm/4 text-gray-500 space-y-1`}
        >
          <div className="flex items-center justify-between gap-4">
            <p className="text-black">{t('STATION')}</p>
            <Badge
              className={`bg-${color}-500 text-white font-extralight tracking-wider px-1`}
            >
              {formatNum(totalTriggered)}/{formatNum(totalRequiredTriggers)}
            </Badge>
          </div>

          <div className="flex items-center justify-between pt-2">
            <p>{t('TOTAL_TRIGGERS')}</p>
            <p className="text-gray-700">{formatNum(totalTriggers)}</p>
          </div>

          <div className="flex items-center justify-between">
            <p>{t('REQUIRED')}</p>
            <p className="text-gray-700">{formatNum(totalRequiredTriggers)}</p>
          </div>

          <div className="flex items-center justify-between">
            <p>{t('REMAINING')}</p>
            <p className="text-gray-700">
              {formatNum(
                calculateRemainingTriggers(
                  totalRequiredTriggers,
                  totalTriggered,
                ),
              )}
            </p>
          </div>
        </div>
        {/* this code can be useful latter */}
        {/* <Progress
                value={Math.floor(
                  (triggeredMandatoryTriggers / mandatoryTriggers) * 100,
                )}
                className="h-2"
                indicatorColor={'bg-[#297AD6]'}
              /> */}
      </div>
    </div>
  );
};

export default TriggerDetailsCard;

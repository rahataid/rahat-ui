import { HealthCacheData } from '@rahat-ui/query';
import { useTranslations } from 'next-intl';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/i18n/number';
import { translateValue } from 'apps/rahat-ui/src/utils/i18n/translateValue';

import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Card, CardContent } from '@rahat-ui/shadcn/src/components/ui/card';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@rahat-ui/shadcn/src/components/ui/hover-card';
import { Separator } from '@rahat-ui/shadcn/src/components/ui/separator';
import { useDateFormat } from 'apps/rahat-ui/src/utils/i18n/date';
import { CheckCircle, Info, X } from 'lucide-react';
import { getDynamicColors } from './utils/getDynamicColor';

export function SystemHealthCard({
  overall_status,
  last_updated,
  sources,
}: HealthCacheData) {
  const t = useTranslations('AA_PROJECT');
  const tg = useTranslations('GLOBAL');
  const formatNum = useNumberFormat();
  const formatDate = useDateFormat();
  const statusColors: any = {
    HEALTHY: 'bg-green-50 text-green-700',
    UNHEALTHY: 'bg-red-50 text-red-700',
    DEGRADED: 'bg-yellow-50 text-yellow-700',
  };

  const calcHEALTHY = sources?.filter(
    (s) => s.currentStatus === 'HEALTHY',
  ).length;
  const calcUNHEALTHY = sources?.filter(
    (s) => s.currentStatus === 'UNHEALTHY',
  ).length;
  const calcDEGRADED = sources?.filter(
    (s) => s.currentStatus === 'DEGRADED',
  ).length;

  return (
    <Card
      className={`border ${getDynamicColors(
        overall_status,
      )} shadow-sm rounded-sm mb-1`}
    >
      <CardContent className="flex flex-col space-y-3 p-4">
        <div className="flex flex-col w-full p-3 pt-0 gap-2">
          <div className="flex flex-row items-center gap-3">
            <span className="text-sm font-medium">{t('OVERALL_SYSTEM_HEALTH')}</span>

            <Badge variant="outline" className={statusColors[overall_status]}>
              {translateValue(t, overall_status, { fallbackStyle: 'raw' })}
            </Badge>

            <HoverCard>
              <HoverCardTrigger asChild>
                <Info className="h-3.5 w-3.5 text-gray-500 hover:cursor-pointer" />
              </HoverCardTrigger>
              <HoverCardContent
                className="w-auto rounded-sm p-3 max-w-md mx-auto bg-white shadow  space-y-6 border"
                align="start"
              >
                <div className="flex gap-2 flex-col">
                  <div>
                    <h4 className="text-sm font-medium mb-2">
                      {t('OVERALL_STATUS_RULES')}
                    </h4>
                    <ul className="space-y-1 text-xs">
                      <li>
                        <span className=" text-green-600">{t('HEALTHY')}:</span>{' '}
                        {t('HEALTH_RULE_HEALTHY')}
                      </li>
                      <li>
                        <span className=" text-yellow-600">{t('DEGRADED')}:</span>{' '}
                        {t('HEALTH_RULE_DEGRADED')}
                      </li>
                      <li>
                        <span className=" text-red-600">{t('UNHEALTHY')}:</span>{' '}
                        {t('HEALTH_RULE_UNHEALTHY')}
                      </li>
                    </ul>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="text-sm font-medium mb-1">{t('VALIDITY_RULES')}</h4>
                    <ul className="space-y-1 text-xs">
                      <li>
                        <span className=" text-green-600">{t('VALID')}:</span>{' '}
                        {t('VALIDITY_RULE_VALID')}
                      </li>
                      <li>
                        <span className=" text-yellow-600">{t('STALE')}:</span>{' '}
                        {t('VALIDITY_RULE_STALE')}
                      </li>
                      <li>
                        <span className=" text-red-600">{t('EXPIRED')}:</span>{' '}
                        {t('VALIDITY_RULE_EXPIRED')}
                      </li>
                    </ul>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
          <div className="flex flex-row items-center gap-3">
            <div className="flex flex-row gap-3">
              <span className="flex items-center  text-xs text-green-500">
                {' '}
                <CheckCircle size={13} className="pr-1 w-4 h-4" />
                {t('SOURCES_HEALTHY_RATIO', {
                  count: formatNum(calcHEALTHY),
                  total: formatNum(sources?.length ?? 0),
                })}
              </span>
              <span className="flex items-center  text-xs text-red-500">
                <X size={13} className="pr-1 w-4 h-4" />
                {t('SOURCES_UNHEALTHY_COUNT', { count: formatNum(calcUNHEALTHY) })}
              </span>

              <span className="flex items-center  text-xs text-red-500">
                <X size={13} className="pr-1 w-4 h-4" />
                {t('SOURCES_DEGRADED_COUNT', { count: formatNum(calcDEGRADED) })}
              </span>
            </div>

            <span className="text-xs text-gray-500 ml-auto">
              {tg('LAST_UPDATED')}: {formatDate(last_updated)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

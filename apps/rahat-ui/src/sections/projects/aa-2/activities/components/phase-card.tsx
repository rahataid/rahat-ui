'use client';

import { useTranslations } from 'next-intl';
import { AARoles, RoleAuth } from '@rahat-ui/auth';
import { cn } from '@rahat-ui/shadcn/src';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
} from '@rahat-ui/shadcn/src/components/ui/card';
import { getStatusBg } from 'apps/rahat-ui/src/utils/get-status-bg';
import { RefreshCw, User } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import TooltipWrapper from 'apps/rahat-ui/src/components/tooltip.wrapper';
import { useLabelDigits } from 'apps/rahat-ui/src/utils/i18n/number';
import { translateValue } from 'apps/rahat-ui/src/utils/i18n/translateValue';

interface PhaseCardProps {
  id: string;
  status: string;
  title: string;
  responsibleStation: string;
  leadTime?: string;
  responsibility: string;
  onUpdateStatus: () => void;
  className?: string;
}

export default function PhaseCard({
  status,
  id,
  title,
  responsibleStation,
  leadTime,
  responsibility,
  onUpdateStatus,
  className,
}: PhaseCardProps) {
  const t = useTranslations('AA_PROJECT');
  const tg = useTranslations('GLOBAL');
  const formatDigits = useLabelDigits();
  const router = useRouter();
  const { id: ProjectId } = useParams();

  // leadTime is stored as "<value> <unit>" (e.g. "1 Days"); translate the
  // unit word and transliterate the digit for display only.
  const formatLeadTime = (value?: string) => {
    if (!value) return undefined;
    const match = value.match(/^(\d+)\s*(hours?|days?)$/i);
    if (!match) return value;
    const [, num, unit] = match;
    const unitKey = unit.toLowerCase().startsWith('hour') ? 'HOURS' : 'DAYS';
    return `${formatDigits(num)} ${t(unitKey)}`;
  };
  const formattedLeadTime = formatLeadTime(leadTime);
  const translatedStatus = translateValue(tg, status);

  return (
    <Card
      className={(cn(' border-gray-300 shadow-sm p-4 rounded-xl '), className)}
      onClick={() => router.push(`/projects/aa/${ProjectId}/activities/${id}`)}
    >
      <CardContent className="space-y-2 p-2">
        <div className="flex items-center justify-between ">
          <TooltipWrapper tip={`${t('ACTIVITY_STATUS')}: ${translatedStatus}`}>
            <Badge className={getStatusBg(status)}>{translatedStatus}</Badge>
          </TooltipWrapper>
          <RoleAuth
            roles={[AARoles.ADMIN, AARoles.MANAGER, AARoles.Municipality]}
            hasContent={false}
          >
            <TooltipWrapper tip={t('UPDATE_ACTIVITY_STATUS')}>
              <div
                className="flex items-center gap-2 text-blue-500 text-xs hover:cursor-pointer hover:rounded-sm hover:bg-gray-50 hover:p-1 hover:text-sm "
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdateStatus();
                }}
              >
                {t('UPDATE_STATUS')} <RefreshCw className="w-4 h-4" />
              </div>
            </TooltipWrapper>
          </RoleAuth>
        </div>
        <TooltipWrapper tip={`${t('ACTIVITY_TITLE')}: ${title}`}>
          <h3 className="text-sm font-medium text-gray-900 truncate max-w-full">
            {title ?? tg('N_A')}
          </h3>
        </TooltipWrapper>
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <TooltipWrapper
            tip={`${t('RESPONSIBLE_STATION')}: ${responsibleStation ?? tg('N_A')}`}
          >
            {responsibleStation && responsibleStation.length > 20
              ? `${responsibleStation.substring(0, 20)}...`
              : responsibleStation ?? tg('N_A')}
          </TooltipWrapper>
          <TooltipWrapper tip={`${t('LEAD_TIME')}: ${formattedLeadTime ?? tg('N_A')}`}>
            {leadTime && <span className="text-gray-400">&bull;</span>}
            <span>{formattedLeadTime ?? tg('N_A')}</span>
          </TooltipWrapper>
        </div>
      </CardContent>
      <CardFooter className="p-2 pt-0">
        <TooltipWrapper tip={`${t('RESPONSIBILITY')}: ${responsibility ?? ''}`}>
          <div className="flex items-center gap-2 p-0">
            <User className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-500">
              {responsibility ?? ''}
            </span>
          </div>
        </TooltipWrapper>
      </CardFooter>
    </Card>
  );
}

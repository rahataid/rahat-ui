import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { translateValue } from 'apps/rahat-ui/src/utils/i18n/translateValue';
import { useSearchParams, useRouter, useParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';

import { UUID } from 'crypto';

import { IndividualLogsTab } from '../table/IndividualLogsTab';
import { useTransportSessionStats } from '@rahat-ui/query';
import { normalizeTransportName } from 'apps/rahat-ui/src/utils/string';
import { DEFAULT_TRANSPORTS } from 'apps/rahat-ui/src/constants/communication.const';
import { SpinnerLoader } from 'apps/rahat-ui/src/common';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/i18n/number';
import { capitalizeFirstLetter } from 'apps/rahat-ui/src/utils';

type SubTabType = 'voice' | 'sms' | 'email';

type TransportStat = {
  transportId: string;
  transportName: string;
  total: number;
};

export function IndividualLogTab() {
  const g = useTranslations('GLOBAL');
  const formatNum = useNumberFormat();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { id } = useParams() as { id: UUID };

  const { data: statsData, isLoading } = useTransportSessionStats(id);
  const tab = searchParams.get('tab') || 'individualLog';

  const mergedStats = useMemo(() => {
    if (!statsData || statsData.length === 0) {
      return DEFAULT_TRANSPORTS;
    }

    return DEFAULT_TRANSPORTS.map((defaultTransport) => {
      const backendStat = statsData.find(
        (stat: TransportStat) =>
          normalizeTransportName(stat.transportName) ===
          defaultTransport.transportName,
      );
      return backendStat || defaultTransport;
    });
  }, [statsData]);

  const defaultSubTab = useMemo(() => {
    if (statsData && statsData.length > 0) {
      return statsData[0].transportName.toLowerCase();
    }
    return 'voice';
  }, [statsData]);

  const subTab = (searchParams.get('subTab') as SubTabType) || defaultSubTab;

  useEffect(() => {
    if (
      tab === 'individualLog' &&
      !searchParams.get('subTab') &&
      !isLoading &&
      statsData
    ) {
      router.replace(`?tab=individualLog&subTab=${defaultSubTab}`);
    }
  }, [tab, searchParams, router, defaultSubTab, isLoading, statsData]);

  const handleSubTabChange = (value: string) => {
    router.push(`?tab=individualLog&subTab=${value}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-8">
        <SpinnerLoader />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg">
      <Tabs
        className="p-1"
        defaultValue={defaultSubTab}
        value={subTab}
        onValueChange={handleSubTabChange}
      >
        <div className="max-w-full">
          <TabsList className="mb-4 flex h-auto w-full flex-wrap sm:w-fit">
            {mergedStats.map((stat: TransportStat) => {
              const tabValue = stat.transportName.toLowerCase();
              return (
                <TabsTrigger
                  key={stat.transportId}
                  value={tabValue}
                  className="flex flex-1 items-center gap-2 font-inter font-medium text-[14px] leading-[24px] tracking-[0%]"
                >
                  <span
                    className={
                      subTab === tabValue
                        ? 'underline decoration-[2px] decoration-[#297AD6]'
                        : ''
                    }
                  >
                    {translateValue(g, stat.transportName, {
                      fallback: capitalizeFirstLetter(stat.transportName),
                    })}
                  </span>
                  <Badge
                    className={`h-6 w-6 justify-center text-white px-2 py-0 ${
                      subTab === tabValue ? 'bg-blue-500' : 'bg-gray-500'
                    }`}
                  >
                    {formatNum(stat.total)}
                  </Badge>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>
        {mergedStats.map((stat: TransportStat) => {
          const tabValue = stat.transportName.toLowerCase();
          return (
            <TabsContent key={stat.transportId} value={tabValue}>
              <IndividualLogsTab id={id} subTab={tabValue as SubTabType} />
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}

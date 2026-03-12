import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { useSearchParams, useRouter, useParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';

import { UUID } from 'crypto';

import { IndividualLogsTab } from '../table/IndividualLogsTab';
import { useTransportSessionStats } from '@rahat-ui/query';
import { normalizeTransportName } from 'apps/rahat-ui/src/utils/string';
import { capitalizeFirstLetter } from 'apps/rahat-ui/src/utils';
import { DEFAULT_TRANSPORTS } from 'apps/rahat-ui/src/constants/communication.const';
import { SpinnerLoader } from 'apps/rahat-ui/src/common';
import { useSwal } from 'libs/query/src/swal';

type SubTabType = 'voice' | 'sms' | 'email';

type TransportStat = {
  transportId: string;
  transportName: string;
  total: number;
};

export function IndividualLogTab() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { id } = useParams() as { id: UUID };
  const alert = useSwal();
  const toast = alert.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });

  const {
    data: statsData,
    isLoading,
    isError,
    error,
  } = useTransportSessionStats(id);
  const tab = searchParams.get('tab') || 'individualLog';

  if (isError) {
    toast.fire({
      icon: 'error',
      text: (error as any)?.message || 'Error fetching transport stats',
    });
  }

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
        <TabsList className="grid w-fit grid-cols-3 mb-4">
          {mergedStats.map((stat: TransportStat) => {
            const tabValue = stat.transportName.toLowerCase();
            return (
              <TabsTrigger
                key={stat.transportId}
                value={tabValue}
                className="font-inter font-medium text-[14px] leading-[24px] tracking-[0%] flex items-center gap-2"
              >
                <span
                  className={
                    subTab === tabValue
                      ? 'underline decoration-[2px] decoration-[#297AD6]'
                      : ''
                  }
                >
                  {capitalizeFirstLetter(stat.transportName)}
                </span>
                <Badge
                  className={`h-6 w-6 justify-center text-white px-2 py-0 ${
                    subTab === tabValue ? 'bg-blue-500' : 'bg-gray-500'
                  }`}
                >
                  {stat.total}
                </Badge>
              </TabsTrigger>
            );
          })}
        </TabsList>
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

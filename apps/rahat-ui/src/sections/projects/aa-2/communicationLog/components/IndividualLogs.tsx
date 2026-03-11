import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { useSearchParams, useRouter, useParams } from 'next/navigation';
import { useEffect } from 'react';

import { UUID } from 'crypto';

import { IndividualLogsTab } from '../table/IndividualLogsTab';
import { useTransportSessionStats } from '@rahat-ui/query';

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

  const { data: statsData } = useTransportSessionStats(id);

  const tab = searchParams.get('tab') || 'individualLog';

  const subTab = (searchParams.get('subTab') as SubTabType) || 'voice';

  useEffect(() => {
    if (tab === 'individualLog' && !searchParams.get('subTab')) {
      router.replace(`?tab=individualLog&subTab=voice`);
    }
  }, [tab, searchParams, router]);

  const handleSubTabChange = (value: string) => {
    router.push(`?tab=individualLog&subTab=${value}`);
  };

  return (
    <div className="bg-white rounded-lg">
      <Tabs
        className="p-1"
        defaultValue="voice"
        value={subTab}
        onValueChange={handleSubTabChange}
      >
        <TabsList className="grid w-fit grid-cols-3 mb-4">
          {statsData?.map((stat: TransportStat) => {
            const tabValue = stat.transportName.toLowerCase();
            return (
              <TabsTrigger
                key={stat.transportId}
                value={tabValue}
                className={`font-inter font-medium text-[14px] leading-[24px] tracking-[0%] flex items-center gap-2 ${
                  subTab === tabValue
                    ? 'underline decoration-[2px] decoration-[#297AD6]'
                    : ''
                }`}
              >
                {stat.transportName.charAt(0) +
                  stat.transportName.slice(1).toLowerCase()}
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
        {statsData?.map((stat: TransportStat) => {
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

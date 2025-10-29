import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import { useSearchParams, useRouter, useParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';

import { UUID } from 'crypto';

import { IndividualLogsTab } from '../table/IndividualLogsTab';

type SubTabType = 'voice' | 'sms' | 'email';

export function IndividualLogTab() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { id } = useParams() as { id: UUID };

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
  console.log(subTab, 'subtabvalue outside');

  return (
    <div className="bg-white rounded-lg">
      <Tabs
        className="p-1"
        defaultValue="voice"
        value={subTab}
        onValueChange={handleSubTabChange}
      >
        <TabsList className="grid w-fit grid-cols-3 mb-4">
          <TabsTrigger
            value="voice"
            className={`font-inter font-medium text-[14px] leading-[24px] tracking-[0%] ${
              subTab === 'voice'
                ? 'underline decoration-[2px] decoration-[#297AD6]'
                : ''
            }`}
          >
            Voice
          </TabsTrigger>
          <TabsTrigger
            value="sms"
            className={`font-inter font-medium text-[14px] leading-[24px] tracking-[0%] ${
              subTab === 'sms'
                ? 'underline decoration-[2px] decoration-[#297AD6]'
                : ''
            }`}
          >
            SMS
          </TabsTrigger>
          <TabsTrigger
            value="email"
            className={`font-inter font-medium text-[14px] leading-[24px] tracking-[0%] ${
              subTab === 'email'
                ? 'underline decoration-[2px] decoration-[#297AD6]'
                : ''
            }`}
          >
            Email
          </TabsTrigger>
        </TabsList>
        <TabsContent value="voice">
          <IndividualLogsTab id={id} subTab={subTab} />
        </TabsContent>
        <TabsContent value="sms">
          <IndividualLogsTab id={id} subTab={subTab} />
        </TabsContent>
        <TabsContent value="email">
          <IndividualLogsTab id={id} subTab={subTab} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

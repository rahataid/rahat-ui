'use client';

import VoiceDetailTable from './voiceDetailTable';
import VoiceInfoCard from '../infoCard';
import { Card, CardContent } from '@rahat-ui/shadcn/src/components/ui/card';
import LogCard from '../logCard';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';

export default function VoiceDetailView() {
  const logCardData = [
    { total: 4, title: 'Total IVR sent' },
    { total: 1, title: 'Successfull IVR' },
    { total: 3, title: 'Failed IVR' },
  ];
  return (
    <>
      <div className="mt-8">
        <VoiceInfoCard />
      </div>
      <div className="mt-5">
        <Card>
          <ScrollArea className="h-custom1">
            <CardContent>
              <div className="grid grid-cols-3 gap-5 mt-8">
                {logCardData.map((item) => (
                  <LogCard title={item.title} total={item.total} />
                ))}
              </div>
              <VoiceDetailTable />
            </CardContent>
          </ScrollArea>
        </Card>
      </div>
    </>
  );
}

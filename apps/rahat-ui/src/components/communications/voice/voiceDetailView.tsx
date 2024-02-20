'use client';

import VoiceDetailTable from './voiceDetailTable';
import VoiceInfoCard from '../infoCard';
import { Card, CardContent } from '@rahat-ui/shadcn/src/components/ui/card';
import LogCard from '../logCard';

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
          <CardContent>
            <div className="grid grid-cols-3 gap-5 mt-8">
              {logCardData.map((item) => (
                <LogCard title={item.title} total={item.total} />
              ))}
            </div>
            <VoiceDetailTable />
          </CardContent>
        </Card>
      </div>
    </>
  );
}

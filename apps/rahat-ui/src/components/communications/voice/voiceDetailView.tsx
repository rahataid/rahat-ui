'use client';

import VoiceDetailTable from './voiceDetailTable';
import VoiceInfoCard from '../infoCard';
import { Card, CardContent } from '@rahat-ui/shadcn/src/components/ui/card';

export default function VoiceDetailView() {
  return (
    <>
      <div className="mt-8">
        <VoiceInfoCard />
      </div>
      <div className="mt-5">
        <Card>
          <CardContent>
            <VoiceDetailTable />
          </CardContent>
        </Card>
      </div>
    </>
  );
}

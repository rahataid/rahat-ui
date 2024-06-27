'use client';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';

import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { useParams, useRouter } from 'next/navigation';
import VoiceCampaignAddDrawer from './campaign.voice.add';

const VoiceCampaignDetails = () => {
  const { id } = useParams();
  const router = useRouter();

  return (
    <div className="h-[calc(100vh-80px)] p-2">
      <ScrollArea className="h-full">
        <div className="grid grid-cols-4 gap-2">
          {/* /Add Campaign Card */}
          <VoiceCampaignAddDrawer />
          {/* Campaign Card */}
          <Card
            onClick={() =>
              router.push(`/projects/rp/${id}/campaigns/text/manage/${id}`)
            }
            className="flex flex-col rounded justify-center shadow bg-card cursor-pointer hover:shadow-md hover:border-1 hover:border-blue-500 ease-in duration-100"
          >
            <CardHeader className="pb-2 p-4">
              <div className="flex items-start justify-between ">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-md font-normal text-primary text-lg">
                    Campaign Name
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="flex flex-col items-center">
                <p className="text-gray-700">Active</p>
                <p className="font-normal text-neutral-400 text-sm">Status</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-gray-700">19</p>
                <p className="font-normal text-neutral-400 text-sm">Triggers</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
};

export default VoiceCampaignDetails;

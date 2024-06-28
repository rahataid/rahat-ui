'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@rahat-ui/shadcn/src/components/ui/resizable';

import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { useParams, useRouter } from 'next/navigation';
import VoiceCampaignAddDrawer from './campaign.voice.add';

const VoiceCampaignDetails = () => {
  const { campaignId, id } = useParams();
  const router = useRouter();

  return (
    <div className="h-[calc(100vh-80px)] p-2">
      <ResizablePanelGroup
        direction="vertical"
        className="max-w-full rounded border bg-secondary p-2"
      >
        <ResizablePanel defaultSize={50}>
          <ScrollArea className="h-full">
            <div className="grid grid-cols-4 gap-2">
              {/* /Add Campaign Card */}
              <VoiceCampaignAddDrawer />
              {/* Campaign Card */}
              <Card
                onClick={() =>
                  router.push(
                    `/projects/rp/${id}/campaigns/text/manage/${campaignId}`,
                  )
                }
                className="flex rounded justify-center border-dashed border-2 border-primary shadow bg-card cursor-pointer hover:shadow-md ease-in duration-300"
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
                    <p className="font-normal text-neutral-400 text-sm">
                      Status
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
                    <p className="text-gray-700">19</p>
                    <p className="font-normal text-neutral-400 text-sm">
                      Triggers
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50}></ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default VoiceCampaignDetails;

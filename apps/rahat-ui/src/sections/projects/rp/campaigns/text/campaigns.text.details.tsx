'use client';
import { UUID } from 'crypto';
import { useParams, useRouter } from 'next/navigation';

import { CAMPAIGN_TYPES } from '@rahat-ui/types';
import { useListRpCampaign } from '@rahat-ui/query';
import TextCampaignAddDrawer from './campaign.text.add';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';

const TextCampaignDetails = () => {
  const { id } = useParams();
  const router = useRouter();

  const { data: campaignData } = useListRpCampaign(id as UUID);
  const textCampaign = campaignData?.rows?.filter(
    (campaign) =>
      campaign.type.toLowerCase() !== CAMPAIGN_TYPES.IVR.toLowerCase(),
  );
  return (
    <div className="h-[calc(100vh-80px)] p-2">
      <ScrollArea className="h-full">
        <div className="grid grid-cols-4 gap-2">
          {/* /Add Campaign Card */}
          <TextCampaignAddDrawer />
          {/* Campaign Card */}
          {textCampaign?.map((campaign) => {
            return (
              <Card
                onClick={() =>
                  router.push(
                    `/projects/rp/${id}/campaigns/text/manage/${campaign.id}`,
                  )
                }
                className="flex flex-col rounded justify-center shadow bg-card cursor-pointer hover:shadow-md hover:border-1 hover:border-blue-500 ease-in duration-200"
              >
                <CardHeader className="pb-2 p-4">
                  <div className="flex items-start justify-between ">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-md font-normal text-primary text-lg">
                        {campaign.name}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <div className="flex flex-col items-center">
                    <p className="text-gray-700">{campaign.status}</p>
                    <p className="font-normal text-neutral-400 text-sm">
                      Status
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
                    <p className="text-gray-700">0</p>
                    <p className="font-normal text-neutral-400 text-sm">
                      Triggers
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default TextCampaignDetails;

'use client';
import { useRouter } from 'next/navigation';

import {
  useListBeneficiariesComms,
  useListTransports,
} from '@rahat-ui/community-query';
import { usePagination } from '@rahat-ui/query';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import TextCampaignAddDrawer from './campaign.text.add';

const TextCampaignDetails = () => {
  const { pagination, filters } = usePagination();
  const router = useRouter();
  pagination.perPage = 0;
  const { data: campaignData } = useListBeneficiariesComms({
    ...pagination,
    ...(filters as any),
  });
  const { data: listTransports } = useListTransports();

  const ivrTransportCuids = listTransports?.data
    ?.filter((transport: any) => transport.name.toLowerCase() === 'ivr')
    .map((transport: any) => transport.cuid);
  const filteredComs = campaignData?.data?.rows.filter(
    (com: any) => !ivrTransportCuids?.includes(com.transportId),
  );

  return (
    <div className="h-[calc(100vh-80px)] p-2">
      <ScrollArea className="h-full">
        <div className="grid grid-cols-4 gap-2">
          <TextCampaignAddDrawer />
          {filteredComs?.map((campaign: any) => {
            return (
              <Card
                key={campaign.uuid}
                onClick={() =>
                  router.push(`/communications/text/manage/${campaign.uuid}`)
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

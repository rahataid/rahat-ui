'use client';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';

import {
  useListRpCampaign,
  useListRpTransport,
  usePagination,
} from '@rahat-ui/query';

import { UUID } from 'crypto';
import { useParams, useRouter } from 'next/navigation';
import IvrCampaignAddDrawer from './campaign.ivr.add';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';


const IvrCampaignDetails = () => {
  const { pagination, filters } = usePagination();
  const router = useRouter();
  const { id } = useParams();

  const { data: campaignData } = useListRpCampaign(id as UUID, {
    ...pagination,
    ...(filters as any),
    order: 'desc',
  });
  const { data: transportData } = useListRpTransport(id as UUID);

  const ivrTransportCuids = transportData
    ?.filter((transport: any) => transport.name.toLowerCase() === 'ivr')
    .map((transport: any) => transport.cuid);
  const filteredComs = campaignData?.filter((com: any) =>
    ivrTransportCuids?.includes(com.transportId),
  );
  console.log(filteredComs, ivrTransportCuids);
  return (
    <div className="h-[calc(100vh-80px)] p-2">
      <ScrollArea className="h-full">
        <div className="grid grid-cols-4 gap-2">
          {/* /Add Campaign Card */}
          <IvrCampaignAddDrawer />
          {/* Campaign Card */}
          {filteredComs?.map((ivrCampaign: any) => {
            return (
              <Card
                key={ivrCampaign.uuid}
                onClick={() =>
                  router.push(
                    `/projects/comms/${id}/campaigns/text/manage/${ivrCampaign.uuid}`,
                  )
                }
                className="flex flex-col rounded justify-center shadow bg-card cursor-pointer hover:shadow-md hover:border-1 hover:border-blue-500 ease-in duration-200"
              >
                <CardHeader className="pb-2 p-4">
                  <div className="flex items-start justify-between ">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-md font-normal text-primary text-lg">
                        {ivrCampaign.name}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <div className="flex flex-col items-center">
                    <p className="text-gray-700">{ivrCampaign.status}</p>
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

export default IvrCampaignDetails;

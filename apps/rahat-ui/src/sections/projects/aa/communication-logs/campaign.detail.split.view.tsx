import { useParams, useRouter } from 'next/navigation';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/components/tooltip';
import { Card, CardContent } from '@rahat-ui/shadcn/src/components/ui/card';
import { Button } from '@rahat-ui/shadcn/components/button';

import { Minus } from 'lucide-react';
import { ICampaignItemApiResponse } from '@rahat-ui/types';
import { useGetCampaign } from '@rumsan/communication-query';
import CampaignDetailTableView from './campaignDetailTable';
import { useProjectBeneficiaries } from '@rahat-ui/query';
import { UUID } from 'crypto';
import { exportDataToExcel } from 'apps/rahat-ui/src/utils';
import Link from 'next/link';
type IProps = {
  details: ICampaignItemApiResponse;
  closeSecondPanel: VoidFunction;
  refetch?: any;
};

export default function CampaignDetailSplitView({
  details,
  closeSecondPanel,
  refetch,
}: IProps) {
  const { id: projectID } = useParams();
  const projectBeneficiaries = useProjectBeneficiaries({
    projectUUID: projectID as UUID,
  });

  const { data: campaign, isSuccess } = useGetCampaign({
    id: Number(details.id),
  });
  const handleExport = () => {
    // filter failed data
    const failedPhones = campaign?.data?.communicationLogs
      .filter((data) => {
        return data?.status.toLowerCase() === 'failed';
      })
      .map((data) => data?.audience?.details?.phone);

    const mappedData = projectBeneficiaries.data.data.filter((data) => {
      if (failedPhones && failedPhones.includes(data.phone)) {
        return data;
      }
    });

    exportDataToExcel(mappedData);
  };

  return (
    <div className="px-2 py-4">
      <div className="flex gap-4">
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger onClick={closeSecondPanel}>
              <Minus size={20} strokeWidth={1.5} />
            </TooltipTrigger>
            <TooltipContent className="bg-secondary ">
              <p className="text-xs font-medium">Close</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="mt-5 flex flex-col gap-5">
        <Card className="shadow-md">
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-light text-base">{details?.status}</p>
                <p className="text-sm font-normal text-muted-foreground">
                  Status
                </p>
              </div>
              <div>
                <p className="font-light text-base">
                  {details?.type.toLowerCase() === 'ivr' ? (
                    // @ts-ignore

                    <Link href={details?.details?.ivrMediaURL || ''}>
                      {details?.details?.ivrFileName}
                    </Link>
                  ) : details?.details?.body ? (
                    details?.details?.body
                  ) : details?.details?.message ? (
                    details?.details?.message
                  ) : (
                    'No message'
                  )}
                </p>
                <p className="text-sm font-normal text-muted-foreground">
                  Message
                </p>
              </div>
              <div>
                <p className="font-light text-base">{details?.type}</p>
                <p className="text-sm font-normal text-muted-foreground">
                  Type
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* export failed ivr and sms  */}
      <div className="flex justify-end mt-2">
        <Button onClick={handleExport}>Export failed</Button>
      </div>

      <div>
        {isSuccess && (
          <CampaignDetailTableView
            data={campaign?.data?.communicationLogs}
            type={details.type}
          />
        )}
      </div>
    </div>
  );
}

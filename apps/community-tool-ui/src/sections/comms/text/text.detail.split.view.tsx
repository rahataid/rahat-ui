import { useRouter } from 'next/navigation';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/components/tooltip';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';
import { Expand, Minus, Trash2, FilePenLine } from 'lucide-react';
import { ICampaignItemApiResponse } from '@rahat-ui/types';
import InfoCard from '../infoCard';
import { paths } from 'apps/rahat-ui/src/routes/paths';

type IProps = {
  details: ICampaignItemApiResponse;
  closeSecondPanel: VoidFunction;
};

export default function TextDetailSplitView({
  details,
  closeSecondPanel,
}: IProps) {
  const router = useRouter();
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
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger>
              <Expand
                size={20}
                strokeWidth={1.5}
                onClick={() =>
                  router.push(
                    paths.dashboard.communication.textDetail(details.id),
                  )
                }
              />
            </TooltipTrigger>
            <TooltipContent className="bg-secondary">
              <p className="text-xs font-medium">Expand</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger>
              <FilePenLine
                size={20}
                strokeWidth={1.5}
                onClick={() =>
                  router.push(
                    paths.dashboard.communication.editTextCampaign(details.id),
                  )
                }
              />
            </TooltipTrigger>
            <TooltipContent className="bg-secondary ">
              <p className="text-xs font-medium">Edit</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger>
              <Trash2 size={20} strokeWidth={1.5} />
            </TooltipTrigger>
            <TooltipContent className="bg-secondary ">
              <p className="text-xs font-medium">Delete</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="mt-5 flex flex-col gap-5">
        <InfoCard
          campaignId={details?.id}
          name={details?.name}
          startTime={
            details?.startTime && new Date(details?.startTime).toLocaleString()
          }
          status={details?.status}
          totalAudience={details?.totalAudiences ?? 0}
          type={details?.type}
          closeSecondPanel={closeSecondPanel}
        />
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Message</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              {details?.details?.body
                ? details?.details?.body
                : details?.details?.message
                ? details?.details?.message
                : 'No message'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/components/tooltip';
import { Archive, Minus, Trash2 } from 'lucide-react';

import { IActivitiesItem } from 'apps/rahat-ui/src/types/activities';

type IProps = {
  data?: IActivitiesItem;
  closeSecondPanel?: VoidFunction;
};

export default function ActivitiesDetail({ data, closeSecondPanel }: IProps) {
  return (
    <div className="p-2">
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
        {/* <TooltipProvider delayDuration={100}>
                    <Tooltip>
                        <TooltipTrigger
                            onClick={() => {
                                router.push(
                                    paths.dashboard.beneficiary.detail(data.walletAddress),
                                );
                            }}
                        >
                            <Expand size={20} strokeWidth={1.5} />
                        </TooltipTrigger>
                        <TooltipContent className="bg-secondary ">
                            <p className="text-xs font-medium">Expand</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider> */}
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger>
              <Archive size={20} strokeWidth={1.5} />
            </TooltipTrigger>
            <TooltipContent className="bg-secondary ">
              <p className="text-xs font-medium">Archive</p>
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
      <div className="mt-4">
        <p className="font-medium text-xl">{data?.title ?? 'Activity Title'}</p>
        <p className="font-normal texl-md">
          {data?.description ??
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat'}
        </p>
      </div>
    </div>
  );
}

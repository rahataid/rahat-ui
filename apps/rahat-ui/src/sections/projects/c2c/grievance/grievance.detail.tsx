'use client';

import { useParams } from 'next/navigation';

import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { Minus } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Separator } from '@rahat-ui/shadcn/src/components/ui/separator';

type IProps = {
  details: any;
  closeSecondPanel: VoidFunction;
};

export default function GrievanceDetail({ details, closeSecondPanel }: IProps) {
  const { id } = useParams();
  const route = useRouter();

  return (
    <>
      <div className="flex justify-between p-4 pt-5 bg-card border-b">
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
      <div className="p-4 bg-card flex gap-2 justify-between items-center flex-wrap">
        <div className="flex items-center gap-2">
          <Image
            className="rounded-full"
            src="/profile.png"
            alt="cat"
            height={80}
            width={80}
          />
          <div>
            <div className="flex items-center justify-between gap-2 mb-1 w-full">
              <h1 className="font-semibold text-xl">
                {/*  */}
                {details?.title}
              </h1>
              <Badge>{details?.status}</Badge>
            </div>
          </div>
        </div>
      </div>
      <Separator className="my-2" />
      <div className="flex items-center justify-between m-4">
        <p>{details?.title}</p>
        <p>{details?.type}</p>
      </div>
      <div className="m-4">{details?.description}</div>
      <div className="flex items-center justify-between m-4">
        <div className="flex flex-col">
          <p>{details?.reportedBy?.name}</p>
          <p className="text-xs text-muted-foreground">Created By</p>
        </div>
        <div className="flex flex-col">
          <p>{details?.createdAt}</p>
          <p className="text-xs text-muted-foreground">Created On</p>
        </div>
      </div>
    </>
  );
}

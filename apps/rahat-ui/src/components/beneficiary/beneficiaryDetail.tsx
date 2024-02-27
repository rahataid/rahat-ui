import Image from 'next/image';
import {
  Tabs,
  TabsTrigger,
  TabsList,
  TabsContent,
} from '@rahat-ui/shadcn/components/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/components/tooltip';

import { Label } from '@rahat-ui/shadcn/components/label';
import { Switch } from '@rahat-ui/shadcn/components/switch';
import { Share, Archive, Trash2, FilePenLine } from 'lucide-react';
import { IBeneficiaryItem } from '../../types/beneficiary';
import { Button } from '@rahat-ui/shadcn/components/button';

type IProps = {
  data: IBeneficiaryItem;
};

export default function BeneficiaryDetail({ data }: IProps) {
  const changedDate = new Date(data?.updatedAt);
  const formattedDate = changedDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  return (
    <>
      <Tabs defaultValue="detail">
        <div className="flex justify-between items-center p-4">
          <TabsList>
            <TabsTrigger value="detail">Details </TabsTrigger>
            <TabsTrigger value="transaction-history">
              Transaction History
            </TabsTrigger>
          </TabsList>
          <div className="flex gap-4">
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger>
                  <Share />
                </TooltipTrigger>
                <TooltipContent className="bg-secondary ">
                  <p className="text-xs font-medium">Export</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger>
                  <FilePenLine />
                </TooltipTrigger>
                <TooltipContent className="bg-secondary ">
                  <p className="text-xs font-medium">Edit</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger>
                  <Archive />
                </TooltipTrigger>
                <TooltipContent className="bg-secondary ">
                  <p className="text-xs font-medium">Archive</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger>
                  <Trash2 />
                </TooltipTrigger>
                <TooltipContent className="bg-secondary ">
                  <p className="text-xs font-medium">Delete</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <div className="flex justify-between items-center p-4">
          <div className="flex gap-4">
            <Image
              className="rounded-full"
              src="/svg/funny-cat.svg"
              alt="cat"
              height={80}
              width={80}
            />
            <div className="my-auto">
              <h1 className="font-semibold text-xl mb-2">
                {data.walletAddress}
              </h1>
              <div className="flex justify-between">
                <p>Edit</p>
                <p>Delete</p>
              </div>
            </div>
          </div>
          <div>
            <p className="text-slate-500">
              {formattedDate}
              <br />
              Last updated
            </p>
          </div>
        </div>
        <TabsContent value="detail">
          <div className="grid grid-cols-2 border-y">
            <div className="border-r p-4 flex flex-col gap-2">
              <p>Name</p>
              <p>Verified</p>
              <p>Updated Date</p>
            </div>
            <div className="p-4 flex flex-col gap-2">
              <p>{data.walletAddress}</p>
              <p>{data.verified ? 'True' : 'False'}</p>
              <p>{formattedDate}</p>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="transaction-history">
          <div className="p-4 border-y">Transaction History View</div>
        </TabsContent>
        <div className="p-6 flex justify-between">
          <div className="flex items-center space-x-2">
            <Switch id="disable-user" />
            <Label htmlFor="disable-user">Disable this user</Label>
          </div>
          <Button>Confirm</Button>
        </div>
      </Tabs>
    </>
  );
}

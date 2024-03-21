'use client';

import {
  Dialog,
  DialogTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/components/tooltip';
import ConfirmDialog from '../../components/dialog';
import { FilePenLine, Trash2 } from 'lucide-react';
import { Badge } from '@rahat-ui/shadcn/components/badge';
import { IBeneficiaryItem } from '../../types/beneficiary';

interface IAdditionalBeneficiaryItem extends IBeneficiaryItem {
  handleClick: VoidFunction;
}

export default function Card({
  walletAddress,
  updatedAt,
  verified,
  handleClick,
}: IAdditionalBeneficiaryItem) {
  const changedDate = new Date(updatedAt);
  const formattedDate = changedDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="p-5 border rounded-md cursor-pointer" onClick={handleClick}>
      <div className="flex justify-between mb-5">
        <div>
          <h1 className="font-semibold mb-2">{walletAddress}</h1>
          <p className="text-slate-500">
            Total transaction made : {Math.floor(Math.random() * 10)}{' '}
            transactions
          </p>
        </div>
        <div className="flex gap-4">
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger>
                <FilePenLine size={20} stroke-width={1.5} />
              </TooltipTrigger>
              <TooltipContent className="bg-secondary ">
                <p className="text-xs font-medium">Edit</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger>
                <Dialog>
                  <DialogTrigger asChild className="my-2 ml-4">
                    <Trash2 size={20} stroke-width={1.5} />
                  </DialogTrigger>
                  <ConfirmDialog name="user" />
                </Dialog>
              </TooltipTrigger>
              <TooltipContent className="bg-secondary ">
                <p className="text-xs font-medium">Delete</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <div className="flex justify-between items-center flex-wrap gap-4">
        <p className="text-slate-400">Last updated: {formattedDate}</p>
        <div className="cursor-auto ">
          <Badge className="px-2 py-1 rounded-md">
            {verified ? 'Verified' : 'Unverified'}
          </Badge>
          {/* <Badge
            className="px-4 py-1.5 rounded-md"
            variant={!verified ? 'default' : 'secondary'}
          >
            Unverified
          </Badge> */}
        </div>
      </div>
    </div>
  );
}

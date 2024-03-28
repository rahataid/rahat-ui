import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/components/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dropdown-menu';
import { truncateEthAddress } from '@rumsan/sdk/utils';
import { Minus, MoreVertical, Trash2 } from 'lucide-react';
import Image from 'next/image';

type IProps = {
  vendorsDetail: any;
  closeSecondPanel: VoidFunction;
};

export default function VendorsDetailSplitView({
  vendorsDetail,
  closeSecondPanel,
}: IProps) {
  console.log('VD==>', vendorsDetail);
  return (
    <>
      <div className="p-4 bg-card">
        <div className="flex">
          <Image
            className="rounded-full"
            src="/svg/funny-cat.svg"
            alt="cat"
            height={80}
            width={80}
          />
          <div className="flex flex-col items-center justify-center w-full mr-2 gap-2">
            <div className="flex align-center justify-between w-full ml-4">
              <h1 className="font-semibold text-xl">{vendorsDetail?.name}</h1>
              <div className="flex">
                <div className="mr-3">
                  <TooltipProvider>
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
                <div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Trash2
                          className="cursor-pointer"
                          size={18}
                          strokeWidth={1.6}
                          color="#FF0000"
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="pl-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreVertical
                        className="cursor-pointer"
                        size={20}
                        strokeWidth={1.5}
                      />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
            <div className="flex align-center justify-between w-full ml-4">
              <p className="text-slate-500">
                {truncateEthAddress(vendorsDetail?.walletAddress) || '-'}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full bg-card">
        <div className="border-t">
          <div className="grid grid-cols-2 gap-4 p-8">
            <div>
              <p className="font-light text-base">
                {vendorsDetail?.name || '-'}
              </p>
              <p className="text-sm font-normal text-muted-foreground">Name</p>
            </div>
            <div>
              <p className="font-light text-base">
                {vendorsDetail?.gender || '-'}
              </p>
              <p className="text-sm font-normal text-muted-foreground ">
                Gender
              </p>
            </div>
          </div>
          <div className="border-b grid grid-cols-2 gap-4 p-8">
            <div>
              <p className="font-light text-base">
                {vendorsDetail?.email || '-'}
              </p>
              <p className="text-sm font-normal text-muted-foreground ">
                Email
              </p>
            </div>
            <div>
              <p className="font-light text-base">
                {vendorsDetail?.phone || '-'}
              </p>
              <p className="text-sm font-normal text-muted-foreground ">
                Phone
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

import { useRouter } from 'next/navigation';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/components/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/components/tooltip';
import {
  Dialog,
  DialogTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import { Archive, Expand, FilePenLine, Minus, Trash2 } from 'lucide-react';
// import ConfirmDialog from '../../components/dialog';
import { paths } from '../../../../routes/paths';
import { IBeneficiaryItem } from '../../../../types/beneficiary';
// import EditBeneficiary from '../beneficiary/editBeneficiary';
import InfoCards from '../../../beneficiary/infoCards';

type IProps = {
  data: IBeneficiaryItem;
  closeSecondPanel: VoidFunction;
};

export default function BeneficiaryDetail({
  data,
  closeSecondPanel: VoidFunction,
}: IProps) {
  const router = useRouter();

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
          <div className="flex gap-4">
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger onClick={handleClose}>
                  <Minus size={20} strokeWidth={1.5} />
                </TooltipTrigger>
                <TooltipContent className="bg-secondary ">
                  <p className="text-xs font-medium">Close</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider delayDuration={100}>
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
            </TooltipProvider>
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
                  <Dialog>
                    <DialogTrigger asChild>
                      <Trash2 size={20} strokeWidth={1.5} />
                    </DialogTrigger>
                    {/* <ConfirmDialog name="beneficiary" /> */}
                  </Dialog>
                </TooltipTrigger>
                <TooltipContent className="bg-secondary ">
                  <p className="text-xs font-medium">Delete</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <TabsList>
            <TabsTrigger value="detail">Details </TabsTrigger>
            <TabsTrigger value="transaction-history">
              Transaction History
            </TabsTrigger>
            <TabsTrigger value="edit">Edit</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="detail">
          <InfoCards data={data} />
        </TabsContent>
        <TabsContent value="transaction-history">
          <div className="p-4 border-y">Transaction History View</div>
        </TabsContent>
        <TabsContent value="edit">{/* <EditBeneficiary /> */}</TabsContent>
      </Tabs>
    </>
  );
}

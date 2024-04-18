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
import { ListBeneficiary } from '@rahataid/community-tool-sdk/beneficiary';
import { Minus } from 'lucide-react';
import EditBeneficiary from './editBeneficiary';
import InfoCards from './infoCards';

type IProps = {
  data: ListBeneficiary;
  // handleDefault: VoidFunction;
  handleClose: VoidFunction;
};

export default function BeneficiaryDetail({ data, handleClose }: IProps) {
  const router = useRouter();

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
            <div>
              <p>
                <b>
                  {data.firstName} {data.lastName}
                </b>
              </p>
            </div>
          </div>
          <TabsList>
            <TabsTrigger value="detail">Details </TabsTrigger>
            {/* <TabsTrigger value="transaction-history">
              Transaction History
            </TabsTrigger> */}
            <TabsTrigger value="edit">Edit</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="detail">
          <InfoCards data={data} />
        </TabsContent>
        {/* <TabsContent value="transaction-history">
          <div className="p-4 border-y">Transaction History View</div>
        </TabsContent> */}
        <TabsContent value="edit">
          <EditBeneficiary uuid={data.uuid} data={data} />
        </TabsContent>
      </Tabs>
    </>
  );
}

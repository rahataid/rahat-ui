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
import { Minus } from 'lucide-react';
import { useCommunityBeneficiaryListByID } from '@rahat-ui/community-query';
import { useEffect } from 'react';
import useFormStore from '../../../formBuilder/form.store';
import EditBeneficiary from '../../beneficiary/editBeneficiary';
import InfoCards from '../../beneficiary/infoCards';

type IProps = {
  uuid: string;
  // handleDefault: VoidFunction;
  closeSecondPanel: VoidFunction;
};

export default function EditGroupedBeneficiaries({
  uuid,
  closeSecondPanel,
}: IProps) {
  const router = useRouter();
  const { setExtras }: any = useFormStore();
  const { data } = useCommunityBeneficiaryListByID({
    uuid,
  });
  useEffect(() => {
    if (data?.data?.extras) {
      setExtras(data?.data?.extras);
    }

    return () => setExtras({});
  }, [data?.data?.extras, data?.data?.uuid, setExtras]);

  return (
    <>
      <Tabs defaultValue="benefDetail">
        <div className="flex justify-between items-center p-4">
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
            <div>
              <p>
                <b>
                  {data?.data?.firstName} {data?.data?.lastName}
                </b>
              </p>
            </div>
          </div>
          <TabsList>
            <TabsTrigger value="benefDetail">Details </TabsTrigger>
            {/* <TabsTrigger value="transaction-history">
              Transaction History
            </TabsTrigger> */}
            <TabsTrigger value="benefEdit">Edit</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="benefDetail">
          <InfoCards data={data?.data} />
        </TabsContent>
        {/* <TabsContent value="transaction-history">
          <div className="p-4 border-y">Transaction History View</div>
        </TabsContent> */}
        <TabsContent value="benefEdit">
          <EditBeneficiary data={data?.data} />
        </TabsContent>
      </Tabs>
    </>
  );
}

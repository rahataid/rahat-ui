import { Tabs, TabsContent } from '@rahat-ui/shadcn/components/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/components/tooltip';
import { ListBeneficiary } from '@rahataid/community-tool-sdk/beneficiary';
import { Minus } from 'lucide-react';
import { useEffect } from 'react';
import useFormStore from '../../../formBuilder/form.store';
import InfoCards from './infoCards';

type IProps = {
  data: ListBeneficiary;
  closeSecondPanel: VoidFunction;
};

export default function PinnedListBeneficiaryDetail({
  data,
  closeSecondPanel,
}: IProps) {
  const { setExtras }: any = useFormStore();

  useEffect(() => {
    if (data.extras) {
      setExtras(data.extras);
    }

    return () => setExtras({});
  }, [data.uuid]);

  return (
    <>
      <Tabs defaultValue="detailBenef">
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
                  {data.firstName} {data.lastName}
                </b>
              </p>
            </div>
          </div>
        </div>
        <TabsContent value="detailBenef">
          <InfoCards data={data} />
        </TabsContent>
      </Tabs>
    </>
  );
}

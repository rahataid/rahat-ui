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
import { Minus, Trash2 } from 'lucide-react';
import EditBeneficiary from './editBeneficiary';
import InfoCards from './infoCards';
import Swal from 'sweetalert2';
import { useCommunityBeneficiaryRemove } from '@rahat-ui/community-query';
import { toast } from 'react-toastify';
import { UUID } from 'crypto';
import useFormStore from '../../formBuilder/form.store';
import { useEffect } from 'react';

type IProps = {
  data: ListBeneficiary;
  // handleDefault: VoidFunction;
  closeSecondPanel: VoidFunction;
};

export default function BeneficiaryDetail({ data, closeSecondPanel }: IProps) {
  const router = useRouter();
  const { setExtras }: any = useFormStore();

  useEffect(() => {
    if (data.extras) {
      setExtras(data.extras);
    }

    return () => setExtras({});
  }, [data.uuid]);

  const deleteCommunityBeneficiary = useCommunityBeneficiaryRemove();
  console.log('benefdetails', data);
  const handleBeneficiaryDelete = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are deleting beneficiary',
      icon: 'question',
      showDenyButton: true,
      confirmButtonText: 'Yes, I am sure!',
      denyButtonText: 'No, cancel it!',
      customClass: {
        actions: 'my-actions',
        cancelButton: 'order-1',
        confirmButton: 'order-2',
        denyButton: 'order-3',
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteCommunityBeneficiary.mutateAsync(data?.uuid as UUID);
          closeSecondPanel();
        } catch (error) {
          toast.error('Error deleting Beneficiary');
          console.error('Error deleting Beneficiary:', error);
        }
      } else if (result.isDenied) {
        Swal.fire('Cancelled', `The Beneficiary wasn't deleted.`, 'error');
      }
    });
  };

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
          <TabsList>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild onClick={handleBeneficiaryDelete}>
                  <Trash2
                    className="cursor-pointer mr-3"
                    size={20}
                    strokeWidth={1.6}
                    color="#FF0000"
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete Beneficiary</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TabsTrigger value="detailBenef">Details </TabsTrigger>
            {/* <TabsTrigger value="transaction-history">
              Transaction History
            </TabsTrigger> */}
            <TabsTrigger value="editBenef">Edit</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="detailBenef">
          <InfoCards data={data} />
        </TabsContent>
        {/* <TabsContent value="transaction-history">
          <div className="p-4 border-y">Transaction History View</div>
        </TabsContent> */}
        <TabsContent value="editBenef">
          <EditBeneficiary data={data} />
        </TabsContent>
      </Tabs>
    </>
  );
}

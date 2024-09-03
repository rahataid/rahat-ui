import { useRouter } from 'next/navigation';

import {
  useCommunityBeneficiaryRemove,
  useGenerateVerificationLink,
} from '@rahat-ui/community-query';
import { Tabs } from '@rahat-ui/shadcn/components/tabs';
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
import { ListBeneficiary } from '@rahataid/community-tool-sdk/beneficiary';
import { UUID } from 'crypto';
import { Minus, MoreVertical } from 'lucide-react';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import useFormStore from '../../formBuilder/form.store';
import EditBeneficiary from './editBeneficiary';
import InfoCards from './infoCards';

type IProps = {
  data: ListBeneficiary;
  // handleDefault: VoidFunction;
  closeSecondPanel: VoidFunction;
};

export default function BeneficiaryDetail({ data, closeSecondPanel }: IProps) {
  const router = useRouter();
  const { setExtras }: any = useFormStore();
  const [value, setValue] = useState('detailBenef');
  useEffect(() => {
    if (data.extras) {
      setExtras(data.extras);
    }

    return () => setExtras({});
  }, [data.extras, data.uuid, setExtras]);

  const deleteCommunityBeneficiary = useCommunityBeneficiaryRemove();
  const generateVerificationLink = useGenerateVerificationLink();
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
        await deleteCommunityBeneficiary.mutateAsync(data?.uuid as UUID);
        closeSecondPanel();
      } else if (result.isDenied) {
        Swal.fire('Cancelled', `The Beneficiary wasn't deleted.`, 'error');
      }
    });
  };

  const handleVerificationLink = async () => {
    Swal.fire({
      title: 'Are you sure?',
      text: ' Send Verification Link',
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
        await generateVerificationLink.mutateAsync(data?.uuid as string);

        closeSecondPanel();
      } else if (result.isDenied) {
        Swal.fire(
          'Cancelled',
          `Generating Verification Link Canceled`,
          'error',
        );
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

          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <MoreVertical
                  className="cursor-pointer"
                  size={20}
                  strokeWidth={1.5}
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setValue('detailBenef')}>
                  Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setValue('editBenef')}>
                  Edit
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={handleVerificationLink}
                  disabled={data?.isVerified}
                >
                  {data?.isVerified ? 'Verified' : 'Verify'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleBeneficiaryDelete}>
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {value === 'detailBenef' ? (
          <InfoCards data={data} />
        ) : (
          <EditBeneficiary data={data} />
        )}
      </Tabs>
    </>
  );
}

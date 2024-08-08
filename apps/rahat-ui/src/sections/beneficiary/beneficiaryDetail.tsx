'use client';

import { useEffect, useState } from 'react';
import { useBeneficiaryStore, useSingleBeneficiary } from '@rahat-ui/query';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@rahat-ui/shadcn/src/components/ui/alert-dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/components/tooltip';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dropdown-menu';
import { truncateEthAddress } from '@rumsan/sdk/utils';
import { UUID } from 'crypto';
import {
  Archive,
  Expand,
  Minus,
  MoreVertical,
  Trash2,
  Copy,
  CopyCheck,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useBoolean } from '../../hooks/use-boolean';
import { paths } from '../../routes/paths';
import AssignToProjectModal from './components/assignToProjectModal';
import SplitViewDetailCards from './components/split.view.detail.cards';
import EditBeneficiary from './editBeneficiary';
import { ListBeneficiary } from '@rahat-ui/types';
import { useRemoveBeneficiary } from '@rahat-ui/query';
import DeleteBeneficiaryModal from './components/deleteBenfModal';

type IProps = {
  beneficiaryDetail: ListBeneficiary;
  closeSecondPanel: VoidFunction;
};

export default function BeneficiaryDetail({
  beneficiaryDetail,
  closeSecondPanel,
}: IProps) {
  const router = useRouter();
 const {refetch} = useSingleBeneficiary(beneficiaryDetail.uuid as UUID);
  const beneficiary = useBeneficiaryStore((state) => state.singleBeneficiary);
  const projectModal = useBoolean();
  const deleteModal = useBoolean();
  const [activeTab, setActiveTab] = useState<'details' | 'edit' | null>(
    'details',
  );
  const [walletAddressCopied, setWalletAddressCopied] =
    useState<boolean>(false);
  const walletAddress = beneficiaryDetail.walletAddress || '';

  const handleTabChange = (tab: 'details' | 'edit') => {
    setActiveTab(tab);
  };

  const clickToCopy = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setWalletAddressCopied(true);
    }
  };

  const handleAssignModalClick = () => {
    projectModal.onTrue();
  };

  const handleDeleteClick = () => {
    deleteModal.onTrue();
  };

  
  const benfAssignedToProject = beneficiaryDetail?.BeneficiaryProject?.length

  console.log(beneficiaryDetail)

  return (
    <>
      <AssignToProjectModal
        beneficiaryDetail={beneficiaryDetail}
        projectModal={projectModal}
        refetch={refetch}
      />

      <DeleteBeneficiaryModal
        beneficiaryDetail={beneficiaryDetail}
        deleteModal={deleteModal}
        closeSecondPanel={closeSecondPanel}
      />
      <div className="flex justify-between p-4 pt-5 bg-card border-b">
        <div className="flex gap-3">
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
        <div className="flex gap-3">
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger disabled={benfAssignedToProject} onClick={handleDeleteClick}>
                <Trash2
                  className="cursor-pointer"
                  color="red"
                  size={20}
                  strokeWidth={1.5}
                />
              </TooltipTrigger>
              <TooltipContent className="bg-secondary ">
                <p className="text-xs font-medium">{benfAssignedToProject ? 'Cannot delete a beneficiary assigned to project.' : 'Delete'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <MoreVertical
                className="cursor-pointer"
                size={20}
                strokeWidth={1.5}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {activeTab === 'details' ? (
                <DropdownMenuItem onClick={() => handleTabChange('edit')}>
                  Edit
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={() => handleTabChange('details')}>
                  Details
                </DropdownMenuItem>
              )}

              <DropdownMenuItem onClick={handleAssignModalClick}>
                Assign to project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div >
      <div className="p-2 flex items-center gap-2">
        <Image
          className="rounded-full"
          src="/profile.png"
          alt="cat"
          height={80}
          width={80}
        />
        <div>
          <div className="flex gap-2 mb-1">
            <h1 className="font-semibold text-xl">
              {beneficiaryDetail?.piiData?.name}
            </h1>
            <Badge>Active</Badge>
          </div>
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger
                className="flex gap-3 items-center"
                onClick={clickToCopy}
              >
                <p className="text-muted-foreground text-base">
                  {truncateEthAddress(walletAddress)}
                </p>
                {walletAddressCopied ? (
                  <CopyCheck size={15} strokeWidth={1.5} />
                ) : (
                  <Copy
                    className="text-muted-foreground"
                    size={15}
                    strokeWidth={1.5}
                  />
                )}
              </TooltipTrigger>
              <TooltipContent className="bg-secondary" side="bottom">
                <p className="text-xs font-medium">
                  {walletAddressCopied ? 'copied' : 'click to copy'}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {
        activeTab === 'details' && (
          <SplitViewDetailCards beneficiaryDetail={beneficiary} />
        )
      }
      {
        activeTab === 'edit' && (beneficiaryDetail || beneficiary) && (
          <EditBeneficiary beneficiary={beneficiaryDetail || beneficiary} />
        )
      }
    </>
  );
}

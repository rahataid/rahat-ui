'use client';

import { useBeneficiaryStore, useSingleBeneficiary } from '@rahat-ui/query';
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
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import {
  Dialog,
  DialogTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
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
import { useState } from 'react';
import ConfirmDialog from '../../components/dialog';
import { useBoolean } from '../../hooks/use-boolean';
import { paths } from '../../routes/paths';
import BeneficiaryDetailTableView from './beneficiaryDetailTable';
import AssignToProjectModal from './components/assignToProjectModal';
import SplitViewDetailCards from './components/split.view.detail.cards';
import EditBeneficiary from './editBeneficiary';
import { ListBeneficiary } from '@rahat-ui/types';

type IProps = {
  beneficiaryDetail: ListBeneficiary;
  closeSecondPanel: VoidFunction;
};

export default function BeneficiaryDetail({
  beneficiaryDetail,
  closeSecondPanel,
}: IProps) {
  const router = useRouter();
  useSingleBeneficiary(beneficiaryDetail.uuid as UUID);
  const beneficiary = useBeneficiaryStore((state) => state.singleBeneficiary);
  const projectModal = useBoolean();
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

  return (
    <>
      <AssignToProjectModal
        beneficiaryDetail={beneficiaryDetail}
        projectModal={projectModal}
      />
      <div className="flex justify-between p-4 pt-5 bg-secondary">
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
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger
                onClick={() => {
                  router.push(
                    paths.dashboard.beneficiary.detail(walletAddress),
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
        </div>
        <div className="flex gap-3">
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
                  <ConfirmDialog name="beneficiary" />
                </Dialog>
              </TooltipTrigger>
              <TooltipContent className="bg-secondary ">
                <p className="text-xs font-medium">Delete</p>
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
              <DropdownMenuItem onClick={() => handleTabChange('details')}>
                Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleTabChange('edit')}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleAssignModalClick}>
                Assign to project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="p-2 flex items-center gap-2">
        <Image
          className="rounded-full"
          src="/svg/funny-cat.svg"
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

      {activeTab === 'details' && (
        <>
          <Tabs defaultValue="detail">
            <div className="p-2">
              <TabsList className="w-full grid grid-cols-2 border h-auto">
                <TabsTrigger value="detail">Details </TabsTrigger>
                <TabsTrigger value="transaction-history">
                  Transaction History
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="detail">
              <SplitViewDetailCards beneficiaryDetail={beneficiaryDetail} />
            </TabsContent>
            <TabsContent value="transaction-history">
              <div className="p-2">
                <BeneficiaryDetailTableView
                  tableScrollAreaHeight={'h-[calc(100vh-375px)]'}
                />
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
      {activeTab === 'edit' && (beneficiaryDetail || beneficiary) && (
        <EditBeneficiary beneficiary={beneficiaryDetail || beneficiary} />
      )}
    </>
  );
}

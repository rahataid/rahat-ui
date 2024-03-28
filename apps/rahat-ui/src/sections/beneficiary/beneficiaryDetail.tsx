'use client';

import { useBeneficiaryStore, useSingleBeneficiary } from '@rahat-ui/query';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
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
import { UUID } from 'crypto';
import { Archive, Expand, Minus, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dropdown-menu';
import { Archive, Expand, Minus, Trash2, MoreVertical } from 'lucide-react';
import { truncateEthAddress } from '@rumsan/sdk/utils';
import ConfirmDialog from '../../components/dialog';
import { useBeneficaryVoucher } from '../../hooks/el/subgraph/querycall';
import { paths } from '../../routes/paths';
import { IBeneficiaryItem } from '../../types/beneficiary';
import EditBeneficiary from './editBeneficiary';
import InfoCards from './infoCards';
import { useBeneficaryVoucher } from '../../hooks/el/subgraph/querycall';
import { useBoolean } from '../../hooks/use-boolean';
import AssignToProjectModal from './components/assignToProjectModal';
import SplitViewDetailCards from './components/split.view.detail.cards';
import BeneficiaryDetailTableView from './beneficiaryDetailTable';

type IProps = {
  data: IBeneficiaryItem;
  handleClose: VoidFunction;
};

export default function BeneficiaryDetail({ data, handleClose }: IProps) {
  const router = useRouter();
  useSingleBeneficiary(data.uuid as UUID);
  const beneficiary = useBeneficiaryStore((state) => state.singleBeneficiary);
  const projectModal = useBoolean();
  const [activeTab, setActiveTab] = useState<'details' | 'edit' | null>(
    'details',
  );
  const walletAddress = data.walletAddress || '';

  // const beneficiaryDetails = useBeneficaryVoucher(walletAddress);

  const handleTabChange = (tab: 'details' | 'edit') => {
    setActiveTab(tab);
  };

  const clickToCopy = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
    }
  };

  const handleAssignModalClick = () => {
    projectModal.onTrue();
  };

  return (
    <>
      <AssignToProjectModal
        beneficiaryDetail={data}
        projectModal={projectModal}
      />
      <div className="flex justify-between p-2 bg-secondary">
        <div className="flex gap-3">
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
                    paths.dashboard.beneficiary.detail(data?.walletAddress),
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
            <h1 className="font-semibold text-xl">{data?.piiData?.name}</h1>
            <Badge>Active</Badge>
          </div>
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger onClick={clickToCopy}>
                <p className="text-slate-500 text-base">
                  {truncateEthAddress(walletAddress)}
                </p>
              </TooltipTrigger>
              <TooltipContent className="bg-secondary" side="bottom">
                <p className="text-xs font-medium">click to copy</p>
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
              <SplitViewDetailCards beneficiaryDetail={data} />
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
      {activeTab === 'edit' && (data || beneficiary) && (
        <EditBeneficiary beneficiary={data || beneficiary} />
      )}
    </>
  );
}

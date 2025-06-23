'use client';

import { useBeneficiaryStore, useSingleBeneficiary } from '@rahat-ui/query';
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
import { ListBeneficiary } from '@rahat-ui/types';
import { truncateEthAddress } from '@rumsan/sdk/utils';
import { UUID } from 'crypto';
import {
  Copy,
  CopyCheck,
  Expand,
  FolderDot,
  FolderPlus,
  Landmark,
  LandmarkIcon,
  Mail,
  MapPin,
  Minus,
  MoreVertical,
  Pencil,
  Phone,
  Trash2,
  User,
  WalletIcon,
  Wifi,
  X,
} from 'lucide-react';
import Image from 'next/image';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useBoolean } from '../../hooks/use-boolean';
import AssignToProjectModal from './components/assignToProjectModal';
import DeleteBeneficiaryModal from './components/deleteBenfModal';
import SplitViewDetailCards from './components/split.view.detail.cards';
import EditBeneficiary from './editBeneficiary';
import TooltipComponent from '../../components/tooltip';
import { humanizeString } from '../../utils';
import useCopy from '../../hooks/useCopy';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';

type IProps = {
  beneficiaryDetail: any;
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
  const deleteModal = useBoolean();
  const searchParams = useSearchParams();
  const { clickToCopy, copyAction } = useCopy();
  const { Id } = useParams();
  const [activeTab, setActiveTab] = useState<'details' | 'edit' | null>(
    'details',
  );
  const [walletAddressCopied, setWalletAddressCopied] =
    useState<boolean>(false);
  const walletAddress = beneficiaryDetail.walletAddress || '';

  const handleTabChange = (tab: 'details' | 'edit') => {
    setActiveTab(tab);
  };

  // const clickToCopy = () => {
  //   if (walletAddress) {
  //     navigator.clipboard.writeText(walletAddress);
  //     setWalletAddressCopied(true);
  //   }
  // };

  const handleAssignModalClick = () => {
    projectModal.onTrue();
  };

  const handleDeleteClick = () => {
    deleteModal.onTrue();
  };

  const benfAssignedToProject = beneficiaryDetail?.BeneficiaryProject?.length;

  const fromTab = searchParams.get('fromTab');
  const isAssignedToProject = searchParams.get('isAssignedToProject');
  const isGroupValidForAA = searchParams.get('isGroupValidForAA');

  console.log(beneficiaryDetail);
  return (
    <>
      <AssignToProjectModal
        beneficiaryDetail={beneficiaryDetail}
        projectModal={projectModal}
      />

      <DeleteBeneficiaryModal
        beneficiaryDetail={beneficiaryDetail}
        deleteModal={deleteModal}
        closeSecondPanel={closeSecondPanel}
      />
      {/* <div className="flex justify-between p-4 pt-5 bg-card border-b">
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
              <TooltipTrigger
                disabled={benfAssignedToProject}
                onClick={handleDeleteClick}
              >
                <Trash2
                  className="cursor-pointer"
                  color="red"
                  size={20}
                  strokeWidth={1.5}
                />
              </TooltipTrigger>
              <TooltipContent className="bg-secondary ">
                <p className="text-xs font-medium">
                  {benfAssignedToProject
                    ? 'Cannot delete a beneficiary assigned to project.'
                    : 'Delete'}
                </p>
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
      </div>
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

      {activeTab === 'details' && (
        <SplitViewDetailCards beneficiaryDetail={beneficiary} />
      )}
      {activeTab === 'edit' && (beneficiaryDetail || beneficiary) && (
        <EditBeneficiary beneficiary={beneficiaryDetail || beneficiary} />
      )} */}
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex space-x-4">
          <TooltipComponent
            disable={benfAssignedToProject}
            handleOnClick={handleDeleteClick}
            Icon={Trash2}
            tip="Delete"
            iconStyle="text-red-600"
          />
          <TooltipComponent
            handleOnClick={() =>
              router.push(
                fromTab
                  ? `/beneficiary/${beneficiaryDetail.uuid}/edit?isAssignedToProject=${isAssignedToProject}&isGroupValidForAA=${isGroupValidForAA}&fromTab=${fromTab}&groupId=${Id}`
                  : `/beneficiary/${beneficiaryDetail.uuid}/edit`,
              )
            }
            Icon={Pencil}
            tip="Edit"
          />

          {!fromTab && (
            <>
              <TooltipComponent
                handleOnClick={handleAssignModalClick}
                Icon={FolderPlus}
                tip="Assign Project"
              />
              <TooltipComponent
                handleOnClick={() =>
                  router.push(`/beneficiary/${beneficiaryDetail.uuid}`)
                }
                Icon={Expand}
                tip="Expand"
              />
            </>
          )}
        </div>
        <TooltipComponent
          handleOnClick={closeSecondPanel}
          Icon={X}
          tip="Close"
        />
      </div>
      <div className="p-4 flex justify-between items-center border-b">
        <div className="flex items-center gap-2">
          <Image
            className="rounded-full"
            src="/profile.png"
            alt="profile"
            height={80}
            width={80}
          />
          <div>
            <h1 className="font-semibold text-xl mb-1">
              {beneficiaryDetail?.piiData?.name ??
                beneficiaryDetail?.name ??
                'John Doe'}
            </h1>
            <div className="flex space-x-4 items-center">
              <Badge>{beneficiaryDetail?.extras?.status ?? 'active'}</Badge>
              <p className="text-base text-muted-foreground">
                {beneficiaryDetail?.extras?.age ?? 'N/A'}
              </p>
              <p className="text-base text-muted-foreground">
                {beneficiaryDetail?.gender ?? 'unknown'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-240px)]">
        <div className="p-4 flex flex-col space-y-4">
          <h1 className="font-medium">General</h1>

          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <MapPin size={20} strokeWidth={1.5} />
              <p>Address</p>
            </div>
            <p className="text-muted-foreground text-base">
              {beneficiaryDetail?.piiData?.extras?.address ||
                beneficiaryDetail?.location ||
                '-'}
            </p>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Phone size={20} strokeWidth={1.5} />
              <p>Phone Number</p>
            </div>
            <p className="text-muted-foreground text-base">
              {beneficiaryDetail?.piiData?.phone ||
                beneficiaryDetail?.phone ||
                '-'}
            </p>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Mail size={20} strokeWidth={1.5} />
              <p>Email Address</p>
            </div>
            <p className="text-muted-foreground text-base">
              {beneficiaryDetail?.piiData?.email ||
                beneficiaryDetail?.email ||
                '-'}
            </p>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Phone size={20} strokeWidth={1.5} />
              <p>Phone Status</p>
            </div>
            <p className="text-muted-foreground text-base">
              {beneficiaryDetail?.phoneStatus || '-'}
            </p>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Landmark size={20} strokeWidth={1.5} />
              <p>Bank Status</p>
            </div>
            <p className="text-muted-foreground text-base">
              {beneficiaryDetail?.bankedStatus || '-'}
            </p>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Wifi size={20} strokeWidth={1.5} />
              <p>Internet Status</p>
            </div>
            <p className="text-muted-foreground text-base">
              {beneficiaryDetail?.internetStatus || '-'}
            </p>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <WalletIcon size={20} strokeWidth={1.5} />
              <p>Wallet Address</p>
            </div>
            <div className="flex items-center">
              <div className="text-base text-muted-foreground truncate w-32  mr-2">
                {beneficiaryDetail?.walletAddress || 'N/A'}
              </div>
              <button
                onClick={() =>
                  clickToCopy(beneficiaryDetail?.walletAddress || '', 1)
                }
                className="ml-2 text-sm text-gray-500"
              >
                {copyAction === 1 ? (
                  <CopyCheck className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
        {beneficiaryDetail?.BeneficiaryProject && (
          <div
            className={`p-4 flex flex-col space-y-4 ml-2 ${
              beneficiaryDetail?.BeneficiaryProject?.length < 1 && 'hidden'
            }`}
          >
            <div className="flex justify-between items-start">
              <p className="text-base font-medium">Project Involved</p>

              <div className="flex flex-col items-end space-y-2">
                {beneficiaryDetail?.BeneficiaryProject?.map((item, index) => (
                  <p
                    key={item.id || index}
                    className="text-muted-foreground text-base"
                  >
                    {item.Project?.name || '-'}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}

        {beneficiaryDetail?.extras && (
          <div className="p-4 flex flex-col space-y-4 ml-2">
            <h1 className="font-medium">Extra Details</h1>

            {Object.keys(beneficiaryDetail?.extras || {}).length > 0 &&
              beneficiaryDetail?.extras && (
                <div className="flex flex-col space-y-4">
                  {Object.entries(beneficiaryDetail.extras)
                    .filter(([key]) => {
                      const cleanKey = key.trim().toLowerCase();
                      return ![
                        'error',
                        'bankedstatus',
                        'validbankaccount',
                        'token',
                      ].includes(cleanKey);
                    })
                    .map(([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between items-center"
                      >
                        <p>{humanizeString(key)}</p>
                        <p className="text-muted-foreground text-base">
                          {String(value) || '-'}
                        </p>
                      </div>
                    ))}
                </div>
              )}
          </div>
        )}
      </ScrollArea>
    </>
  );
}

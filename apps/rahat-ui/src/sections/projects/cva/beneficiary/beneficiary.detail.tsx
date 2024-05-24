'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  PROJECT_SETTINGS_KEYS,
  useAssignClaimsToBeneficiary,
  useProjectSettingsStore,
} from '@rahat-ui/query';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/components/tabs';
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
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Card, CardContent } from '@rahat-ui/shadcn/src/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { truncateEthAddress } from '@rumsan/sdk/utils';
import { Copy, CopyCheck, Minus, MoreVertical, Trash2 } from 'lucide-react';
import AssignToken from './assign-token.modal';

type IProps = {
  beneficiaryDetails: any;
  closeSecondPanel: VoidFunction;
};

export default function BeneficiaryDetail({
  beneficiaryDetails,
  closeSecondPanel,
}: IProps) {
  const { id } = useParams();
  const contractSettings = useProjectSettingsStore(
    (state) => state.settings?.[id]?.[PROJECT_SETTINGS_KEYS.CONTRACT] || null,
  );

  console.log('beneficiaryDetails', beneficiaryDetails);
  const assignToken = useAssignClaimsToBeneficiary();

  const [activeTab, setActiveTab] = useState<'details' | 'edit'>('details');
  const [walletAddressCopied, setWalletAddressCopied] = useState(false);

  const clickToCopy = () => {
    if (beneficiaryDetails?.walletAddress) {
      navigator.clipboard.writeText(beneficiaryDetails.walletAddress);
      setWalletAddressCopied(true);
    }
  };

  const handleTabChange = (tab: 'details' | 'edit') => {
    setActiveTab(tab);
  };

  const handleAssignSubmit = async (numberOfTokens: string) => {
    await assignToken.mutateAsync({
      beneficiary: beneficiaryDetails.walletAddress,
      projectAddress: contractSettings?.cvaProject?.address,
      tokenAmount: numberOfTokens,
    });
  };

  const removeBeneficiary = (uuid: string) => {
    // Implement the removeBeneficiary logic
  };

  return (
    <>
      <Header
        closeSecondPanel={closeSecondPanel}
        removeBeneficiary={removeBeneficiary}
        beneficiaryDetails={beneficiaryDetails}
        handleTabChange={handleTabChange}
      />
      <DetailsSection
        beneficiaryDetails={beneficiaryDetails}
        clickToCopy={clickToCopy}
        walletAddressCopied={walletAddressCopied}
        handleAssignSubmit={handleAssignSubmit}
      />
      <Tabs defaultValue="details" value={activeTab}>
        <TabsNavigation handleTabChange={handleTabChange} />
        <TabsContent value="details">
          <BeneficiaryInfo beneficiaryDetails={beneficiaryDetails} />
        </TabsContent>
        <TabsContent value="transaction">
          <TransactionTab />
        </TabsContent>
      </Tabs>
    </>
  );
}

type IHeaderProps = {
  closeSecondPanel: VoidFunction;
  removeBeneficiary: (uuid: string) => void;
  beneficiaryDetails: any;
  handleTabChange: (tab: 'details' | 'edit') => void;
};

function Header({
  closeSecondPanel,
  removeBeneficiary,
  beneficiaryDetails,
  handleTabChange,
}: IHeaderProps) {
  return (
    <div className="flex justify-between p-4 pt-5 bg-card border-b">
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger onClick={closeSecondPanel}>
            <Minus size={20} strokeWidth={1.5} />
          </TooltipTrigger>
          <TooltipContent className="bg-secondary">
            <p className="text-xs font-medium">Close</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <div className="flex gap-3">
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger>
              <AlertDialog>
                <AlertDialogTrigger className="flex items-center">
                  <Trash2
                    className="cursor-pointer"
                    color="red"
                    size={20}
                    strokeWidth={1.5}
                  />
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      this beneficiary.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() =>
                        removeBeneficiary(beneficiaryDetails?.uuid)
                      }
                    >
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </TooltipTrigger>
            <TooltipContent className="bg-secondary">
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
            <DropdownMenuItem onClick={() => handleTabChange('edit')}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleTabChange('details')}>
              Details
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

type IDetailsSectionProps = {
  beneficiaryDetails: any;
  clickToCopy: VoidFunction;
  walletAddressCopied: boolean;
  handleAssignSubmit: (numberOfTokens: string) => void;
};

function DetailsSection({
  beneficiaryDetails,
  clickToCopy,
  walletAddressCopied,
  handleAssignSubmit,
}: IDetailsSectionProps) {
  return (
    <div className="p-4 bg-card flex gap-2 justify-between items-center flex-wrap">
      <div className="flex items-center gap-2">
        <Image
          className="rounded-full"
          src="/profile.png"
          alt="profile"
          height={80}
          width={80}
        />
        <div>
          <div className="flex gap-2 mb-1">
            <h1 className="font-semibold text-xl">
              {beneficiaryDetails?.piiData?.name}
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
                  {truncateEthAddress(beneficiaryDetails?.walletAddress)}
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
                  {walletAddressCopied ? 'Copied' : 'Click to copy'}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <div>
        <AssignToken
          beneficiary={beneficiaryDetails}
          handleSubmit={handleAssignSubmit}
        />
      </div>
    </div>
  );
}

type ITabsNavigationProps = {
  handleTabChange: (tab: 'details' | 'edit') => void;
};

function TabsNavigation({ handleTabChange }: ITabsNavigationProps) {
  return (
    <div className="p-2">
      <TabsList className="w-full grid grid-cols-2 border h-auto">
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="transaction">Transaction</TabsTrigger>
      </TabsList>
    </div>
  );
}

type IBeneficiaryInfoProps = {
  beneficiaryDetails: any;
};

function BeneficiaryInfo({ beneficiaryDetails }: IBeneficiaryInfoProps) {
  return (
    <>
      <div className="flex flex-col gap-2 p-2">
        <Card className="shadow rounded">
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="font-light text-base">
                  {beneficiaryDetails?.type}
                </p>
                <p className="text-sm font-normal text-muted-foreground">
                  Beneficiary Type
                </p>
              </div>
              <div className="text-right">
                <p className="font-light text-base">
                  {beneficiaryDetails?.gender}
                </p>
                <p className="text-sm font-normal text-muted-foreground">
                  Gender
                </p>
              </div>
              <div>
                <p className="font-light text-base">
                  {beneficiaryDetails?.email || 'N/A'}
                </p>
                <p className="text-sm font-normal text-muted-foreground">
                  Email
                </p>
              </div>
              <div className="text-right">
                <p className="font-light text-base">
                  {beneficiaryDetails?.phone}
                </p>
                <p className="text-sm font-normal text-muted-foreground">
                  Phone
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card className="shadow rounded m-2">
        <CardContent className="pt-6">
          <div className="text-base font-500">Token Details</div>
          <div className="mt-2">
            <div className="flex items-center justify-between text-sm">
              <p className="font-light">Token Assigned</p>
              <p className="text-primary">12</p>
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-center justify-between text-sm">
              <p className="font-light">Token Claimed</p>
              <p className="text-primary">12</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

function TransactionTab() {
  return (
    <div className="p-2 pb-0">
      {/* <TransactionTable walletAddress={walletAddress} /> */}
    </div>
  );
}

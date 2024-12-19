'use client';

import {
  PROJECT_SETTINGS_KEYS,
  useAssignClaimsToBeneficiary,
  useFindOneDisbursement,
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
import { Card, CardContent } from '@rahat-ui/shadcn/src/components/ui/card';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';

import {
  Copy,
  CopyCheck,
  Home,
  Minus,
  Trash2,
} from 'lucide-react';

import { UUID } from 'crypto';
import Image from 'next/image';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { TransactionTable } from './transaction.table';
import { truncateEthAddress } from '@rumsan/sdk/utils';
import DataCard from 'apps/rahat-ui/src/components/dataCard';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { useReadRahatPayrollProjectTokenAllocations } from 'libs/query/src/lib/rp/contracts/generated-hooks';

type IProps = {
  beneficiaryDetails: any;
  closeSecondPanel: VoidFunction;
};

export default function BeneficiaryDetail({
  beneficiaryDetails,
  closeSecondPanel,
}: IProps) {
  const { id } = useParams() as { id: UUID };
  const contractSettings = useProjectSettingsStore(
    (state) => state.settings?.[id]?.[PROJECT_SETTINGS_KEYS.CONTRACT] || null,
  );

  const assignToken = useAssignClaimsToBeneficiary();
  const allocatedTokens = useFindOneDisbursement(id, {
    walletAddress: beneficiaryDetails?.walletAddress,
  });

  const assignedTokens = useReadRahatPayrollProjectTokenAllocations({
    args: [contractSettings?.rahattoken?.address,beneficiaryDetails?.walletAddress],
    address: contractSettings?.rahatpayrollproject?.address
  });

  const [activeTab, setActiveTab] = useState<'details' | 'transaction'>(
    'details',
  );
  const [walletAddressCopied, setWalletAddressCopied] = useState(false);

  const clickToCopy = () => {
    if (beneficiaryDetails?.walletAddress) {
      navigator.clipboard.writeText(beneficiaryDetails.walletAddress);
      setWalletAddressCopied(true);
    }
  };

  const handleTabChange = (tab: 'details' | 'transaction') => {
    setActiveTab(tab);
  };

  const handleAssignSubmit = async (numberOfTokens: string) => {
    const ass = await assignToken.mutateAsync({
      beneficiary: beneficiaryDetails.walletAddress,
      projectAddress: contractSettings?.rpproject?.address,
      tokenAmount: numberOfTokens,
    });
  };

  const removeBeneficiary = (uuid: string) => {
    // Implement the removeBeneficiary logic
  };

  type ITabsNavigationProps = {
    handleTabChange: (tab: 'details' | 'transaction') => void;
  };

  function TabsNavigation({ handleTabChange }: ITabsNavigationProps) {
    return (
      <div className="p-2">
        <TabsList className="w-full grid grid-cols-2 border h-auto rounded-md">
          <TabsTrigger
            className="m-0"
            value="details"
            onClick={() => handleTabChange('details')}
          >
            Details
          </TabsTrigger>
          <TabsTrigger
            value="transaction"
            onClick={() => handleTabChange('transaction')}
          >
            Transaction
          </TabsTrigger>
        </TabsList>
      </div>
    );
  }

  return (
    <>
      <Header
        closeSecondPanel={closeSecondPanel}
        removeBeneficiary={removeBeneficiary}
        beneficiaryDetails={beneficiaryDetails}
        handleTabChange={handleTabChange}
        allocatedTokens={Number(allocatedTokens?.data?.amount) || 0}
      />
      <Tabs value={activeTab}>
        <TabsNavigation handleTabChange={handleTabChange} />
        <TabsContent value="details">
          <DetailsSection
            beneficiaryDetails={beneficiaryDetails}
            clickToCopy={clickToCopy}
            walletAddressCopied={walletAddressCopied}
            handleAssignSubmit={handleAssignSubmit}
            assignLoading={assignToken.isPending}
          />
          <BeneficiaryInfo
            beneficiaryDetails={beneficiaryDetails}
            assignedTokensCount={Number(assignedTokens?.data).toString()}
            tokensClaimedCount={'N/a'}
          />
        </TabsContent>
        <TabsContent value="transaction">
          <TransactionTab beneficiary={beneficiaryDetails} />
        </TabsContent>
      </Tabs>
    </>
  );
}

type IHeaderProps = {
  closeSecondPanel: VoidFunction;
  removeBeneficiary: (uuid: string) => void;
  beneficiaryDetails: any;
  handleTabChange: (tab: 'details' | 'transaction') => void;
  allocatedTokens: number;
};

function Header({
  closeSecondPanel,
  removeBeneficiary,
  beneficiaryDetails,
  handleTabChange,
  allocatedTokens,
}: IHeaderProps) {
  return (
    <div className="flex justify-between p-4 pt-5 bg-card">
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
          {allocatedTokens <= 0 && (
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
                        This action cannot be undone. This will permanently
                        delete this beneficiary.
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
          )}
        </TooltipProvider>
        {/* <DropdownMenu>
          <DropdownMenuTrigger>
            <MoreVertical
              className="cursor-pointer"
              size={20}
              strokeWidth={1.5}
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleTabChange('transaction')}>
              Transaction
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleTabChange('details')}>
              Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => closeSecondPanel()}>
              Remove/Hide
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> */}
      </div>
    </div>
  );
}

type IDetailsSectionProps = {
  beneficiaryDetails: any;
  clickToCopy: VoidFunction;
  walletAddressCopied: boolean;
  handleAssignSubmit: (numberOfTokens: string) => void;
  assignLoading: boolean;
};

function DetailsSection({
  beneficiaryDetails,
  clickToCopy,
  walletAddressCopied,
  handleAssignSubmit,
  assignLoading,
}: IDetailsSectionProps) {
  return (
    <div className="p-4 bg-card flex flex-col gap-2 justify-between items-center flex-wrap">
      <div className="flex flex-col items-center gap-2">
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
              {beneficiaryDetails?.name}
            </h1>
            {/* <Badge>Active</Badge> */}
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
      {/* <div>
        <AssignToken
          loading={assignLoading}
          beneficiary={beneficiaryDetails}
          handleSubmit={handleAssignSubmit}
        />
      </div> */}
    </div>
  );
}

type IBeneficiaryInfoProps = {
  beneficiaryDetails: any;
  assignedTokensCount: string;
  tokensClaimedCount: string;
};

function BeneficiaryInfo({
  beneficiaryDetails,
  assignedTokensCount,
  tokensClaimedCount,
}: IBeneficiaryInfoProps) {
  return (
    <>
      <div className="flex flex-col gap-2 p-2">
        <Card className="shadow rounded">
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-3">
              <div className="text-left">
                <p className="text-sm font-normal text-muted-foreground">
                  Gender
                </p>
                <p className="font-light text-base">
                  {beneficiaryDetails?.gender}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-normal text-muted-foreground">
                  Status
                </p>
                <p className="font-light text-base">
                  <Badge className="bg-green-200 text-green-800">Active</Badge>
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="text-left">
                <p className="text-sm font-normal text-muted-foreground">
                  Phone
                </p>
                <p className="font-light text-base">
                  {beneficiaryDetails?.phone || 'N/A'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-normal text-muted-foreground">
                  Email
                </p>
                <p className="font-light text-base">
                  {beneficiaryDetails?.email || 'N/A'}
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center"></div>
          </CardContent>
        </Card>
      </div>
      <div className="flex items-center justify-between gap-3 mx-2">
        <DataCard
          className="w-screen"
          title="Tokens Assigned"
          number={assignedTokensCount}
          Icon={Home}
        />
        <DataCard
          className="w-screen"
          title="Tokens Claimed"
          number={tokensClaimedCount}
          Icon={Home}
        />
      </div>
    </>
  );
}

function TransactionTab(beneficiaryDetails: any) {
  return (
    <div className="p-2 pb-0">
      <TransactionTable beneficiaryDetails={beneficiaryDetails} />
    </div>
  );
}

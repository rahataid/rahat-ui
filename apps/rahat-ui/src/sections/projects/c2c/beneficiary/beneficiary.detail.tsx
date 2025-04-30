'use client';

import {
  useBeneficiaryTransaction,
  useRemoveBeneficiary,
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
import TableLoader from 'apps/rahat-ui/src/components/table.loader';
import { UUID } from 'crypto';
import { Copy, CopyCheck, Minus, MoreVertical, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import EditBeneficiary from './beneficiary.edit';
import TransactionTable from './beneficiary.transaction.table';

type IProps = {
  beneficiaryDetails: any;
  closeSecondPanel: VoidFunction;
};

export default function BeneficiaryDetail({
  beneficiaryDetails,
  closeSecondPanel,
}: IProps) {
  // TODO: remove reference to el vouchers
  const deleteBeneficiary = useRemoveBeneficiary();

  const walletAddress = beneficiaryDetails?.walletAddress;

  const { data: transactionList, isLoading } =
    useBeneficiaryTransaction(walletAddress);

  const [activeTab, setActiveTab] = useState<'details' | 'edit' | null>(
    'details',
  );
  const [walletAddressCopied, setWalletAddressCopied] =
    useState<boolean>(false);

  const clickToCopy = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setWalletAddressCopied(true);
    }
  };

  const handleTabChange = (tab: 'details' | 'edit') => {
    setActiveTab(tab);
  };

  const removeBeneficiary = (id: string | undefined) => {
    try {
      deleteBeneficiary.mutateAsync({
        uuid: id as UUID,
      });
    } catch (e) {
      console.error('Error::', e);
    }
  };

  const disbursementBeneficiary = beneficiaryDetails?.DisbursementBeneficiary;
  let amount = 0;
  if (disbursementBeneficiary?.length > 0) {
    disbursementBeneficiary.forEach((beneficiary: any) => {
      amount += Number(beneficiary.amount);
    });
  }

  useEffect(() => {
    setWalletAddressCopied(false);
  }, [beneficiaryDetails]);

  return (
    <>
      {isLoading ? (
        <TableLoader />
      ) : (
        <>
          <div className="flex justify-between p-4 pt-5 bg-card border-b">
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
                  {activeTab === 'details' ? (
                    <DropdownMenuItem onClick={() => handleTabChange('edit')}>
                      Edit
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      onClick={() => handleTabChange('details')}
                    >
                      Details
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="p-4 bg-card flex gap-2 justify-between items-center flex-wrap">
            <div className="flex items-center gap-2">
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
                    {beneficiaryDetails?.name || 'N/A'}
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
                        {walletAddress
                          ? truncateEthAddress(walletAddress)
                          : 'N/A'}
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
                        {walletAddressCopied ? 'Copied' : walletAddress}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>

          {activeTab === 'details' && (
            <>
              <Tabs defaultValue="details">
                <div className="p-2">
                  <TabsList className="w-full grid grid-cols-2 border h-auto">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="transaction">Transaction</TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="details">
                  <div className="flex flex-col gap-2 p-2">
                    <Card className="shadow rounded">
                      <CardContent className="pt-6">
                        <div className="grid grid-cols-3 gap-3">
                          <div>
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
                            <p className="font-light text-base">{'N/A'}</p>
                            <p className="text-sm font-normal text-muted-foreground">
                              Location
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-3 mt-3">
                          <div>
                            <p className="font-light text-base">
                              {amount.toFixed(2) + ' USDC' || 'N/A'}
                            </p>
                            <p className="text-sm font-normal text-muted-foreground">
                              Disbursed Amount
                            </p>
                          </div>
                          <div>
                            <p className="font-light text-base">Verified </p>
                            <p className="text-sm font-normal text-muted-foreground">
                              Verification Status
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                <TabsContent value="transaction">
                  <div className="p-2 pb-0">
                    <TransactionTable
                      walletAddress={walletAddress}
                      transaction={transactionList}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
          {/* Edit View */}
          {activeTab === 'edit' && (
            <EditBeneficiary beneficiary={beneficiaryDetails} />
          )}
        </>
      )}
    </>
  );
}

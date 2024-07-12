'use client';

import { useParams } from 'next/navigation';

import {
  BeneficiaryAssignedToken,
  PROJECT_SETTINGS_KEYS,
  useProjectAction,
  useProjectSettingsStore,
} from '@rahat-ui/query';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/components/tabs';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';
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
import { Gender } from '@rahataid/sdk/enums';
import { enumToObjectArray, truncateEthAddress } from '@rumsan/sdk/utils';
// import { useAssignClaims } from 'apps/rahat-ui/src/hooks/el/contracts/el-contracts';
import { getProjectAddress } from 'apps/rahat-ui/src/utils/getProjectAddress';
import { Minus, MoreVertical, Copy, CopyCheck, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import TransactionTable from './beneficiary.transaction.table';
// import { useReadElProjectGetBeneficiaryVoucherDetail } from 'apps/rahat-ui/src/hooks/el/contracts/elProject';
import { zeroAddress } from 'viem';
import { useBoolean } from 'apps/rahat-ui/src/hooks/use-boolean';
// import AssignVoucherConfirm from './assign.voucher.confirm';
import TableLoader from 'apps/rahat-ui/src/components/table.loader';
import { useRouter } from 'next/navigation';
import EditBeneficiary from './beneficiary.edit';
import { useRemoveBeneficiary } from '@rahat-ui/query';
import { UUID } from 'crypto';
import { useWaitForTransactionReceipt } from 'wagmi';
import { useQuery } from 'urql';

type IProps = {
  beneficiaryDetails: any;
  closeSecondPanel: VoidFunction;
};

export default function BeneficiaryDetail({
  beneficiaryDetails,
  closeSecondPanel,
}: IProps) {
  console.log('benf detailsssssss', beneficiaryDetails);

  // const assignClaims = useAssignClaims();
  const { id } = useParams();
  const getProject = useProjectAction();
  const route = useRouter();
  const deleteBeneficiary = useRemoveBeneficiary();
  const [assignStatus, setAssignStatus] = useState(false);
  const [transactionHash, setTransactionHash] = useState<`0x${string}`>();
  const [isTransacting, setisTransacting] = useState<boolean>(false);

  const walletAddress = beneficiaryDetails.walletAddress;

  const contractSettings = useProjectSettingsStore(
    (state) => state.settings?.[id]?.[PROJECT_SETTINGS_KEYS.CONTRACT] || null,
  );

  const isLoading = false;

  const [result] = useQuery({
    query: BeneficiaryAssignedToken,
    variables: {
      beneficiary: walletAddress,
    },
  });

  console.log('rerrrrrr', result);

  // const {
  //   data: beneficiaryVoucherDetails,
  //   isLoading,
  //   refetch,
  // } = useReadElProjectGetBeneficiaryVoucherDetail({
  //   address: contractSettings?.elproject?.address,
  //   args: [walletAddress],
  // });

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

  // const genderList = enumToObjectArray(Gender);
  const handleTabChange = (tab: 'details' | 'edit') => {
    setActiveTab(tab);
  };

  // const result = useWaitForTransactionReceipt({
  //   hash: transactionHash,
  // });

  // useEffect(() => {
  //   result?.data && setisTransacting(false);
  //   refetch();
  // }, [result]);

  // const handleAssignVoucher = () => {
  //   setisTransacting(true);
  //   getProjectAddress(getProject, id as string).then(async (res) => {
  //     const txnHash = await assignClaims.writeContractAsync({
  //       address: res.value.elproject.address,
  //       args: [walletAddress],
  //     });
  //     setTransactionHash(txnHash);
  //   });
  // };

  // useEffect(() => {
  //   if (assignClaims.isSuccess) {
  //     route.push(`/projects/el/${id}/beneficiary`);
  //   }
  //   if (assignClaims.isError) {
  //     setisTransacting(false);
  //   }
  // }, [assignClaims.isSuccess, assignClaims.isError]);

  // useEffect(() => {
  //   if (
  //     beneficiaryVoucherDetails?.freeVoucherAddress === undefined ||
  //     beneficiaryVoucherDetails?.referredVoucherAddress === undefined
  //   )
  //     return;
  //   if (
  //     beneficiaryVoucherDetails?.freeVoucherAddress?.toString() !==
  //       zeroAddress ||
  //     beneficiaryVoucherDetails?.referredVoucherAddress?.toString() !==
  //       zeroAddress
  //   ) {
  //     setAssignStatus(true);
  //   }
  // }, [beneficiaryVoucherDetails]);

  const voucherAssignModal = useBoolean();

  const handleVoucherAssignModalClose = () => {
    voucherAssignModal.onFalse();
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

  useEffect(() => {
    deleteBeneficiary.isSuccess && closeSecondPanel();
  }, [deleteBeneficiary]);

  return (
    <>
      {isLoading ? (
        <TableLoader />
      ) : (
        <>
          <div className="flex justify-between p-4 pt-5 bg-secondary border-b">
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
                  <DropdownMenuItem onClick={() => handleTabChange('edit')}>
                    Edit
                  </DropdownMenuItem>
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
                    {beneficiaryDetails?.name}
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
            {/* {!assignStatus && beneficiaryDetails?.type === 'ENROLLED' && (
              <div>
                <Button disabled={isTransacting} onClick={handleAssignVoucher}>
                  {isTransacting
                    ? 'Confirming transaction...'
                    : 'Assign Voucher'}
                </Button>
              </div>
            )} */}
          </div>
          {/* <AssignVoucherConfirm
            open={voucherAssignModal.value}
            handleClose={handleVoucherAssignModalClose}
            handleSubmit={handleAssignVoucher}
          /> */}

          {/* Details View */}

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
                        <div className="grid grid-cols-2 gap-3">
                          {/* <div>
                            <p className="font-light text-base">
                              {beneficiaryDetails?.type}
                            </p>
                            <p className="text-sm font-normal text-muted-foreground">
                              Beneficiary Type
                            </p>
                          </div> */}
                          <div className="text-right">
                            <p className="font-light text-base">
                              {beneficiaryDetails?.gender}
                            </p>
                            <p className="text-sm font-normal text-muted-foreground ">
                              Gender
                            </p>
                          </div>
                          <div>
                            <p className="font-light text-base">
                              {beneficiaryDetails?.email || 'N/A'}
                            </p>
                            <p className="text-sm font-normal text-muted-foreground ">
                              Email
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-light text-base">
                              {beneficiaryDetails?.phone}
                            </p>
                            <p className="text-sm font-normal text-muted-foreground ">
                              Phone
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="shadow rounded">
                      <CardHeader>
                        <CardTitle className="text-lg">Token Details</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col gap-4">
                          <div className="flex justify-between items-center">
                            <p>Token Reserved</p>
                            <p className="text-sm">
                              {beneficiaryDetails?.benTokens}
                            </p>

                            {/* <p className="text-sm font-light">
                              {beneficiaryVoucherDetails?.freeVoucherAddress !==
                                undefined &&
                              beneficiaryVoucherDetails?.freeVoucherAddress !==
                                zeroAddress
                                ? 'Free Voucher'
                                : beneficiaryVoucherDetails?.referredVoucherAddress !==
                                    undefined &&
                                  beneficiaryVoucherDetails?.referredVoucherAddress !==
                                    zeroAddress
                                ? 'Discount Voucher'
                                : 'N/A'}
                            </p> */}
                          </div>
                          <div className="flex justify-between items-center">
                            <p>Assigned Status</p>
                            <p className="text-sm">
                              {!result?.data?.benTokensAssigneds?.length
                                ? 'None'
                                : 'Complete'}
                            </p>
                            {/* <p className="text-sm font-light">
                              {beneficiaryVoucherDetails?.freeVoucherAddress !==
                                undefined &&
                              beneficiaryVoucherDetails?.freeVoucherAddress !==
                                zeroAddress
                                ? beneficiaryVoucherDetails?.freeVoucherClaimStatus?.toString()
                                : beneficiaryVoucherDetails?.referredVoucherAddress !==
                                    undefined &&
                                  beneficiaryVoucherDetails?.referredVoucherAddress !==
                                    zeroAddress
                                ? beneficiaryVoucherDetails?.referredVoucherClaimStatus?.toString()
                                : 'N/A'}
                            </p> */}
                          </div>
                          <div className="flex justify-between items-center">
                            <p>Wallet Address</p>
                            <p className="text-sm">
                              {truncateEthAddress(walletAddress)}
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
                      transactionData={result?.data?.benTokensAssigneds}
                      isFetching={result?.fetching}
                      // walletAddress={walletAddress}
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

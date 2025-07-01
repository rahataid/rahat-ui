'use client';

import React from 'react';

import { BeneficiaryAssignedToken } from '@rahat-ui/query';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/components/tabs';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { truncateEthAddress } from '@rumsan/sdk/utils/string.utils';
import { Minus, Copy, CopyCheck } from 'lucide-react';
import Image from 'next/image';
import TransactionTable from './beneficiary.transaction.table';
import TableLoader from 'apps/rahat-ui/src/components/table.loader';
import { useQuery } from 'urql';

type IProps = {
  beneficiaryDetails: any;
  closeSecondPanel: VoidFunction;
};

export default function BeneficiaryDetail({
  beneficiaryDetails,
  closeSecondPanel,
}: IProps) {
  const walletAddress = beneficiaryDetails.walletAddress;

  const isLoading = false;

  const [result] = useQuery({
    query: BeneficiaryAssignedToken,
    variables: {
      beneficiary: walletAddress,
    },
  });

  const [walletAddressCopied, setWalletAddressCopied] =
    React.useState<boolean>(false);

  const clickToCopy = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setWalletAddressCopied(true);
    }
  };

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
          </div>

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
                      </div>
                      <div className="flex justify-between items-center">
                        <p>Assigned Status</p>
                        <p className="text-sm">
                          {!result?.data?.benTokensAssigneds?.length
                            ? 'None'
                            : 'Complete'}
                        </p>
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
                />
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </>
  );
}

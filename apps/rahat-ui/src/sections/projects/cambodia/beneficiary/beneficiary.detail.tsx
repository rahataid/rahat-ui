'use client';
import {
  useCambodiaBeneficiary,
  useCambodiaBeneficiaryTransactions,
} from '@rahat-ui/query';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { truncateEthAddress } from '@rumsan/sdk/utils/string.utils';
import { formatDT } from 'apps/rahat-ui/src/utils';
import { Copy, CopyCheck } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useState } from 'react';
import HeaderWithBack from '../../components/header.with.back';
import TransactionHistoryView from './transaction.history.view';
export default function BeneficiaryDetail() {
  const { id, benId } = useParams();
  const { data, isLoading } = useCambodiaBeneficiary({
    projectUUID: id,
    uuid: benId,
  }) as any;
  const [copyAction, setCopyAction] = useState<boolean>(false);
  const clickToCopy = (name: string) => {
    navigator.clipboard.writeText(name);
    setCopyAction(true);
    setTimeout(() => {
      setCopyAction(false);
    }, 2000);
  };

  console.log('Benef===>', data);

  return (
    <div className="h-[calc(100vh-95px)] m-4">
      <div className="flex justify-between items-center">
        <HeaderWithBack
          title="Beneficiary details"
          subtitle="Here is the detailed view of selected beneficiary"
          path={`/projects/el-cambodia/${id}/beneficiary`}
        />
        {/* <div className="flex space-x-3">
          <div className="flex bg-secondary rounded-full w-10 h-10 justify-center items-center hover:cursor-pointer">
            <Edit2 color="skyBlue" size={20} />
          </div>

          <div className="flex bg-secondary rounded-full w-10 h-10 justify-center items-center hover:cursor-pointer">
            <Trash2 color="red" size={20} />
          </div>
        </div> */}
      </div>
      <div className="p-5 rounded-md border grid grid-cols-4 gap-5 mb-5">
        <div>
          <h1 className="text-md text-muted-foreground">Beneficiary Name</h1>
          <p className="font-medium">{data?.data?.piiData?.name ?? '-'}</p>
        </div>
        <div>
          <h1 className="text-md text-muted-foreground">Gender</h1>
          <p className="font-medium">{data?.data?.gender ?? '-'}</p>
        </div>

        <div>
          <h1 className="text-md text-muted-foreground">Phone Number</h1>
          <p className="font-medium">{data?.data?.piiData?.phone ?? '-'}</p>
        </div>
        <div>
          <h1 className="text-md text-muted-foreground">
            Beneficiary Data Upload Date
          </h1>
          <p className="font-medium">
            {/* {data?.data?.createdAt.toLocaleString()} */}
            {data?.data?.createdAt ? formatDT(data?.data?.createdAt) : '-'}
          </p>
        </div>
        <div>
          <h1 className="text-md text-muted-foreground">Wallet Address</h1>
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger
                className="flex gap-3 cursor-pointer"
                onClick={() => clickToCopy(data?.data?.walletAddress)}
              >
                <p>{truncateEthAddress(data?.data?.walletAddress)}</p>
                {copyAction ? (
                  <CopyCheck size={20} strokeWidth={1.5} />
                ) : (
                  <Copy size={20} strokeWidth={1.5} />
                )}
              </TooltipTrigger>
              <TooltipContent className="bg-secondary" side="bottom">
                <p className="text-xs font-medium">
                  {copyAction ? 'copied' : 'click to copy'}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div>
          <h1 className="text-md text-muted-foreground">Beneficiary Type</h1>

          <Badge variant="secondary">{data?.data?.type ?? 'UNKNOWN'}</Badge>
        </div>
        <div>
          <h1 className="text-md text-muted-foreground">Referred By</h1>
          <p className="font-medium">{data?.data?.healthWorker?.name ?? '-'}</p>
        </div>
      </div>
      <div className="">
        <h1 className="text-2xl mb-5">Transactions</h1>
        <TransactionHistoryView walletAddress={data?.data?.walletAddress} />
      </div>
    </div>
  );
}

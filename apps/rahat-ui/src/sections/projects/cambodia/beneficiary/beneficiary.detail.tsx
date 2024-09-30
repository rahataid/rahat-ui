'use client';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import Back from '../../components/back';
import HeaderWithBack from '../../components/header.with.back';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Check, Copy, CopyCheck, Edit2, Trash2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import TransactionHistoryView from './transaction.history.view';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { truncateEthAddress } from '@rumsan/sdk/utils';
import { useState } from 'react';
export default function BeneficiaryDetail() {
  const { id } = useParams();
  const [copyAction, setCopyAction] = useState<boolean>(false);
  const clickToCopy = (name: string) => {
    navigator.clipboard.writeText(name);
    setCopyAction(true);
    setTimeout(() => {
      setCopyAction(false);
    }, 2000);
  };
  return (
    <div className="h-[calc(100vh-95px)] m-4">
      <div className="flex justify-between items-center">
        <HeaderWithBack
          title="Beneficiary details"
          subtitle="Here is the detailed view of selected beneficiary"
          path={`/projects/el-cambodia/${id}/beneficiary`}
        />
        <div className="flex space-x-3">
          <div className="flex bg-secondary rounded-full w-10 h-10 justify-center items-center hover:cursor-pointer">
            <Edit2 color="skyBlue" size={20} />
          </div>

          <div className="flex bg-secondary rounded-full w-10 h-10 justify-center items-center hover:cursor-pointer">
            <Trash2 color="red" size={20} />
          </div>
        </div>
      </div>
      <div className="p-5 rounded-md border grid grid-cols-4 gap-5 mb-5">
        <div>
          <h1 className="text-md text-muted-foreground">Beneficiary Name</h1>
          <p className="font-medium">John Doe</p>
        </div>
        <div>
          <h1 className="text-md text-muted-foreground">Gender</h1>
          <p className="font-medium">Male</p>
        </div>
        <div>
          <h1 className="text-md text-muted-foreground">
            Beneficiary Data Upload Date
          </h1>
          <p className="font-medium">John Doe</p>
        </div>
        <div>
          <h1 className="text-md text-muted-foreground">Beneficiary Type</h1>

          <Badge variant="secondary">Secondary</Badge>
        </div>
        <div>
          <h1 className="text-md text-muted-foreground">Refered By</h1>
          <p className="font-medium">Hima Tamang</p>
        </div>
        <div>
          <h1 className="text-md text-muted-foreground">Phone Number</h1>
          <p className="font-medium">+9779876543210</p>
        </div>
        <div>
          <h1 className="text-md text-muted-foreground">Wallet Address</h1>
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger
                className="flex gap-3 cursor-pointer"
                onClick={() => clickToCopy('0xds9565khgkhkjhguyt78')}
              >
                <p>{truncateEthAddress('0xds9565khgkhkjhguyt78')}</p>
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
          <h1 className="text-md text-muted-foreground">Transaction Type</h1>
          <Badge variant="secondary">Donation</Badge>
        </div>
      </div>
      <div className="">
        <h1 className="text-2xl mb-5">Transactions</h1>
        <TransactionHistoryView />
      </div>
    </div>
  );
}

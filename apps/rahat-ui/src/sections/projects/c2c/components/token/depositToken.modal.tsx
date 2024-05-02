'use client';
import {
  PROJECT_SETTINGS_KEYS,
  useProjectAction,
  useProjectSettingsStore,
} from '@rahat-ui/query';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dialog';

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@rahat-ui/shadcn/components/alert';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import React, { FC, useState } from 'react';
import { Vault, Info, TriangleAlert, TicketCheck } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useSendTransaction } from 'wagmi';
import { parseEther } from 'viem';

interface DepositTokenModalType {
  handleModal: () => void;
}

const DepositTokenModal: FC<DepositTokenModalType> = ({ handleModal }) => {
  const { id } = useParams();
  const [tokenInputs, setTokenInputs] = useState('');
  const { data: hash, isPending, sendTransaction } = useSendTransaction();
  const contractSettings = useProjectSettingsStore(
    (state) => state.settings?.[id]?.[PROJECT_SETTINGS_KEYS.CONTRACT] || null,
  );

  console.log({ contractSettings });

  const handleSubmit = () => {
    sendTransaction({
      to: contractSettings?.c2cproject?.address || '',
      value: parseEther(tokenInputs),
    });
  };

  const handleDepositToken = () => {
    console.log(contractSettings?.c2cproject?.address);
    sendTransaction({
      to: `0x2D205EB00883a2FeeBFdAf632f407492F391063c`,
      value: parseEther(tokenInputs),
    });
    setTokenInputs('');
  };

  console.log({ id });

  return (
    <>
      <Dialog onOpenChange={handleModal}>
        <DialogTrigger asChild>
          <div className="w-full flex justify-between items-center">
            <div className="flex gap-3 items-center">
              <Vault size={18} strokeWidth={1.5} />
              <p>Deposit Token</p>
            </div>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Deposit Token</DialogTitle>
            <DialogClose />
          </DialogHeader>
          <Alert className="rounded">
            <Info className="h-4 w-4" />
            <AlertTitle>Deposit Token To C2C Project</AlertTitle>
            <AlertDescription className="flex flex-col gap-4">
              <form>
                <div className="flex items-center justify-between">
                  <p className="text-sm flex items-center gap-1 text-muted-foreground text-yellow-600 font-normal">
                    <TriangleAlert
                      className="h-4 w-4 text-yellow-600"
                      aria-hidden="true"
                    />
                    You are going to transfer the token to the C2C project
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="noOfVouchers">
                    Total no. of Token transfers
                  </Label>
                  <Input
                    name="tokens"
                    className="w-2/3"
                    value={tokenInputs}
                    onChange={(e) => setTokenInputs(e.target.value)}
                    type="number"
                    min="1"
                  />
                </div>
              </form>
            </AlertDescription>
          </Alert>
          {hash && (
            <div className="w-full  mb-2">
              <Alert className="rounded">
                <TicketCheck className="h-4 w-4">
                  <AlertTitle>Transaction hash: {hash}</AlertTitle>
                </TicketCheck>
              </Alert>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  handleDepositToken();
                }}
              >
                Send
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DepositTokenModal;

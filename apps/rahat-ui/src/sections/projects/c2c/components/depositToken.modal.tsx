'use client';
import {
  PROJECT_SETTINGS_KEYS,
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
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import { Info, TriangleAlert, Vault } from 'lucide-react';
import { useParams } from 'next/navigation';
import { FC, useState } from 'react';
import { UseBooleanReturnType } from 'apps/rahat-ui/src/hooks/use-boolean';
import { config } from 'apps/rahat-ui/wagmi.config';
import { parseEther } from 'viem';
import { sepolia } from 'viem/chains';
import { useAccount, useConnect, useWriteContract } from 'wagmi';
import { rahatChain } from 'apps/rahat-ui/src/chain-custom';
import { injected } from 'wagmi/connectors';
import { rahatTokenAbi } from 'apps/rahat-ui/src/hooks/el/contracts/token';

interface DepositTokenModalType {
  handleModal: UseBooleanReturnType;
}

const DepositTokenModal: FC<DepositTokenModalType> = ({ handleModal }) => {
  const { id } = useParams();
  const [tokenInputs, setTokenInputs] = useState('');
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const { connectAsync } = useConnect();

  // const contractInt = useSendTransaction({
  //   config,
  //   mutation: {
  //     onError: (error) => {
  //       console.error(error);
  //     },
  //     onSuccess(data, variables, context) {
  //       console.log('data', data, variables, context);
  //     },
  //   },
  // });

  const contractSettings = useProjectSettingsStore(
    (state) => state.settings?.[id]?.[PROJECT_SETTINGS_KEYS.CONTRACT] || null,
  );

  const handleDepositToken = async () => {
    console.log({ rahatChain });
    if (!address) {
      await connectAsync({
        chainId: rahatChain.id,
        connector: injected(),
      });
    }
    const data = writeContractAsync({
      chainId: rahatChain.id,
      address: contractSettings?.rahattoken?.address,
      functionName: 'transfer',
      abi: rahatTokenAbi,
      args: [contractSettings?.c2cproject?.address, parseEther(tokenInputs)],
    });
    console.log(contractSettings?.c2cproject?.address);
    console.log(address);
  };

  return (
    <>
      <Dialog onOpenChange={handleModal.onToggle} open={handleModal.value}>
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

'use client';

import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import { BadgePlus } from 'lucide-react';
import { useState } from 'react';
import {
  PROJECT_SETTINGS_KEYS,
  useProjectSettingsStore,
  useTokenMintAndSend,
} from '@rahat-ui/query';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';

export default function CreateTokenModal() {
  const [token, setToken] = useState('0');
  const createToken = useTokenMintAndSend();
  const { id } = useParams() as { id: UUID };
  const contractSettings = useProjectSettingsStore(
    (state) => state?.settings?.[id]?.[PROJECT_SETTINGS_KEYS.CONTRACT] as any,
  );

  const handleSubmit = async () => {
    const transactionHash = await createToken.mutateAsync({
      amount: token,
      projectAddress: contractSettings?.cvaproject.address,
      rahatDonorAddress: contractSettings?.rahatdonor.address,
      tokenAddress: contractSettings?.rahattoken.address,
    });
    console.log(`first transaction hash: ${transactionHash}`);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="w-full flex justify-between items-center">
          <div className="flex gap-3 items-center">
            <BadgePlus size={18} strokeWidth={1.5} />
            <p>Create Token</p>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Token</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div>
            <Label
              htmlFor="token"
              className="text-right text-muted-foreground mb-2"
            >
              No.of Token
            </Label>
            <Input
              id="token"
              className="col-span-3"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            disabled={createToken.isPending || token === '0'}
            onClick={handleSubmit}
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

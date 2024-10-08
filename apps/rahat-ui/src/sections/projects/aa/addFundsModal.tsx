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
} from '@rahat-ui/shadcn/components/dialog';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { useMintTokens } from 'apps/rahat-ui/src/hooks/aa/contracts/aa-contract';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import * as React from 'react';

type FundsModalType = {
  value: boolean;
  onToggle: () => void;
};

type IProps = {
  fundsModal: FundsModalType;
};

export default function AddFundsModal({ fundsModal }: IProps) {
  const [tokens, setTokens] = React.useState('');
  const params = useParams();
  const projectID = params.id as UUID;

  const contractSettings = useProjectSettingsStore(
    (s) => s.settings?.[projectID]?.[PROJECT_SETTINGS_KEYS.CONTRACT] || null,
  );

  const mintTokens = useMintTokens();

  const handleAdd = async (tokens: any) => {
    mintTokens.writeContractAsync({
      address: contractSettings?.rahatdonor?.address,
      args: [
        contractSettings?.rahattoken?.address,
        contractSettings?.aaproject?.address,
        BigInt(tokens),
      ],
    });
  };

  return (
    <Dialog open={fundsModal.value} onOpenChange={fundsModal.onToggle}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Tokens Budget</DialogTitle>
        </DialogHeader>
        <div>
          <Input
            type="number"
            inputMode="decimal"
            value={tokens}
            onChange={(e) => setTokens(e.target.value)}
            placeholder="Tokens"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAdd(tokens);
              }
            }}
          />
        </div>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="ghost">
              Close
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              onClick={() => {
                handleAdd(tokens);
              }}
              type="button"
              variant="ghost"
              className="text-primary"
            >
              Add
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

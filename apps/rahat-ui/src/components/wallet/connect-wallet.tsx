import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { ConnectKitButton } from 'connectkit';
import { Wallet2 } from 'lucide-react';
import { Account } from './account';

function ConnectWallet() {
  return (
    <div>
      <ConnectKitButton.Custom>
        {({ show, isConnected, ensName }) => {
          if (isConnected) {
            return <Account />;
          }
          return (
            <Button variant="outline" size="icon" onClick={show}>
              <Wallet2 size={20} strokeWidth={1.5} />
            </Button>
          );
        }}
      </ConnectKitButton.Custom>
    </div>
  );
}

export default ConnectWallet;

import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { ConnectKitButton } from 'connectkit';

function ConnectWallet() {
  return <ConnectKitButton showAvatar={true} showBalance={false} />;
}

export default ConnectWallet;

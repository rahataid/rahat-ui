import { ConnectKitButton } from 'connectkit';

function ConnectWallet() {
  return (
    <div>
      <ConnectKitButton showAvatar={true} showBalance={false} />
    </div>
  );
}

export default ConnectWallet;

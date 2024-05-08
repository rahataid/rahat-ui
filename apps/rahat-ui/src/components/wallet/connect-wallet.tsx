import { ConnectKitButton } from 'connectkit';

function ConnectWallet() {
  return (
    <div>
      <ConnectKitButton showAvatar={true} showBalance={true} />
      {/* <ConnectKitButton.Custom>
        {({ show, isConnected, ensName }) => {
          if (isConnected) {
            return <Account />;
          }
          return (
            <Button
              className="flex items-center"
              variant="outline"
              size="icon"
              onClick={show}
            >
              <Wallet2 size={20} strokeWidth={1.5} />
            </Button>
          );
        }}
      </ConnectKitButton.Custom> */}
    </div>
  );
}

export default ConnectWallet;

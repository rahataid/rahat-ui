import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { useEffect, useState } from 'react';
import { Connector, useConnect } from 'wagmi';

export function WalletOptions() {
  const { connectors, connect } = useConnect();

  return (
    <div className="flex flex-col space-y-4">
      {connectors.map((connector) => (
        <WalletOption
          key={connector.uid}
          connector={connector}
          onClick={() => connect({ connector })}
        />
      ))}
    </div>
  );
}

function WalletOption({
  connector,
  onClick,
}: {
  connector: Connector;
  onClick: () => void;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const provider = await connector.getProvider();
      setReady(!!provider);
    })();
  }, [connector]);

  return (
    <Button
      disabled={!ready}
      onClick={onClick}
      className={`flex items-center space-x-2 w-full py-2 px-4 rounded-md text-white ${
        ready
          ? 'bg-blue-500 hover:bg-blue-700'
          : 'bg-gray-500 cursor-not-allowed'
      }`}
    >
      <img src={connector.icon} alt={connector.name} className="w-6 h-6" />
      {connector.name}
    </Button>
  );
}

import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi';

export function Account() {
  const { address, connector } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! });
  const formattedAddress = formatAddress(address);

  return (
    <div className="flex items-center space-x-4">
      {connector.icon ? (
        <img
          alt="ENS Avatar"
          className="h-8 w-8 rounded-full"
          src={connector.icon}
        />
      ) : (
        <div className="h-8 w-8 rounded-full bg-gray-200" />
      )}
      <div>
        {address && (
          <div className="text-sm font-bold">
            {ensName ? `${ensName} (${formattedAddress})` : formattedAddress}
          </div>
        )}
        <div className="text-xs text-gray-500">
          Connected to {connector?.name}
        </div>
      </div>
      <button
        onClick={() => disconnect()}
        className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-700 text-xs"
      >
        Disconnect
      </button>
    </div>
  );
}

function formatAddress(address?: string) {
  if (!address) return null;
  return `${address.slice(0, 6)}…${address.slice(38, 42)}`;
}

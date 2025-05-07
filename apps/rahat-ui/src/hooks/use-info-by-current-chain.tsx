import {
  PROJECT_SETTINGS_KEYS,
  useProjectSettingsStore,
} from '@rahat-ui/query';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import { Chain } from 'viem';
import { useChainId, useChains } from 'wagmi';

type ChainInfo = {
  safeURL: string;
  explorerUrl: string;
} & Chain;

export const useInfoByCurrentChain: () => ChainInfo = () => {
  const { id }: { id: UUID } = useParams();

  const safeWallet = useProjectSettingsStore(
    (state) => state.settings?.[id]?.[PROJECT_SETTINGS_KEYS.SAFE_WALLET],
  );
  console.log('first', safeWallet);
  const chainId = useChainId();
  const chain = useChains()
    .filter(({ id }) => id === chainId)
    .pop();

  if (!chain) {
    throw new Error('Chain not found.');
  }

  const safeUrl = `https://app.safe.global/transactions/queue?safe=${chain.name
    .replace(/\s+/g, '')
    .toLowerCase()}:${safeWallet?.address}`;

  return {
    ...chain,
    safeURL: safeUrl,
  } as ChainInfo;
};

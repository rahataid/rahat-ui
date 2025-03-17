import { Chain } from 'viem';
import { useChainId, useChains } from 'wagmi';

type ChainInfo = {
  safeURL: string;
  explorerUrl: string;
} & Chain;

export const useInfoByCurrentChain: () => ChainInfo = () => {
  const chainId = useChainId();
  const chain = useChains()
    .filter(({ id }) => id === chainId)
    .pop();
  if (!chain) {
    throw new Error('Chain not found.');
  }

  if (!process.env.NEXT_PUBLIC_SAFE_WALLET_ADDRESS) {
    throw new Error('Safe wallet address not found.');
  }

  const safeUrl = `https://app.safe.global/transactions/queue?safe=${chain.name
    .replace(/\s+/g, '')
    .toLowerCase()}:${process.env.NEXT_PUBLIC_SAFE_WALLET_ADDRESS}`;

  return {
    ...chain,
    safeURL: safeUrl,
  } as ChainInfo;
};

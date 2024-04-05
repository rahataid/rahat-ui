import { defineChain } from 'viem';
import { useChainStore } from '@rahat-ui/query';

const chain = useChainStore.getInitialState().chainSettings;

export const rahatChain = defineChain(chain);

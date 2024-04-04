import { useChainStore } from '@rahat-ui/query';
import { defineChain } from 'viem';

const chain = useChainStore.getInitialState().chainSettings;

export const rahatChain = defineChain(chain);

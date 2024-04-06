import { defineChain } from 'viem';
import { useSettingsStore } from '@rahat-ui/query';

const chain = useSettingsStore.getInitialState().chainSettings;

export const rahatChain = defineChain(chain);

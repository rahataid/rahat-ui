import { defineConfig } from '@wagmi/cli';
import { react } from '@wagmi/cli/plugins';
import { ELAbi } from './abis/ELProject';

export default defineConfig({
  out: 'apps/rahat-ui/src/contract-hooks/generated.ts',
  contracts: [
    {
      name: 'ELProject',
      abi: ELAbi,
    },
  ],
  plugins: [react()],
});

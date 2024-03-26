import { defineConfig } from '@wagmi/cli';
import { react } from '@wagmi/cli/plugins';
import { ELAbi } from './abis/ELProject';
import { RahatDonorAbi } from './abis/RahatDonor';

export default defineConfig([
  {
    out: 'apps/rahat-ui/src/hooks/el/contracts/elProject.ts',
    contracts: [
      {
        name: 'ELProject',
        abi: ELAbi,
      },
    ],
    plugins: [react()],
  },
  {
    out: 'apps/rahat-ui/src/hooks/el/contracts/donor.ts',
    contracts: [
      {
        name: 'RahatDonor',
        abi: RahatDonorAbi,
      },
    ],
    plugins: [react()],
  },
]);

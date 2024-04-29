import { defineConfig } from '@wagmi/cli';
import { react } from '@wagmi/cli/plugins';
import { ELAbi } from './abis/ELProject';
import { RahatDonorAbi } from './abis/RahatDonor';
import { RahatTokenAbi } from './abis/RahatToken';
import { AccessAbi } from './abis/AccessManager';

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
  {
    out: 'apps/rahat-ui/src/hooks/el/contracts/token.ts',
    contracts: [
      {
        name: 'RahatToken',
        abi: RahatTokenAbi,
      },
    ],
    plugins: [react()],
  },
  {
    out: 'apps/rahat-ui/src/hooks/el/contracts/access.ts',
    contracts: [
      {
        name: 'AccessManager',
        abi: AccessAbi,
      },
    ],
    plugins: [react()],
  },
]);

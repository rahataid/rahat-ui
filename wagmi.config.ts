import { defineConfig } from '@wagmi/cli';
import { react } from '@wagmi/cli/plugins';
import { ELAbi } from './abis/ELProject';
import { RahatDonorAbi } from './abis/RahatDonor';
import { RahatTokenAbi } from './abis/RahatToken';
import { AccessAbi } from './abis/AccessManager';
import { RahatDonorAbi as CVARahatDonorAbi } from './abis/cva/RahatDonor';
import { RahatTokenAbi as CVARahatTokenAbi } from './abis/cva/RahatToken';
import { CVAProjectAbi } from './abis/cva/CVAProject';
import { RahatClaimAbi } from './abis/cva/RahatClaim';

export default defineConfig([
  // {
  //   out: 'apps/rahat-ui/src/hooks/el/contracts/elProject.ts',
  //   contracts: [
  //     {
  //       name: 'ELProject',
  //       abi: ELAbi,
  //     },
  //   ],
  //   plugins: [react()],
  // },
  // {
  //   out: 'apps/rahat-ui/src/hooks/el/contracts/donor.ts',
  //   contracts: [
  //     {
  //       name: 'RahatDonor',
  //       abi: RahatDonorAbi,
  //     },
  //   ],
  //   plugins: [react()],
  // },
  // {
  //   out: 'apps/rahat-ui/src/hooks/el/contracts/token.ts',
  //   contracts: [
  //     {
  //       name: 'RahatToken',
  //       abi: RahatTokenAbi,
  //     },
  //   ],
  //   plugins: [react()],
  // },
  // {
  //   out: 'apps/rahat-ui/src/hooks/el/contracts/access.ts',
  //   contracts: [
  //     {
  //       name: 'AccessManager',
  //       abi: AccessAbi,
  //     },
  //   ],
  //   plugins: [react()],
  // },
  {
    out: 'libs/query/src/lib/cva/contracts/generated-hooks/rahatDonor.ts',
    contracts: [
      {
        name: 'RahatDonor',
        abi: CVARahatDonorAbi,
      },
    ],
    plugins: [react()],
  },
  {
    out: 'libs/query/src/lib/cva/contracts/generated-hooks/rahatToken.ts',
    contracts: [
      {
        name: 'RahatToken',
        abi: CVARahatTokenAbi,
      },
    ],
    plugins: [react()],
  },
  {
    out: 'libs/query/src/lib/cva/contracts/generated-hooks/cvaProject.ts',
    contracts: [
      {
        name: 'CVAProject',
        abi: CVAProjectAbi,
      },
    ],
    plugins: [react()],
  },
  {
    out: 'libs/query/src/lib/cva/contracts/generated-hooks/rahatClaim.ts',
    contracts: [
      {
        name: 'RahatClaim',
        abi: RahatClaimAbi,
      },
    ],
    plugins: [react()],
  },
]);

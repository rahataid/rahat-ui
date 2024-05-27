import { defineConfig } from '@wagmi/cli';
import { react } from '@wagmi/cli/plugins';

// Import ABI's for EL project
import { ELAbi } from './abis/ELProject';
import { RahatDonorAbi } from './abis/RahatDonor';
import { RahatTokenAbi } from './abis/RahatToken';
import { AccessAbi } from './abis/AccessManager';

// Wagmi-config for el-project
// export default defineConfig([
//   {
//     out: 'apps/rahat-ui/src/hooks/el/contracts/elProject.ts',
//     contracts: [
//       {
//         name: 'ELProject',
//         abi: ELAbi,
//       },
//     ],
//     plugins: [react()],
//   },
//   {
//     out: 'apps/rahat-ui/src/hooks/el/contracts/donor.ts',
//     contracts: [
//       {
//         name: 'RahatDonor',
//         abi: RahatDonorAbi,
//       },
//     ],
//     plugins: [react()],
//   },
//   {
//     out: 'apps/rahat-ui/src/hooks/el/contracts/token.ts',
//     contracts: [
//       {
//         name: 'RahatToken',
//         abi: RahatTokenAbi,
//       },
//     ],
//     plugins: [react()],
//   },
//   {
//     out: 'apps/rahat-ui/src/hooks/el/contracts/access.ts',
//     contracts: [
//       {
//         name: 'AccessManager',
//         abi: AccessAbi,
//       },
//     ],
//     plugins: [react()],
//   },
// ]);

// Import ABI's for AA project
import { AAProjectABI } from './abis/aa/AAProject';
import { AccessManagerAbi } from './abis/aa/AccessManager';
import { RahatDonorABI } from './abis/aa/RahatDonor';
import { RahatTokenABI } from './abis/aa/RahatToken';
import { TriggerManagerABI } from './abis/aa/TriggerManager';

export default defineConfig([
  {
    out: 'apps/rahat-ui/src/hooks/aa/contracts/aaProject.ts',
    contracts: [
      {
        name: 'AAProject',
        abi: AAProjectABI,
      },
    ],
    plugins: [react()],
  },
  {
    out: 'apps/rahat-ui/src/hooks/aa/contracts/accessManager.ts',
    contracts: [
      {
        name: 'AccessManager',
        abi: AccessManagerAbi,
      },
    ],
    plugins: [react()],
  },
  {
    out: 'apps/rahat-ui/src/hooks/aa/contracts/donor.ts',
    contracts: [
      {
        name: 'RahatDonor',
        abi: RahatDonorABI,
      },
    ],
    plugins: [react()],
  },
  {
    out: 'apps/rahat-ui/src/hooks/aa/contracts/token.ts',
    contracts: [
      {
        name: 'RahatToken',
        abi: RahatTokenABI,
      },
    ],
    plugins: [react()],
  },
  {
    out: 'apps/rahat-ui/src/hooks/aa/contracts/triggerManager.ts',
    contracts: [
      {
        name: 'TriggerManager',
        abi: TriggerManagerABI,
      },
    ],
    plugins: [react()],
  },
]);

import { defineConfig } from '@wagmi/cli';
import { react } from '@wagmi/cli/plugins';

// Import ABI's for EL project
import { AccessAbi } from './abis/AccessManager';
import { ELAbi } from './abis/ELProject';
import { RahatDonorAbi } from './abis/RahatDonor';
import { RahatTokenAbi } from './abis/RahatToken';

// Import ABI's for CVA project
import { CVAProjectAbi } from './abis/cva/CVAProject';
import { RahatClaimAbi } from './abis/cva/RahatClaim';
import { RahatDonorAbi as CVARahatDonorAbi } from './abis/cva/RahatDonor';
import { RahatTokenAbi as CVARahatTokenAbi } from './abis/cva/RahatToken';

// Import ABI's for AA project
import { AAProjectABI } from './abis/aa/AAProject';
import { AccessManagerAbi as AAAccessManagerAbi } from './abis/aa/AccessManager';
import { RahatDonorABI as AARahatDonorABI } from './abis/aa/RahatDonor';
import { RahatTokenABI as AARahatTokenABI } from './abis/aa/RahatToken';
import { TriggerManagerABI as AATriggerManagerABI } from './abis/aa/TriggerManager';
import { C2CProjectABI, RahatTokenABI } from './abis/c2c';

import { rahatAccessManagerAbi } from './abis/rp/RahatAccessManager';
import { rahatPayrollProjectAbi } from './abis/rp/RahatPayrollProject';
import { rahatTokenAbi } from './abis/rp/RahatToken';
import { rahatTreasuryAbi } from './abis/rp/RahatTreasury';
import { vendorAbi } from './abis/rp/Vendor';
import { redemptionsAbi } from './abis/rp/Redemptions';
import { rahatCVACambodiaAbi } from './abis/cambodia/RahatCVACambodia';
import { rahatCvaKenyaProjectAbi } from './abis/el-kenya/RahatCVAKenyaProject';

const ELConfig = [
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
];

const CVAConfig = [
  {
    out: 'apps/rahat-ui/src/hooks/cva/contracts/rahatDonor.ts',
    contracts: [
      {
        name: 'RahatDonor',
        abi: CVARahatDonorAbi,
      },
    ],
    plugins: [react()],
  },
  {
    out: 'apps/rahat-ui/src/hooks/cva/contracts/rahatToken.ts',
    contracts: [
      {
        name: 'RahatToken',
        abi: CVARahatTokenAbi,
      },
    ],
    plugins: [react()],
  },
  {
    out: 'apps/rahat-ui/src/hooks/cva/contracts/cvaProject.ts',
    contracts: [
      {
        name: 'CVAProject',
        abi: CVAProjectAbi,
      },
    ],
    plugins: [react()],
  },
  {
    out: 'apps/rahat-ui/src/hooks/cva/contracts/rahatClaim.ts',
    contracts: [
      {
        name: 'RahatClaim',
        abi: RahatClaimAbi,
      },
    ],
    plugins: [react()],
  },
];

const AAConfig = [
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
        abi: AAAccessManagerAbi,
      },
    ],
    plugins: [react()],
  },
  {
    out: 'apps/rahat-ui/src/hooks/aa/contracts/donor.ts',
    contracts: [
      {
        name: 'RahatDonor',
        abi: AARahatDonorABI,
      },
    ],
    plugins: [react()],
  },
  {
    out: 'apps/rahat-ui/src/hooks/aa/contracts/token.ts',
    contracts: [
      {
        name: 'RahatToken',
        abi: AARahatTokenABI,
      },
    ],
    plugins: [react()],
  },
  {
    out: 'apps/rahat-ui/src/hooks/aa/contracts/triggerManager.ts',
    contracts: [
      {
        name: 'TriggerManager',
        abi: AATriggerManagerABI,
      },
    ],
    plugins: [react()],
  },
];

const C2CConfig = [
  {
    out: 'apps/rahat-ui/src/hooks/c2c/contracts/c2cProject.ts',
    contracts: [
      {
        name: 'C2CProject',
        abi: C2CProjectABI,
      },
    ],
    plugins: [react()],
  },
  {
    out: 'apps/rahat-ui/src/hooks/c2c/contracts/rahatToken.ts',
    contracts: [
      {
        name: 'RahatToken',
        abi: RahatTokenABI,
      },
    ],
    plugins: [react()],
  },
  {
    out: 'apps/rahat-ui/src/hooks/c2c/contracts/rahatAccessManager.ts',
    contracts: [
      {
        name: 'RahatAccessManager',
        abi: rahatAccessManagerAbi,
      },
    ],
    plugins: [react()],
  },
];

const RPConfig = [
  {
    out: 'libs/query/src/lib/rp/contracts/generated-hooks/rahatToken.ts',
    contracts: [
      {
        name: 'RahatToken',
        abi: rahatTokenAbi,
      },
    ],
    plugins: [react()],
  },
  {
    out: 'libs/query/src/lib/rp/contracts/generated-hooks/vendor.ts',
    contracts: [
      {
        name: 'Vendor',
        abi: vendorAbi,
      },
    ],
    plugins: [react()],
  },
  {
    out: 'libs/query/src/lib/rp/contracts/generated-hooks/rahatAccessManager.ts',
    contracts: [
      {
        name: 'RahatAccessManager',
        abi: rahatAccessManagerAbi,
      },
    ],
    plugins: [react()],
  },
  {
    out: 'libs/query/src/lib/rp/contracts/generated-hooks/rahatPayrollProject.ts',
    contracts: [
      {
        name: 'RahatPayrollProject',
        abi: rahatPayrollProjectAbi,
      },
    ],
    plugins: [react()],
  },
  {
    out: 'libs/query/src/lib/rp/contracts/generated-hooks/rahatTreasury.ts',
    contracts: [
      {
        name: 'RahatTreasury',
        abi: rahatTreasuryAbi,
      },
    ],
    plugins: [react()],
  },
  {
    out: 'libs/query/src/lib/rp/contracts/generated-hooks/redemptions.ts',
    contracts: [
      {
        name: 'Redemptions',
        abi: redemptionsAbi,
      },
    ],
    plugins: [react()],
  },
];
const KenyaConfig = [
  {
    out: 'libs/query/src/lib/el-kenya/contracts/generated-hooks/rahatToken.ts',
    contracts: [
      {
        name: 'RahatToken',
        abi: rahatTokenAbi,
      },
    ],
    plugins: [react()],
  },
  {
    out: 'libs/query/src/lib/el-kenya/contracts/generated-hooks/vendor.ts',
    contracts: [
      {
        name: 'Vendor',
        abi: vendorAbi,
      },
    ],
    plugins: [react()],
  },
  {
    out: 'libs/query/src/lib/el-kenya/contracts/generated-hooks/rahatAccessManager.ts',
    contracts: [
      {
        name: 'RahatAccessManager',
        abi: rahatAccessManagerAbi,
      },
    ],
    plugins: [react()],
  },
  {
    out: 'libs/query/src/lib/el-kenya/contracts/generated-hooks/rahatCvaKenya.ts',
    contracts: [
      {
        name: 'RahatCvaKenya',
        abi: rahatCvaKenyaProjectAbi,
      },
    ],
    plugins: [react()],
  },
  {
    out: 'libs/query/src/lib/el-kenya/contracts/generated-hooks/rahatTreasury.ts',
    contracts: [
      {
        name: 'RahatTreasury',
        abi: rahatTreasuryAbi,
      },
    ],
    plugins: [react()],
  },
  {
    out: 'libs/query/src/lib/el-kenya/contracts/generated-hooks/redemptions.ts',
    contracts: [
      {
        name: 'Redemptions',
        abi: redemptionsAbi,
      },
    ],
    plugins: [react()],
  },
];
const CambodiaConfig = [
  {
    out: 'libs/query/src/lib/cambodia/contracts/generated-hooks/rahatToken.ts',
    contracts: [
      {
        name: 'RahatToken',
        abi: rahatTokenAbi,
      },
    ],
    plugins: [react()],
  },
  {
    out: 'libs/query/src/lib/cambodia/contracts/generated-hooks/vendor.ts',
    contracts: [
      {
        name: 'Vendor',
        abi: vendorAbi,
      },
    ],
    plugins: [react()],
  },
  {
    out: 'libs/query/src/lib/cambodia/contracts/generated-hooks/rahatAccessManager.ts',
    contracts: [
      {
        name: 'RahatAccessManager',
        abi: rahatAccessManagerAbi,
      },
    ],
    plugins: [react()],
  },
  {
    out: 'libs/query/src/lib/cambodia/contracts/generated-hooks/rahatCVACambodia.ts',
    contracts: [
      {
        name: 'RahatCVACambodia',
        abi: rahatCVACambodiaAbi,
      },
    ],
    plugins: [react()],
  },
  {
    out: 'libs/query/src/lib/cambodia/contracts/generated-hooks/rahatTreasury.ts',
    contracts: [
      {
        name: 'RahatTreasury',
        abi: rahatTreasuryAbi,
      },
    ],
    plugins: [react()],
  },
  {
    out: 'libs/query/src/lib/cambodia/contracts/generated-hooks/redemptions.ts',
    contracts: [
      {
        name: 'Redemptions',
        abi: redemptionsAbi,
      },
    ],
    plugins: [react()],
  },
];
export default defineConfig([
  ...ELConfig,
  ...CVAConfig,
  ...AAConfig,
  ...C2CConfig,
  ...RPConfig,
  ...KenyaConfig,
  ...CambodiaConfig,
]);

// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
import { ProjectTypes } from '@rahataid/sdk/enums';
import { useNavItems as useAANavItems } from '../aa/useAANavItems';
import { useNavItems as useCVANavItems } from '../cva/useCVANavItems';
import { useNavItems as useELNavItems } from '../el/useNavItems';
import { useProjectListNavItems } from '../useNavItems';
import { useProjectNavItemsType } from './nav-items.types';
import { useNavItems as useC2CNavItems } from '../c2c/useNavItems';
import { useNavItems as useRPNavItems } from '../rp/useRPNavItems';
import { useNavItems as useELKenyaNavItems } from '../el-kenya/useELKenyaNavItems';
import { useNavItems as useCambodiaNavItems } from '../cambodia/useCambodiaNavItems';
import { useNavItems as useCommsNavItems } from '../comms/useCommsNavItems';


const hooks = {
  [ProjectTypes.ANTICIPATORY_ACTION]: useAANavItems,
  [ProjectTypes.EL]: useELNavItems,
  [ProjectTypes.CVA]: useCVANavItems,
  [ProjectTypes.C2C]: useC2CNavItems,
  [ProjectTypes.RP]: useRPNavItems,
  [ProjectTypes.COMMS]: useCommsNavItems,
  'el-kenya': useELKenyaNavItems,
  'el-cambodia': useCambodiaNavItems,
  ALL: useProjectListNavItems,
};

export const useProjectNavItems: useProjectNavItemsType = (projectType) => {
  const useNavItems = hooks[projectType];

  if (!useNavItems) {
    throw new Error(`Invalid project type: ${projectType}`);
  }

  return useNavItems();
};

import { ProjectTypes } from '@rahataid/sdk/enums';
import { useNavItems as useAANavItems } from '../aa/useAANavItems';
import { useNavItems as useCVANavItems } from '../cva/useCVANavItems';
import { useNavItems as useELNavItems } from '../el/useNavItems';
import { useProjectListNavItems } from '../useNavItems';
import { useProjectNavItemsType } from './nav-items.types';
import { useNavItems as useC2CNavItems } from '../c2c/useNavItems';
import { useNavItems as useRPNavItems } from '../rp/useRPNavItems';
import { useNavItems as useELKenyaNavItems } from '../el-kenya/useELKenyaNavItems';

const hooks = {
  [ProjectTypes.ANTICIPATORY_ACTION]: useAANavItems,
  [ProjectTypes.EL]: useELNavItems,
  [ProjectTypes.CVA]: useCVANavItems,
  [ProjectTypes.C2C]: useC2CNavItems,
  [ProjectTypes.RP]: useRPNavItems,
  [ProjectTypes.EL_KENYA]: useELKenyaNavItems,
  ALL: useProjectListNavItems,
};

export const useProjectNavItems: useProjectNavItemsType = (projectType) => {
  const useNavItems = hooks[projectType];

  if (!useNavItems) {
    throw new Error(`Invalid project type: ${projectType}`);
  }

  return useNavItems();
};

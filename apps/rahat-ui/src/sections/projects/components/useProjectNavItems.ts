import { ProjectTypes } from '@rahataid/sdk/enums';
import { useNavItems as useAANavItems } from '../aa/useAANavItems';
import { useNavItems as useCVANavItems } from '../cva/useCVANavItems';
import { useNavItems as useELNavItems } from '../el/useNavItems';
import { useProjectListNavItems } from '../useNavItems';
import { useProjectNavItemsType } from './nav-items.types';
import { useNavItems as useC2CNavItems } from '../c2c/useNavItems';

export const useProjectNavItems: useProjectNavItemsType = (projectType) => {
  const hooks = {
    [ProjectTypes.ANTICIPATORY_ACTION]: useAANavItems,
    [ProjectTypes.EL]: useELNavItems,
    [ProjectTypes.CVA]: useCVANavItems,
    C2C: useC2CNavItems,
    ALL: useProjectListNavItems,
  };

  const useNavItems = hooks[projectType];

  if (!useNavItems) {
    throw new Error(`Invalid project type: ${projectType}`);
  }

  return useNavItems();
};

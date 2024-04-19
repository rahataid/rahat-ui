import { ProjectTypes } from '@rahataid/sdk/enums';
import { useNavItems as useAANavItems } from '../aa/useAANavItems';
import { useNavItems as useCVANavItems } from '../cva/useCVANavItems';
import { useNavItems as useELNavItems } from '../el/useNavItems';
import { useProjectListNavItems } from '../useNavItems';
import { useProjectNavItemsType } from './nav-items.types';
import { useNavItems as useC2CNavItems } from '../c2c/useNavItems';

export const useProjectNavItems: useProjectNavItemsType = (projectType) => {
  const aaNavItems = useAANavItems();
  const elNavItems = useELNavItems();
  const cvaNavItems = useCVANavItems();
  const listNavItems = useProjectListNavItems();
  const c2cNavItems = useC2CNavItems();

  switch (projectType) {
    case ProjectTypes.ANTICIPATORY_ACTION:
      return aaNavItems;
    case ProjectTypes.EL:
      return elNavItems;
    case ProjectTypes.CVA:
      return cvaNavItems;
    case 'C2C':
      return c2cNavItems;
    case 'ALL':
      return listNavItems;
    default:
      throw new Error(`Invalid project type: ${projectType}`);
  }
};

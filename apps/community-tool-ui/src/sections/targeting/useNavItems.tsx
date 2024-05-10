import { List, ListFilter } from 'lucide-react';
import { paths } from '../../routes/paths';
import { NavItem } from './nav-items.types';

export const useTargetingNavItems = () => {
  const menuItems: NavItem[] = [
    {
      title: 'Targeting',
      children: [
        {
          title: 'Targeting Filters',
          path: `${paths.dashboard.targeting.root}`,
          icon: <ListFilter size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Target List',
          path: `${paths.dashboard.targeting.list}`,
          icon: <List size={18} strokeWidth={1.5} />,
        },
      ],
    },
  ];
  return menuItems;
};

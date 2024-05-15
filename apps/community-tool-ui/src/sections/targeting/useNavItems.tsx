import { PinIcon, ListFilter } from 'lucide-react';
import { paths } from '../../routes/paths';
import { NavItem } from './nav-items.types';

export const useTargetingNavItems = () => {
  const menuItems: NavItem[] = [
    {
      title: 'Targeting',
      children: [
        {
          title: 'Filters options',
          path: `${paths.dashboard.targeting.root}`,
          icon: <ListFilter size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Pinned list',
          path: `${paths.dashboard.targeting.list}`,
          icon: <PinIcon size={18} strokeWidth={1.5} />,
        },
      ],
    },
  ];
  return menuItems;
};

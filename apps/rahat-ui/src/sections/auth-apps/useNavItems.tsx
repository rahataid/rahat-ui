import { List, Plus, User } from 'lucide-react';
import { NavItem } from './nav-items.types';

export const useAppAuthenticationNavItems = () => {
  const menuItems: NavItem[] = [
    {
      title: 'Auth Apps',
      children: [
        {
          title: 'List',
          path: '/auth-apps',
          icon: <List size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Add',
          path: '/auth-apps/add',
          icon: <Plus size={18} strokeWidth={1.5} />,
        },
      ],
    },
  ];
  return menuItems;
};

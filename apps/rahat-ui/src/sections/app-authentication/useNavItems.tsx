import { List, Plus, User } from 'lucide-react';
import { NavItem } from './nav-items.types';

export const useAppAuthenticationNavItems = () => {
  const menuItems: NavItem[] = [
    {
      title: 'App Authentication',
      children: [
        {
          title: 'List',
          path: '/app-authentication',
          icon: <List size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Add',
          path: '/app-authentication/add',
          icon: <Plus size={18} strokeWidth={1.5} />,
        },
      ],
    },
  ];
  return menuItems;
};

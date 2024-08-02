import { List, Plus, User } from 'lucide-react';
import { NavItem } from './nav-items.types';

export const useSettingFieldDefinitionNavItems = () => {
  const menuItems: NavItem[] = [
    {
      title: 'Settings',
      children: [
        {
          title: 'List',
          path: '/settings',
          icon: <List size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Add',
          path: '/settings/add',
          icon: <Plus size={18} strokeWidth={1.5} />,
        },
      ],
    },
  ];
  return menuItems;
};

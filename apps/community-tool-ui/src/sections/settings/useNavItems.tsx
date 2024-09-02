import { usePagination } from '@rahat-ui/query';
import { List, ListCollapse, Plus, User, View } from 'lucide-react';
import { NavItem } from './nav-items.types';

export const useSettingFieldDefinitionNavItems = () => {
  const { setFilters } = usePagination();

  const menuItems: NavItem[] = [
    {
      title: 'Profile',

      children: [
        {
          title: 'Profile',
          path: '/profile',
          icon: <User size={18} strokeWidth={1.5} />,
        },
      ],
    },
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
        {
          title: 'Samples',
          path: '/settings/samples',
          icon: <View size={18} strokeWidth={1.5} />,
        },
      ],
    },
    {
      title: 'Field Definition',
      children: [
        {
          title: 'List',
          path: '/field-definitions',
          icon: <List size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Add',
          path: '/field-definitions/add',
          icon: <Plus size={18} strokeWidth={1.5} />,
        },
      ],
    },
  ];
  return menuItems;
};

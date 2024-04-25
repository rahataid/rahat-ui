import { usePagination } from '@rahat-ui/query';
import { KanbanSquare, Archive, Plus, ListCollapse, List } from 'lucide-react';
import { NavItem } from './nav-items.types';

export const useSettingFieldDefinitionNavItems = () => {
  const { setFilters } = usePagination();

  const accordianItems = [
    {
      title: 'List Roles',
      icon: <List size={18} strokeWidth={1.5} />,
      path: '/users/roles',
    },
    {
      title: 'Add Roles',
      icon: <Plus size={18} strokeWidth={1.5} />,
      path: '/users/roles/add',
    },
  ];
  const menuItems: NavItem[] = [
    {
      title: 'Action',
      icon: <ListCollapse size={18} strokeWidth={1.5} />,
      children: [
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
        {
          title: 'FieldDefinition',
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
      ],
    },
  ];
  return menuItems;
};

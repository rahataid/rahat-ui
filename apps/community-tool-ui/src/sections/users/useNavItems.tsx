import { KanbanSquare, List, ListCollapse, Plus } from 'lucide-react';
import { NavItem } from './nav-items.types';

export const useUsersNavItems = () => {
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
      title: 'Users',
      children: [
        {
          title: 'Users',
          icon: <KanbanSquare size={18} strokeWidth={1.5} />,
          path: '/users',
        },
      ],
    },
    {
      title: 'Actions',
      children: [
        {
          title: 'Add Users',
          path: '/users/add',
          icon: <Plus size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Role and Permission',
          children: accordianItems,
          icon: <ListCollapse size={18} strokeWidth={1.5} />,
        },
      ],
    },
  ];
  return menuItems;
};

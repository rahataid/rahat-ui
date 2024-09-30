import { usePagination } from '@rahat-ui/query';
import { KanbanSquare, Archive, Plus, List, ListCollapse } from 'lucide-react';
import { NavItem } from './nav-items.types';

export const useUsersNavItems = () => {
  const { setFilters } = usePagination();

  const handleFilter = (type: string) => {
    setFilters({ type });
  };

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
          path: '/users',
          icon: <KanbanSquare size={18} strokeWidth={1.5} />,
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

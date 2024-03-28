import { usePagination } from '@rahat-ui/query';
import { KanbanSquare, Archive, Plus } from 'lucide-react';
import { NavItem } from './nav-items.types';

export const useUsersNavItems = () => {
  const { setFilters } = usePagination();

  const handleFilter = (type: string) => {
    setFilters({ type });
  };

  const menuItems: NavItem[] = [
    {
      title: 'Users',
      children: [
        {
          title: 'Users',
          icon: <KanbanSquare size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Archived',
          icon: <Archive size={18} strokeWidth={1.5} />,
          onClick: () => setFilters({ deletedAt: true }),
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
      ],
    },
  ];
  return menuItems;
};

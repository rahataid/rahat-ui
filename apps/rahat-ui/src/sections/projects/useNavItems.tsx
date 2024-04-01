import { usePagination } from '@rahat-ui/query';
import { NavItem } from './components';
import { KanbanSquare, Archive, Plus } from 'lucide-react';

export const useProjectListNavItems = () => {
  const { setFilters } = usePagination();

  const handleFilter = (type: string) => {
    setFilters({ type });
  };

  const menuItems: NavItem[] = [
    {
      title: 'Projects',
      children: [
        {
          title: 'Projects',
          icon: <KanbanSquare size={18} strokeWidth={1.5} />,
          children: [
            {
              title: 'All',
              path: '/projects',
            },
            {
              title: 'CVA',
              onClick: () => handleFilter('cva'),
            },
            {
              title: 'AA',
              onClick: () => handleFilter('aa'),
            },
            {
              title: 'EL',
              onClick: () => handleFilter('el'),
            },
          ],
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
          title: 'Add Project',
          path: '/projects/add',
          icon: <Plus size={18} strokeWidth={1.5} />,
        },
      ],
    },
  ];
  return menuItems;
};

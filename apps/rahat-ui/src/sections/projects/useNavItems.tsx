import { NavItem } from './components';
import { KanbanSquare, Archive, Plus } from 'lucide-react';

export const useProjectListNavItems = () => {
  const menuItems: NavItem[] = [
    {
      title: 'Projects',
      children: [
        {
          title: 'Projects',
          icon: <KanbanSquare size={18} strokeWidth={1.5} />,
          children: [
            {
              title: 'CVA',
            },
            {
              title: 'AA',
            },
            {
              title: 'EL',
            },
          ],
        },
        {
          title: 'Archived',
          icon: <Archive size={18} strokeWidth={1.5} />,
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

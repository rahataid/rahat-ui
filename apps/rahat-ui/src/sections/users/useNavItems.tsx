import { useTranslations } from 'next-intl';
import { usePagination } from '@rahat-ui/query';
import { KanbanSquare, Archive, Plus, List, ListCollapse } from 'lucide-react';
import { NavItem } from './nav-items.types';

export const useUsersNavItems = () => {
  const t = useTranslations('USERS_LIST');
  const tr = useTranslations('USERS_ROLES_PERMISSIONS');
  const tg = useTranslations('GLOBAL');
  const { setFilters } = usePagination();

  const handleFilter = (type: string) => {
    setFilters({ type });
  };

  const accordianItems = [
    {
      title: tr('LIST_ROLES'),
      icon: <List size={18} strokeWidth={1.5} />,
      path: '/users/roles',
    },
    {
      title: tg('ADD_ROLE'),
      icon: <Plus size={18} strokeWidth={1.5} />,
      path: '/users/roles/add',
    },
  ];
  const menuItems: NavItem[] = [
    {
      title: t('USERS'),
      children: [
        {
          title: t('USERS'),
          path: '/users',
          icon: <KanbanSquare size={18} strokeWidth={1.5} />,
        },
      ],
    },
    {
      title: tg('ACTIONS'),
      children: [
        {
          title: tg('ADD_USERS'),
          path: '/users/add',
          icon: <Plus size={18} strokeWidth={1.5} />,
        },
        {
          title: tr('ROLES_AND_PERMISSIONS'),
          children: accordianItems,
          icon: <ListCollapse size={18} strokeWidth={1.5} />,
        },
      ],
    },
  ];
  return menuItems;
};

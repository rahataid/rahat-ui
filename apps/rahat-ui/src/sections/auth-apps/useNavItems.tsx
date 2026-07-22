import { List, Plus, User } from 'lucide-react';
import { NavItem } from './nav-items.types';
import { useTranslations } from 'next-intl';

export const useAppAuthenticationNavItems = () => {
  const t = useTranslations('Auth Apps – List');
  const tg = useTranslations('GLOBAL');
  const menuItems: NavItem[] = [
    {
      title: t('AUTH_APPS'),
      children: [
        {
          title: t('LIST'),
          path: '/auth-apps',
          icon: <List size={18} strokeWidth={1.5} />,
        },
        {
          title: tg('ADD'),
          path: '/auth-apps/add',
          icon: <Plus size={18} strokeWidth={1.5} />,
        },
      ],
    },
  ];
  return menuItems;
};

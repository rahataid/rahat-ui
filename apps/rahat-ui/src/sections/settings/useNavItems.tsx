import { useTranslations } from 'next-intl';
import { List, Plus, User } from 'lucide-react';
import { NavItem } from './nav-items.types';

export const useSettingFieldDefinitionNavItems = () => {
  const t = useTranslations('Settings – Navigation');
  const g = useTranslations('GLOBAL');
  const menuItems: NavItem[] = [
    {
      title: g('SETTINGS'),
      children: [
        {
          title: t('LIST'),
          path: '/settings',
          icon: <List size={18} strokeWidth={1.5} />,
        },
        {
          title: g('ADD'),
          path: '/settings/add',
          icon: <Plus size={18} strokeWidth={1.5} />,
        },
      ],
    },
    {
      title: t('AUTH_APPS'),
      children: [
        {
          title: t('LIST'),
          path: '/auth-apps',
          icon: <List size={18} strokeWidth={1.5} />,
        },
        {
          title: g('ADD'),
          path: '/auth-apps/add',
          icon: <Plus size={18} strokeWidth={1.5} />,
        },
      ],
    },
    {
      title: t('PROJECT_INFO'),
      children: [
        {
          title: t('LIST'),
          path: '/project-info',
          icon: <List size={18} strokeWidth={1.5} />,
        },

      ],
    },
  ];
  return menuItems;
};

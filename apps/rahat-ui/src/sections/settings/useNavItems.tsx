import { useTranslations } from 'next-intl';
import { List, Plus } from 'lucide-react';
import {
  ACTIONS,
  SUBJECTS,
} from 'apps/rahat-ui/src/constants/ability.constants';
import { NavItem } from './nav-items.types';

export const useSettingFieldDefinitionNavItems = () => {
  const t = useTranslations('SETTINGS_NAVIGATION');
  const g = useTranslations('GLOBAL');
  const menuItems: NavItem[] = [
    {
      title: g('SETTINGS'),
      children: [
        {
          title: t('LIST'),
          path: '/settings',
          icon: <List size={18} strokeWidth={1.5} />,
          action: ACTIONS.READ,
          subject: SUBJECTS.SETTINGS,
        },
        {
          title: g('ADD'),
          path: '/settings/add',
          icon: <Plus size={18} strokeWidth={1.5} />,
          action: ACTIONS.CREATE,
          subject: SUBJECTS.SETTINGS,
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
          action: ACTIONS.READ,
          subject: SUBJECTS.SETTINGS,
        },
        {
          title: g('ADD'),
          path: '/auth-apps/add',
          icon: <Plus size={18} strokeWidth={1.5} />,
          action: ACTIONS.CREATE,
          subject: SUBJECTS.SETTINGS,
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
          action: ACTIONS.READ,
          subject: SUBJECTS.SETTINGS,
        },
      ],
    },
    {
      title: t('SITE_INFO'),
      children: [
        {
          title: t('LIST'),
          path: '/site-info',
          icon: <List size={18} strokeWidth={1.5} />,
          action: ACTIONS.READ,
          subject: SUBJECTS.SETTINGS,
        },
        {
          title: g('ADD'),
          path: '/site-info/add',
          icon: <Plus size={18} strokeWidth={1.5} />,
          action: ACTIONS.CREATE,
          subject: SUBJECTS.SETTINGS,
        },
      ],
    },
    {
      title: t('VERSION'),
      children: [
        {
          title: t('LIST'),
          path: '/version',
          icon: <List size={18} strokeWidth={1.5} />,
          action: ACTIONS.READ,
          subject: SUBJECTS.SETTINGS,
        },
      ],
    },
    {
      title: t('HEALTH'),
      children: [
        {
          title: t('LIST'),
          path: '/health',
          icon: <List size={18} strokeWidth={1.5} />,
          action: ACTIONS.READ,
          subject: SUBJECTS.SETTINGS,
        },
      ],
    },
  ];
  return menuItems;
};

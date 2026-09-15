import { useTranslations } from 'next-intl';
import { List, Plus, User } from 'lucide-react';
import { NavItem } from './nav-items.types';
import { useWebVersion, useAppVersions } from '@rahat-ui/query';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';

export const useSettingFieldDefinitionNavItems = () => {
  const t = useTranslations('SETTINGS_NAVIGATION');
  const g = useTranslations('GLOBAL');
  const { data: appVersions } = useAppVersions();
  const { data: webVersion } = useWebVersion();
  const versionBadge = (value: string | undefined) => (
    <Badge variant={value === 'unreachable' ? 'destructive' : 'outline'} className="text-xs">
      {value === 'unreachable' ? t('UNREACHABLE') : value ?? '—'}
    </Badge>
  );
  // Normalize to the same 'v'-prefixed format the backends already use (version.helper.ts),
  // since NEXT_PUBLIC_APP_VERSION is a raw package.json value with no prefix.
  const rahatUiVersion = process.env.NEXT_PUBLIC_APP_VERSION
    ? process.env.NEXT_PUBLIC_APP_VERSION.startsWith('v')
      ? process.env.NEXT_PUBLIC_APP_VERSION
      : `v${process.env.NEXT_PUBLIC_APP_VERSION}`
    : '—';
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
    {
      title: t('VERSION'),
      children: [
        {
          title: 'Rahat UI',
          subtitle: (
            <Badge variant="outline" className="text-xs">
              {rahatUiVersion}
            </Badge>
          ),
        },
        {
          title: 'Platform',
          subtitle: versionBadge(appVersions?.platform),
        },
        {
          title: 'Triggers',
          subtitle: versionBadge(appVersions?.triggers),
        },
        {
          title: 'Rahat AA',
          subtitle: versionBadge(appVersions?.rahatAa),
        },
        {
          title: t('WEB_VERSION'),
          subtitle: (
            <a
              href={webVersion?.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs underline truncate max-w-[140px]"
            >
              {webVersion?.url ?? '—'}
            </a>
          ),
        },
      ],
    },
  ];
  return menuItems;
};

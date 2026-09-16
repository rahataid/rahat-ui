'use client';
import { useTranslations } from 'next-intl';
import { AARoles } from '@rahat-ui/auth';
import { PROJECT_SETTINGS_KEYS, useTabConfiguration } from '@rahat-ui/query';
import { Can } from 'apps/rahat-ui/src/components/can';
import {
  ACTIONS,
  SUBJECTS,
} from 'apps/rahat-ui/src/constants/ability.constants';
import {
  defaultNavConfig,
  NavItemDB,
  resolveIcon,
} from 'apps/rahat-ui/src/utils/resolvedIcon';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import * as React from 'react';
import { NavItem as BaseNavItem } from '../components/nav-items.types';
import { translateValue } from 'apps/rahat-ui/src/utils/i18n/translateValue';

type NavItem = BaseNavItem;

// "Payout" derives to PAYOUT, which already means something else in
// AA_PROJECT — the real translation lives at PAYOUT2.
const NAV_TITLE_OVERRIDES: Record<string, string> = { Payout: 'PAYOUT2' };

export const useNavItems = () => {
  const t = useTranslations('AA_PROJECT');
  const params = useParams();
  const projectId = params.id as string;
  const { data, isLoading } = useTabConfiguration(
    projectId as UUID,
    PROJECT_SETTINGS_KEYS.PROJECT_NAV_CONFIG,
  );

  const backendNavs = data?.value?.navsettings
    ? data?.value?.navsettings.map((item: NavItemDB) => {
        // DB records may not have `subject` — fall back to defaultNavConfig match by path
        const defaultMatch = defaultNavConfig.navsettings.find(
          (d) => d.path === item.path,
        );
        return {
          ...item,
          subject: item.subject ?? defaultMatch?.subject,
          roles: item.roles?.map((r) => AARoles[r as keyof typeof AARoles]),
          icon: resolveIcon(item.icon),
        };
      })
    : defaultNavConfig.navsettings.map((item) => ({
        ...item,
        roles: item.roles?.map((r) => AARoles[r as keyof typeof AARoles]),
        icon: resolveIcon(item.icon),
      }));
  // Map default nav items
  const mappedNavItems: NavItem[] = backendNavs.map((item: NavItem) => {
    const navItem: NavItem = {
      // Nav titles can come from backend-configurable navsettings, so an
      // unmapped title must render as-is rather than throwing MISSING_MESSAGE.
      title: translateValue(t, item.title, {
        keyMap: NAV_TITLE_OVERRIDES,
        fallbackStyle: 'raw',
        silent: true,
      }),
      path: `/projects/aa/${projectId}/${item.path}`,
      icon: item.icon,
    };

    const hasAbilityGuard =
      (item.subject && item.subject !== SUBJECTS.ALL) ||
      ('roles' in item && item.roles);
    if (hasAbilityGuard) {
      navItem.wrapper = (children: React.ReactNode) => (
        <Can
          action={item.action || ACTIONS.READ}
          subject={item.subject || SUBJECTS.ALL}
        >
          {children}
        </Can>
      );
    }

    return navItem;
  });

  const navItems: NavItem[] = [
    {
      title: t('PROJECT_DETAILS'),
      isLoading: isLoading,
      children: [...mappedNavItems],
    },
  ];

  return { navItems };
};

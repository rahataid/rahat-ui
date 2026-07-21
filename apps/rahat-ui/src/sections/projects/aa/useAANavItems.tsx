'use client';
import { AARoles, RoleAuth } from '@rahat-ui/auth';
import { PROJECT_SETTINGS_KEYS, useTabConfiguration } from '@rahat-ui/query';
import {
  defaultNavConfig,
  NavItemDB,
  resolveIcon,
} from 'apps/rahat-ui/src/utils/resolvedIcon';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import * as React from 'react';
import { NavItem as BaseNavItem } from '../components/nav-items.types';

type NavItem = BaseNavItem;

export const useNavItems = () => {
  const params = useParams();
  const projectId = params.id as string;
  const { data, isLoading } = useTabConfiguration(
    projectId as UUID,
    PROJECT_SETTINGS_KEYS.PROJECT_NAV_CONFIG,
  );

  const backendNavs = data?.value?.navsettings
    ? data?.value?.navsettings.map((item: NavItemDB) => ({
        ...item,
        roles: item.roles?.map((r) => AARoles[r as keyof typeof AARoles]),
        icon: resolveIcon(item.icon),
      }))
    : defaultNavConfig.navsettings.map((item) => ({
        ...item,
        roles: item.roles?.map((r) => AARoles[r as keyof typeof AARoles]),
        icon: resolveIcon(item.icon),
      }));
  // Map default nav items
  const mappedNavItems: NavItem[] = backendNavs.map((item: NavItem) => {
    const navItem: NavItem = {
      title: item.title,
      path: `/projects/aa/${projectId}/${item.path}`,
      icon: item.icon,
    };

    if ('roles' in item && item.roles) {
      navItem.wrapper = (children: React.ReactNode) => (
        <RoleAuth roles={item.roles} hasContent={false}>
          {children}
        </RoleAuth>
      );
    }

    return navItem;
  });

  const navItems: NavItem[] = [
    {
      title: 'Project Details',
      isLoading: isLoading,
      children: [...mappedNavItems],
    },
  ];

  return { navItems };
};

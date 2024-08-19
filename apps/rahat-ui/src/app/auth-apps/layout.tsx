'use client';

import * as React from 'react';

import { useSecondPanel } from '../../providers/second-panel-provider';
import SettingsFieldDefLayout from '../../sections/settings/settingsFieldDefinitionLayout';
import DashboardLayout from '../dashboard/layout';
import { useSettingFieldDefinitionNavItems } from '../../sections/settings/useNavItems';

export default function AuthenticationAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { secondPanel } = useSecondPanel();

  const menuItems = useSettingFieldDefinitionNavItems();

  return (
    <DashboardLayout>
      <SettingsFieldDefLayout menuItems={menuItems}>
        {secondPanel ? [children, secondPanel] : children}
      </SettingsFieldDefLayout>
    </DashboardLayout>
  );
}

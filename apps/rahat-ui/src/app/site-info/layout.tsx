'use client';

import * as React from 'react';

import DashboardLayout from '../dashboard/layout';
import SettingFieldDefinitionLayout from '../../sections/settings/settingsFieldDefinitionLayout';
import { useSettingFieldDefinitionNavItems } from '../../sections/settings/useNavItems';
import { useSecondPanel } from '../../providers/second-panel-provider';

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { secondPanel } = useSecondPanel();

  const menuItems = useSettingFieldDefinitionNavItems();

  return (
    <DashboardLayout>
      <SettingFieldDefinitionLayout menuItems={menuItems}>
        {secondPanel ? [children, secondPanel] : children}
      </SettingFieldDefinitionLayout>
    </DashboardLayout>
  );
}

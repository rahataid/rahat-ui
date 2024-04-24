'use client';

import * as React from 'react';
import DashboardLayout from '../dashboard/layout';
import { useSecondPanel } from '../../providers/second-panel-provider';
import { useSettingFieldDefinitionNavItems } from '../../sections/settings/useNavItems';
import SettingFieldDefinitionLayout from '../../sections/settings/settingsFieldDefinitionLayout';

export default function Layout({ children }: { children: React.ReactNode }) {
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

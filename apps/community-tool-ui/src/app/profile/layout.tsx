'use client';

import { useSecondPanel } from '../../providers/second-panel-provider';
import SettingFieldDefinitionLayout from '../../sections/settings/settingsFieldDefinitionLayout';
import { useSettingFieldDefinitionNavItems } from '../../sections/settings/useNavItems';
import DashboardLayout from '../dashboard/layout';

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

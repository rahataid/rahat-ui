'use client';

import * as React from 'react';
import { useSecondPanel } from '../../../providers/second-panel-provider';
import { useNavItems } from '../../../sections/communications/text/useTextNavItems';
import { CommunicationLayout } from '../../../sections/communications/components';

export default function TextLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems = useNavItems();
  const { secondPanel } = useSecondPanel();
  return (
    <CommunicationLayout menuItems={navItems}>
      {secondPanel ? [children, secondPanel] : children}
    </CommunicationLayout>
  );
}

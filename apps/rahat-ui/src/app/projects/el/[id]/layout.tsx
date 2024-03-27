'use client';

import * as React from 'react';
import { useSecondPanel } from '../../../../providers/second-panel-provider';
import { ProjectLayout } from '../../../../sections/projects/components';
import { useNavItems } from '../../../../sections/projects/el/useNavItems';

export default function ProjectLayoutRoot({
  children,
}: {
  children: React.ReactNode;
}) {
  const { navItems, createVoucher } = useNavItems();
  const { secondPanel } = useSecondPanel();

  const renderChildren = () => {
    if (createVoucher.isPending) {
      return <h3>Minting Voucher...</h3>;
    }
    if (secondPanel) {
      return [children, secondPanel];
    }

    return children;
  };

  return <ProjectLayout menuItems={navItems}>{renderChildren()}</ProjectLayout>;
}

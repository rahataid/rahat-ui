'use client';

import * as React from 'react';
import { useSecondPanel } from '../../../../providers/second-panel-provider';
import { ProjectLayout } from '../../../../sections/projects/components';
import { useNavItems } from '../../../../sections/projects/el/useNavItems';
import { useProjectSettings } from '@rahat-ui/query';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';

export default function ProjectLayoutRoot({
  children,
}: {
  children: React.ReactNode;
}) {
  const { navItems, createVoucher } = useNavItems();
  const { secondPanel } = useSecondPanel();
  const { id } = useParams();

  useProjectSettings(id as UUID);

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

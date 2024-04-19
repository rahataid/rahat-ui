'use client';

import { useProjectContractSettings } from '@rahat-ui/query';
import { useSecondPanel } from 'apps/rahat-ui/src/providers/second-panel-provider';
import { GraphQueryProvider } from 'apps/rahat-ui/src/providers/subgraph-provider';
import { ProjectLayout } from 'apps/rahat-ui/src/sections/projects/components';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import * as React from 'react';

export default function ProjectLayoutRoot({
  children,
}: {
  children: React.ReactNode;
}) {
  const { secondPanel } = useSecondPanel();
  const { id } = useParams();

  useProjectContractSettings(id as UUID);

  const renderChildren = () => {
    // if (createVoucher.isPending) {
    //   return <h3>Minting Voucher...</h3>;
    // }
    if (secondPanel) {
      return [children, secondPanel];
    }

    return children;
  };

  return (
    <GraphQueryProvider>
      <ProjectLayout projectType="C2C">{renderChildren()}</ProjectLayout>
    </GraphQueryProvider>
  );
}

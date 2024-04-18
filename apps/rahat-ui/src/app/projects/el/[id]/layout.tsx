'use client';

import { useProjectContractSettings } from '@rahat-ui/query';
import { GraphQueryProvider } from 'apps/rahat-ui/src/providers/subgraph-provider';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import * as React from 'react';
import { useSecondPanel } from '../../../../providers/second-panel-provider';
import { ProjectLayout } from '../../../../sections/projects/components';

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
      <ProjectLayout>{renderChildren()}</ProjectLayout>
    </GraphQueryProvider>
  );
}

'use client';

import { useProjectContractSettings } from '@rahat-ui/query';
import { GraphQueryProvider } from 'apps/rahat-ui/src/providers/subgraph-provider';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import * as React from 'react';
import { useSecondPanel } from '../../../../providers/second-panel-provider';
import { ProjectLayout } from '../../../../sections/projects/components';
import { ProjectTypes } from '@rahataid/sdk/enums';

const ProjectLayoutRoot = ({ children }: { children: React.ReactNode }) => {
  const { secondPanel } = useSecondPanel();
  const { id } = useParams();

  useProjectContractSettings(id as UUID);
  console.log('here');

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
      <ProjectLayout projectType={ProjectTypes.EL}>
        {renderChildren()}
      </ProjectLayout>
    </GraphQueryProvider>
  );
};

export default React.memo(ProjectLayoutRoot);

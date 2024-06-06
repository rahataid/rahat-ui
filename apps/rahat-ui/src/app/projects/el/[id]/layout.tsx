'use client';

import { useProjectContractSettings } from '@rahat-ui/query';
import { ProjectTypes } from '@rahataid/sdk/enums';
import { GraphQueryProvider } from 'apps/rahat-ui/src/providers/subgraph-provider';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import * as React from 'react';
import { useSecondPanel } from '../../../../providers/second-panel-provider';
import { ProjectLayout } from '../../../../sections/projects/components';

const ProjectLayoutRoot = ({ children }: { children: React.ReactNode }) => {
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
      <ProjectLayout
        projectType={ProjectTypes.EL}
        // navFooter={
        //   <div className="fixed bottom-2 left-0 right-0  px-6">
        //     <Image
        //       src="/el/el_logo_dark.png"
        //       alt="Dark Logo"
        //       height={150}
        //       width={200}
        //     />
        //   </div>
        // }
      >
        {renderChildren()}
      </ProjectLayout>
    </GraphQueryProvider>
  );
};

export default React.memo(ProjectLayoutRoot);

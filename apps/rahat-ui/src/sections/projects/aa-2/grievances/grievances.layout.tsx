'use client';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@rahat-ui/shadcn/src/components/ui/resizable';
import { FC, Fragment } from 'react';

type GrievancesLayoutProps = {
  children: React.ReactNode | React.ReactNode[];
};

const GrievancesLayout: FC<GrievancesLayoutProps> = ({ children }) => {
  const renderResizablePanel = (children: React.ReactNode, index?: number) => {
    const defaultSize = index === 1 ? 30 : 70;

    return (
      <ResizablePanel minSize={30} defaultSize={defaultSize} key={index}>
        {children}
      </ResizablePanel>
    );
  };

  const renderChildren = () => {
    if (Array.isArray(children)) {
      return children.map((child, index) => (
        <Fragment key={index}>
          {index !== 0 && <ResizableHandle withHandle />}
          {renderResizablePanel(child, index)}
        </Fragment>
      ));
    }

    return renderResizablePanel(children);
  };

  return (
    <>
      <ResizablePanelGroup direction="horizontal">
        {renderChildren()}
      </ResizablePanelGroup>
    </>
  );
};

export default GrievancesLayout;

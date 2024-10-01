'use client';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@rahat-ui/shadcn/src/components/ui/resizable';
import { FC } from 'react';
import { NavItem } from './nav-items.types';

type BeneficiaryLayoutProps = {
  children: React.ReactNode | React.ReactNode[];
  menuItems?: NavItem[];
};

const BeneficiaryLayout: FC<BeneficiaryLayoutProps> = ({
  children,
  menuItems,
}) => {
  const renderResizablePanel = (children: React.ReactNode, index?: number) => {
    return (
      <ResizablePanel minSize={50} key={index}>
        {children}
      </ResizablePanel>
    );
  };
  const renderChildren = () => {
    if (Array.isArray(children)) {
      return children.map((child, index) => {
        return (
          <>
            <ResizableHandle />
            {renderResizablePanel(child, index)}
          </>
        );
      });
    }
    return (
      <>
        <ResizableHandle />
        {renderResizablePanel(children)}
      </>
    );
  };

  return (
    <ResizablePanelGroup direction="horizontal">
      {renderChildren()}
    </ResizablePanelGroup>
  );
};

export default BeneficiaryLayout;

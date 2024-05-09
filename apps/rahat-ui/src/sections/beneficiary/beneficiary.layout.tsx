'use client';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@rahat-ui/shadcn/src/components/ui/resizable';
// import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { Tabs } from '@rahat-ui/shadcn/src/components/ui/tabs';
import { FC } from 'react';
import { NavItem } from './nav-items.types';
import BeneficiaryNavView from './beneficiary.nav.view';

type BeneficiaryLayoutProps = {
  children: React.ReactNode | React.ReactNode[];
  menuItems: NavItem[];
};

const BeneficiaryLayout: FC<BeneficiaryLayoutProps> = ({
  children,
  menuItems,
}) => {
  const renderResizablePanel = (children: React.ReactNode, index?: number) => {
    return (
      <ResizablePanel minSize={30} key={index}>
        {children}
        {/* <ScrollArea className="h-[calc(100vh-66px)]">{children}</ScrollArea> */}
      </ResizablePanel>
    );
  };
  const renderChildren = () => {
    if (Array.isArray(children)) {
      return children.map((child, index) => {
        return (
          <>
            <ResizableHandle withHandle />
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
    <>
      <Tabs defaultValue="list">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={18} minSize={18} maxSize={18}>
            {menuItems.map((item) => (
              <BeneficiaryNavView
                key={item.title}
                title={item.title}
                items={item.children}
                item={item}
              />
            ))}
          </ResizablePanel>
          {renderChildren()}
        </ResizablePanelGroup>
      </Tabs>
    </>
  );
};

export default BeneficiaryLayout;

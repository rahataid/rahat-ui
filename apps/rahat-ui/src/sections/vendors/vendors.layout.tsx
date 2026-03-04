'use client';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@rahat-ui/shadcn/src/components/ui/resizable';
// import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { FC, Fragment } from 'react';
import { NavItem } from './nav-items.types';
import VendorsNavView from './vendors.nav.view';

type VendorsLayoutProps = {
  children: React.ReactNode | React.ReactNode[];
  menuItems?: NavItem[];
};

const VendorsLayout: FC<VendorsLayoutProps> = ({ children, menuItems }) => {
  const renderResizablePanel = (children: React.ReactNode, index?: number) => {
    const defaultSize = index === 1 ? 30 : 70;

    return (
      <ResizablePanel minSize={30} defaultSize={defaultSize} key={index}>
        {children}
        {/* <ScrollArea className="h-[calc(100vh-66px)]">{children}</ScrollArea> */}
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
        {/* <ResizablePanel defaultSize={20} minSize={20} maxSize={20}>
          {menuItems.map((item) => (
            <VendorsNavView
              key={item.title}
              title={item.title}
              items={item.children}
            />
          ))}
        </ResizablePanel> */}
        {renderChildren()}
      </ResizablePanelGroup>
    </>
  );
};

export default VendorsLayout;

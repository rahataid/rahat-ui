'use client';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@rahat-ui/shadcn/src/components/ui/resizable';
import { FC } from 'react';
import { NavItem } from './nav-items.types';
import CommunicationNavView from './communications.nav.view';

type CommunicationLayoutProps = {
  children: React.ReactNode | React.ReactNode[];
  menuItems: NavItem[];
};

const CommunicationLayout: FC<CommunicationLayoutProps> = ({
  children,
  menuItems,
}) => {
  const renderResizablePanel = (children: React.ReactNode, index?: number) => {
    return <ResizablePanel key={index}>{children}</ResizablePanel>;
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
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel minSize={20} defaultSize={20} maxSize={20}>
        {menuItems.map((item) => (
          <CommunicationNavView
            key={item.title}
            title={item.title}
            items={item.children}
          />
        ))}
      </ResizablePanel>
      {renderChildren()}
    </ResizablePanelGroup>
  );
};

export default CommunicationLayout;

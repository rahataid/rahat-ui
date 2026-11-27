'use client';

import { Separator } from '@rahat-ui/shadcn/components/separator';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@rahat-ui/shadcn/src/components/ui/resizable';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { Tabs } from '@rahat-ui/shadcn/src/components/ui/tabs';
import { useUserGlobalAbilities } from 'apps/rahat-ui/src/hooks/useUserGlobalAbilities';
import { FC } from 'react';
import { NavItem } from './nav-items.types';
import SettingFieldDefinitionNavView from './settingfieldDefinition.nav.view';

type SettingFieldDefinitionLayoutProps = {
  children: React.ReactNode | React.ReactNode[];
  menuItems: NavItem[];
};

const SettingFieldDefinitionLayout: FC<SettingFieldDefinitionLayoutProps> = ({
  children,
  menuItems,
}) => {
  const { ability, isLoading } = useUserGlobalAbilities();

  const canSeeItem = (item: NavItem) =>
    !item.action || !item.subject || ability.can(item.action, item.subject);

  const hasVisibleItems = menuItems.some((group) =>
    group.children?.some(
      (child) => canSeeItem(child) || child.children?.some(canSeeItem),
    ),
  );

  const renderResizablePanel = (children: React.ReactNode, index?: number) => {
    return (
      <ResizablePanel key={index}>
        <ScrollArea className="h-[calc(100vh-66px)]">{children}</ScrollArea>
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

  if (!isLoading && !hasVisibleItems) {
    return (
      <div>
        <Tabs defaultValue="grid">
          <ResizablePanelGroup
            direction="horizontal"
            className="h-[calc(100vh-66px)] border"
          >
            {renderResizablePanel(children)}
          </ResizablePanelGroup>
        </Tabs>
      </div>
    );
  }

  return (
    <div>
      <Tabs defaultValue="grid">
        <ResizablePanelGroup
          direction="horizontal"
          className="h-[calc(100vh-66px)] border"
        >
          <ResizablePanel
            defaultSize={20}
            minSize={20}
            maxSize={20}
            className="h-full"
          >
            {menuItems.map((item) => (
              <SettingFieldDefinitionNavView
                key={item.title}
                title={item.title}
                items={item.children}
              />
            ))}
            <Separator />
          </ResizablePanel>
          {renderChildren()}
        </ResizablePanelGroup>
      </Tabs>
    </div>
  );
};

export default SettingFieldDefinitionLayout;

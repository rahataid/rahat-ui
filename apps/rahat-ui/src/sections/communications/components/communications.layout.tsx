'use client';

import { Separator } from '@rahat-ui/shadcn/components/separator';
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from '@rahat-ui/shadcn/src/components/ui/resizable';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { Tabs } from '@rahat-ui/shadcn/src/components/ui/tabs';
import { FC } from 'react';
import { NavItem } from './nav-items.types';
import CommunicationNavView from './communications.nav.view';

type CommunicationLayoutProps = {
    children: React.ReactNode | React.ReactNode[];
    menuItems: NavItem[];
};

const CommunicationLayout: FC<CommunicationLayoutProps> = ({ children, menuItems }) => {
    const renderResizablePanel = (children: React.ReactNode, index?: number) => {
        return (
            <ResizablePanel defaultSize={80} key={index}>
                <ScrollArea className="h-[calc(100vh-66px)]">{children}</ScrollArea>
            </ResizablePanel>
        );
    };
    const renderChildren = () => {
        if (Array.isArray(children)) {
            return children.map((child, index) => {
                return renderResizablePanel(child, index);
            });
        }
        return renderResizablePanel(children);
    };
    return (
        <div>
            <Tabs defaultValue="grid">
                <ResizablePanelGroup
                    direction="horizontal"
                    className="min-h-max border"
                >
                    <ResizablePanel
                        minSize={20}
                        defaultSize={20}
                        maxSize={20}
                        className="h-full"
                    >
                        {menuItems.map((item) => (
                            <CommunicationNavView
                                key={item.title}
                                title={item.title}
                                items={item.children}
                            />
                        ))}
                        <Separator />
                    </ResizablePanel>
                    <ResizableHandle />
                    {renderChildren()}
                </ResizablePanelGroup>
            </Tabs>
        </div>
    );
};

export default CommunicationLayout;

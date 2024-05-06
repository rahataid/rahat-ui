'use client';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@rahat-ui/shadcn/src/components/ui/resizable';
import { FC } from 'react';
import ProjectNavView from './project.nav.view';
import { useProjectNavItems } from './useProjectNavItems';
import { ProjectType } from './nav-items.types';
import Image from 'next/image';
import { useTheme } from 'next-themes';

type ProjectLayoutProps = {
  children: React.ReactNode | React.ReactNode[];
  projectType: ProjectType;
};

const ProjectLayout: FC<ProjectLayoutProps> = ({ children, projectType }) => {
  const { navItems: menuItems } = useProjectNavItems(projectType);
  const theme = useTheme();
  const renderResizablePanel = (children: React.ReactNode, index?: number) => {
    return (
      <ResizablePanel minSize={40} key={index}>
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
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={18} minSize={18} maxSize={18}>
          {menuItems.map((item) => (
            <ProjectNavView
              key={item.title}
              title={item.title}
              items={item.children}
            />
          ))}
          <div className="fixed bottom-2 left-0 right-0  px-6">
            <Image
              src="/el/el_logo_dark.png"
              alt="Dark Logo"
              height={150}
              width={200}
            />
            {/* {theme?.theme === 'light' ? (
              <Image
                src="/el/el_logo_light.png"
                alt="Light Logo"
                height={150}
                width={200}
              />
            ) : (
              theme?.theme === 'dark' && (
                <Image
                  src="/el/el_logo_dark.png"
                  alt="Dark Logo"
                  height={150}
                  width={200}
                />
              )
            )} */}
          </div>
        </ResizablePanel>
        {renderChildren()}
      </ResizablePanelGroup>
    </>
  );
};

export default ProjectLayout;

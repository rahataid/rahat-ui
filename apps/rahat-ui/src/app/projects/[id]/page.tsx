'use client';

import { useState, useCallback } from 'react';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@rahat-ui/shadcn/components/resizable';
import { Tabs } from '@rahat-ui/shadcn/components/tabs';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import ProjectDetailsNav from '../../../sections/projects/prjectDetailsNav';
import ProjectDetails from './projectDetails';
import { PROJECT_DETAIL_NAV_ROUTE } from 'apps/rahat-ui/src/constants/project.detail.const';
import EditProject from 'apps/rahat-ui/src/sections/projects/editProject';

export default function ProjectPage() {
  const [active, setActive] = useState<string>(
    PROJECT_DETAIL_NAV_ROUTE.DEFAULT
  );

  const handleNav = useCallback((item: string) => {
    setActive(item);
  }, []);
  return (
    <div className="mb-5">
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
            <ProjectDetailsNav
              title={'Project Details'}
              handleNav={handleNav}
            />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel>
            {active === PROJECT_DETAIL_NAV_ROUTE.DEFAULT && (
              <ScrollArea className="h-custom">
                <ProjectDetails />
              </ScrollArea>
            )}
            {active === PROJECT_DETAIL_NAV_ROUTE.EDIT && (
              <EditProject handleGoBack={handleNav} />
            )}
          </ResizablePanel>
        </ResizablePanelGroup>
      </Tabs>
    </div>
  );
}

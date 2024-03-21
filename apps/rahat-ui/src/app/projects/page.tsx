'use client';
import { Tabs } from '@rahat-ui/shadcn/components//tabs';
import { Button } from '@rahat-ui/shadcn/components/button';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@rahat-ui/shadcn/components/resizable';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { PlusCircle, Search } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { PROJECT_NAV_ROUTE } from '../../constants/project.const';
import { AddProject, ProjectCard, ProjectNav } from '../../sections/projects';
import projectsData from './projectsData.json';
import { useRumsanService } from '../../providers/service.provider';

export default function ProjectPage() {
  const [active, setActive] = useState<string>(PROJECT_NAV_ROUTE.DEFAULT);
  const [projectType, setProjectType] = useState<string>('');
  const itemsPerPage = 12;
  const [currentPage, setCurrentPage] = useState(1);
  const [projectData, setProjectData] = useState<any>();

  const { projectQuery } = useRumsanService();
  const projectsList = projectQuery.useProjectList({});

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const selectedProjectType = []?.filter((item) => item.badge === projectType);

  console.log(projectsList?.data?.data);

  const selectedProject = projectType.length
    ? selectedProjectType
    : projectsList?.data?.data;

  const handlePaginationClick = (page: number) => {
    setCurrentPage(page);
  };

  const handleNav = useCallback((item: string) => {
    setActive(item);
  }, []);

  return (
    <div>
      <Tabs defaultValue="grid">
        <div className="flex items-center justify-between"></div>
        <ResizablePanelGroup direction="horizontal" className="min-h-max">
          <ResizablePanel
            minSize={20}
            defaultSize={20}
            maxSize={20}
            className="h-full"
          >
            <ProjectNav
              title="Projects"
              handleNav={handleNav}
              setProjectType={setProjectType}
            />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel className="bg-secondary">
            {active === PROJECT_NAV_ROUTE.DEFAULT && (
              <>
                <div className="p-3">
                  <div className="flex relative w-full">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search" className="pl-8 rounded mr-2" />
                    {/* <Button
                      variant="default"
                      className="ml-auto bg-primary w-40"
                      onClick={() => handleNav(PROJECT_NAV_ROUTE.ADD)}
                    >
                      <PlusCircle className="mr-2 w-5" />
                      Add Project
                    </Button> */}
                  </div>
                </div>
                <ScrollArea className="px-3 h-withPage">
                  <div className="grid grid-cols-3 gap-6">
                    {selectedProject?.map((project) => (
                      <ProjectCard
                        id={project.id}
                        key={project.id}
                        title={project.title}
                        image={project.image}
                        subTitle={project.subTitle}
                        badge={project.badge}
                      />
                    ))}
                  </div>
                </ScrollArea>
                {/* <CustomPagination
              currentPage={currentPage}
              totalPages={totalPages}
              handlePaginationClick={handlePaginationClick}
            /> */}
              </>
            )}
            {active === PROJECT_NAV_ROUTE.ADD && (
              <AddProject handleGoBack={handleNav} />
            )}
          </ResizablePanel>
        </ResizablePanelGroup>
      </Tabs>
    </div>
  );
}

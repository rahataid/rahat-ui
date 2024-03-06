'use client';
import { Tabs } from '@rahat-ui/shadcn/components//tabs';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@rahat-ui/shadcn/components/resizable';
import { Button } from '@rahat-ui/shadcn/components/button';
import ProjectNav from '../../sections/projects/nav';
import ProjectCards from '../../sections/projects/projectCard';
import projectsData from './projectsData.json';
import { useCallback, useState } from 'react';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import CustomPagination from '../../components/customPagination';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { PiIcon, PlusCircle, Search, Settings2 } from 'lucide-react';
import { PROJECT_NAV_ROUTE } from '../../constants/project.const';
import AddProject from '../../sections/projects/addProject';

interface CardProps {
  id: number;
  title: string;
  subTitle: string;
  image: string;
  handleClick: VoidFunction;
}

export default function ProjectPage({ handleClick }: CardProps) {
  const [active, setActive] = useState<string>(PROJECT_NAV_ROUTE.DEFAULT);
  const itemsPerPage = 12;
  const [currentPage, setCurrentPage] = useState(1);

  const totalItems = projectsData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedItems = projectsData.slice(startIndex, endIndex);

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
            <ProjectNav title="Projects" />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel className="bg-secondary">
            {active === PROJECT_NAV_ROUTE.DEFAULT && (
              <>
                <div className="p-3">
                  <div className="flex relative w-full">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search" className="pl-8 rounded mr-2" />
                    <Button
                      variant="default"
                      className="ml-auto bg-primary w-40"
                      onClick={() => handleNav(PROJECT_NAV_ROUTE.ADD)}
                    >
                      <PlusCircle className="mr-2 w-5" />
                      Add Project
                    </Button>
                  </div>
                </div>
                <ScrollArea className="px-3 h-withPage">
                  <div className="grid grid-cols-3 gap-6">
                    {displayedItems.map((project) => (
                      <ProjectCards
                        id={project.id}
                        key={project.id}
                        title={project.title}
                        image={project.image}
                        subTitle={project.subTitle}
                        handleClick={handleClick}
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

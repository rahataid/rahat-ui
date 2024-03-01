'use client';
import { Tabs } from '@rahat-ui/shadcn/components//tabs';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@rahat-ui/shadcn/components/resizable';
import ProjectNav from '../../sections/projects/nav';
import ProjectCards from '../../sections/projects/projectCard';
import projectsData from './projectsData.json';
import { useState } from 'react';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import CustomPagination from '../../components/customPagination';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Search } from 'lucide-react';

interface CardProps {
  id: number;
  title: string;
  subTitle: string;
  image: string;
  handleClick: VoidFunction;
}

export default function ProjectPage({ handleClick }: CardProps) {
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
          <ResizablePanel>
            <div className='p-4'>
              <div className="relative w-full">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search" className="pl-8 rounded" />
              </div>
            </div>
            <ScrollArea className="px-4 h-withPage bg-slate-50">
              <div className="grid grid-cols-3 gap-4">
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
          </ResizablePanel>
        </ResizablePanelGroup>
      </Tabs>
    </div>
  );
}

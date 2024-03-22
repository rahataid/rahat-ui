'use client';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { Search } from 'lucide-react';
import { useRumsanService } from '../../providers/service.provider';
import { ProjectCard } from '../../sections/projects';
import Filters from './filter';

export default function ProjectListView() {
  const { projectQuery } = useRumsanService();
  const projectsList = projectQuery.useProjectList({});

  return (
    <div>
      <div className="p-3">
        <Filters />
      </div>
      <ScrollArea className="px-3 h-withPage">
        <div className="grid grid-cols-3 gap-6">
          {projectsList?.data?.data?.map((project: any) => (
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
    </div>
  );
}

'use client';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { useRumsanService } from '../../providers/service.provider';
import { ProjectCard } from '../../sections/projects';
import Filters from './filter';

export default function ProjectListView() {
  const { projectQuery } = useRumsanService();
  const projectsList = projectQuery.useProjectList({});

  return (
    <div className="bg-secondary">
      <div className="p-2">
        <Filters />
      </div>
      <ScrollArea className="px-2 h-withPage">
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

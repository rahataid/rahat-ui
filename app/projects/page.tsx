'use client';

import ProjectCard from '@/components/projectCard';
import { Input } from '@/components/ui/input';
import { ResizablePanel } from '@/components/ui/resizable';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

const cardData = [
  { id: 1, title: 'Project 1', subTile: 'subTitle' },
  { id: 2, title: 'Project 2', subTile: 'subTitle' },
  { id: 3, title: 'Project 3', subTile: 'subTitle' },
];

export default function ProjectPage() {
  const route = useRouter();

  const handleProjectCardClick = (id: number) => {
    route.push(`/projects/${id}`);
  };

  return (
    <>
      {/* <ResizablePanel minSize={30}> */}
      <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <form>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search projects" className="pl-8" />
          </div>
        </form>
        <div className="mt-10 flex gap-4">
          {cardData.map((item) => (
            <ProjectCard
              key={item.title}
              title={item.title}
              subTitle={item.subTile}
              handleClick={() => handleProjectCardClick(item.id)}
            />
          ))}
        </div>
      </div>
      {/* </ResizablePanel> */}
    </>
  );
}

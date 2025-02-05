// import { useProjectStore } from '@rahat-ui/query';
import React from 'react';
import CommsProjectDetails from './detail';
import { useProjectStore } from 'libs/query/src';
import { ScrollArea } from 'libs/shadcn/src/components/ui/scroll-area';
// import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';

export default function MainView() {
  const project = useProjectStore((state) => state.singleProject);

  return (
    <>
      <div className="p-2 bg-secondary">
        <ScrollArea className="h-[calc(100vh-80px)]">
          <CommsProjectDetails project={project ? project : {}} />
        </ScrollArea>
      </div>
    </>
  );
}

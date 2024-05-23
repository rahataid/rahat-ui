import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import ProjectDetails from './project.detail';

const ProjectMainView = () => {
  return (
    <>
      <div className="p-2 bg-secondary">
        <ScrollArea className="h-[calc(100vh-80px)]">
          <ProjectDetails />
        </ScrollArea>
      </div>
    </>
  );
};

export default ProjectMainView;

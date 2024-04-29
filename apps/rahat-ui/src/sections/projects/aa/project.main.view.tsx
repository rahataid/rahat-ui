import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import ProjectDetails from './project.detail';

const ProjectMainView = () => {
  return (
    <>
      <ScrollArea className="h-[calc(100vh-65px)]">
        <ProjectDetails />
      </ScrollArea>
    </>
  );
};

export default ProjectMainView;

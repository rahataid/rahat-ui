import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import { useRumsanService } from 'apps/rahat-ui/src/providers/service.provider';
import { FC } from 'react';

interface ProjectAssignModal {
  handleModal: () => void;
  handleSubmit: () => void;
  open: boolean;
}

const ProjectAssign: FC<ProjectAssignModal> = ({
  handleModal,
  handleSubmit,
  open,
}) => {
  const { projectQuery } = useRumsanService();
  const projectsList = projectQuery.useProjectList({});
  const d = projectsList.data;
  const projectList = d?.data || [];

  const handleProjectChange = (d: string) => {
    console.log('D==>', d);
  };

  return (
    <div className="py-2 w-full border-t">
      <div className="p-4 flex flex-col gap-0.5 text-sm">
        <Dialog open={open} onOpenChange={handleModal}>
          <DialogTrigger className=" hover:bg-muted p-1 rounded text-left">
            Assign Projects
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign Project</DialogTitle>
              <DialogDescription>
                Select the project to be assigned to the beneficiary
              </DialogDescription>
            </DialogHeader>
            <div>
              <Select onValueChange={handleProjectChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Projects" />
                </SelectTrigger>
                <SelectContent>
                  {projectList.length > 0 &&
                    projectList.map((project: any) => {
                      return (
                        <SelectItem key={project.id} value={project.id}>
                          {project.title}
                        </SelectItem>
                      );
                    })}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter className="sm:justify-end">
              <DialogClose asChild>
                <Button type="button" variant="ghost">
                  Close
                </Button>
              </DialogClose>
              <Button
                onClick={() => handleSubmit()}
                variant="ghost"
                className="text-primary"
              >
                Assign
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ProjectAssign;

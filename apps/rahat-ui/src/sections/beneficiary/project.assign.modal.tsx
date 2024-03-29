import { useProjectList } from '@rahat-ui/query';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import { FC } from 'react';

interface ProjectAssignModal {
  handleModal: () => void;
  handleSubmit: () => void;
  setId: (id: string) => void;
  open: boolean;
}

const ProjectAssign: FC<ProjectAssignModal> = ({
  handleModal,
  handleSubmit,
  setId,
  open,
}) => {
  const projectsList = useProjectList({});

  const handleProjectChange = (id: string) => {
    console.log('ID==>', id);
    setId(id);
  };

  return (
    <div className="py-2 w-full border-t">
      <div className="p-4 flex flex-col gap-0.5 text-sm">
        <Dialog open={open} onOpenChange={handleModal}>
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
                  {projectsList.data?.data.length &&
                    projectsList.data.data.map((project) => {
                      return (
                        <SelectItem key={project.uuid} value={project.uuid}>
                          {project.name}
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

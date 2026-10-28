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
import { useTranslations } from 'next-intl';

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
  const t = useTranslations('GLOBAL');

  const handleProjectChange = (id: string) => {
    setId(id);
  };

  return (
    <Dialog open={open} onOpenChange={handleModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('ASSIGN_PROJECT')}</DialogTitle>
          <DialogDescription>
            {t('SELECT_THE_PROJECT_TO_BE_ASSIGNED')}
          </DialogDescription>
        </DialogHeader>
        <div>
          <Select onValueChange={handleProjectChange}>
            <SelectTrigger>
              <SelectValue placeholder={t('PROJECTS')} />
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
              {t('CLOSE')}
            </Button>
          </DialogClose>
          <Button
            onClick={() => handleSubmit()}
            variant="ghost"
            className="text-primary"
          >
            {t('ASSIGN')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectAssign;

'use client';

import { useProjectList } from '@rahat-ui/query';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@rahat-ui/shadcn/components/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/components/select';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { UUID } from 'crypto';
import * as React from 'react';

type ProjectModalType = {
  value: boolean;
  onToggle: () => void;
};

type IProps = {
  selectedBeneficiaries: any;
  projectModal: ProjectModalType;
  handleSubmit: (selectedProject: string) => void;
};

export default function BulkAssignToProjectModal({
  projectModal,
  handleSubmit,
  selectedBeneficiaries,
}: IProps) {
  const [selectedProject, setSelectedProject] = React.useState<UUID>();
  const projectsList = useProjectList({});

  const handleProjectChange = (d: UUID) => setSelectedProject(d);

  const handleAssignProject = async () => {
    if (!selectedProject) return alert('Please select a project');
    handleSubmit(selectedProject);
  };

  return (
    <Dialog open={projectModal.value} onOpenChange={projectModal.onToggle}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Project</DialogTitle>
          <DialogDescription>
            Select the project to be assigned to the{' '}
            {selectedBeneficiaries.length > 1 ? 'beneficiaries' : 'beneficiary'}
          </DialogDescription>
        </DialogHeader>
        <div>
          <Select onValueChange={handleProjectChange}>
            <SelectTrigger>
              <SelectValue placeholder="Projects" />
            </SelectTrigger>
            <SelectContent>
              {projectsList.data?.data.length &&
                projectsList.data?.data.map((project) => {
                  return (
                    <SelectItem
                      key={project.uuid}
                      disabled={project.type === 'aa'}
                      value={project.uuid}
                    >
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
          <DialogClose asChild>
            <Button
              onClick={handleAssignProject}
              type="button"
              variant="ghost"
              className="text-primary"
            >
              Assign
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

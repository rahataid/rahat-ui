'use client';

import * as React from 'react';
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
import { useRumsanService } from 'apps/rahat-ui/src/providers/service.provider';
import { MS_ACTIONS } from '@rahataid/sdk';
import { useProjectAction } from '../../../../../../libs/query/src/lib/projects/projects';

type ProjectModalType = {
  value: boolean;
  onToggle: () => void;
};

type IProps = {
  beneficiaryDetail: any;
  projectModal: ProjectModalType;
};

export default function AssignToProjectModal({
  beneficiaryDetail,
  projectModal,
}: IProps) {
  const addBeneficiary = useProjectAction();
  const { projectQuery } = useRumsanService();
  const projectsList = projectQuery.useProjectList({});
  const d = projectsList.data;
  const projectList = d?.data || [];

  const [selectedProject, setSelectedProject] = React.useState('');

  const handleProjectChange = (d: string) => setSelectedProject(d);

  const handleAssignProject = async () => {
    if (!selectedProject) return alert('Please select a project');
    const result = await addBeneficiary.mutateAsync({
      uuid: selectedProject,
      data: {
        action: MS_ACTIONS.BENEFICIARY.ASSGIN_TO_PROJECT,
        payload: {
          beneficiaryId: beneficiaryDetail?.uuid,
        },
      },
    });
  };

  return (
    <Dialog open={projectModal.value} onOpenChange={projectModal.onToggle}>
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
            onClick={handleAssignProject}
            type="button"
            variant="ghost"
            className="text-primary"
          >
            Assign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

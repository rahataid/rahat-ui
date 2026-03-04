'use client';

import { useAssignBenGroupToProject, useProjectList } from '@rahat-ui/query';
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
import { ListBeneficiaryGroup } from '@rahat-ui/types';
import { UUID } from 'crypto';
import * as React from 'react';

type ProjectModalType = {
  value: boolean;
  onToggle: () => void;
  onFalse: () => void;
};

type IProps = {
  beneficiaryGroupDetail: ListBeneficiaryGroup;
  projectModal: ProjectModalType;
  closeSecondPanel?: VoidFunction;
  assignedGroupId: string[];
};

export default function AssignBeneficiaryToProjectModal({
  projectModal,
  beneficiaryGroupDetail,
  closeSecondPanel,
  assignedGroupId,
}: IProps) {
  const assignBeneficiaryGroup = useAssignBenGroupToProject();
  const projectsList = useProjectList({ page: 1, perPage: 10 });

  const [selectedProject, setSelectedProject] = React.useState<UUID>();

  const handleProjectChange = (d: UUID) => setSelectedProject(d);

  const handleAssignProject = async () => {
    if (!selectedProject) return alert('Please select a project');
    await assignBeneficiaryGroup.mutateAsync({
      projectUUID: selectedProject,
      beneficiaryGroupUUID: beneficiaryGroupDetail.uuid as UUID,
    });
    projectModal.onFalse();
  };

  // React.useEffect(() => {
  //   if (assignBeneficiaryGroup.isSuccess) {
  //     projectModal.onFalse();
  //     closeSecondPanel();
  //   }
  // }, [assignBeneficiaryGroup.isSuccess]);
  return (
    <Dialog open={projectModal.value} onOpenChange={projectModal.onToggle}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Project</DialogTitle>
          <DialogDescription>
            Select the project to be assigned to the beneficiary group
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
                  const projectType = project.type?.toLowerCase();
                  const projectAACriteria =
                    projectType === 'aa'
                      ? !beneficiaryGroupDetail?.isGroupValidForAA
                      : false;
                  return (
                    <SelectItem
                      disabled={
                        assignedGroupId?.includes(project?.id) ||
                        projectAACriteria
                      }
                      key={project.uuid}
                      value={project.uuid as UUID}
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
          <Button
            disabled={assignBeneficiaryGroup.isPending}
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

'use client';

import { useAssignBenToProject, useProjectList } from '@rahat-ui/query';
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
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import { UUID } from 'crypto';
import * as React from 'react';

type ProjectModalType = {
  value: boolean;
  onToggle: () => void;
  onFalse: () => void;
};

type IProps = {
  beneficiaryDetail: any;
  projectModal: ProjectModalType;
};

export default function AssignToProjectModal({
  beneficiaryDetail,
  projectModal,
}: IProps) {
  // console.log("beneficiary detail", beneficiaryDetail)

  const assignBeneficiary = useAssignBenToProject();
  const projectsList = useProjectList({ page: 1, perPage: 100 });

  const [selectedProject, setSelectedProject] = React.useState<UUID>();

  const handleProjectChange = (d: UUID) => {
    setSelectedProject(d);
  };

  const handleAssignProject = async () => {
    if (!selectedProject) return alert('Please select a project');
    await assignBeneficiary.mutateAsync({
      beneficiaryUUID: beneficiaryDetail?.uuid,
      projectUUID: selectedProject,
    });
    // await addBeneficiary.mutateAsync({
    //   uuid: selectedProject,
    //   data: {
    //     action: MS_ACTIONS.BENEFICIARY.ASSGIN_TO_PROJECT,
    //     payload: {
    //       beneficiaryId: beneficiaryDetail?.uuid,
    //     },
    //   },
    // });
  };

  const checkProjectAlreadyAssigned = (projectUUID: string): boolean => {
    const isAssigned = beneficiaryDetail?.BeneficiaryProject?.some(
      (p: any) => p?.projectId === projectUUID,
    );
    return isAssigned ?? false;
  };

  React.useEffect(() => {
    assignBeneficiary.isSuccess && projectModal.onFalse();
  }, [assignBeneficiary]);

  return (
    <Dialog open={projectModal.value} onOpenChange={projectModal.onToggle}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Project</DialogTitle>
          <DialogDescription>
            Select a project to assign the selected beneficiary
          </DialogDescription>
        </DialogHeader>
        <div>
          <Label>Project</Label>
          <Select onValueChange={handleProjectChange}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Projects" />
            </SelectTrigger>
            <SelectContent>
              {projectsList.data?.data.length &&
                projectsList.data?.data.map((project) => {
                  return (
                    <SelectItem
                      key={project.uuid}
                      value={project.uuid as string}
                      disabled={checkProjectAlreadyAssigned(
                        project?.uuid as string,
                      )}
                    >
                      {project.name}
                    </SelectItem>
                  );
                })}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button className="w-full" type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button
            onClick={handleAssignProject}
            type="button"
            className="w-full"
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

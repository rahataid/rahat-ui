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
import { useTranslations } from 'next-intl';

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
  const t = useTranslations('Beneficiary Detail');
  const tg = useTranslations('GLOBAL');

  const assignBeneficiary = useAssignBenToProject();
  const projectsList = useProjectList({ page: 1, perPage: 100 });

  const [selectedProject, setSelectedProject] = React.useState<UUID>();

  const handleProjectChange = (d: UUID) => {
    setSelectedProject(d);
  };

  const handleAssignProject = async () => {
    if (!selectedProject) return alert(tg('PLEASE_SELECT_PROJECT'));
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
          <DialogTitle>{t('ASSIGN_TO_PROJECT')}</DialogTitle>
          <DialogDescription>
            {t('SELECT_A_PROJECT_TO_ASSIGN_THE')}
          </DialogDescription>
        </DialogHeader>
        <div>
          <Label>{t('PROJECT')}</Label>
          <Select onValueChange={handleProjectChange}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder={tg('PROJECTS')} />
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
              {tg('CLOSE')}
            </Button>
          </DialogClose>
          <Button
            onClick={handleAssignProject}
            type="button"
            className="w-full"
          >
            {tg('CONFIRM')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

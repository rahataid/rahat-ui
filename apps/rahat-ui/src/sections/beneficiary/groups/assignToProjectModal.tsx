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
import { Loader2 } from 'lucide-react';
import * as React from 'react';
import { useTranslations } from 'next-intl';

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
  const t = useTranslations('GLOBAL');

  const [selectedProject, setSelectedProject] = React.useState<UUID>();

  const handleProjectChange = (d: UUID) => setSelectedProject(d);

  const [isAssigning, setIsAssigning] = React.useState(false);

  const handleAssignProject = async () => {
    if (!selectedProject) return alert(t('PLEASE_SELECT_A_PROJECT'));
    setIsAssigning(true);
    try {
      await assignBeneficiaryGroup.mutateAsync({
        projectUUID: selectedProject,
        beneficiaryGroupUUID: beneficiaryGroupDetail.uuid as UUID,
      });
      projectModal.onFalse();
    } catch {
      // error toast handled in useAssignBenGroupToProject onError
    } finally {
      setIsAssigning(false);
    }
  };

  // React.useEffect(() => {
  //   if (assignBeneficiaryGroup.isSuccess) {
  //     projectModal.onFalse();
  //     closeSecondPanel();
  //   }
  // }, [assignBeneficiaryGroup.isSuccess]);
  return (
    <Dialog
      open={projectModal.value}
      onOpenChange={() => {
        if (isAssigning) return;
        projectModal.onToggle();
      }}
    >
      <DialogContent>
        {isAssigning && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-lg bg-background/90">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm font-medium text-center px-4">
              {t('ASSIGNING_GROUP_PLEASE_WAIT')}
            </p>
          </div>
        )}
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
              {t('CLOSE')}
            </Button>
          </DialogClose>
          <Button
            disabled={isAssigning}
            onClick={handleAssignProject}
            type="button"
            variant="ghost"
            className="text-primary"
          >
            {t('ASSIGN')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

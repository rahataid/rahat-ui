'use client';
import {
  useAssignBenToProject,
  useBeneficiaryStore,
  useProjectList,
} from '@rahat-ui/query';
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
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
} from '@rahat-ui/shadcn/src/components/ui/card';
import { truncateEthAddress } from '@rumsan/sdk/utils';
import { UUID } from 'crypto';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { useBoolean } from '../../hooks/use-boolean';
import AssignToProjectModal from './components/assignToProjectModal';
import { useSwal } from '../../components/swal';
import ProjectConfirm from './projects.assign.confirm';
import ProjectAssign from './project.assign.modal';

export default function InfoCards() {
  const addBeneficiary = useAssignBenToProject();
  const projectsList = useProjectList({});

  const data = useBeneficiaryStore((state) => state.singleBeneficiary);
  // const { projectQuery } = useRumsanService();
  const router = useRouter();

  const [selectedProject, setSelectedProject] = React.useState<UUID>();

  const projectModal = useBoolean();

  const projectConfirmModal = useBoolean();
  const projectAssignModal = useBoolean();

  const [selectedRow, setSelectedRow] = React.useState(null) as any;
  const setId = (id: any) => setSelectedRow(id);

  const alert = useSwal();

  const handleProjectChange = (d: UUID) => setSelectedProject(d);

  const handleAssignProject = async () => {
    if (!selectedProject) {
      return;
    }
    await addBeneficiary.mutateAsync({
      beneficiaryUUID: data?.uuid as UUID,
      projectUUID: selectedProject,
    });
  };
  const handleOpenProjectAssignModal = () => {
    projectAssignModal.onToggle();
    projectConfirmModal.onFalse();
  };

  const handleSubmitProjectAssignModal = () => {
    projectAssignModal.onFalse();
    projectConfirmModal.onTrue();
  };

  const handleSubmitConfirmProjectModal = () => {
    handleAssignProject();
    projectConfirmModal.onFalse();
  };
  const handleCloseConfirmProjectModal = () => {
    projectConfirmModal.onFalse();
  };

  const handleAssignModalClick = () => {
    projectModal.onTrue();
  };

  return (
    <>
      <AssignToProjectModal
        beneficiaryDetail={data}
        projectModal={projectModal}
      />
      <div className="p-2 grid grid-cols-3 gap-2">
        <Card className="shadow rounded col-span-2">
          <CardHeader>
            <div className="flex justify-between">
              <div className="flex gap-2 items-center">
                <p className="text-xl font-semibold">
                  {data?.piiData?.name ?? 'Beneficiary Name'}
                </p>
                <Badge variant="outline" className="bg-secondary">
                  Not Approved
                </Badge>
              </div>
              <Button onClick={handleOpenProjectAssignModal}>
                Assign To Project
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between gap-8">
              <div>
                <p>{truncateEthAddress(data?.walletAddress) ?? 'N/A'}</p>
                <p className="text-sm font-normal text-muted-foreground">
                  Wallet Address
                </p>
              </div>
              <div>
                <p>{data?.bankedStatus ?? '-'}</p>
                <p className="text-sm font-normal text-muted-foreground">
                  Bank Status
                </p>
              </div>
              <div>
                <p>{data?.internetStatus ?? '-'}</p>
                <p className="text-sm font-normal text-muted-foreground">
                  Internet Status
                </p>
              </div>
              <div>
                <p>{data?.gender ?? '-'}</p>
                <p className="text-sm font-normal text-muted-foreground">
                  Gender
                </p>
              </div>

              <div>
                <p>{data?.location ?? '-'}</p>
                <p className="text-sm font-normal text-muted-foreground">
                  Location
                </p>
              </div>
              <div>
                <p>{data?.phoneStatus ?? '-'}</p>
                <p className="text-sm font-normal text-muted-foreground">
                  Phone Status
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow rounded">
          <CardHeader>
            <p className="font-mediun text-md">Projects Involved</p>
          </CardHeader>
          <CardContent>
            {data?.BeneficiaryProject?.map((benProject: any) => {
              return (
                <Badge
                  key={benProject.id}
                  variant="outline"
                  color="primary"
                  className="rounded cursor-pointer"
                  onClick={() => {
                    router.push(
                      `/projects/${benProject.Project?.type}/${benProject.Project.uuid}`,
                    );
                  }}
                >
                  {benProject.Project.name ?? 'Projects Name'}
                </Badge>
              );
            })}
          </CardContent>
        </Card>
      </div>
      <ProjectAssign
        open={projectAssignModal.value}
        setId={setId}
        handleModal={handleOpenProjectAssignModal}
        handleSubmit={handleSubmitProjectAssignModal}
      />
      <ProjectConfirm
        open={projectConfirmModal.value}
        handleClose={handleCloseConfirmProjectModal}
        handleSubmit={handleSubmitConfirmProjectModal}
      />
    </>
  );
}

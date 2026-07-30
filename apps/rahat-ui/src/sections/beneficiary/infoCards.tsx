'use client';
import * as React from 'react';
import { useAssignBenToProject, useBeneficiaryStore } from '@rahat-ui/query';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/components/tooltip';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
} from '@rahat-ui/shadcn/src/components/ui/card';
import { truncateEthAddress } from '@rumsan/sdk/utils/string.utils';
import { UUID } from 'crypto';
import { useRouter } from 'next/navigation';
import { useBoolean } from '../../hooks/use-boolean';
import AssignToProjectModal from './components/assignToProjectModal';
import ProjectConfirm from './projects.assign.confirm';
// import ProjectAssign from './project.assign.modal';
import { Copy, CopyCheck } from 'lucide-react';
import ProjectAssign from './project.assign.modal';
import { useTranslations } from 'next-intl';

export default function InfoCards() {
  const t = useTranslations('GLOBAL');
  const addBeneficiary = useAssignBenToProject();

  const data = useBeneficiaryStore((state) => state.singleBeneficiary);
  // const { projectQuery } = useRumsanService();
  const router = useRouter();

  const [selectedProject, setSelectedProject] = React.useState<UUID>();

  const projectModal = useBoolean();

  const projectConfirmModal = useBoolean();
  const projectAssignModal = useBoolean();

  const [selectedRow, setSelectedRow] = React.useState(null) as any;
  const setId = (id: any) => setSelectedRow(id);
  const [walletAddressCopied, setWALLETAddressCopied] =
    React.useState<boolean>(false);

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

  const clickToCopy = (walletAddress: string) => {
    navigator.clipboard.writeText(walletAddress);
    setWALLETAddressCopied(true);
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
                  {data?.piiData?.name ?? t('BENEFICIARY_NAME')}
                </p>
                <Badge>{t('ACTIVE')}</Badge>
              </div>
              <Button onClick={handleOpenProjectAssignModal}>
                {t('ASSIGN_TO_PROJECT')}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between gap-8">
              <div>
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger
                      className="flex gap-3 items-center"
                      onClick={() => clickToCopy(data?.walletAddress || '')}
                    >
                      <p className="text-base">
                        {truncateEthAddress(data?.walletAddress || '-')}
                      </p>
                      {walletAddressCopied ? (
                        <CopyCheck size={15} strokeWidth={1.5} />
                      ) : (
                        <Copy
                          className="text-muted-foreground"
                          size={15}
                          strokeWidth={1.5}
                        />
                      )}
                    </TooltipTrigger>
                    <TooltipContent className="bg-secondary" side="bottom">
                      <p className="text-xs font-medium">
                        {walletAddressCopied ? t('COPIED') : t('CLICK_TO_COPY')}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <p className="text-sm font-normal text-muted-foreground">
                  {t('WALLET_ADDRESS')}
                </p>
              </div>
              <div>
                <p>{data?.bankedStatus ?? '-'}</p>
                <p className="text-sm font-normal text-muted-foreground">
                  {t('BANKING_STATUS')}
                </p>
              </div>
              <div>
                <p>{data?.internetStatus ?? '-'}</p>
                <p className="text-sm font-normal text-muted-foreground">
                  {t('INTERNET_STATUS')}
                </p>
              </div>
              <div>
                <p>{data?.gender ?? '-'}</p>
                <p className="text-sm font-normal text-muted-foreground">
                  {t('GENDER')}
                </p>
              </div>

              <div>
                <p>{data?.location ?? '-'}</p>
                <p className="text-sm font-normal text-muted-foreground">
                  {t('LOCATION')}
                </p>
              </div>
              <div>
                <p>{data?.phoneStatus ?? '-'}</p>
                <p className="text-sm font-normal text-muted-foreground">
                  {t('PHONE_STATUS')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow rounded">
          <CardHeader>
            <p className="font-mediun text-md">{t('PROJECTS_INVOLVED')}</p>
          </CardHeader>
          <CardContent>
            {data?.BeneficiaryProject?.length ? (
              data?.BeneficiaryProject?.map((benProject: any) => {
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
                    {benProject.Project.name}
                  </Badge>
                );
              })
            ) : (
              <p className="text-sm text-muted-foreground">
                {t('NO_PROJECTS_INVOLVED')}
              </p>
            )}
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

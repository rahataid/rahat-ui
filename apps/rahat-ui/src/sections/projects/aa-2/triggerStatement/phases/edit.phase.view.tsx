import { useTranslations } from 'next-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  PROJECT_SETTINGS_KEYS,
  useDeletePhase,
  usePhases,
  useProjectInfo,
  useProjectSettingsStore,
  useProjectSettingsGet,
  useSinglePhase,
  useUpdatePhase,
} from '@rahat-ui/query';
import { Option } from '@rahat-ui/shadcn/src/components/custom/multi-select';
import { PhaseForm } from './PhaseForm';
import { Back, Heading, TableLoader } from 'apps/rahat-ui/src/common';
import ConfirmationDialog from 'apps/rahat-ui/src/common/confirmationDialog';
import { useBoolean } from 'apps/rahat-ui/src/hooks/use-boolean';
import { Trash } from 'lucide-react';
import { DialogComponent } from 'apps/rahat-ui/src/sections/projects/aa-2/activities/details/dialog.reuse';
import { UUID } from 'crypto';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  AddPhaseFormInputValues,
  AddPhaseFormValues,
  buildAddPhaseSchema,
  getAddPhaseDefaultValues,
} from './phase.schema';
import TooltipWrapper from 'apps/rahat-ui/src/components/tooltip.wrapper';
import { getStationTitle } from 'apps/rahat-ui/src/utils/getStationTitle';

export default function EditPhaseView() {
  const t = useTranslations('AA_PROJECT');
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as UUID;
  const phaseId = params.phaseId as UUID;
  const searchParams = useSearchParams();

  const updatePhase = useUpdatePhase();
  const deletePhase = useDeletePhase();
  const [isDeleted, setIsDeleted] = useState(false);
  const editPhaseConfirmDialog = useBoolean(false);
  const navigation = searchParams.get('from');
  const tab = searchParams.get('tab') ?? '';
  const { data: phasesData = [] } = usePhases(projectId);

  const { settings } = useProjectSettingsStore((state) => ({
    settings: state.settings,
  }));

  const { data: phase, isLoading } = useSinglePhase(projectId, phaseId, {
    enabled: !isDeleted,
  });
  const riverBasin =
    settings?.[projectId]?.[PROJECT_SETTINGS_KEYS.PROJECT_INFO]?.[
      'river_basin'
    ];
  const { data: projectInfo, isLoading: isProjectInfoLoading } = useProjectInfo(
    projectId as UUID,
  );
  const stationHeading = getStationTitle(
    projectInfo?.value?.project_type || '',
  );
  const { data: disbursementMethodsSetting } = useProjectSettingsGet(
    projectId,
    'DISBURSHMENT_METHODS',
  );

  const disbursementMethodLabels: Record<string, string> = {
    GROUP_TOKEN: t('GROUP_CASH_TOKEN'),
    TOKEN: t('TOKEN'),
    INKIND: t('INKIND'),
  };

  const disbursementMethodOptions: Option[] = useMemo(() => {
    const methods: string[] = disbursementMethodsSetting?.value || [];
    return methods.map((m: string) => ({
      value: m,
      label: disbursementMethodLabels[m] || m,
    }));
  }, [disbursementMethodsSetting]);

  const triggerStatementPath = `/projects/aa/${projectId}/${
    navigation || 'trigger-statements'
  }?tab=${tab}`;

  const AddPhaseSchema = buildAddPhaseSchema(t);
  const form = useForm<AddPhaseFormInputValues, unknown, AddPhaseFormValues>({
    resolver: zodResolver(AddPhaseSchema),
    defaultValues: getAddPhaseDefaultValues(riverBasin || ''),
    mode: 'onChange',
  });

  React.useEffect(() => {
    if (!phase) return;

    form.reset({
      name: phase?.name || '',
      riverBasin: phase?.source?.riverBasin || riverBasin || '',
      requiredMandatoryTriggers: String(phase?.requiredMandatoryTriggers),
      requiredOptionalTriggers: String(phase?.requiredOptionalTriggers),
      canRevert: !!phase?.canRevert,
      canTriggerPayout: !!phase?.canTriggerPayout,
      disbursementMethods: phase?.disbursementConfig?.disbursementMethods || [],
      isAutomatedActivity: !!phase?.isAutomatedActivity,
      isRequiredLeadTime: !!phase?.isRequiredLeadTime,
    });
  }, [phase, form, riverBasin]);

  const handleFormSubmit = async (_data: AddPhaseFormValues) => {
    editPhaseConfirmDialog.onTrue();
  };

  const handleConfirmUpdate = async () => {
    const data = form.getValues();
    const canTriggerPayout = !!data.canTriggerPayout;
    const payload = {
      uuid: phaseId,
      name: data.name.trim().toUpperCase(),
      canRevert: !!data.canRevert,
      canTriggerPayout,
      requiredMandatoryTriggers: Number(data.requiredMandatoryTriggers),
      requiredOptionalTriggers: Number(data.requiredOptionalTriggers),
      disbursementMethods: canTriggerPayout ? data.disbursementMethods : [],
      isAutomatedActivity: !!data.isAutomatedActivity,
      isRequiredLeadTime: !!data.isRequiredLeadTime,
    };

    try {
      await updatePhase.mutateAsync({
        projectUUID: projectId,
        phasePayload: payload,
      });
      editPhaseConfirmDialog.onFalse();
      router.push(`/projects/aa/${projectId}/${navigation}?tab=${tab}`);
    } catch (error) {
      console.error('Update phase error:', error);
      editPhaseConfirmDialog.onFalse();
    }
  };

  const handleCancelUpdate = () => {
    editPhaseConfirmDialog.onFalse();
  };

  const handleReset = () => {
    if (!phase) {
      const resetValues = getAddPhaseDefaultValues(riverBasin || '');
      form.reset(resetValues);
      return;
    }

    form.reset({
      name: phase?.name || '',
      riverBasin: phase?.source?.riverBasin || riverBasin || '',
      requiredMandatoryTriggers: String(phase?.requiredMandatoryTriggers),
      requiredOptionalTriggers: String(phase?.requiredOptionalTriggers),
      canRevert: !!phase?.canRevert,
      canTriggerPayout: !!phase?.canTriggerPayout,
      disbursementMethods: phase?.disbursementConfig?.disbursementMethods || [],
      isAutomatedActivity: !!phase?.isAutomated,
      isRequiredLeadTime: !!phase?.isRequiredLeadTime,
    });
  };

  const handleDeletePhase = async () => {
    try {
      setIsDeleted(true);
      await deletePhase.mutateAsync({
        projectUUID: projectId,
        phasePayload: {
          uuid: phaseId,
        },
      });
      router.push(triggerStatementPath);
    } catch (error) {
      setIsDeleted(false);
      console.error('Delete phase error:', error);
    }
  };

  if (isLoading || isDeleted || isProjectInfoLoading) return <TableLoader />;

  return (
    <>
      <div className="mt-4 px-4">
        <Back path={`/projects/aa/${projectId}/${navigation}?tab=${tab}`} />
      </div>
      <div className="mt-4 px-4 flex items-start justify-between gap-3">
        <Heading
          title={t('EDIT_PHASE')}
          description={t('EDIT_FORM_TO_UPDATE_PHASE')}
        />
        <TooltipWrapper
          tip={
            phase?._count?.Activity > 0 || phase?.triggers?.length > 0
              ? t('CANNOT_DELETE_PHASE_WITH_TRIGGERS')
              : t('DELETE_PHASE')
          }
        >
          <DialogComponent
            buttonIcon={Trash}
            buttonText={t('DELETE_PHASE')}
            dialogTitle={t('DELETE_PHASE')}
            dialogDescription={t('DELETE_PHASE_CONFIRM')}
            confirmButtonText={deletePhase.isPending ? t('DELETING') : t('DELETE')}
            handleClick={handleDeletePhase}
            buttonClassName="rounded-sm w-full text-red-500 border-red-500"
            confirmButtonClassName="rounded-sm w-full bg-red-500"
            variant="outline"
            data={phase}
          />
        </TooltipWrapper>
      </div>
      <PhaseForm
        form={form}
        onSubmit={handleFormSubmit}
        onReset={handleReset}
        loading={updatePhase.isPending}
        submitLabel={t('UPDATE')}
        resetLabel={t('RESET')}
        stationHeading={stationHeading}
        disbursementMethodOptions={disbursementMethodOptions}
        allPhases={phasesData}
        currentPhaseId={phaseId}
      />
      <ConfirmationDialog
        isConfirmationDialogOpen={editPhaseConfirmDialog.value}
        onCancel={handleCancelUpdate}
        onConfirm={handleConfirmUpdate}
        dialogTitle={t('CONFIRM_UPDATE_PHASE')}
        dialogMessage={t('CONFIRM_UPDATE_PHASE_DESC')}
      />
    </>
  );
}

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
import { Trash } from 'lucide-react';
import { DialogComponent } from 'apps/rahat-ui/src/sections/projects/aa-2/activities/details/dialog.reuse';
import { UUID } from 'crypto';
import { useParams, useRouter } from 'next/navigation';
import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  AddPhaseFormInputValues,
  AddPhaseFormValues,
  AddPhaseSchema,
  getAddPhaseDefaultValues,
} from './phase.schema';
import TooltipWrapper from 'apps/rahat-ui/src/components/tooltip.wrapper';
import { getStationTitle } from 'apps/rahat-ui/src/utils/getStationTitle';

export default function EditPhaseView() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as UUID;
  const phaseId = params.phaseId as UUID;

  const updatePhase = useUpdatePhase();
  const deletePhase = useDeletePhase();
  const [isDeleted, setIsDeleted] = useState(false);

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

  const disbursementMethodOptions: Option[] = useMemo(() => {
    const methods: string[] = disbursementMethodsSetting?.value || [];
    return methods.map((m: string) => ({
      value: m,
      label: m,
    }));
  }, [disbursementMethodsSetting]);

  const payoutEnabledPhase = useMemo(
    () => phasesData?.find((phase: any) => phase?.canTriggerPayout) || null,
    [phasesData],
  );
  const triggerStatementPath = `/projects/aa/${projectId}/trigger-statements`;
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
      disbursementMethods: phase?.disbursementMethods || [],
    });
  }, [phase, form, riverBasin]);

  const handleUpdatePhase = async (data: AddPhaseFormValues) => {
    const canTriggerPayout = !!data.canTriggerPayout;
    const payload = {
      uuid: phaseId,
      name: data.name.trim().toUpperCase(),
      canRevert: !!data.canRevert,
      canTriggerPayout,
      requiredMandatoryTriggers: Number(data.requiredMandatoryTriggers),
      requiredOptionalTriggers: Number(data.requiredOptionalTriggers),
      disbursementMethods: canTriggerPayout ? data.disbursementMethods : [],
    };

    try {
      await updatePhase.mutateAsync({
        projectUUID: projectId,
        phasePayload: payload,
      });
      router.push(
        `/projects/aa/${projectId}/trigger-statements/phase/${phaseId}`,
      );
    } catch (error) {
      console.error('Update phase error:', error);
    }
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
      disbursementMethods: phase?.disbursementMethods || [],
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
        <Back
          path={`/projects/aa/${projectId}/trigger-statements/phase/${phaseId}`}
        />
      </div>
      <div className="mt-4 px-4 flex items-start justify-between gap-3">
        <Heading
          title="Edit Phase"
          description="Edit the form below to update this phase"
        />
        <TooltipWrapper
          tip={
            phase?._count?.Activity > 0 || phase?.triggers?.length > 0
              ? 'Cannot delete a phase with activities or triggers'
              : 'Delete Phase'
          }
        >
          <DialogComponent
            buttonIcon={Trash}
            buttonText="Delete Phase"
            dialogTitle="Delete Phase"
            dialogDescription="Are you sure you want to delete this phase?"
            confirmButtonText={deletePhase.isPending ? 'Deleting...' : 'Delete'}
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
        onSubmit={handleUpdatePhase}
        onReset={handleReset}
        loading={updatePhase.isPending}
        submitLabel="Update"
        resetLabel="Reset"
        payoutEnabledPhase={payoutEnabledPhase}
        stationHeading={stationHeading}
        disbursementMethodOptions={disbursementMethodOptions}
        allPhases={phasesData}
        currentPhaseId={phaseId}
      />
    </>
  );
}

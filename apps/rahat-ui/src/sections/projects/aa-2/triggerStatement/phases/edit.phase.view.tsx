import { zodResolver } from '@hookform/resolvers/zod';
import {
  PROJECT_SETTINGS_KEYS,
  useDeletePhase,
  useProjectSettingsStore,
  useSinglePhase,
  useUpdatePhase,
} from '@rahat-ui/query';
import { PhaseForm } from './PhaseForm';
import {
  Back,
  CustomAlertDialog,
  Heading,
  TableLoader,
} from 'apps/rahat-ui/src/common';
import { UUID } from 'crypto';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import {
  AddPhaseFormInputValues,
  AddPhaseFormValues,
  AddPhaseSchema,
  getAddPhaseDefaultValues,
} from './phase.schema';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';

export default function EditPhaseView() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as UUID;
  const phaseId = params.phaseId as UUID;

  const updatePhase = useUpdatePhase();
  const deletePhase = useDeletePhase();

  const { settings } = useProjectSettingsStore((state) => ({
    settings: state.settings,
  }));

  const { data: phase, isLoading } = useSinglePhase(projectId, phaseId);

  const riverBasin =
    settings?.[projectId]?.[PROJECT_SETTINGS_KEYS.PROJECT_INFO]?.[
      'river_basin'
    ];

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
      requiredMandatoryTriggers: String(phase?.requiredMandatoryTriggers || ''),
      requiredOptionalTriggers: String(phase?.requiredOptionalTriggers || ''),
      canRevert: !!phase?.canRevert,
      canTriggerPayout: !!phase?.canTriggerPayout,
    });
  }, [phase, form, riverBasin]);

  const handleUpdatePhase = async (data: AddPhaseFormValues) => {
    const payload = {
      uuid: phaseId,
      name: data.name.trim(),
      canRevert: !!data.canRevert,
      canTriggerPayout: !!data.canTriggerPayout,
    };

    try {
      await updatePhase.mutateAsync({
        projectUUID: projectId,
        phasePayload: payload,
      });

      router.push(
        `/projects/aa/${projectId}/trigger-statements/phase/${phaseId}`,
      );
    } catch (_error) {}
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
      requiredMandatoryTriggers: String(phase?.requiredMandatoryTriggers || ''),
      requiredOptionalTriggers: String(phase?.requiredOptionalTriggers || ''),
      canRevert: !!phase?.canRevert,
      canTriggerPayout: !!phase?.canTriggerPayout,
    });
  };

  const handleDeletePhase = async () => {
    try {
      await deletePhase.mutateAsync({
        projectUUID: projectId,
        phasePayload: {
          uuid: phaseId,
        },
      });

      router.push(triggerStatementPath);
    } catch (_error) {}
  };

  if (isLoading) return <TableLoader />;

  return (
    <>
      <Back path={triggerStatementPath} />
      <div className="mt-4 flex items-start justify-between gap-3">
        <Heading
          title="Edit Phase"
          description="Edit the form below to update this phase"
        />
        <CustomAlertDialog
          dialogTrigger={
            <Button
              type="button"
              variant="destructive"
              className="w-36"
              disabled={deletePhase.isPending}
            >
              {deletePhase.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          }
          title="Delete Phase"
          description="Are you sure you want to delete this phase?"
          handleContinueClick={handleDeletePhase}
        />
      </div>
      <PhaseForm
        form={form}
        onSubmit={handleUpdatePhase}
        onReset={handleReset}
        loading={updatePhase.isPending}
        submitLabel="Update"
        resetLabel="Reset"
      />
    </>
  );
}

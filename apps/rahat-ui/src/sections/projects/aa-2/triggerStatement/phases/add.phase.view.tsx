import { useTranslations } from 'next-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useCreatePhase,
  PROJECT_SETTINGS_KEYS,
  usePhases,
  useProjectSettingsStore,
  useProjectInfo,
  useProjectSettingsGet,
} from '@rahat-ui/query';
import { Option } from '@rahat-ui/shadcn/src/components/custom/multi-select';
import { PhaseForm } from './PhaseForm';
import {
  Back,
  Heading,
  TableLoader,
  UnsavedChangesDialog,
} from 'apps/rahat-ui/src/common';
import { useUnsavedChanges } from 'apps/rahat-ui/src/hooks/useUnsavedChanges';
import { useSessionFormStorage } from 'apps/rahat-ui/src/hooks/useSessionFormStorage';
import ConfirmationDialog from 'apps/rahat-ui/src/common/confirmationDialog';
import { useBoolean } from 'apps/rahat-ui/src/hooks/use-boolean';
import { UUID } from 'crypto';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useMemo, useRef } from 'react';
import { useForm } from 'react-hook-form';
import {
  AddPhaseFormInputValues,
  AddPhaseFormValues,
  buildAddPhaseSchema,
  getAddPhaseDefaultValues,
} from './phase.schema';
import { getStationTitle } from 'apps/rahat-ui/src/utils/getStationTitle';

export default function AddPhaseView() {
  const t = useTranslations('AA_PROJECT');
  const tGlobal = useTranslations('GLOBAL');
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as UUID;
  const searchParams = useSearchParams();
  const addPhaseConfirmDialog = useBoolean(false);
  const hasInteracted = useRef(false);
  const isRestored = useRef(false);
  const isSubmittingRef = useRef(false);

  const navigation = searchParams.get('from');
  const tab = searchParams.get('tab') ?? '';

  const createPhase = useCreatePhase();
  const { data: phasesData = [] } = usePhases(projectId);

  const { settings } = useProjectSettingsStore((state) => ({
    settings: state.settings,
  }));
  const dataSourceSettings =
    settings?.[projectId]?.[PROJECT_SETTINGS_KEYS.DATASOURCE];

  const { data: projectInfo, isLoading: isProjectInfoLoading } = useProjectInfo(
    projectId as UUID,
  );
  const stationHeading = getStationTitle(
    projectInfo?.value?.project_type || '',
    t,
  );

  const phaseSource = useMemo(() => {
    if (dataSourceSettings?.dhm) return 'DHM';
    if (dataSourceSettings?.glofas) return 'GLOFAS';
    if (dataSourceSettings?.gfh) return 'GFH';
    return 'DHM';
  }, [dataSourceSettings]);

  const activeYear =
    settings?.[projectId]?.[PROJECT_SETTINGS_KEYS.PROJECT_INFO]?.[
      'active_year'
    ];

  const riverBasin =
    settings?.[projectId]?.[PROJECT_SETTINGS_KEYS.PROJECT_INFO]?.[
      'river_basin'
    ];

  const triggerStatementPath = `/projects/aa/${projectId}/${
    navigation || 'trigger-statements'
  }?tab=${tab}`;

  const AddPhaseSchema = buildAddPhaseSchema(t);
  const form = useForm<AddPhaseFormInputValues, unknown, AddPhaseFormValues>({
    resolver: zodResolver(AddPhaseSchema),
    defaultValues: getAddPhaseDefaultValues(riverBasin || ''),
    mode: 'onChange',
  });

  useEffect(() => {
    if (riverBasin) {
      form.setValue('riverBasin', riverBasin, { shouldValidate: true });
    }
  }, [riverBasin, form]);

  const { loadSaved, saveData, clearSaved } =
    useSessionFormStorage<AddPhaseFormInputValues>({
      key: 'phase_draft',
      projectId: projectId as string,
      defaultValue: getAddPhaseDefaultValues(),
    });

  useEffect(() => {
    if (isRestored.current || !projectId) return;
    const saved = loadSaved();
    if (saved?.name || saved?.requiredMandatoryTriggers || saved?.requiredOptionalTriggers) {
      form.reset({
        ...getAddPhaseDefaultValues(riverBasin || ''),
        ...saved,
        riverBasin: riverBasin || saved.riverBasin || '',
      });
    }
    isRestored.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const hasUnsavedChanges =
    !isSubmittingRef.current && hasInteracted.current && form.formState.isDirty;

  const {
    showDialog,
    handleConfirmLeave,
    handleCancelLeave,
    handleDiscardLeave,
  } = useUnsavedChanges({
    hasUnsavedChanges,
    onConfirm: () => {
      saveData(form.getValues());
    },
    onDiscard: () => {
      clearSaved();
    },
  });

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

  const handleFormSubmit = async (data: AddPhaseFormValues) => {
    const trimmedName = data.name.trim().toUpperCase();
    const isDuplicate = phasesData.some(
      (phase: any) => phase?.name?.trim().toUpperCase() === trimmedName,
    );
    if (isDuplicate) {
      form.setError('name', {
        type: 'manual',
        message: t('THIS_PHASE_ALREADY_EXISTS'),
      });
      return;
    }
    addPhaseConfirmDialog.onTrue();
  };

  const handleConfirmAdd = async () => {
    const data = form.getValues();
    const canTriggerPayout = !!data.canTriggerPayout;
    const payload = {
      name: data.name.trim().toUpperCase(),
      source: phaseSource,
      river_basin: data.riverBasin,
      activeYear: String(activeYear || ''),
      requiredMandatoryTriggers: Number(data.requiredMandatoryTriggers),
      requiredOptionalTriggers: Number(data.requiredOptionalTriggers),
      canRevert: !!data.canRevert,
      canTriggerPayout,
      disbursementMethods: canTriggerPayout ? data.disbursementMethods : [],
      isAutomatedActivity: !!data.isAutomatedActivity,
      isRequiredLeadTime: !!data.isRequiredLeadTime,
    };
    isSubmittingRef.current = true;
    try {
      await createPhase.mutateAsync({
        projectUUID: projectId,
        phasePayload: payload,
      });
      addPhaseConfirmDialog.onFalse();
      clearSaved();
      router.push(triggerStatementPath);
    } catch (error) {
      isSubmittingRef.current = false;
      console.error('Error creating phase:', error);
      addPhaseConfirmDialog.onFalse();
    }
  };

  const handleCancelAdd = () => {
    addPhaseConfirmDialog.onFalse();
  };

  const handleReset = () => {
    clearSaved();
    const resetValues = getAddPhaseDefaultValues(riverBasin || '');
    form.reset(resetValues);
    form.setValue('canRevert', resetValues.canRevert);
    form.setValue('canTriggerPayout', resetValues.canTriggerPayout);
  };

  if (isProjectInfoLoading) return <TableLoader />;

  return (
    <>
      <div className="mt-4 px-4">
        <Back path={triggerStatementPath} />
        <Heading
          title={t('ADD_PHASE')}
          description={t('FILL_FORM_TO_CREATE_PHASE')}
        />
      </div>
      <div
        onFocus={() => {
          hasInteracted.current = true;
        }}
      >
        <PhaseForm
          form={form}
          onSubmit={handleFormSubmit}
          onReset={handleReset}
          loading={createPhase.isPending}
          submitLabel={t('ADD')}
          resetLabel={t('CLEAR')}
          stationHeading={stationHeading}
          disbursementMethodOptions={disbursementMethodOptions}
          allPhases={phasesData}
        />
      </div>
      <ConfirmationDialog
        isConfirmationDialogOpen={addPhaseConfirmDialog.value}
        onCancel={handleCancelAdd}
        onConfirm={handleConfirmAdd}
        dialogTitle={t('CONFIRM_ADD_PHASE')}
        dialogMessage={t('CONFIRM_ADD_PHASE_DESC')}
      />
      <UnsavedChangesDialog
        open={showDialog}
        onConfirm={handleConfirmLeave}
        onCancel={handleCancelLeave}
        onDiscard={handleDiscardLeave}
        title={tGlobal('UNSAVED_TITLE')}
        description={tGlobal('UNSAVED_ALERT_DESCRIPTION')}
        cancelText={tGlobal('CANCEL_TEXT')}
        discardText={tGlobal('DISCARD_TEXT')}
        confirmText={tGlobal('CONFIRM_TEXT')}
      />
    </>
  );
}

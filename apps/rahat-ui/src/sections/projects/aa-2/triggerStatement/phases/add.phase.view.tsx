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
import { Back, Heading, TableLoader } from 'apps/rahat-ui/src/common';
import ConfirmationDialog from 'apps/rahat-ui/src/common/confirmationDialog';
import { useBoolean } from 'apps/rahat-ui/src/hooks/use-boolean';
import { UUID } from 'crypto';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useMemo } from 'react';
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
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as UUID;
  const searchParams = useSearchParams();
  const addPhaseConfirmDialog = useBoolean(false);

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
    try {
      await createPhase.mutateAsync({
        projectUUID: projectId,
        phasePayload: payload,
      });
      addPhaseConfirmDialog.onFalse();
      router.push(triggerStatementPath);
    } catch (error) {
      console.error('Error creating phase:', error);
      addPhaseConfirmDialog.onFalse();
    }
  };

  const handleCancelAdd = () => {
    addPhaseConfirmDialog.onFalse();
  };

  const handleReset = () => {
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
      <ConfirmationDialog
        isConfirmationDialogOpen={addPhaseConfirmDialog.value}
        onCancel={handleCancelAdd}
        onConfirm={handleConfirmAdd}
        dialogTitle={t('CONFIRM_ADD_PHASE')}
        dialogMessage={t('CONFIRM_ADD_PHASE_DESC')}
      />
    </>
  );
}

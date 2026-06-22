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
import React, { useEffect, useMemo, useRef } from 'react';
import { useForm } from 'react-hook-form';
import {
  AddPhaseFormInputValues,
  AddPhaseFormValues,
  AddPhaseSchema,
  getAddPhaseDefaultValues,
} from './phase.schema';
import { getStationTitle } from 'apps/rahat-ui/src/utils/getStationTitle';

export default function AddPhaseView() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as UUID;
  const searchParams = useSearchParams();
  const addPhaseConfirmDialog = useBoolean(false);
  const pendingPhaseData = useRef<AddPhaseFormValues | null>(null);

  const navigation = searchParams.get('from');

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

  const triggerStatementPath = `/projects/aa/${projectId}/${navigation || 'trigger-statements'
    }`;

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
    GROUP_TOKEN: 'Group Cash Token',
    TOKEN: 'Token',
    INKIND: 'Inkind',
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
        message: 'This phase already exists.',
      });
      return;
    }
    pendingPhaseData.current = data;
    addPhaseConfirmDialog.onTrue();
  };

  const handleConfirmAdd = async () => {
    const data = pendingPhaseData.current;
    if (!data) return;
    const canTriggerPayout = !!data.canTriggerPayout;
    const payload = {
      name: data.name.trim().toUpperCase(),
      source: phaseSource,
      river_basin: data.riverBasin,
      activeYear: String(activeYear || ''),
      requiredMandatoryTriggers: data.requiredMandatoryTriggers,
      requiredOptionalTriggers: data.requiredOptionalTriggers,
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
    pendingPhaseData.current = null;
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
          title="Add Phase"
          description="Fill the form below to create new phase"
        />
      </div>
      <PhaseForm
        form={form}
        onSubmit={handleFormSubmit}
        onReset={handleReset}
        loading={createPhase.isPending}
        submitLabel="Add"
        resetLabel="Clear"
        stationHeading={stationHeading}
        disbursementMethodOptions={disbursementMethodOptions}
        allPhases={phasesData}
      />
      <ConfirmationDialog
        isConfirmationDialogOpen={addPhaseConfirmDialog.value}
        onCancel={handleCancelAdd}
        onConfirm={handleConfirmAdd}
        dialogTitle="Confirm Add Phase"
        dialogMessage="Are you sure you want to add this phase?"
      />
    </>
  );
}

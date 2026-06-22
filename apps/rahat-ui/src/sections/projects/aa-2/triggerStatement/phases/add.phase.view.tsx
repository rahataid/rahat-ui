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
import { UUID } from 'crypto';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useMemo } from 'react';
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

  const triggerStatementPath = `/projects/aa/${projectId}/${
    navigation || 'trigger-statements'
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

  const handleAddPhase = async (data: AddPhaseFormValues) => {
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
    const canTriggerPayout = !!data.canTriggerPayout;
    const payload = {
      name: trimmedName,
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
      router.push(triggerStatementPath);
    } catch (error) {
      console.error('Error creating phase:', error);
    }
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
        onSubmit={handleAddPhase}
        onReset={handleReset}
        loading={createPhase.isPending}
        submitLabel="Confirm"
        resetLabel="Clear"
        stationHeading={stationHeading}
        disbursementMethodOptions={disbursementMethodOptions}
        allPhases={phasesData}
      />
    </>
  );
}

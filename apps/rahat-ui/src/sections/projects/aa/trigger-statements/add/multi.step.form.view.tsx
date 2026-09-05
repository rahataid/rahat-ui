import * as React from 'react';
import { Stepper, Step } from 'react-form-stepper';
import AddTriggerStatementView from './add.trigger.statements.view';
import ConfigurePhase from './configure.phase';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAddTriggerStatementToPhase, useSinglePhase } from '@rahat-ui/query';
import { UUID } from 'crypto';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  useCreateTriggerStatement,
  PROJECT_SETTINGS_KEYS,
  useProjectSettingsStore,
} from '@rahat-ui/query';
import { normalizeNumeralsPreprocessor } from 'apps/rahat-ui/src/utils/i18n/numeral';

const steps = [
  { key: 'ADD_TRIGGER_STATEMENT' },
  { key: 'CONFIGURE_PHASE' },
];

const MultiStepForm = () => {
  const t = useTranslations('AA_PROJECT');
  const router = useRouter();
  const { id } = useParams();
  const projectId = id as UUID;

  const selectedPhase = JSON.parse(
    localStorage.getItem('selectedPhase') as string,
  );

  const { data: phaseDetail } = useSinglePhase(
    projectId as UUID,
    selectedPhase.phaseId as UUID,
  );

  const createTriggerStatement = useCreateTriggerStatement();
  const addTriggersToPhase = useAddTriggerStatementToPhase();

  const [activeTab, setActiveTab] = React.useState('automatedTrigger');
  const [activeStep, setActiveStep] = React.useState(0);

  const nextStep = () => {
    if (activeTab === 'manualTrigger') {
      manualForm.handleSubmit(handleSubmitManualTrigger)();
    }
    if (activeTab === 'automatedTrigger') {
      automatedForm.handleSubmit(handleSubmitAutomatedTrigger)();
    }
  };
  const prevStep = () => setActiveStep((prev) => prev - 1);

  const dataSources = useProjectSettingsStore(
    (s) => s.settings?.[projectId]?.[PROJECT_SETTINGS_KEYS.DATASOURCE],
  );

  const riverBasin = dataSources?.glofas?.location;

  const ManualFormSchema = z.object({
    title: z.string().min(2, { message: t('PLEASE_ENTER_VALID_TITLE') }),
    isMandatory: z.boolean().optional(),
  });

  const manualForm = useForm<z.infer<typeof ManualFormSchema>>({
    resolver: zodResolver(ManualFormSchema),
    defaultValues: {
      title: '',
      isMandatory: true,
    },
  });

  const AutomatedFormSchema = z.object({
    title: z.string().min(2, { message: t('PLEASE_ENTER_VALID_NAME') }),
    dataSource: z.string().min(1, { message: t('PLEASE_SELECT_DATA_SOURCE') }),
    isMandatory: z.boolean().optional(),
    minLeadTimeDays: z.preprocess(
      normalizeNumeralsPreprocessor,
      z.string().min(1, { message: t('PLEASE_ENTER_MINIMUM_LEAD_TIME_DAYS') }),
    ),
    maxLeadTimeDays: z.preprocess(
      normalizeNumeralsPreprocessor,
      z.string().min(1, { message: t('PLEASE_ENTER_MAXIMUM_LEAD_TIME_DAYS') }),
    ),
    probability: z.preprocess(
      normalizeNumeralsPreprocessor,
      z.string().min(1, { message: t('PLEASE_ENTER_FORECAST_PROBABILITY') }),
    ),
  });

  const automatedForm = useForm<z.infer<typeof AutomatedFormSchema>>({
    resolver: zodResolver(AutomatedFormSchema),
    defaultValues: {
      title: '',
      dataSource: '',
      maxLeadTimeDays: '',
      minLeadTimeDays: '',
      probability: '',
      isMandatory: true,
    },
  });

  const handleSubmitManualTrigger = async (
    data: z.infer<typeof ManualFormSchema>,
  ) => {
    setActiveStep((prev) => prev + 1);
  };

  const handleSubmitAutomatedTrigger = async (
    data: z.infer<typeof AutomatedFormSchema>,
  ) => {
    setActiveStep((prev) => prev + 1);
  };

  const handleAddTriggerStatement = async (data: any) => {
    let payload;

    if (data?.newTriggerData?.dataSource) {
      const {
        waterLevel,
        maxLeadTimeDays,
        minLeadTimeDays,
        probability,
        ...restData
      } = data?.newTriggerData;

      if (data?.newTriggerData?.dataSource === 'DHM') {
        payload = {
          ...restData,
          triggerStatement: {
            waterLevel: waterLevel,
          },
          phaseId: selectedPhase.phaseId,
        };
      }

      if (data?.newTriggerData?.dataSource === 'GLOFAS') {
        payload = {
          ...restData,
          triggerStatement: {
            maxLeadTimeDays,
            minLeadTimeDays,
            probability,
          },
          phaseId: selectedPhase.phaseId,
          location: riverBasin,
        };
      }
    } else {
      payload = {
        ...data.newTriggerData,
        phaseId: selectedPhase.phaseId,
        dataSource: 'MANUAL',
      };
    }
    try {
      const response = await createTriggerStatement.mutateAsync({
        projectUUID: projectId,
        triggerStatementPayload: payload,
      });

      const newTrigger = {
        repeatKey: response.data.repeatKey,
        isMandatory: response.data.isMandatory,
      };
      const filteredTiggers = [
        ...data.allMandatoryTriggers.filter((d: any) => d.repeatKey),
        ...data.allOptionalTriggers.filter((d: any) => d.repeatKey),
        newTrigger,
      ];

      const totalMandatoryTriggers = filteredTiggers.filter(
        (d) => d.isMandatory,
      ).length;
      const requiredMandatoryTriggers = totalMandatoryTriggers;
      const requiredOptionalTriggers = data?.requiredOptionalTriggers;

      const triggerRequirements = {
        mandatoryTriggers: {
          requiredTriggers: requiredMandatoryTriggers,
        },
        optionalTriggers: {
          requiredTriggers: requiredOptionalTriggers,
        },
      };

      await addTriggersToPhase.mutateAsync({
        projectUUID: projectId as UUID,
        addToPhasePayload: {
          uuid: selectedPhase.phaseId,
          triggers: filteredTiggers,
          triggerRequirements,
        },
      });
    } catch (e) {
      console.error('Add Triggers To Phase::', e);
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  React.useEffect(() => {
    if (addTriggersToPhase.isSuccess) {
      router.push(`/projects/aa/${projectId}/phase/${selectedPhase?.phaseId}`);
    }
  }, [addTriggersToPhase.isSuccess]);

  return (
    <div className="p-4 bg-secondary">
      <div className="bg-card p-4 rounded">
        <Stepper
          activeStep={activeStep}
          styleConfig={{
            completedBgColor: '#10b981',
            activeBgColor: '#3b82f6',
            inactiveBgColor: '#9ca3af',
          }}
          connectorStateColors={true}
          connectorStyleConfig={{
            completedColor: '#10b981',
            activeColor: '#3b82f6',
            disabledColor: '#9ca3af',
          }}
        >
          {steps.map((step, index) => (
            <Step key={index} label={t(step.key)} />
          ))}
        </Stepper>
        {activeStep === 0 && (
          <AddTriggerStatementView
            nextStep={nextStep}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            manualForm={manualForm}
            automatedForm={automatedForm}
          />
        )}
        {activeStep === 1 && (
          <ConfigurePhase
            prevStep={prevStep}
            manualForm={manualForm}
            automatedForm={automatedForm}
            phaseDetail={phaseDetail}
            activeTab={activeTab}
            handleAddTrigger={handleAddTriggerStatement}
          />
        )}
      </div>
    </div>
  );
};

export default MultiStepForm;

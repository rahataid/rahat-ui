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
import {
  useCreateTriggerStatement,
  PROJECT_SETTINGS_KEYS,
  useProjectSettingsStore,
} from '@rahat-ui/query';

const steps = [
  { label: 'Add Trigger Statement' },
  { label: 'Configure Phase' },
];

const MultiStepForm = () => {
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
    title: z.string().min(2, { message: 'Please enter valid title' }),
    // hazardTypeId: z.string().min(1, { message: 'Please select hazard type' }),
    isMandatory: z.boolean().optional(),
  });

  const manualForm = useForm<z.infer<typeof ManualFormSchema>>({
    resolver: zodResolver(ManualFormSchema),
    defaultValues: {
      title: '',
      // hazardTypeId: '',
      isMandatory: true,
    },
  });

  const AutomatedFormSchema = z.object({
    title: z.string().min(2, { message: 'Please enter valid name' }),
    dataSource: z.string().min(1, { message: 'Please select data source' }),
    // location: z.string().min(1, { message: 'Please select river basin' }),
    // hazardTypeId: z.string().min(1, { message: 'Please select hazard type' }),
    isMandatory: z.boolean().optional(),
    minLeadTimeDays: z
      .string()
      .min(1, { message: 'Please enter minimum lead time days' }),
    maxLeadTimeDays: z
      .string()
      .min(1, { message: 'Please enter maximum lead time days' }),
    probability: z.string().min(1, { message: 'Please forecast probability' }),
    // waterLevel: z.string().min(1, { message: 'Please enter water level' }),
    // .regex(/^(?:[0-9]+(?:\.[0-9]*)?|\.[0-9]+)$/, 'Must be a positive number')
    // activationLevel: z
    // .string()
    // .regex(/^(?:[0-9]+(?:\.[0-9]*)?|\.[0-9]+)$/, 'Must be a positive number')
    // .optional(),
  });
  // .refine(
  //   (data) => {
  //     if (selectedPhase.name === 'READINESS') {
  //       return (
  //         data.readinessLevel !== undefined && data.readinessLevel !== ''
  //       );
  //     }
  //     if (selectedPhase.name === 'ACTIVATION') {
  //       return (
  //         data.activationLevel !== undefined && data.activationLevel !== ''
  //       );
  //     }
  //     return true;
  //   },
  //   {
  //     message: 'Threshold levels must be provided.',
  //     path: ['readinessLevel', 'activationLevel'],
  //   },
  // );

  const automatedForm = useForm<z.infer<typeof AutomatedFormSchema>>({
    resolver: zodResolver(AutomatedFormSchema),
    defaultValues: {
      title: '',
      dataSource: '',
      // location: '',
      // hazardTypeId: '',
      maxLeadTimeDays: '',
      minLeadTimeDays: '',
      probability: '',
      // waterLevel: '',
      // activationLevel: '',
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
    console.log('trigger data', data);

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
      // const totalOptionalTriggers = filteredTiggers.filter(
      //   (d) => !d.isMandatory,
      // ).length;
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
      // console.log(triggerRequirements);

      // const;
      // console.log(filteredTiggers);
      // const allTriggers = data.allMandatoryTriggers.map(d d>)
      // console.log('add response', response);
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
    <div className="p-4 h-[calc(100vh-65px)] bg-secondary">
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
            <Step key={index} label={step.label} />
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

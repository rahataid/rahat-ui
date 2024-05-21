import * as React from 'react';
import { Stepper, Step } from 'react-form-stepper';
import AddTriggerStatementView from './add.trigger.statements.view';
import ConfigurePhase from './configure.phase';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const steps = [{ label: 'Step 1' }, { label: 'Step 2' }];

const MultiStepForm = () => {
  const selectedPhase = JSON.parse(
    localStorage.getItem('selectedPhase') as string,
  );
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

  const ManualFormSchema = z.object({
    title: z.string().min(2, { message: 'Please enter valid title' }),
    hazardTypeId: z.string().min(1, { message: 'Please select hazard type' }),
  });

  const manualForm = useForm<z.infer<typeof ManualFormSchema>>({
    resolver: zodResolver(ManualFormSchema),
    defaultValues: {
      title: '',
      hazardTypeId: '',
    },
  });

  const AutomatedFormSchema = z
    .object({
      title: z.string().min(2, { message: 'Please enter valid name' }),
      dataSource: z.string().min(1, { message: 'Please select data source' }),
      location: z.string().min(1, { message: 'Please select river basin' }),
      hazardTypeId: z.string().min(1, { message: 'Please select hazard type' }),
      readinessLevel: z
        .string()
        // .regex(/^(?:[0-9]+(?:\.[0-9]*)?|\.[0-9]+)$/, 'Must be a positive number')
        .optional(),
      activationLevel: z
        .string()
        // .regex(/^(?:[0-9]+(?:\.[0-9]*)?|\.[0-9]+)$/, 'Must be a positive number')
        .optional(),
    })
    .refine(
      (data) => {
        console.log('submit data', data);

        if (selectedPhase.name === 'READINESS') {
          return (
            data.readinessLevel !== undefined && data.readinessLevel !== ''
          );
        }
        if (selectedPhase.name === 'ACTIVATION') {
          return (
            data.activationLevel !== undefined && data.activationLevel !== ''
          );
        }
        return true;
      },
      {
        message: 'Threshold levels must be provided.',
        path: ['readinessLevel', 'activationLevel'],
      },
    );

  const automatedForm = useForm<z.infer<typeof AutomatedFormSchema>>({
    resolver: zodResolver(AutomatedFormSchema),
    defaultValues: {
      title: '',
      dataSource: '',
      location: '',
      hazardTypeId: '',
      readinessLevel: '',
      activationLevel: '',
    },
  });

  const handleSubmitManualTrigger = async (
    data: z.infer<typeof ManualFormSchema>,
  ) => {
    console.log(data);
    setActiveStep((prev) => prev + 1);
    console.log('called manual');

    // const payload = { ...data, phaseId: phaseId };
    // console.log('payload::', payload);
    // try {
    //   await createTriggerStatement.mutateAsync({
    //     projectUUID: projectId,
    //     triggerStatementPayload: payload,
    //   });
    // } catch (e) {
    //   console.error('Create Manual Trigger Error::', e);
    // } finally {
    //   form.reset();
    // }
  };

  const handleSubmitAutomatedTrigger = async (
    data: z.infer<typeof AutomatedFormSchema>,
  ) => {
    console.log(data);
    setActiveStep((prev) => prev + 1);
    console.log('called auto');

    // const payload = { ...data, phaseId: phaseId };
    // console.log('payload::', payload);
    // try {
    //   await createTriggerStatement.mutateAsync({
    //     projectUUID: projectId,
    //     triggerStatementPayload: payload,
    //   });
    // } catch (e) {
    //   console.error('Create Manual Trigger Error::', e);
    // } finally {
    //   form.reset();
    // }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="p-4 h-[calc(100vh-65px)] bg-secondary">
      <div className="bg-card p-4 rounded">
        <Stepper activeStep={activeStep}>
          {steps.map((step, index) => (
            <Step key={index} label={step.label} />
          ))}
        </Stepper>
        {activeStep === 0 && (
          <AddTriggerStatementView
            activeTab={activeTab}
            onTabChange={handleTabChange}
            manualForm={manualForm}
            automatedForm={automatedForm}
            next={nextStep}
          />
        )}
        {activeStep === 1 && <ConfigurePhase previous={prevStep} />}

        {activeStep === 0 && (
          <div className="flex justify-end mt-8">
            <div className="flex gap-2">
              <Button
                variant="secondary"
                className="bg-red-100 text-red-600 w-36"
                disabled
              >
                Cancel
              </Button>
              <Button className="px-8" onClick={nextStep}>
                Next
              </Button>
            </div>
          </div>
        )}

        {activeStep === 1 && (
          <div className="flex justify-end mt-8">
            <div className="flex gap-2">
              <Button
                variant="secondary"
                className="bg-red-100 text-red-600 w-36"
                disabled
              >
                Cancel
              </Button>
              <Button onClick={prevStep}>Previous</Button>
              <Button type="submit">Add Trigger Statement</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiStepForm;

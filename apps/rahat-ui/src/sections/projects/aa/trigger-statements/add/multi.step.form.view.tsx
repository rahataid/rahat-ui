import * as React from 'react';
import { Stepper, Step } from 'react-form-stepper';
import AddTriggerStatementView from './add.trigger.statements.view';
import ConfigurePhase from './configure.phase';

const steps = [
    { label: 'Step 1' },
    { label: 'Step 2' },
];

const MultiStepForm = () => {
    const [activeStep, setActiveStep] = React.useState(0);

    const nextStep = () => setActiveStep(prev => prev + 1);
    const prevStep = () => setActiveStep(prev => prev - 1);

    return (
        <div className="p-4 h-[calc(100vh-65px)] bg-secondary">
            <div className='bg-card p-4 rounded'>
                <Stepper activeStep={activeStep}>
                    {steps.map((step, index) => (
                        <Step key={index} label={step.label} />
                    ))}
                </Stepper>
                {activeStep === 0 && <AddTriggerStatementView next={nextStep} />}
                {activeStep === 1 && <ConfigurePhase previous={prevStep} />}
            </div>
        </div>
    );
};

export default MultiStepForm;
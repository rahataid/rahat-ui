'use client';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { DropdownMenuRadioGroup } from '@rahat-ui/shadcn/src/components/ui/dropdown-menu';
import React from 'react';
import { Stepper } from 'react-form-stepper';

const steps = [{ label: 'Step 1' }, { label: 'Step 2' }, { label: 'Step 3' }];

const DisburseTokens = () => {
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  return (
    <div className="p-4 h-[calc(100vh-65px)] bg-secondary">
      <div className="bg-card p-4 rounded">
        <Stepper
          steps={steps}
          activeStep={activeStep}
          styleConfig={{
            completedBgColor: '#10b981',
            activeBgColor: '#3D3D5A',
            inactiveBgColor: '#9ca3af',
          }}
          connectorStateColors={true}
          connectorStyleConfig={{
            completedColor: '#10b981',
            activeColor: '#3b82f6',
            disabledColor: '#9ca3af',
          }}
        />
        <div className="mt-4">
          {activeStep === 0 && (
            <div>
              <p className="mb-2 text-lg font-semibold text-blueGray-700">
                Select Distribution Mode
              </p>
              <p className="font-normal text-lg text-blueGray-700 mb-4">
                How would you like to disburse fund ?
              </p>
              <div>
                <label className="flex items-center gap-3 mb-4">
                  <input type="radio" name="option" value="option1" />
                  <p>Project Balance</p>
                </label>
                <label className="flex items-center gap-3 mb-4">
                  <input type="radio" name="option" value="option2" />
                  <p>Your Wallet</p>
                </label>
                <label className="flex items-center gap-3 mb-4">
                  <input type="radio" name="option" value="option3" />
                  <p>Multisig Wallet A/C</p>
                </label>
              </div>
            </div>
          )}
          {activeStep === 1 && (
            <div>
              <h2 className="mb-2">Step 2: Provide Details</h2>
              <div>
                <label className="block">
                  Field 1:
                  <input type="text" className="border rounded p-1 w-full" />
                </label>
                <label className="block">
                  Field 2:
                  <input type="text" className="border rounded p-1 w-full" />
                </label>
              </div>
            </div>
          )}
          {activeStep === 2 && (
            <div>
              <h2 className="mb-2">Congratulations!</h2>
              <p>You have completed all the steps.</p>
            </div>
          )}
        </div>
        <div className="mt-4 flex items-center gap-6 justify-end">
          <Button
            className="bg-gray-500 text-white py-2 px-4 rounded w-52 h-11"
            onClick={handleBack}
            disabled={activeStep === 0}
          >
            Back
          </Button>
          <Button
            className="bg-blue-500 text-white py-2 px-4 rounded w-52 h-11"
            onClick={handleNext}
            disabled={activeStep === steps.length - 1}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DisburseTokens;

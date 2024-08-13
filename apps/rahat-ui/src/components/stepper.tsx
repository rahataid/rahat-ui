import { FC } from 'react';

type StepperProps = {
  currentStep: number;
  steps: { id: string; title: string }[];
};

const Stepper: FC<StepperProps> = ({ currentStep, steps }) => {
  return (
    <div className="ml-32 my-4">
      <ol className="flex items-center w-full text-sm text-gray-500 font-medium sm:text-base">
        {steps.map((step, index) => (
          <li
            key={step.id}
            className={`flex md:w-full items-center ${
              currentStep >= index ? 'text-primary' : 'text-gray-600'
            } sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-4 xl:after:mx-8`}
          >
            <div className="flex items-center whitespace-nowrap after:content-['/'] sm:after:hidden after:mx-2">
              <span
                className={`w-6 h-6 ${
                  currentStep >= index ? 'bg-primary' : 'bg-gray-100'
                } border ${
                  currentStep >= index ? 'border-white' : 'border-gray-200'
                } rounded-full flex justify-center items-center mr-3 text-sm ${
                  currentStep >= index ? 'text-white' : 'text-gray-600'
                } lg:w-10 lg:h-10`}
              >
                {index + 1}
              </span>
              {`Step ${index + 1}`}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default Stepper;

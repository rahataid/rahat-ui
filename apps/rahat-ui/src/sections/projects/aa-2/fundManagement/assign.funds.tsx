'use client';

import { useParams, useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { ChevronLeft, CheckCircle2, Info } from 'lucide-react';
import FundManagementForm from './components/fund.management.form';
import { FUND_MANAGEMENT_TABS } from './consts/conts';
import type { PayoutFormData } from './components/assign.payout.form';
import { useFundAssignmentStore } from '@rahat-ui/query';

export default function AssignFundsView() {
  // Router goes here
  const id = useParams().id;
  const router = useRouter();

  // State goes here
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [payoutData, setPayoutData] = useState<PayoutFormData | null>(null);

  const { setAssignedFundData } = useFundAssignmentStore((s) => ({
    setAssignedFundData: s.setAssignedFundData,
  }));

  const handleStepChange = useCallback((step: number) => {
    setCurrentStep(step);
  }, []);

  // Clears all flow state and navigates back to the fund management list
  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    } else {
      setAssignedFundData({});
      setPayoutData(null);
      router.push(`/projects/aa/${id}/fund-management`);
    }
  }, [currentStep, id, router, setAssignedFundData]);

  return (
    <div>
      <div className="flex items-center space-x-2 mb-1 px-4 pt-4">
        <button
          onClick={handleBack}
          className="flex items-center gap-0 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
          <p className="ml-0 mb-0">Back</p>
        </button>
      </div>
      <nav className="flex items-start w-full mb-2 px-4">
        {FUND_MANAGEMENT_TABS.map((tab, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;
          const isFirst = index === 0;
          const isLast = index === FUND_MANAGEMENT_TABS.length - 1;

          return (
            <div key={tab.id} className="flex-1 flex items-start relative">
              {!isFirst && (
                <div
                  className={`absolute top-[18px] left-0 h-0.5 transition-colors ${
                    isCompleted || isActive ? 'bg-green-500' : 'bg-muted'
                  }`}
                  style={{ right: 'calc(50% + 18px)' }}
                />
              )}
              {!isLast && (
                <div
                  className={`absolute top-[18px] right-0 h-0.5 transition-colors ${
                    isCompleted ? 'bg-green-500' : 'bg-muted'
                  }`}
                  style={{ left: 'calc(50% + 16px)' }}
                />
              )}
              <div className="flex flex-col items-center w-full relative z-10">
                {isCompleted ? (
                  <CheckCircle2 className="h-9 w-9 text-green-500" />
                ) : (
                  <Info
                    className={`h-9 w-9 ${
                      isActive ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  />
                )}
                <span
                  className={`text-sm mt-1 font-medium transition-colors ${
                    isActive
                      ? 'text-primary'
                      : isCompleted
                      ? 'text-green-500'
                      : 'text-muted-foreground'
                  }`}
                >
                  Step {index + 1}
                </span>
                <span
                  className={`text-md mt-0.5 text-center transition-colors ${
                    isActive
                      ? 'text-primary font-semibold'
                      : isCompleted
                      ? 'text-green-500'
                      : 'text-muted-foreground'
                  }`}
                >
                  {tab.title}
                </span>
              </div>
            </div>
          );
        })}
      </nav>

      <div className="px-4 pb-4">
        <FundManagementForm
          currentStep={currentStep}
          handleStepChange={handleStepChange}
          payoutData={payoutData}
          onPayoutData={setPayoutData}
        />
      </div>
    </div>
  );
}

'use client';

import { useCallback, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, CheckCircle2, Info } from 'lucide-react';
import { INKIND_FORM_STEPS } from './consts/inkind.consts';
import InkindDetailsForm from './forms/inkind.details.form';
import InkindConfirmation from './forms/inkind.confirmation';
import type { InkindDetailsValues } from './schemas/inkind.validation';

export default function AddInkindView() {
  const { id } = useParams();
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<InkindDetailsValues>>({});

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    } else {
      router.push(`/projects/aa/${id}/inkind-management`);
    }
  }, [currentStep, id, router]);

  const handleDetailsNext = (data: InkindDetailsValues) => {
    setFormData(data);
    setCurrentStep(1);
  };

  const handleSuccess = () => {
    router.push(`/projects/aa/${id}/inkind-management`);
  };

  return (
    <div>
      {/* ── Back button ────────────────────────────────────────────── */}
      <div className="flex items-center space-x-2 mb-1 px-4 pt-4">
        <button
          onClick={handleBack}
          className="flex items-center gap-0 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
          <p className="ml-0 mb-0">Back</p>
        </button>
      </div>

      {/* ── Step indicator ─────────────────────────────────────────── */}
      <nav className="flex items-start w-full mb-4 px-4">
        {INKIND_FORM_STEPS.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;
          const isFirst = index === 0;
          const isLast = index === INKIND_FORM_STEPS.length - 1;

          return (
            <div key={step.id} className="flex-1 flex items-start relative">
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
                  {step.title}
                </span>
              </div>
            </div>
          );
        })}
      </nav>

      {/* ── Step content ───────────────────────────────────────────── */}
      <div className="px-4 pb-4">
        {currentStep === 0 && (
          <InkindDetailsForm formData={formData} onNext={handleDetailsNext} />
        )}
        {currentStep === 1 && (
          <InkindConfirmation
            formData={formData as InkindDetailsValues}
            onBack={() => setCurrentStep(0)}
            onSuccess={handleSuccess}
          />
        )}
      </div>
    </div>
  );
}

'use client';

import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, CheckCircle2, Info } from 'lucide-react';
import FundManagementForm from './components/fund.management.form';
import { FUND_MANAGEMENT_TABS } from './consts/conts';
import type { PayoutFormData } from './components/assign.payout.form';
import type { FundDraft } from './components/assign.funds.form';
import { useFundAssignmentStore } from '@rahat-ui/query';
import { useTranslations } from 'next-intl';
import { useLabelDigits } from 'apps/rahat-ui/src/utils/i18n/number';
import { UnsavedChangesDialog } from 'apps/rahat-ui/src/common';
import { useUnsavedChanges } from 'apps/rahat-ui/src/hooks/useUnsavedChanges';
import { useSessionFormStorage } from 'apps/rahat-ui/src/hooks/useSessionFormStorage';

const EMPTY_DRAFT: Partial<FundDraft> = {};

export default function AssignFundsView() {
  // Router goes here
  const t = useTranslations('AA_PROJECT');
  const tg = useTranslations('AA_PROJECT_WITH_GNOSIS');
  const tGlobal = useTranslations('GLOBAL');
  const formatDigits = useLabelDigits();
  const id = useParams().id;
  const router = useRouter();

  // State goes here
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [payoutData, setPayoutData] = useState<PayoutFormData | null>(null);
  // Tracks the payout sub-step: null = prompt, true = form
  // Lifted here so the Back button can reset it without decrementing the step
  const [wantsPayout, setWantsPayout] = useState<boolean | null>(null);
  const [draft, setDraft] = useState<FundDraft | null>(null);
  const [isDetailsDirty, setIsDetailsDirty] = useState(false);
  const [hasProgressed, setHasProgressed] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const draftValuesRef = useRef<FundDraft | null>(null);
  const listPath = `/projects/aa/${id}/fund-management?tab=fundManagementList`;

  const { loadSaved, saveData, clearSaved } = useSessionFormStorage<
    Partial<FundDraft>
  >({
    key: 'fund_assignment_draft',
    projectId: id as string,
    defaultValue: EMPTY_DRAFT,
  });

  useEffect(() => {
    if (!id) return;
    const saved = loadSaved();
    if (saved?.title || saved?.beneficiaryGroupId || saved?.tokenAmountPerBenef) {
      setDraft(saved as FundDraft);
    }
  }, [id, loadSaved]);

  useEffect(() => {
    if (currentStep > 0) setHasProgressed(true);
  }, [currentStep]);

  const handleDraftChange = useCallback(
    (values: FundDraft, isDirty: boolean) => {
      draftValuesRef.current = values;
      setIsDetailsDirty(isDirty);
    },
    [],
  );

  const handleClear = useCallback(() => {
    clearSaved();
    setDraft(null);
    setHasProgressed(false);
  }, [clearSaved]);

  const handleComplete = useCallback(() => {
    clearSaved();
    setIsCompleted(true);
  }, [clearSaved]);

  useEffect(() => {
    if (isCompleted) router.push(listPath);
  }, [isCompleted, router, listPath]);

  const hasUnsavedChanges = !isCompleted && (isDetailsDirty || hasProgressed);

  const {
    showDialog,
    handleConfirmLeave,
    handleCancelLeave,
    handleDiscardLeave,
  } = useUnsavedChanges({
    hasUnsavedChanges,
    onConfirm: () => {
      if (draftValuesRef.current) saveData(draftValuesRef.current);
    },
    onDiscard: () => {
      clearSaved();
    },
  });

  const { setAssignedFundData } = useFundAssignmentStore((s) => ({
    setAssignedFundData: s.setAssignedFundData,
  }));

  // Clear the store when the user leaves this flow entirely
  useEffect(() => {
    return () => {
      setAssignedFundData({});
    };
  }, [setAssignedFundData]);

  const handleBack = useCallback(() => {
    // On the payout step, if the user is in the form (wantsPayout=true),
    // go back to the prompt instead of decrementing the step
    if (currentStep === 1 && wantsPayout === true) {
      setWantsPayout(null);
      return;
    }
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    } else {
      setAssignedFundData({});
      setPayoutData(null);
      router.push(`/projects/aa/${id}/fund-management`);
    }
  }, [currentStep, wantsPayout, id, router, setAssignedFundData]);

  return (
    <div>
      <div className="flex items-center space-x-2 mb-1 px-4 pt-4">
        <button
          onClick={handleBack}
          className="flex items-center gap-0 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
          <p className="ml-0 mb-0">{t('BACK')}</p>
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
                  {tg('STEP', { index: formatDigits(index + 1) })}
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
                  {t(tab.titleKey)}
                </span>
              </div>
            </div>
          );
        })}
      </nav>

      <div className="px-4 pb-4">
        <FundManagementForm
          currentStep={currentStep}
          handleStepChange={setCurrentStep}
          payoutData={payoutData}
          onPayoutData={setPayoutData}
          wantsPayout={wantsPayout}
          onWantsPayoutChange={setWantsPayout}
          draft={draft}
          onDraftChange={handleDraftChange}
          onClear={handleClear}
          onComplete={handleComplete}
        />
      </div>

      <UnsavedChangesDialog
        open={showDialog}
        onConfirm={handleConfirmLeave}
        onCancel={handleCancelLeave}
        onDiscard={handleDiscardLeave}
        title={tGlobal('UNSAVED_TITLE')}
        description={tGlobal('UNSAVED_ALERT_DESCRIPTION')}
        cancelText={tGlobal('CANCEL_TEXT')}
        discardText={tGlobal('DISCARD_TEXT')}
        confirmText={tGlobal('CONFIRM_TEXT')}
      />
    </div>
  );
}

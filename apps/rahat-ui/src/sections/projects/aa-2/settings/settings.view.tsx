'use client';

import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import { Save } from 'lucide-react';
import {
  SettingNameValue,
  useAAProjectSettingsUpdateValues,
} from '@rahat-ui/query';
import { IconLabelBtn } from 'apps/rahat-ui/src/common';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@rahat-ui/shadcn/src/components/ui/alert-dialog';
import PayoutTypeConfigEditor from './friendly/payout-type-config.editor';
import ProjectNavConfigEditor from './friendly/project-nav-config.editor';
import DisbursementMethodsEditor from './friendly/disbursement-methods.editor';
import FundManagementTabConfigEditor from './friendly/fundmanagement-tab-config.editor';
import ForecastTabConfigEditor from './friendly/forecast-tab-config.editor';
import TriggerTabConfigEditor from './friendly/trigger-tab-config.editor';

type SubmitFn = () => SettingNameValue | null;
type SubmitRef = React.MutableRefObject<SubmitFn | null>;

export default function AASettingsView() {
  const t = useTranslations('AA_PROJECT');
  const tg = useTranslations('GLOBAL');
  const { id } = useParams();
  const projectUUID = id as UUID;

  const updateSettings = useAAProjectSettingsUpdateValues();

  const payoutSubmitRef = useRef<SubmitFn | null>(null);
  const navSubmitRef = useRef<SubmitFn | null>(null);
  const disbursementSubmitRef = useRef<SubmitFn | null>(null);
  const fundManagementSubmitRef = useRef<SubmitFn | null>(null);
  const forecastSubmitRef = useRef<SubmitFn | null>(null);
  const triggerTabSubmitRef = useRef<SubmitFn | null>(null);

  const submitRefs: SubmitRef[] = [
    payoutSubmitRef,
    navSubmitRef,
    disbursementSubmitRef,
    fundManagementSubmitRef,
    forecastSubmitRef,
    triggerTabSubmitRef,
  ];

  const [pendingSettings, setPendingSettings] = useState<
    SettingNameValue[] | null
  >(null);

  const handleUpdateClick = () => {
    const settings = submitRefs
      .map((ref) => ref.current?.())
      .filter((setting): setting is SettingNameValue => Boolean(setting));

    if (!settings.length) return;

    setPendingSettings(settings);
  };

  const handleConfirmUpdate = () => {
    if (!pendingSettings) return;
    updateSettings.mutate(
      { projectUUID, settings: pendingSettings },
      { onSuccess: () => setPendingSettings(null) },
    );
  };

  return (
    <div>
      <div className="pb-3 flex justify-between items-center space-x-4">
        <div>
          <h2 className="text-lg font-semibold">Settings</h2>
          <p className="text-xs text-muted-foreground">
            Manage project settings
          </p>
        </div>
        <IconLabelBtn
          Icon={Save}
          handleClick={handleUpdateClick}
          name={updateSettings.isPending ? 'Updating...' : 'Update Setting'}
          className="px-3 py-2"
          disabled={updateSettings.isPending}
        />
      </div>
      <div className="space-y-4">
        <ProjectNavConfigEditor submitRef={navSubmitRef} />
        <ForecastTabConfigEditor submitRef={forecastSubmitRef} />
        <TriggerTabConfigEditor submitRef={triggerTabSubmitRef} />
        <DisbursementMethodsEditor submitRef={disbursementSubmitRef} />
        <FundManagementTabConfigEditor submitRef={fundManagementSubmitRef} />
        <PayoutTypeConfigEditor submitRef={payoutSubmitRef} />
      </div>

      <AlertDialog
        open={!!pendingSettings}
        onOpenChange={(open) => !open && setPendingSettings(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Update settings?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to update these project settings?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmUpdate}
              disabled={updateSettings.isPending}
            >
              {updateSettings.isPending ? 'Updating...' : 'Confirm'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

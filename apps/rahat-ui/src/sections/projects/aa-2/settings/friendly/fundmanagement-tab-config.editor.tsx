'use client';

import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import { SettingDataType, useAAProjectSettingsList } from '@rahat-ui/query';
import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';

const setsAreEqual = (a: Set<string>, b: Set<string>) =>
  a.size === b.size && [...a].every((value) => b.has(value));

const SETTING_NAME = 'FUNDMANAGEMENT_TAB_CONFIG';

// Known fund management tabs, matching componentMap in
// apps/rahat-ui/src/sections/projects/aa-2/fundManagement/components/tabs.tsx
const TAB_OPTIONS: { value: string; label: string }[] = [
  { value: 'tokenOverview', label: 'Tokens Overview' },
  { value: 'fundManagementList', label: 'Fund Management List' },
  { value: 'inKind', label: 'InKind' },
  { value: 'counselling', label: 'Counselling' },
  { value: 'cashTracker', label: 'Cash Tracker' },
  { value: 'inKindTracker', label: 'InKind Tracker' },
  { value: 'multisigWallet', label: 'Multisig Wallet' },
  { value: 'treasury', label: 'Treasury' },
];

type IProps = {
  submitRef?: MutableRefObject<
    (() => { name: string; value: unknown } | null) | null
  >;
};

export default function FundManagementTabConfigEditor({ submitRef }: IProps) {
  const { id } = useParams();
  const projectUUID = id as UUID;

  const { data: settings, isLoading } = useAAProjectSettingsList(projectUUID);
  const currentSetting = settings?.find((s: any) => s.name === SETTING_NAME);

  const [checkedValues, setCheckedValues] = useState<Set<string>>(new Set());
  const initialValuesRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    // When this setting has never been saved for the project, default to
    // every known tab enabled rather than none — an empty selection here
    // would disable all fund management tabs the next time settings are saved.
    const currentTabs: { value: string }[] = currentSetting
      ? currentSetting?.value?.tabs || []
      : TAB_OPTIONS;
    const initial = new Set(currentTabs.map((tab) => tab.value));
    initialValuesRef.current = initial;
    setCheckedValues(initial);
  }, [currentSetting]);

  const toggleValue = (value: string, checked: boolean) => {
    setCheckedValues((prev) => {
      const next = new Set(prev);
      if (checked) next.add(value);
      else next.delete(value);
      return next;
    });
  };

  const handleSubmit = () => {
    // Don't submit this setting if the user never touched it — avoids
    // overwriting other settings' values when only one editor was edited.
    if (setsAreEqual(checkedValues, initialValuesRef.current)) return null;

    const tabs = TAB_OPTIONS.filter((opt) => checkedValues.has(opt.value));

    return {
      name: SETTING_NAME,
      value: { tabs },
      dataType: SettingDataType.OBJECT,
    };
  };

  useEffect(() => {
    if (submitRef) submitRef.current = handleSubmit;
  });

  if (isLoading) {
    return <div className="p-4 text-sm text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="rounded border bg-white p-4">
      <div className="mb-3">
        <h2 className="text-sm font-semibold">Fund Management Tabs</h2>
        <p className="text-xs text-muted-foreground">
          Choose which fund management tabs are enabled for this project.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        {TAB_OPTIONS.map((opt) => (
          <div key={opt.value} className="flex items-center space-x-2">
            <Checkbox
              id={`fm-tab-${opt.value}`}
              checked={checkedValues.has(opt.value)}
              onCheckedChange={(checked) =>
                toggleValue(opt.value, checked === true)
              }
            />
            <Label htmlFor={`fm-tab-${opt.value}`}>{opt.label}</Label>
          </div>
        ))}
      </div>
    </div>
  );
}

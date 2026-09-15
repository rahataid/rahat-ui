'use client';

import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import { useTranslations } from 'next-intl';
import { SettingDataType, useAAProjectSettingsList } from '@rahat-ui/query';
import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';

const setsAreEqual = (a: Set<string>, b: Set<string>) =>
  a.size === b.size && [...a].every((value) => b.has(value));

const SETTING_NAME = 'DISBURSHMENT_METHODS';

// Known disbursement methods this editor exposes as checkboxes.
const DISBURSEMENT_METHOD_OPTIONS: { key: string; labelKey: string }[] = [
  { key: 'GROUP_TOKEN', labelKey: 'GROUP_CASH_TOKEN' },
  { key: 'TOKEN', labelKey: 'TOKEN' },
  { key: 'INKIND', labelKey: 'INKIND' },
];

type IProps = {
  submitRef?: MutableRefObject<
    (() => { name: string; value: unknown } | null) | null
  >;
};

export default function DisbursementMethodsEditor({ submitRef }: IProps) {
  const t = useTranslations('AA_PROJECT');
  const g = useTranslations('GLOBAL');
  const { id } = useParams();
  const projectUUID = id as UUID;

  const { data: settings, isLoading } = useAAProjectSettingsList(projectUUID);
  const currentSetting = settings?.find((s: any) => s.name === SETTING_NAME);

  const [checkedKeys, setCheckedKeys] = useState<Set<string>>(new Set());
  const initialKeysRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const currentMethods: string[] = currentSetting?.value || [];
    const initial = new Set(currentMethods);
    initialKeysRef.current = initial;
    setCheckedKeys(initial);
  }, [currentSetting]);

  const toggleKey = (key: string, checked: boolean) => {
    setCheckedKeys((prev) => {
      const next = new Set(prev);
      if (checked) next.add(key);
      else next.delete(key);
      return next;
    });
  };

  const handleSubmit = () => {
    // Don't submit this setting if the user never touched it — avoids
    // overwriting other settings' values when only one editor was edited.
    if (setsAreEqual(checkedKeys, initialKeysRef.current)) return null;

    const value = DISBURSEMENT_METHOD_OPTIONS.filter((opt) =>
      checkedKeys.has(opt.key),
    ).map((opt) => opt.key);

    return {
      name: SETTING_NAME,
      value,
      dataType: SettingDataType.OBJECT,
    };
  };

  useEffect(() => {
    if (submitRef) submitRef.current = handleSubmit;
  });

  if (isLoading) {
    return <div className="p-4 text-sm text-muted-foreground">{g('LOADING')}</div>;
  }

  return (
    <div className="rounded border bg-white p-4">
      <div className="mb-3">
        <h2 className="text-sm font-semibold">{t('DISBURSEMENT_METHODS')}</h2>
        <p className="text-xs text-muted-foreground">
          {t('CHOOSE_WHICH_DISBURSEMENT_METHODS_ARE_AVAILABLE')}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        {DISBURSEMENT_METHOD_OPTIONS.map((opt) => (
          <div key={opt.key} className="flex items-center space-x-2">
            <Checkbox
              id={`disbursement-method-${opt.key}`}
              checked={checkedKeys.has(opt.key)}
              onCheckedChange={(checked) => toggleKey(opt.key, checked === true)}
            />
            <Label htmlFor={`disbursement-method-${opt.key}`}>
              {t(opt.labelKey)}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}

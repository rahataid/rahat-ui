'use client';

import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import { SettingDataType, useAAProjectSettingsList } from '@rahat-ui/query';
import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';

const setsAreEqual = (a: Set<string>, b: Set<string>) =>
  a.size === b.size && [...a].every((value) => b.has(value));

const SETTING_NAME = 'PAYOUT_TYPE_CONFIG';

// Known payout types this editor exposes as checkboxes.
// `payoutmethod` -> shows a payment-provider picker when this type is active.
// `toggle`       -> shows an online/offline switch when this type is active.
const PAYOUT_TYPE_OPTIONS: {
  key: string;
  label: string;
  flag: 'payoutmethod' | 'toggle';
}[] = [
  { key: 'FSP', label: 'FSP', flag: 'payoutmethod' },
  { key: 'CVA', label: 'CVA', flag: 'toggle' },
];

type PayoutTypesValue = {
  types: {
    key: string;
    label: string;
    payoutmethod?: boolean;
    toggle?: boolean;
  }[];
};

type IProps = {
  submitRef?: MutableRefObject<
    (() => { name: string; value: unknown } | null) | null
  >;
};

export default function PayoutTypeConfigEditor({ submitRef }: IProps) {
  const { id } = useParams();
  const projectUUID = id as UUID;

  const { data: settings, isLoading } = useAAProjectSettingsList(projectUUID);

  const currentSetting = settings?.find((s: any) => s.name === SETTING_NAME);

  const [checkedKeys, setCheckedKeys] = useState<Set<string>>(new Set());
  const initialKeysRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const currentTypes: PayoutTypesValue['types'] =
      currentSetting?.value?.types || [];
    const initial = new Set(currentTypes.map((t) => t.key));
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

    const types = PAYOUT_TYPE_OPTIONS.filter((opt) =>
      checkedKeys.has(opt.key),
    ).map((opt) => ({
      key: opt.key,
      label: opt.label,
      [opt.flag]: true,
    }));

    return {
      name: SETTING_NAME,
      value: { types },
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
        <h2 className="text-sm font-semibold">Payout Types</h2>
        <p className="text-xs text-muted-foreground">
          Choose which payout methods are available for this project.
        </p>
      </div>

      <div className="flex items-center space-x-6">
        {PAYOUT_TYPE_OPTIONS.map((opt) => (
          <div key={opt.key} className="flex items-center space-x-2">
            <Checkbox
              id={`payout-type-${opt.key}`}
              checked={checkedKeys.has(opt.key)}
              onCheckedChange={(checked) =>
                toggleKey(opt.key, checked === true)
              }
            />
            <Label htmlFor={`payout-type-${opt.key}`}>{opt.label}</Label>
          </div>
        ))}
      </div>
    </div>
  );
}

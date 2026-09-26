'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import { useTranslations } from 'next-intl';
import { Save, X } from 'lucide-react';
import {
  SettingDataType,
  useAAProjectSettingsUpdateValues,
  useProjectSettingsGet,
} from '@rahat-ui/query';
import { Heading, IconLabelBtn } from 'apps/rahat-ui/src/common';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';

// Setting isn't created on the backend yet -- reading it returns
// null/undefined until an admin saves it here for the first time.
const SETTING_NAME = 'BENEFICIARY_GROUP_PDF_CONFIG';

export default function BeneficiaryQrConfigView() {
  const t = useTranslations('AA_PROJECT');
  const g = useTranslations('GLOBAL');
  const { id } = useParams();
  const projectUUID = id as UUID;

  const { data: currentSetting, isLoading } = useProjectSettingsGet(
    projectUUID,
    SETTING_NAME,
  );
  const updateSettings = useAAProjectSettingsUpdateValues();

  const [fields, setFields] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    // Value may be a plain string[] (["name","age"]) or an object shape
    // ({ fields: [...] }) depending on how it was first saved -- handle both.
    const rawValue = currentSetting?.value;
    const savedFields: string[] = Array.isArray(rawValue)
      ? rawValue
      : Array.isArray(rawValue?.fields)
      ? rawValue.fields
      : [];
    setFields(savedFields);
  }, [currentSetting]);

  const addField = (raw: string) => {
    const name = raw.trim();
    if (!name || fields.includes(name)) return;
    setFields((prev) => [...prev, name]);
  };

  const removeField = (name: string) => {
    setFields((prev) => prev.filter((field) => field !== name));
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addField(inputValue);
      setInputValue('');
    } else if (e.key === 'Backspace' && !inputValue && fields.length) {
      removeField(fields[fields.length - 1]);
    }
  };

  const handleInputBlur = () => {
    if (inputValue.trim()) {
      addField(inputValue);
      setInputValue('');
    }
  };

  const handleSave = () => {
    updateSettings.mutate({
      projectUUID,
      settings: [
        {
          name: SETTING_NAME,
          value: fields,
          dataType: SettingDataType.OBJECT,
        },
      ],
    });
  };

  return (
    <div>
      <div className="pb-1 flex justify-between items-center space-x-4">
        <Heading
          title={t('BENEFICIARY_QR_FIELDS')}
          description={t('CHOOSE_WHICH_FIELDS_ARE_SHOWN_ON_BENEFICIARY_GROUP_QR')}
        />
        <IconLabelBtn
          Icon={Save}
          handleClick={handleSave}
          name={updateSettings.isPending ? t('UPDATING') : t('UPDATE_SETTING')}
          className="px-3 py-2"
          disabled={updateSettings.isPending || isLoading}
        />
      </div>

      <div className="w-full mt-1 p-4 bg-secondary rounded">
        {isLoading ? (
          <div className="text-sm text-muted-foreground">{g('LOADING')}</div>
        ) : (
          <div className="space-y-2 rounded border bg-white p-4">
            <Label htmlFor="beneficiary-qr-field-input">{t('FIELD_NAMES')}</Label>
            <div className="flex flex-wrap items-center gap-2 rounded border p-2">
              {fields.map((field) => (
                <span
                  key={field}
                  className="flex items-center gap-1 rounded bg-secondary px-2 py-1 text-xs"
                >
                  {field}
                  <button
                    type="button"
                    onClick={() => removeField(field)}
                    aria-label={field}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              <Input
                id="beneficiary-qr-field-input"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleInputKeyDown}
                onBlur={handleInputBlur}
                placeholder={t('TYPE_A_FIELD_NAME_AND_PRESS_ENTER')}
                className="h-7 flex-1 border-none p-1 shadow-none focus-visible:ring-0"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {t('EXAMPLE_FIELD_NAMES')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

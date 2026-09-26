'use client';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import { useTranslations } from 'next-intl';
import { useProjectSettingsGet } from '@rahat-ui/query';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import MultipleSelector, {
  Option,
} from '@rahat-ui/shadcn/src/components/custom/multi-select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

// Kept in sync with the setting name used on the Beneficiary QR settings tab.
const BENEFICIARY_GROUP_PDF_CONFIG = 'BENEFICIARY_GROUP_PDF_CONFIG';

// Backend caps pdfFields at 5 -- keep this in sync with that limit.
const MAX_PDF_FIELDS = 5;

export type QrOtpConfirmValues = {
  includeOtp: boolean;
  excludeUnphonedBeneficiaries: boolean;
  pdfFields: string[];
};

export type QrOtpDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (values: QrOtpConfirmValues) => void;
  isPending: boolean;
};

export function QrOtpDialog({
  open,
  onOpenChange,
  onConfirm,
  isPending,
}: QrOtpDialogProps) {
  const t = useTranslations('AA_PROJECT');
  const { id } = useParams();
  const projectUUID = id as UUID;

  const [includeOtp, setIncludeOtp] = useState(true);
  const [excludeUnphonedBeneficiaries, setExcludeUnphonedBeneficiaries] =
    useState(false);
  const [selectedFields, setSelectedFields] = useState<Option[]>([]);

  const { data: fieldsSetting } = useProjectSettingsGet(
    projectUUID,
    BENEFICIARY_GROUP_PDF_CONFIG,
  );

  // Value may be a plain string[] (["name","age"]) or an object shape
  // ({ fields: [...] }) depending on how it was saved on the settings tab.
  const fieldOptions: Option[] = useMemo(() => {
    const rawValue = fieldsSetting?.value;
    const fields: string[] = Array.isArray(rawValue)
      ? rawValue
      : Array.isArray(rawValue?.fields)
      ? rawValue.fields
      : [];
    return fields.map((field) => ({ value: field, label: field }));
  }, [fieldsSetting]);

  useEffect(() => {
    if (open) {
      setIncludeOtp(true);
      setExcludeUnphonedBeneficiaries(false);
      setSelectedFields([]);
    }
  }, [open]);

  const exceedsMaxFields = selectedFields.length > MAX_PDF_FIELDS;

  const handleConfirm = () => {
    if (exceedsMaxFields) {
      toast.error(t('MAX_PDF_FIELDS_REACHED', { max: MAX_PDF_FIELDS }));
      return;
    }
    onConfirm({
      includeOtp,
      excludeUnphonedBeneficiaries,
      pdfFields: selectedFields.map((option) => option.value),
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!isPending) onOpenChange(next);
      }}
    >
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{t('QR_PDF_GENERATION_OPTIONS')}</DialogTitle>
          <DialogDescription>
            {t('QR_PDF_GENERATION_OPTIONS_DESCRIPTION')}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="qr-include-otp"
              checked={includeOtp}
              disabled={isPending}
              onCheckedChange={(checked) => setIncludeOtp(checked === true)}
            />
            <Label htmlFor="qr-include-otp">{t('GENERATE_RAHAT_PIN')}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="qr-exclude-unphoned"
              checked={excludeUnphonedBeneficiaries}
              disabled={isPending}
              onCheckedChange={(checked) =>
                setExcludeUnphonedBeneficiaries(checked === true)
              }
            />
            <Label htmlFor="qr-exclude-unphoned">
              {t('EXCLUDE_UNPHONED_BENEFICIARIES')}
            </Label>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="qr-fields">{t('FIELDS_TO_INCLUDE_IN_PDF')}</Label>
            <MultipleSelector
              value={selectedFields}
              onChange={setSelectedFields}
              options={fieldOptions}
              placeholder={t('SELECT_FIELDS_TO_INCLUDE')}
              hideClearAllButton
              disabled={isPending || !fieldOptions.length}
              maxSelected={MAX_PDF_FIELDS}
              onMaxSelected={() =>
                toast.error(
                  t('MAX_PDF_FIELDS_REACHED', { max: MAX_PDF_FIELDS }),
                )
              }
            />
            {!fieldOptions.length ? (
              <p className="text-xs text-muted-foreground">
                {t('NO_BENEFICIARY_QR_FIELDS_CONFIGURED')}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                {t('SELECT_UP_TO_MAX_FIELDS', { max: MAX_PDF_FIELDS })}
              </p>
            )}
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            className="cursor-pointer"
          >
            {t('CANCEL')}
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isPending || exceedsMaxFields}
            className="cursor-pointer"
          >
            {isPending && <Loader2 size={16} className="mr-2 animate-spin" />}
            {isPending ? t('GENERATING') : t('GENERATE_QR')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

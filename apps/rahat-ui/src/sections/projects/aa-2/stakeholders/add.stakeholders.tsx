import { useTranslations } from 'next-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateStakeholders } from '@rahat-ui/query';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import { PhoneInput } from '@rahat-ui/shadcn/src/components/ui/phone-input';
import { HeaderWithBack, UnsavedChangesDialog } from 'apps/rahat-ui/src/common';
import { useUnsavedChanges } from 'apps/rahat-ui/src/hooks/useUnsavedChanges';
import { useSessionFormStorage } from 'apps/rahat-ui/src/hooks/useSessionFormStorage';
import { UUID } from 'crypto';
import { Tag, TagInput } from 'emblor';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { z } from 'zod';
import { normalizeNumeralsPreprocessor } from 'apps/rahat-ui/src/utils/i18n/numeral';
import { usePhoneCountrySelectProps } from 'apps/rahat-ui/src/utils/i18n/phone';

type FormValues = {
  name: string;
  phone: string;
  email: string;
  designation: string;
  organization: string;
  district: string;
  municipality: string;
  supportArea?: { id: string; text: string }[];
};

const DEFAULT_FORM_VALUES: FormValues = {
  name: '',
  phone: '+977',
  email: '',
  designation: '',
  organization: '',
  district: '',
  municipality: '',
};

export default function AddStakeholders() {
  const t = useTranslations('AA_PROJECT');
  const tg = useTranslations('GLOBAL');
  const phoneCountrySelectProps = usePhoneCountrySelectProps();
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const addedFromGroup = searchParams.get('fromGroup');
  const createStakeholder = useCreateStakeholders();
  const [variationTags, setVariationTags] = useState<Tag[]>([]);
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);
  const [unsavedSupportAreaInput, setUnsavedSupportAreaInput] =
    useState<string>('');
  const hasInteracted = useRef(false);
  const isRestored = useRef(false);
  const isSubmittingRef = useRef(false);
  const [showClearDialog, setShowClearDialog] = useState(false);

  const { loadSaved, saveData, clearSaved } = useSessionFormStorage<FormValues>(
    {
      key: 'stakeholder_draft',
      projectId: id as string,
      defaultValue: DEFAULT_FORM_VALUES,
    },
  );
  const isValidPhoneNumberRefinement = (value: string | undefined) => {
    if (value === undefined || value === '') return true; // If phone number is empty or undefined, it's considered valid
    return isValidPhoneNumber(value);
  };

  const FormSchema = z.object({
    name: z
      .string()
      .regex(/^[\p{L}\p{M}\s]*$/u, t('ONLY_ALPHABETIC_CHARACTERS'))
      .min(2, { message: t('PLEASE_ENTER_NAME') }),
    phone: z.preprocess(
      normalizeNumeralsPreprocessor,
      z.string().refine(isValidPhoneNumberRefinement, {
        message: t('INVALID_PHONE_NUMBER'),
      }),
    ),
    email: z
      .string()
      .optional()
      .refine((email) => !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), {
        message: t('INVALID_EMAIL_ADDRESS'),
      }),
    designation: z
      .string()
      .regex(/^[\p{L}\p{M}\s]*$/u, t('ONLY_ALPHABETIC_CHARACTERS'))
      .min(2, { message: t('PLEASE_ENTER_DESIGNATION') }),
    organization: z
      .string()
      .regex(/^[\p{L}\p{M}\s]*$/u, t('ONLY_ALPHABETIC_CHARACTERS'))
      .min(2, { message: t('PLEASE_ENTER_ORGANIZATION') }),
    district: z
      .string()
      .regex(/^[\p{L}\p{M}\s]*$/u, t('ONLY_ALPHABETIC_CHARACTERS'))
      .min(2, { message: t('PLEASE_ENTER_DISTRICT') }),
    municipality: z
      .string()
      .regex(/^[\p{L}\p{M}\s]*$/u, t('ONLY_ALPHABETIC_CHARACTERS'))
      .min(2, { message: t('PLEASE_ENTER_MUNICIPALITY') }),
    supportArea: z
      .array(
        z.object({
          id: z.string(),
          text: z.string(),
        }),
      )
      .optional(),
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    mode: 'onChange',
    defaultValues: DEFAULT_FORM_VALUES,
  });

  // Restore saved data after   projectId becomes available
  useEffect(() => {
    if (isRestored.current || !id) return;
    const saved = loadSaved();
    if (saved && Object.keys(saved).length > 0) {
      form.reset(saved);
      if (saved.supportArea && saved.supportArea.length > 0) {
        setVariationTags(saved.supportArea);
      }
    }
    isRestored.current = true;
  }, [id]);

  const saveCurrentForm = () => {
    const values = form.getValues();
    saveData({ ...values, supportArea: variationTags });
  };

  const handleClearForm = () => {
    clearSaved();
    form.reset(DEFAULT_FORM_VALUES);
    setVariationTags([]);
    setUnsavedSupportAreaInput('');
    setShowClearDialog(false);
  };

  const hasUnsavedChanges =
    !isSubmittingRef.current &&
    ((hasInteracted.current && form.formState.isDirty) ||
      unsavedSupportAreaInput.trim() !== '');

  const { showDialog, handleConfirmLeave, handleCancelLeave } =
    useUnsavedChanges({
      hasUnsavedChanges,
      onConfirm: () => {
        saveCurrentForm();
      },
    });
  // Handle Enter key in the support area TagInput
  const handleSupportAreaKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === 'Enter') {
      // Prevent form submission on Enter
      e.preventDefault();
      if (unsavedSupportAreaInput.trim() !== '') {
        const newTag: Tag = {
          id: new Date().getTime().toString(),
          text: unsavedSupportAreaInput.trim(),
        };
        const updatedTags = [...variationTags, newTag];
        setVariationTags(updatedTags);
        form.setValue('supportArea', updatedTags);
        setUnsavedSupportAreaInput('');
      }
    }
  };
  const handleCreateStakeholders = async (data: z.infer<typeof FormSchema>) => {
    isSubmittingRef.current = true;
    try {
      const payload = {
        ...data,
        supportArea: data?.supportArea?.map((t) => t.text),
      };
      await createStakeholder.mutateAsync({
        projectUUID: id as UUID,
        stakeholderPayload: payload,
      });
      clearSaved();
      form.reset();
      router.push(`/projects/aa/${id}/stakeholders`);
    } catch (e) {
      isSubmittingRef.current = false;
      console.error('Create Stakeholder Error::', e);
    }
  };

  return (
    <div className="p-4">
      <HeaderWithBack
        title={t('CREATE_STAKEHOLDER')}
        subtitle={t('FILL_THE_FORM_BELOW_TO_CREATE')}
        path={`/projects/aa/${id}/stakeholders`}
      />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleCreateStakeholders)}
          onFocus={() => {
            hasInteracted.current = true;
          }}
        >
          <div className="p-[clamp(6px,1vw,10px)] rounded-sm border bg-card gap-3">
            <div className="grid grid-cols-2 gap-[clamp(6px,0.8vw,12px)]  ">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => {
                  return (
                    <FormItem className="space-y-[clamp(2px,0.4vw,6px)]">
                      <Label className="text-[clamp(11px,1vw,14px)]">
                        {t('STAKEHOLDERS_NAME')}
                      </Label>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={t('ENTER_A_STAKEHOLDER_NAME')}
                          className="h-[clamp(28px,3vw,36px)] text-[clamp(11px,1vw,14px)]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="supportArea"
                render={({ field }) => {
                  return (
                    <FormItem className="space-y-[clamp(2px,0.4vw,6px)]">
                      <Label className="text-[clamp(11px,1vw,14px)]">
                        {t('SUPPORT_AREA')}
                      </Label>
                      <FormControl>
                        <>
                          <TagInput
                            {...field}
                            tags={variationTags}
                            setTags={(newTags) => {
                              setVariationTags(newTags);
                              form.setValue(
                                'supportArea',
                                newTags as [Tag, ...Tag[]],
                              );
                            }}
                            placeholder={t('ENTER_A_SUPPORT_AREA')}
                            className="min-h-[23px]"
                            styleClasses={{
                              inlineTagsContainer:
                                'border-input rounded shadow-xs p-1 gap-1 min-h-[clamp(28px,3vw,36px)] ' +
                                'focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500',
                              input:
                                'w-full rounded-sm min-w-[80px] shadow-none px-2 h-[clamp(22px,2.4vw,28px)] text-[clamp(11px,1vw,14px)]',
                              tag: {
                                body: 'h-[clamp(22px,2.4vw,28px)] relative rounded-sm border border-input font-medium text-[clamp(10px,0.9vw,12px)] ps-2 pe-7',
                                closeButton:
                                  'absolute -inset-y-px -end-px p-0 rounded-e-md flex size-[clamp(22px,2.4vw,28px)] transition-[color,box-shadow] outline-none focus-visible:ring-2 focus-visible:ring-blue-500 text-muted-foreground/80 hover:text-foreground',
                              },
                            }}
                            activeTagIndex={activeTagIndex}
                            setActiveTagIndex={setActiveTagIndex}
                            inputProps={{
                              value: unsavedSupportAreaInput,
                              onChange: (
                                e: React.ChangeEvent<HTMLInputElement>,
                              ) => setUnsavedSupportAreaInput(e.target.value),
                              onKeyDown: handleSupportAreaKeyDown,
                            }}
                          />
                          {unsavedSupportAreaInput && (
                            <span className="text-[clamp(11px,1vw,14px)] text-red-400 ml-1">
                              {t('PRESS_ENTER_TO_ADD')}
                            </span>
                          )}
                        </>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
            <div className="grid grid-cols-2 gap-[clamp(6px,0.8vw,12px)] mb-[clamp(6px,0.8vw,12px)] mt-[clamp(6px,0.8vw,12px)]">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => {
                  return (
                    <FormItem className="space-y-[clamp(2px,0.4vw,8px)]">
                      <Label className="text-[clamp(11px,1vw,14px)]">
                        {tg('PHONE_NUMBER')}
                      </Label>
                      <FormControl>
                        <PhoneInput
                          defaultCountry="NP"
                          placeholder={t('ENTER_A_PHONE_NUMBER')}
                          className="[&_input]:h-[clamp(28px,3vw,36px)] [&_input]:text-[clamp(11px,1vw,14px)] [&_button]:h-[clamp(28px,3vw,36px)]"
                          {...field}
                          {...phoneCountrySelectProps}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => {
                  return (
                    <FormItem className="space-y-[clamp(2px,0.4vw,8px)]">
                      <Label className="text-[clamp(11px,1vw,14px)]">
                        {tg('EMAIL')}
                      </Label>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder={t('ENTER_A_EMAIL_ADDRESS')}
                          className="h-[clamp(28px,3vw,36px)] text-[clamp(11px,1vw,14px)]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="designation"
                render={({ field }) => {
                  return (
                    <FormItem className="space-y-[clamp(2px,0.4vw,8px)]">
                      <Label className="text-[clamp(11px,1vw,14px)]">
                        {t('DESIGNATION')}
                      </Label>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={t('ENTER_A_DESIGNATION')}
                          className="h-[clamp(28px,3vw,36px)] text-[clamp(11px,1vw,14px)]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="organization"
                render={({ field }) => {
                  return (
                    <FormItem className="space-y-[clamp(2px,0.4vw,8px)]">
                      <Label className="text-[clamp(11px,1vw,14px)]">
                        {t('ORGANIZATION')}
                      </Label>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={t('ENTER_AN_ORGANIZATION')}
                          className="h-[clamp(28px,3vw,36px)] text-[clamp(11px,1vw,14px)]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="district"
                render={({ field }) => {
                  return (
                    <FormItem className="space-y-[clamp(2px,0.4vw,8px)]">
                      <Label className="text-[clamp(11px,1vw,14px)]">
                        {t('DISTRICT')}
                      </Label>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={t('ENTER_A_DISTRICT')}
                          className="h-[clamp(28px,3vw,36px)] text-[clamp(11px,1vw,14px)]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="municipality"
                render={({ field }) => {
                  return (
                    <FormItem className="space-y-[clamp(2px,0.4vw,8px)]">
                      <Label className="text-[clamp(11px,1vw,14px)]">
                        {t('MUNICIPALITY')}
                      </Label>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={t('ENTER_A_MUNICIPALITY')}
                          className="h-[clamp(28px,3vw,36px)] text-[clamp(11px,1vw,14px)]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="secondary"
                className="h-[clamp(28px,3vw,36px)] px-[clamp(16px,2vw,32px)] text-[clamp(11px,1vw,14px)]"
                onClick={() => setShowClearDialog(true)}
              >
                {tg('CLEAR')}
              </Button>
              <Button
                className="h-[clamp(28px,3vw,36px)] min-w-[clamp(80px,8vw,128px)] text-[clamp(11px,1vw,14px)]"
                disabled={
                  form.formState.isSubmitting ||
                  unsavedSupportAreaInput.trim() !== ''
                }
              >
                {tg('CREATE')}
              </Button>
            </div>
          </div>
        </form>
      </Form>

      <UnsavedChangesDialog
        open={showDialog}
        onConfirm={handleConfirmLeave}
        onCancel={handleCancelLeave}
        title="Unsaved Changes"
        description="You have unsaved changes. Your entered data will be saved and you can continue where you left off when you return."
        cancelText="No, stay here"
        confirmText="Yes, save and leave"
      />

      <UnsavedChangesDialog
        open={showClearDialog}
        onConfirm={handleClearForm}
        onCancel={() => setShowClearDialog(false)}
        title="Clear Form"
        description="Are you sure you want to clear the form? All entered data will be lost and any saved progress will be removed."
        cancelText="No, keep it"
        confirmText="Yes, clear all"
      />
    </div>
  );
}

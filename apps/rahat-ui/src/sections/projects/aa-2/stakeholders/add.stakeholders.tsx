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
      .regex(/^[A-Za-z\s]*$/, 'Only alphabetic characters are allowed.')
      .min(2, { message: 'Please enter name.' }),
    phone: z.string().refine(isValidPhoneNumberRefinement, {
      message: 'Invalid phone number',
    }),
    email: z
      .string()
      .optional()
      .refine((email) => !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), {
        message: 'Invalid email address',
      }),
    designation: z
      .string()
      .regex(/^[A-Za-z\s]*$/, 'Only alphabetic characters are allowed.')
      .min(2, { message: 'Please enter designation.' }),
    organization: z
      .string()
      .regex(/^[A-Za-z\s]*$/, 'Only alphabetic characters are allowed.')
      .min(2, { message: 'Please enter organization.' }),
    district: z.string().min(2, { message: 'Please enter district.' }),
    municipality: z.string().min(2, { message: 'Please enter municipality' }),
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

  // Restore saved data after projectId becomes available
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
        title={'Create Stakeholder'}
        subtitle="Fill the form below  to create a new stakeholder"
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
                        Stakeholders Name
                      </Label>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter a Stakeholder Name"
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
                        Support Area
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
                            placeholder={'Enter a Support Area'}
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
                              Press Enter to add.
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
                        Phone Number
                      </Label>
                      <FormControl>
                        <PhoneInput
                          defaultCountry="NP"
                          placeholder="Enter a Phone Number"
                          className="[&_input]:h-[clamp(28px,3vw,36px)] [&_input]:text-[clamp(11px,1vw,14px)] [&_button]:h-[clamp(28px,3vw,36px)]"
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
                name="email"
                render={({ field }) => {
                  return (
                    <FormItem className="space-y-[clamp(2px,0.4vw,8px)]">
                      <Label className="text-[clamp(11px,1vw,14px)]">
                        Email
                      </Label>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter a Email Address"
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
                        Designation
                      </Label>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter a Designation"
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
                        Organization
                      </Label>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter an Organization"
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
                        District
                      </Label>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter a District"
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
                        Municipality
                      </Label>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter a Municipality"
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
                Clear
              </Button>
              <Button
                className="h-[clamp(28px,3vw,36px)] min-w-[clamp(80px,8vw,128px)] text-[clamp(11px,1vw,14px)]"
                disabled={
                  form.formState.isSubmitting ||
                  unsavedSupportAreaInput.trim() !== ''
                }
              >
                Create
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

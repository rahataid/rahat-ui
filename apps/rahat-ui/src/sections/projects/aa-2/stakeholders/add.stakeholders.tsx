import React, { useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { UUID } from 'crypto';
import { HeaderWithBack } from 'apps/rahat-ui/src/common';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { PhoneInput } from '@rahat-ui/shadcn/src/components/ui/phone-input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import { DISTRICTS_OF_NEPAL } from 'apps/rahat-ui/src/common/data/district';
import { MUNICIPALITIES_OF_NEPAL } from 'apps/rahat-ui/src/common/data/municipality';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { useCreateStakeholders } from '@rahat-ui/query';
import { Tag, TagInput } from 'emblor';

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

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      phone: '+977',
      email: '',
      designation: '',
      organization: '',
      district: '',
      municipality: '',
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
    try {
      const payload = {
        ...data,
        supportArea: data?.supportArea?.map((t) => t.text),
      };
      await createStakeholder.mutateAsync({
        projectUUID: id as UUID,
        stakeholderPayload: payload,
      });
      router.push(`/projects/aa/${id}/stakeholders`);
      form.reset();
    } catch (e) {
      console.error('Create Stakeholder Error::', e);
    }
  };
  const l = form.watch('supportArea');

  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <HeaderWithBack
          title={'Create Stakeholder'}
          subtitle="Fill the form below  to create a new stakeholder"
          path={`/projects/aa/${id}/stakeholders`}
        />
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleCreateStakeholders)}>
          <div className=" p-4 rounded-lg border bg-card gap-3">
            <div className="grid grid-cols-2 gap-4 mb-4 mt-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <Label>Stakeholders Name</Label>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter a Stakeholder Name"
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
                    <FormItem>
                      <Label>
                        Support Area{' '}
                        {unsavedSupportAreaInput && (
                          <span className="text-sm text-red-400 ml-1">
                            Press Enter to add.
                          </span>
                        )}
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
                                'border-input rounded shadow-xs p-1 gap-1 ' +
                                'focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500',
                              input:
                                'w-full rounded-sm min-w-[80px] shadow-none px-2 h-7',
                              tag: {
                                body: 'h-7 relative rounded-sm border border-input font-medium text-xs ps-2 pe-7',
                                closeButton:
                                  'absolute -inset-y-px -end-px p-0 rounded-e-md flex size-7 transition-[color,box-shadow] outline-none focus-visible:ring-2 focus-visible:ring-blue-500 text-muted-foreground/80 hover:text-foreground',
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
                        </>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4 mt-5">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <Label>Phone Number</Label>
                      <FormControl>
                        <PhoneInput
                          defaultCountry="NP"
                          placeholder="Enter a Phone Number"
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
                    <FormItem>
                      <Label>Email</Label>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter a Email Address"
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
                    <FormItem>
                      <Label>Designation</Label>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter a Designation"
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
                    <FormItem>
                      <Label>Organization</Label>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter an Organization"
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
                    <FormItem>
                      <Label>District</Label>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter a District"
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
                    <FormItem>
                      <Label>Municipality</Label>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter a Municipality"
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
                className=" px-8 "
                onClick={() => {
                  form.reset();
                  setUnsavedSupportAreaInput('');
                }}
              >
                Clear
              </Button>
              <Button
                className="w-32"
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
    </div>
  );
}

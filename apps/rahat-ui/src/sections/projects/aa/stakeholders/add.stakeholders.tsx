import React from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';

import { isValidPhoneNumber } from 'react-phone-number-input';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { z } from 'zod';
import { PhoneInput } from '@rahat-ui/shadcn/src/components/ui/phone-input';
import { useCreateStakeholders } from '@rahat-ui/query';
import { UUID } from 'crypto';

export default function AddStakeholders() {
  const t = useTranslations('AA Project');
  const tg = useTranslations('GLOBAL');
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const stakeholdersListPath = `/projects/aa/${id}/stakeholders`;

  const addedFromGroup = searchParams.get('fromGroup');
  const createStakeholder = useCreateStakeholders();

  const isValidPhoneNumberRefinement = (value: string | undefined) => {
    if (value === undefined || value === '') return true; // If phone number is empty or undefined, it's considered valid
    return isValidPhoneNumber(value);
  };

  const FormSchema = z.object({
    name: z
      .string()
      .regex(/^[A-Za-z\s]*$/, t('ONLY_ALPHABETIC_CHARACTERS'))
      .min(2, { message: t('PLEASE_ENTER_NAME') }),
    phone: z.string().optional().refine(isValidPhoneNumberRefinement, {
      message: t('INVALID_PHONE_NUMBER'),
    }),
    email: z.string().optional(),
    designation: z
      .string()
      .regex(/^[A-Za-z\s]*$/, t('ONLY_ALPHABETIC_CHARACTERS'))
      .min(2, { message: t('PLEASE_ENTER_DESIGNATION') }),
    organization: z
      .string()
      .regex(/^[A-Za-z\s]*$/, t('ONLY_ALPHABETIC_CHARACTERS'))
      .min(2, { message: t('PLEASE_ENTER_ORGANIZATION') }),
    district: z
      .string()
      .regex(/^[A-Za-z\s]*$/, t('ONLY_ALPHABETIC_CHARACTERS'))
      .min(2, { message: t('PLEASE_ENTER_DISTRICT') }),
    municipality: z
      .string()
      .regex(/^[A-Za-z\s]*$/, t('ONLY_ALPHABETIC_CHARACTERS'))
      .min(2, { message: t('PLEASE_ENTER_MUNICIPALITY') }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      designation: '',
      organization: '',
      district: '',
      municipality: '',
    },
  });

  const handleCreateStakeholders = async (data: z.infer<typeof FormSchema>) => {
    try {
      await createStakeholder.mutateAsync({
        projectUUID: id as UUID,
        stakeholderPayload: data,
      });
      if (addedFromGroup == 'true') {
        router.push(`/projects/aa/${id}/groups/add`);
      } else router.push(stakeholdersListPath);
    } catch (e) {
      console.error('Create Stakeholder Error::', e);
    }
  };

  React.useEffect(() => {
    if (createStakeholder.isSuccess) {
      form.reset();
    }
  }, [createStakeholder.isSuccess]);
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleCreateStakeholders)}>
        <div className="p-4 h-add bg-secondary">
          <div className="shadow-md p-4 rounded-sm bg-card">
            <h1 className="text-lg font-semibold mb-6">Add : Stakeholders</h1>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormControl>
                        <Input type="text" placeholder={tg('NAME')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormControl>
                        <PhoneInput placeholder={tg('PHONE')} {...field} />
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
                      <FormControl>
                        <Input
                          type="email"
                          placeholder={tg('EMAIL_ADDRESS')}
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
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={t('DESIGNATION')}
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
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={tg('ORGANIZATION')}
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
                      <FormControl>
                        <Input type="text"                           placeholder={tg('ADDRESS')} {...field} />
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
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={t('MUNICIPALITY')}
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
                className="bg-red-100 text-red-600 px-8 hover:bg-red-200"
                onClick={() => router.push(stakeholdersListPath)}
              >
                Cancel
              </Button>
              <Button>Create Stakeholders</Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}

import * as React from 'react';
import { useParams } from 'next/navigation';
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
import { z } from 'zod';
import { PhoneInput } from '@rahat-ui/shadcn/src/components/ui/phone-input';

import { useSecondPanel } from 'apps/rahat-ui/src/providers/second-panel-provider';
import { IStakeholdersItem } from 'apps/rahat-ui/src/types/stakeholders';
import { useUpdateStakeholders } from '@rahat-ui/query';
import { useTranslations } from 'next-intl';
import { UUID } from 'crypto';

type IProps = {
  stakeholdersDetail: IStakeholdersItem;
};

export default function EditStakeholders({ stakeholdersDetail }: IProps) {
  const t = useTranslations('AA Project');
  const tg = useTranslations('GLOBAL');
  const { id } = useParams();
  const { closeSecondPanel } = useSecondPanel();

  const updateStakeholder = useUpdateStakeholders();

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
    defaultValues: {},
  });

  React.useEffect(() => {
    form.setValue('name', stakeholdersDetail?.name);
    form.setValue('phone', stakeholdersDetail?.phone || '');
    form.setValue('email', stakeholdersDetail?.email || '');
    form.setValue('designation', stakeholdersDetail?.designation);
    form.setValue('organization', stakeholdersDetail?.organization);
    form.setValue('district', stakeholdersDetail?.district);
    form.setValue('municipality', stakeholdersDetail?.municipality);
  }, [stakeholdersDetail]);

  const handleEditStakeholders = async (data: z.infer<typeof FormSchema>) => {
    try {
      await updateStakeholder.mutateAsync({
        projectUUID: id as UUID,
        stakeholderPayload: { ...data, uuid: stakeholdersDetail?.uuid },
      });
    } catch (e) {
      console.error('Update Stakeholder Error::', e);
    }
  };

  React.useEffect(() => {
    updateStakeholder.isSuccess && closeSecondPanel();
  }, [updateStakeholder]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleEditStakeholders)}>
        <div className="p-4 bg-card">
          <h1 className="text-lg font-semibold mb-6">Edit : Stakeholder</h1>
          <div className="shadow-md p-4 rounded-sm">
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
            <div className="flex justify-end">
              <Button>Update Stakeholders</Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}

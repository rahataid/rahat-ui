'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { PhoneInput } from '@rahat-ui/shadcn/src/components/ui/phone-input';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { useForm } from 'react-hook-form';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { z } from 'zod';
import { Loader2, Wallet } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import {
  RadioGroup,
  RadioGroupItem,
} from '@rahat-ui/shadcn/src/components/ui/radio-group';
import { UUID } from 'crypto';
import HeaderWithBack from '../projects/components/header.with.back';
import { Gender } from '@rahataid/sdk/enums';
import { useGetVendor, useUpdateVendor } from '@rahat-ui/query';
import { useTranslations } from 'next-intl';

export default function EditVendors() {
  const t = useTranslations('Vendors – Edit');
  const g = useTranslations('GLOBAL');
  const router = useRouter();
  const { id } = useParams() as { id: UUID };

  const { data: vendorDetails, isLoading } = useGetVendor(id);
  const vendor = React.useMemo(() => {
    return vendorDetails?.data;
  }, [vendorDetails]);

  const updateVendor = useUpdateVendor();

  const FormSchema = z.object({
    name: z.string().min(2, { message: t('NAME_MUST_BE_AT_LEAST4') }),
    wallet: z.string(),
    phone: z
      .string()
      .refine(isValidPhoneNumber, { message: t('INVALID_PHONE_NUMBER') }),
    email: z.string().optional(),
    gender: z
      .string()
      .toUpperCase()
      .min(4, { message: t('MUST_SELECT_A_GENDER') }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      gender: '',
      wallet: '',
      email: '',
      phone: '',
    },
  });

  React.useEffect(() => {
    if (vendor) {
      form.reset({
        name: vendor?.name?.toString(),
        gender: vendor?.gender?.toString(),
        email: vendor?.email?.toString(),
        phone: vendor?.phone?.toString(),
        wallet: vendor?.wallet?.toString(),
      });
    }
  }, [vendor, form.reset]);

  const handleEditVendor = async (data: z.infer<typeof FormSchema>) => {
    await updateVendor.mutateAsync({
      uuid: id,
      payload: { ...data },
    });
    router.push('/vendors');
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleEditVendor)}>
          <div className="p-4 h-[calc(100vh-115px)]">
            <HeaderWithBack
              title={t('EDIT_VENDOR')}
              subtitle={t('EDIT_VENDOR_DETAIL')}
              path="/vendors"
            />
            <div className="shadow-md p-4 rounded-sm bg-card">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>{t('VENDOR_NAME')}</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder={t('ENTER_VENDOR_NAME')}
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
                  name="gender"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>{g('GENDER')}</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex space-x-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value={Gender.MALE} />
                            </FormControl>
                            <FormLabel className="font-normal">{g('MALE')}</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value={Gender.FEMALE} />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {g('FEMALE')}
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value={Gender.OTHER} />
                            </FormControl>
                            <FormLabel className="font-normal">{g('OTHER')}</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="UNKNOWN" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {g('UNKNOWN')}
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>{g('PHONE_NUMBER')}</FormLabel>
                        <FormControl>
                          <PhoneInput
                            placeholder={g('ENTER_PHONE_NUMBER')}
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
                        <FormLabel>{g('EMAIL')}</FormLabel>
                        <FormControl>
                          <Input placeholder={g('ENTER_EMAIL_ADDRESS')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                <FormField
                  control={form.control}
                  name="wallet"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>{g('WALLET_ADDRESS')}</FormLabel>
                        <FormControl>
                          <div className="relative w-full">
                            <Wallet className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="text"
                              placeholder={g('ENTER_WALLET_ADDRESS')}
                              {...field}
                            />
                            <p className="text-xs text-amber-500 mt-2">
                              {g('WALLET_ADDRESS_IS_REQUIRED_IF_NOT')}
                            </p>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2 py-2 px-4 border-t">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                form.reset();
              }}
            >
              {g('RESET')}
            </Button>
            {updateVendor.isPending ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {g('PLEASE_WAIT')}
              </Button>
            ) : (
              <Button className="px-10">{g('SAVE_CHANGES')}</Button>
            )}
          </div>
        </form>
      </Form>
    </>
  );
}

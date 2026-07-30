'use client';

import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import { z } from 'zod';
import { useUpdateBeneficiary } from '@rahat-ui/query';
import { useSecondPanel } from '../../providers/second-panel-provider';
import Back from '../projects/components/back';
import {
  RadioGroup,
  RadioGroupItem,
} from '@rahat-ui/shadcn/src/components/ui/radio-group';
import { PhoneInput } from '@rahat-ui/shadcn/src/components/ui/phone-input';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { Wallet } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function EditBeneficiary({ beneficiary }: any) {
  const { closeSecondPanel } = useSecondPanel();
  const updateBeneficiary = useUpdateBeneficiary();
  const t = useTranslations('GLOBAL');

  const FormSchema = z.object({
    name: z.string().min(2, { message: t('NAME_MIN_LENGTH') }),
    walletAddress: z.string(),
    phone: z
      .string()
      .refine(isValidPhoneNumber, { message: t('INVALID_PHONE') }),
    email: z.string().optional(),
    gender: z
      .string()
      .toUpperCase()
      .min(4, { message: t('GENDER_REQUIRED') }),
    bankedStatus: z.string().toUpperCase(),
    internetStatus: z.string().toUpperCase(),
    phoneStatus: z.string().toUpperCase(),
    address: z.string(),
    age: z.string(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: beneficiary?.piiData?.name,
      phone: beneficiary?.piiData?.phone,
      gender: beneficiary?.gender,
      walletAddress: beneficiary?.walletAddress,
      bankedStatus: beneficiary?.bankedStatus,
      internetStatus: beneficiary?.internetStatus,
      phoneStatus: beneficiary?.phoneStatus,
    },
  });

  const handleEditBeneficiary = async (data: z.infer<typeof FormSchema>) => {
    try {
      await updateBeneficiary.mutateAsync({
        id: beneficiary.id,
        uuid: beneficiary.uuid,
        gender: data.gender,
        bankedStatus: data.bankedStatus,
        internetStatus: data.internetStatus,
        phoneStatus: data.phoneStatus,
        piiData: {
          name: data.name,
          phone: data.phone,
        },
        walletAddress: data.walletAddress,
      });
    } catch (e) {
      console.error('Error::', e);
    }
  };

  useEffect(() => {
    updateBeneficiary.isSuccess && closeSecondPanel();
  }, [updateBeneficiary]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleEditBeneficiary)}>
        <div className="p-4 h-add">
          <div className="flex space-x-3 mb-10">
            <Back path="/beneficiary" />
            <div>
              <h1 className="text-2xl font-semibold">{t('EDIT_BENEFICIARY')}</h1>
              <p className=" text-muted-foreground">{t('EDIT_BENEFICIARY_DETAIL')}</p>
            </div>
          </div>
          <div className="shadow-md p-4 rounded-sm bg-card">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>{t('BENEFICIARY_NAME')}</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={t('ENTER_BENEFICIARY_NAME')}
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
                    <FormLabel>{t('GENDER')}</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex space-x-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="male" />
                          </FormControl>
                          <FormLabel className="font-normal">{t('MALE')}</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="female" />
                          </FormControl>
                          <FormLabel className="font-normal">{t('FEMALE')}</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="other" />
                          </FormControl>
                          <FormLabel className="font-normal">{t('OTHER')}</FormLabel>
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
                      <FormLabel>{t('PHONE_NUMBER')}</FormLabel>
                      <FormControl>
                        <PhoneInput
                          placeholder={t('ENTER_PHONE_NUMBER')}
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
                      <FormLabel>{t('EMAIL')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('ENTER_EMAIL_ADDRESS')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>{t('ESTIMATED_AGE')}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder={t('ENTER_ESTIMATED_AGE')}
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
                name="address"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>{t('ADDRESS')}</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={t('ENTER_BENEFICIARY_ADDRESS')}
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
                name="phoneStatus"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>{t('PHONE_STATUS')}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('SELECT_PHONE_STATUS')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="smart_phone">
                            {t('SMART_PHONE') || 'Smart Phone'}
                          </SelectItem>
                          <SelectItem value="no_phone">{t('NO_PHONE') || 'No Phone'}</SelectItem>
                          <SelectItem value="feature_phone">
                            {t('FEATURE_PHONE') || 'Feature Phone'}
                          </SelectItem>
                          <SelectItem value="unknown">{t('UNKNOWN')}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="bankedStatus"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>{t('BANKING_STATUS')}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('SELECT_BANKING_STATUS')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="banked">{t('BANKED') || 'Banked'}</SelectItem>
                          <SelectItem value="under_banked">
                            {t('UNDER_BANKED') || 'Under Banked'}
                          </SelectItem>
                          <SelectItem value="unBanked">{t('UNBANKED') || 'UnBanked'}</SelectItem>
                          <SelectItem value="unknown">{t('UNKNOWN')}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="internetStatus"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>{t('INTERNET_STATUS')}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('SELECT_INTERNET_STATUS')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="mobile_internet">
                            {t('MOBILE_INTERNET') || 'Mobile Internet'}
                          </SelectItem>
                          <SelectItem value="no_internet">
                            {t('NO_INTERNET') || 'No Internet'}
                          </SelectItem>
                          <SelectItem value="home_internet">
                            {t('HOME_INTERNET') || 'Home Internet'}
                          </SelectItem>
                          <SelectItem value="unknown">{t('UNKNOWN')}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="walletAddress"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>{t('WALLET_ADDRESS')}</FormLabel>
                      <FormControl>
                        <div className="relative w-full">
                          <Wallet className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="text"
                            placeholder={t('ENTER_WALLET_ADDRESS')}
                            {...field}
                          />
                          {/* {!field.value ? ( */}
                          <p className="text-xs text-amber-500 mt-2">
                            {t('WALLET_ADDRESS_IS_REQUIRED_IF_NOT')}
                          </p>
                          {/* ) : (
                            ''
                          )} */}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button>{t('EDIT_BENEFICIARY')}</Button>
          </div>
        </div>
      </form>
    </Form>
  );
}

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateBeneficiary } from '@rahat-ui/query';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { z } from 'zod';
import { Loader2, Wallet } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {
  RadioGroup,
  RadioGroupItem,
} from '@rahat-ui/shadcn/src/components/ui/radio-group';
import Back from '../../projects/components/back';
import HeaderWithBack from '../../projects/components/header.with.back';
import { useTranslations } from 'next-intl';
import { normalizeNumeralsPreprocessor } from 'apps/rahat-ui/src/utils/numeral.utils';

export default function AddBeneficiaryForm() {
  const addBeneficiary = useCreateBeneficiary();
  const router = useRouter();
  const t = useTranslations('BENEFICIARY_ADD');
  const g = useTranslations('GLOBAL');

  const FormSchema = z.object({
    name: z
      .string({ required_error: g('REQUIRED') })
      .min(4, { message: g('NAME_MIN_LENGTH') })
      .regex(/^[\p{L}\p{M}\s]+$/u, {
        message: g('NAME_LETTERS_ONLY'),
      }),
    walletAddress: z.string({ required_error: g('REQUIRED') }),
    phone: z.preprocess(
      normalizeNumeralsPreprocessor,
      z
        .string({ required_error: g('REQUIRED') })
        .refine(isValidPhoneNumber, { message: g('INVALID_PHONE') }),
    ),
    email: z
      .string()
      .optional()
      .refine((email) => !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), {
        message: g('INVALID_EMAIL'),
      }),
    gender: z.string().optional(),
    bankedStatus: z.string({ required_error: g('REQUIRED') }).toUpperCase(),
    internetStatus: z
      .string({ required_error: g('REQUIRED') })
      .toUpperCase(),
    phoneStatus: z.string({ required_error: g('REQUIRED') }).toUpperCase(),
    address: z.string().optional(),
    age: z.preprocess(
      normalizeNumeralsPreprocessor,
      z
        .string()
        .optional()
        .refine((age) => !age || /^[1-9]\d*$/.test(age), {
          message: g('AGE_POSITIVE_INTEGER'),
        }),
    ),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      gender: '',
      walletAddress: '',
      email: '',
      phone: '',
      bankedStatus: '',
      internetStatus: '',
      phoneStatus: '',
      age: '',
      address: '',
    },
  });

  const handleCreateBeneficiary = async (data: z.infer<typeof FormSchema>) => {
    try {
      const result = await addBeneficiary.mutateAsync({
        gender: data.gender,
        location: data.address,
        age: data.age,
        bankedStatus: data.bankedStatus || 'UNKNOWN',
        internetStatus: data.internetStatus || 'UNKNOWN',
        phoneStatus: data.phoneStatus || 'UNKNOWN',
        piiData: {
          email: data.email,
          name: data.name,
          phone: data.phone,
        },
        walletAddress: data.walletAddress,
      });
      if (result) {
        toast.success(t('BENEFICIARY_ADDED_SUCCESSFULLY'));
        router.push('/beneficiary');
        form.reset();
      }
    } catch (e) {
      toast.error(e?.response?.data?.message || t('FAILED_TO_ADD_BENEFICIARY'));
    }
  };

  useEffect(() => {
    if (addBeneficiary.isSuccess) {
      router.push('/beneficiary');
    }
  }, [addBeneficiary.isSuccess]);

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleCreateBeneficiary)}>
          <div className="p-4 h-[calc(100vh-115px)]">
            <HeaderWithBack
              title={t('CREATE_BENEFICIARY')}
              subtitle={t('CREATE_A_NEW_BENEFICIARY')}
              path="/beneficiary"
            />
            <div className="shadow-md p-4 rounded-sm bg-card">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>{g('BENEFICIARY_NAME')}</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder={g('ENTER_BENEFICIARY_NAME')}
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
                          defaultValue={field.value}
                          className="flex space-x-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="MALE" />
                            </FormControl>
                            <FormLabel className="font-normal">{g('MALE')}</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="FEMALE" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {g('FEMALE')}
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="OTHER" />
                            </FormControl>
                            <FormLabel className="font-normal">{g('OTHER')}</FormLabel>
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
                  name="age"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>{g('ESTIMATED_AGE')}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder={g('ENTER_ESTIMATED_AGE')}
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
                        <FormLabel>{g('ADDRESS')}</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder={g('ENTER_BENEFICIARY_ADDRESS')}
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
                        <FormLabel>{g('PHONE_STATUS')}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={g('SELECT_PHONE_STATUS')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="smart_phone">
                              {g('SMART_PHONE')}
                            </SelectItem>
                            <SelectItem value="no_phone">{g('NO_PHONE')}</SelectItem>
                            <SelectItem value="feature_phone">
                              {g('FEATURE_PHONE')}
                            </SelectItem>
                            <SelectItem value="unknown">{g('UNKNOWN')}</SelectItem>
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
                        <FormLabel>{g('BANKING_STATUS')}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={g('SELECT_BANKING_STATUS')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="banked">{g('BANKED')}</SelectItem>
                            <SelectItem value="under_banked">
                              {g('UNDER_BANKED')}
                            </SelectItem>
                            <SelectItem value="unBanked">{g('UNBANKED')}</SelectItem>
                            <SelectItem value="unknown">{g('UNKNOWN')}</SelectItem>
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
                        <FormLabel>{g('INTERNET_STATUS')}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={g('SELECT_INTERNET_STATUS')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="mobile_internet">
                              {g('MOBILE_INTERNET')}
                            </SelectItem>
                            <SelectItem value="no_internet">
                              {g('NO_INTERNET')}
                            </SelectItem>
                            <SelectItem value="home_internet">
                              {g('HOME_INTERNET')}
                            </SelectItem>
                            <SelectItem value="unknown">{g('UNKNOWN')}</SelectItem>
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
                        <FormLabel>{g('WALLET_ADDRESS')}</FormLabel>
                        <FormControl>
                          <div className="relative w-full">
                            <Wallet className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="text"
                              placeholder={g('ENTER_WALLET_ADDRESS')}
                              {...field}
                            />
                            {/* {!field.value ? ( */}
                            <p className="text-xs text-amber-500 mt-2">
                              {g('WALLET_ADDRESS_IS_REQUIRED_IF_NOT')}
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
          </div>
          <div className="flex justify-end space-x-2 py-2 px-4 border-t">
            <Button
              type="button"
              variant="secondary"
              onClick={() => form.reset()}
            >
              {g('CLEAR')}
            </Button>
            {addBeneficiary.isPending ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {g('PLEASE_WAIT')}
              </Button>
            ) : (
              <Button className="px-10">{g('CREATE')}</Button>
            )}
          </div>
        </form>
      </Form>
    </>
  );
}

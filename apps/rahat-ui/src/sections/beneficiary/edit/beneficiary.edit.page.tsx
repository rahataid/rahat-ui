'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  useBeneficiaryStore,
  useCreateBeneficiary,
  useUpdateBeneficiary,
} from '@rahat-ui/query';
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
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import {
  RadioGroup,
  RadioGroupItem,
} from '@rahat-ui/shadcn/src/components/ui/radio-group';
import Back from '../../projects/components/back';
import { UUID } from 'crypto';
import HeaderWithBack from '../../projects/components/header.with.back';
import {
  Gender,
  PhoneStatus,
  InternetStatus,
  BankedStatus,
} from '@rahataid/sdk/enums';
import { useTranslations } from 'next-intl';

export default function AddBeneficiaryForm() {
  const updateBeneficiary = useUpdateBeneficiary();
  const router = useRouter();
  const { id } = useParams() as { id: UUID };
  const searchParams = useSearchParams();
  const groupId = searchParams.get('groupId');
  const isGroupValidForAA = searchParams.get('isGroupValidForAA');
  const isAssignedToProject = searchParams.get('isAssignedToProject');
  const fromTab = searchParams.get('fromTab') as string;
  const beneficiary = useBeneficiaryStore((state) => state.singleBeneficiary);
  const t = useTranslations('BENEFICIARY_EDIT');
  const g = useTranslations('GLOBAL');

  const FormSchema = z.object({
    name: z
      .string()
      .min(4, { message: g('NAME_MIN_LENGTH') })
      .regex(/^[a-zA-Z\s]+$/, {
        message: g('NAME_LETTERS_ONLY'),
      }),
    walletAddress: z.string(),
    phone: z
      .string()
      .refine(isValidPhoneNumber, { message: g('INVALID_PHONE') }),
    email: z
      .string()
      .optional()
      .refine((email) => !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), {
        message: g('INVALID_EMAIL'),
      }),
    gender: z.string().optional(),
    bankedStatus: z.string().toUpperCase(),
    internetStatus: z.string().toUpperCase(),
    phoneStatus: z.string().toUpperCase(),
    address: z.string().optional(),
    age: z
      .string()
      .optional()
      .refine((age) => !age || /^[1-9]\d*$/.test(age), {
        message: g('AGE_POSITIVE_INTEGER'),
      }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: beneficiary?.piiData?.name,
      gender: beneficiary?.gender,
      walletAddress: beneficiary?.walletAddress,
      email: beneficiary?.piiData?.email ?? '',
      phone: beneficiary?.piiData?.phone,
      bankedStatus: beneficiary?.bankedStatus,
      internetStatus: beneficiary?.internetStatus,
      phoneStatus: beneficiary?.phoneStatus,
      age: beneficiary?.age?.toString(),
      address: beneficiary?.location,
    },
  });

  const handleEditBeneficiary = async (data: z.infer<typeof FormSchema>) => {
    try {
      await updateBeneficiary.mutateAsync({
        id: beneficiary?.id,
        uuid: beneficiary?.uuid,
        location: data.address,
        age: data.age,
        gender: data.gender,
        bankedStatus: data.bankedStatus,
        internetStatus: data.internetStatus,
        phoneStatus: data.phoneStatus,
        piiData: {
          name: data.name,
          phone: data.phone,
          email: data.email,
        },
        walletAddress: data.walletAddress,
      });
      router.push(
        fromTab === 'beneficiaryGroups'
          ? `/beneficiary/groups/${groupId}?isAssignedToProject=${isAssignedToProject}&isGroupValidForAA=${isGroupValidForAA}&fromTab=${fromTab}`
          : '/beneficiary',
      );
    } catch (e) {
      console.error('Error::', e);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleEditBeneficiary)}>
          <div className="p-4 h-[calc(100vh-115px)]">
            <HeaderWithBack
              title={t('EDIT_BENEFICIARY')}
              subtitle={t('EDIT_BENEFICIARY_DETAIL')}
              path={
                fromTab === 'beneficiaryGroups'
                  ? `/beneficiary/groups/${groupId}?isAssignedToProject=${isAssignedToProject}&isGroupValidForAA=${isGroupValidForAA}&fromTab=${fromTab}`
                  : '/beneficiary'
              }
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
                            <SelectItem value={PhoneStatus.SMART_PHONE}>
                              {g('SMART_PHONE')}
                            </SelectItem>
                            <SelectItem value={PhoneStatus.NO_PHONE}>
                              {g('NO_PHONE')}
                            </SelectItem>
                            <SelectItem value={PhoneStatus.FEATURE_PHONE}>
                              {g('FEATURE_PHONE')}
                            </SelectItem>
                            <SelectItem value={PhoneStatus.UNKNOWN}>
                              {g('UNKNOWN')}
                            </SelectItem>
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
                            <SelectItem value={BankedStatus.BANKED}>
                              {g('BANKED')}
                            </SelectItem>
                            <SelectItem value={BankedStatus.UNDER_BANKED}>
                              {g('UNDER_BANKED')}
                            </SelectItem>
                            <SelectItem value={BankedStatus.UNBANKED}>
                              {g('UNBANKED')}
                            </SelectItem>
                            <SelectItem value={BankedStatus.UNKNOWN}>
                              {g('UNKNOWN')}
                            </SelectItem>
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
                            <SelectItem value={InternetStatus.MOBILE_INTERNET}>
                              {g('MOBILE_INTERNET')}
                            </SelectItem>
                            <SelectItem value={InternetStatus.NO_INTERNET}>
                              {g('NO_INTERNET')}
                            </SelectItem>
                            <SelectItem value={InternetStatus.HOME_INTERNET}>
                              {g('HOME_INTERNET')}
                            </SelectItem>
                            <SelectItem value={InternetStatus.UNKNOWN}>
                              {g('UNKNOWN')}
                            </SelectItem>
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
              // onClick={() => router.push('/beneficiary')}
              onClick={() => {
                form.reset();
              }}
            >
              {g('RESET')}
            </Button>
            {updateBeneficiary.isPending ? (
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

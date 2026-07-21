'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import { useRoleList, useSettingsStore } from '@rahat-ui/query';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
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
  useAddAdmin,
  useAddManager,
} from '../../hooks/el/contracts/el-contracts';
import { useRouter } from 'next/navigation';
import { PhoneInput } from '@rahat-ui/shadcn/src/components/ui/phone-input';
import HeaderWithBack from '../projects/components/header.with.back';
import { Wallet } from 'lucide-react';
import {
  RadioGroup,
  RadioGroupItem,
} from '@rahat-ui/shadcn/src/components/ui/radio-group';
import { Gender } from '@rahataid/sdk/enums';
import { useUserCreate } from '@rumsan/react-query';
import Swal from 'sweetalert2';

export default function AddUser() {
  const t = useTranslations('Users – Add');
  const tg = useTranslations('GLOBAL');

  const FormSchema = z.object({
    name: z.string().min(2, { message: t('NAME_MUST_BE_AT_LEAST4') }),
    email: z.string().email(),
    gender: z.string().min(1, { message: t('PLEASE_SELECT_GENDER') }),
    roles: z.array(z.string()).length(1, { message: t('PLEASE_SELECT_ROLE') }),
    phone: z.string(),
    wallet: z
      .string()
      .optional()
      .refine((val) => val === undefined || val === '' || val.length === 42, {
        message: t('ETH_ADDRESS_MUST_BE_EMPTY_OR42'),
      }),
  });

  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      gender: '',
      email: '',
      phone: '',
      roles: [],
      wallet: '',
    },
  });

  const { data: roleData } = useRoleList();
  const contractSettings = useSettingsStore((state) => state.accessManager);
  const roleSync = useSettingsStore((state) => state.roleOnChainSync);
  const route = useRouter();

  const userCreate = useUserCreate();
  const addManager = useAddManager();
  const addAdmin = useAddAdmin();

  const handleAddUser = async (data: any) => {
    try {
      if (roleSync === true) {
        if (data.roles.includes('Manager')) {
          await addManager.mutateAsync({
            data: data,
            walletAddress: data?.wallet,
            contractAddress: contractSettings as `0x${string}`,
          });
        } else if (data.roles.includes('Admin')) {
          await addAdmin.mutateAsync({
            data: data,
            walletAddress: data?.wallet,
            contractAddress: contractSettings as `0x${string}`,
          });
        } else {
          await userCreate.mutateAsync(data);
        }
      } else {
        await userCreate.mutateAsync(data);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : t('AN_UNEXPECTED_ERROR_OCCURRED');
      Swal.fire(t('USER_CREATION_FAILED'), errorMessage, 'error');
    }
  };

  useEffect(() => {
    if (userCreate.isSuccess) {
      Swal.fire(t('USER_CREATED_SUCCESSFULLY'), '', 'success');
      form.reset({
        name: '',
        gender: '',
        email: '',
        phone: '',
        roles: [],
        wallet: '',
      });
      route.push('/users');
    }
  }, [form, route, userCreate.isSuccess]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleAddUser)}>
        <div className="p-4 h-[calc(100vh-130px)]">
          <HeaderWithBack
            title={t('CREATE_USER')}
            subtitle={t('CREATE_A_NEW_USER_DETAIL')}
            path="/users"
          />

          <div className="grid grid-cols-2 gap-4 border p-4 rounded-md">
            <>
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('USER_NAME')}</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder={t('ENTER_USER_NAME')}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>{tg('GENDER')}</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex space-x-1"
                      >
                        {Object.values(Gender).map((gender) => (
                          <FormItem
                            key={gender}
                            className="flex items-center space-x-3 space-y-0"
                          >
                            <FormControl>
                              <RadioGroupItem value={gender} />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {tg(gender.toUpperCase())}
                            </FormLabel>
                          </FormItem>
                        ))}
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
                      <FormLabel>{tg('PHONE_NUMBER')}</FormLabel>
                      <FormControl>
                        <PhoneInput
                          placeholder={tg('ENTER_PHONE_NUMBER')}
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
                      <FormLabel>{tg('EMAIL')}</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={tg('ENTER_EMAIL_ADDRESS')}
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
                name="roles"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <Select
                        onValueChange={(value) => {
                          field.onChange([value]);
                        }}
                        value={field.value[0] ?? ''}
                      >
                        <FormLabel>{t('USER_ROLE')}</FormLabel>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('SELECT_USER_ROLE')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            {roleData?.data &&
                              roleData?.data?.map((role: any) => (
                                <SelectItem value={role.name} key={role.id}>
                                  {role.name}
                                </SelectItem>
                              ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
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
                      <FormLabel>{tg('WALLET_ADDRESS')}</FormLabel>
                      <FormControl>
                        <div className="relative w-full">
                          <Wallet className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="text"
                            placeholder={tg('ENTER_WALLET_ADDRESS')}
                            {...field}
                          />
                          <p className="text-xs text-amber-500 mt-2">
                            {tg('WALLET_ADDRESS_IS_REQUIRED_IF_NOT')}
                          </p>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </>
          </div>
        </div>
        <div className="flex justify-end space-x-2 p-4 border-t">
          <Button
            className="px-14"
            type="button"
            variant="secondary"
            onClick={() => {
              form.reset();
              // router.push('/users')
            }}
          >
            {tg('CLEAR')}
          </Button>
          <Button type="submit" className="px-10">
            {tg('CREATE')}
          </Button>
        </div>
      </form>
    </Form>
  );
}

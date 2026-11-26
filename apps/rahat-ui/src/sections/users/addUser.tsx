'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { usePhoneCountrySelectProps } from 'apps/rahat-ui/src/utils/i18n/phone';
import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import { useRoleList, useSettingsStore } from '@rahat-ui/query';
import { resolveBackendErrorMessage } from '@rahat-ui/query/utils/i18n/backend-error';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
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
import { cn } from '@rahat-ui/shadcn/src';
import {
  FormInput,
  FormSelectTrigger,
  UnsavedChangesDialog,
} from 'apps/rahat-ui/src/common';
import { useUnsavedChanges } from 'apps/rahat-ui/src/hooks/useUnsavedChanges';
import { useSessionFormStorage } from 'apps/rahat-ui/src/hooks/useSessionFormStorage';

export default function AddUser() {
  const t = useTranslations('USERS_ADD');
  const tg = useTranslations('GLOBAL');
  const tb = useTranslations();
  const phoneCountrySelectProps = usePhoneCountrySelectProps();

  const FormSchema = z.object({
    name: z.string().min(2, { message: t('NAME_MUST_BE_AT_LEAST4') }),
    email: z.string().email({ message: t('INVALID_EMAIL_ADDRESS') }),
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

  type FormValues = z.infer<typeof FormSchema>;
  const DEFAULT_FORM_VALUES: FormValues = {
    name: '',
    gender: '',
    email: '',
    phone: '',
    roles: [],
    wallet: '',
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const hasInteracted = useRef(false);
  const isRestored = useRef(false);
  const isSubmittingRef = useRef(false);

  const { loadSaved, saveData, clearSaved } = useSessionFormStorage<FormValues>({
    key: 'user_draft',
    projectId: 'core',
    defaultValue: DEFAULT_FORM_VALUES,
  });

  useEffect(() => {
    if (isRestored.current) return;
    const saved = loadSaved();
    if (saved && (saved.name || saved.email || saved.phone || saved.wallet || saved.roles?.length)) {
      form.reset({ ...DEFAULT_FORM_VALUES, ...saved });
    }
    isRestored.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hasUnsavedChanges =
    !isSubmittingRef.current && hasInteracted.current && form.formState.isDirty;

  const {
    showDialog,
    handleConfirmLeave,
    handleCancelLeave,
    handleDiscardLeave,
  } = useUnsavedChanges({
    hasUnsavedChanges,
    onConfirm: () => {
      saveData(form.getValues());
    },
    onDiscard: () => {
      clearSaved();
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
    isSubmittingRef.current = true;
    try {
      if (roleSync === true) {
        if (data.roles.includes('Manager')) {
          await addManager.mutateAsync({
            data: data,
            walletAddress: data?.wallet,
            contractAddress: contractSettings as `0x${string}`,
          });
          isSubmittingRef.current = false;
        } else if (data.roles.includes('Admin')) {
          await addAdmin.mutateAsync({
            data: data,
            walletAddress: data?.wallet,
            contractAddress: contractSettings as `0x${string}`,
          });
          isSubmittingRef.current = false;
        } else {
          await userCreate.mutateAsync(data);
        }
      } else {
        await userCreate.mutateAsync(data);
      }
    } catch (error: unknown) {
      isSubmittingRef.current = false;
      // error.message on an Axios error is a generic HTTP status string
      // (e.g. "Request failed with status code 400"), not the backend's
      // actual message -- read it from the response body instead. The
      // user-service backend sends a stable `name` (RSError), not `code`.
      const e = error as {
        response?: {
          data?: {
            code?: string;
            name?: string;
            params?: Record<string, string | number | Date>;
            message?: string;
          };
        };
        message?: string;
      };
      const rawMessage: string =
        e?.response?.data?.message ||
        e?.message ||
        t('AN_UNEXPECTED_ERROR_OCCURRED');
      const errorMessage = resolveBackendErrorMessage(
        tb,
        e?.response?.data?.code || e?.response?.data?.name,
        e?.response?.data?.params,
        ['USERS'],
        rawMessage,
      );
      Swal.fire(t('USER_CREATION_FAILED'), errorMessage, 'error');
    }
  };

  useEffect(() => {
    if (userCreate.isSuccess) {
      Swal.fire(t('USER_CREATED_SUCCESSFULLY'), '', 'success');
      clearSaved();
      form.reset(DEFAULT_FORM_VALUES);
      route.push('/users');
    }
  }, [form, route, userCreate.isSuccess]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleAddUser)}
        onFocus={() => {
          hasInteracted.current = true;
        }}
      >
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
                    <FormLabel required>{t('USER_NAME')}</FormLabel>
                    <FormControl>
                      <FormInput
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
                    <FormLabel required>{tg('GENDER')}</FormLabel>
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
                render={({ field, fieldState }) => {
                  return (
                    <FormItem>
                      <FormLabel>{tg('PHONE_NUMBER')}</FormLabel>
                      <FormControl>
                        <PhoneInput
                          placeholder={tg('ENTER_PHONE_NUMBER')}
                          className={cn(
                            fieldState.error &&
                              '[&_input]:bg-red-50 [&_input]:shadow-[inset_4px_0_0_0_hsl(var(--destructive))]',
                          )}
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
                    <FormItem>
                      <FormLabel required>{tg('EMAIL')}</FormLabel>
                      <FormControl>
                        <FormInput
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
                        <FormLabel required>{t('USER_ROLE')}</FormLabel>
                        <FormControl>
                          <FormSelectTrigger value={field.value[0]}>
                            <SelectValue placeholder={t('SELECT_USER_ROLE')} />
                          </FormSelectTrigger>
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
                          <FormInput
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
              clearSaved();
              form.reset(DEFAULT_FORM_VALUES);
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

      <UnsavedChangesDialog
        open={showDialog}
        onConfirm={handleConfirmLeave}
        onCancel={handleCancelLeave}
        onDiscard={handleDiscardLeave}
        title={tg('UNSAVED_TITLE')}
        description={tg('UNSAVED_ALERT_DESCRIPTION')}
        cancelText={tg('CANCEL_TEXT')}
        discardText={tg('DISCARD_TEXT')}
        confirmText={tg('CONFIRM_TEXT')}
      />
    </Form>
  );
}

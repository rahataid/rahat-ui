import { useTranslations } from 'next-intl';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
import HeaderWithBack from '../projects/components/header.with.back';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { useRouter } from 'next/navigation';
import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { SUBJECT_ACTIONS } from '../../constants/user.const';
import PermissionsCard from './rolesandPermission/PermissionsCard';
import React from 'react';
import Swal from 'sweetalert2';
import { useUserRoleCreate } from '@rumsan/react-query';

export default function UserAddRoleView() {
  const t = useTranslations('USERS_ADD_ROLE');
  const tg = useTranslations('GLOBAL');
  const router = useRouter();

  const [selectedSubjectActions, setSeletedSubjectActions] =
    React.useState<any>(null);

  const createRole = useUserRoleCreate();

  const FormSchema = z.object({
    name: z.string().min(2, { message: t('NAME_MUST_BE_AT_LEAST4') }),
    isSystem: z.boolean(),
  });

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      isSystem: false,
    },
  });

  const filterNonEmptyArrays = (obj: any) => {
    return Object.keys(obj)
      .filter((key) => obj[key].length > 0)
      .reduce((acc: any, key) => {
        acc[key] = obj[key];
        return acc;
      }, {});
  };

  const handlePermissionUpdate = (subject: string, action: string) => {
    setSeletedSubjectActions((prevPermissions: any) => {
      const currentPerms =
        prevPermissions && prevPermissions[subject]
          ? prevPermissions[subject]
          : [];
      const updatedActions = currentPerms.includes(action)
        ? currentPerms.filter((perm: string) => perm !== action)
        : [...currentPerms, action];

      return {
        ...prevPermissions,
        [subject]: updatedActions,
      };
    });
  };

  const handleAddRole = async (data: z.infer<typeof FormSchema>) => {
    const validateData = FormSchema.parse(data);
    console.log({ validateData });
    const sanitizedPerms = filterNonEmptyArrays(selectedSubjectActions);
    const hasPerms = Object.keys(sanitizedPerms).length > 0;
    if (!hasPerms)
      return Swal.fire(
        t('ERROR'),
        t('PLEASE_SELECT_AT_LEAST_ONE_PERMISSION'),
        'error',
      );
    const k = {
      ...validateData,
      permissions: sanitizedPerms,
    };

    try {
      await createRole.mutateAsync(k);
      router.push('/users/roles');
      Swal.fire(t('ROLE_CREATED_SUCCESSFULLY'), '', 'success');
    } catch (e: any) {
      const errorMsg =
        e?.response?.data?.message || t('SOMETHING_WENT_WRONG');
      Swal.fire(t('ERROR'), errorMsg, 'error');
    } finally {
      form.reset();
      setSeletedSubjectActions(null);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleAddRole)}>
          <div className="p-4">
            <HeaderWithBack
              title={tg('ADD_ROLE')}
              subtitle={t('CREATE_A_NEW_ROLE_DETAIL')}
              path="/users/roles"
            />
            <div className="grid grid-cols-2 gap-4">
              <div className="border p-4 rounded-md flex flex-col space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>{t('ROLE_NAME')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('ENTER_ROLE_NAME')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="isSystem"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('IS_SYSTEM')}</FormLabel>
                      <FormControl>
                        <div className="flex space-x-2 items-center">
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                          <p>{t('THIS_ROLE_IS_PART_OF_THE')}</p>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="border p-4 rounded-md">
                <div className="mb-4">
                  <h1 className="font-medium text-lg">{t('SELECT_ROLES')}</h1>
                  <p className="text-muted-foreground text-sm">
                    {t('SELECT_ROLES_BELOW_TO_ASSIGN_TO')}
                  </p>
                </div>
                <ScrollArea className="h-[calc(100vh-346px)]">
                  {Object.keys(SUBJECT_ACTIONS).map((subject) => (
                    <PermissionsCard
                      key={subject}
                      subject={subject}
                      existingActions={
                        selectedSubjectActions &&
                        selectedSubjectActions[subject]
                          ? selectedSubjectActions[subject]
                          : []
                      }
                      onUpdate={handlePermissionUpdate}
                    />
                  ))}
                </ScrollArea>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2 p-4 border-t">
            <Button
              className="px-14"
              type="button"
              variant="secondary"
              // onClick={() => router.push('/users/roles')}
              onClick={() => {
                form.reset({
                  name: '',
                  isSystem: false,
                });
                setSeletedSubjectActions(null);
              }}
            >
              {tg('CLEAR')}
            </Button>
            <Button type="submit" className="px-10">
              {tg('ADD')}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}

import { useTranslations } from 'next-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { z } from 'zod';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';

import { useRoleList } from '@rumsan/react-query';
import { useProjectList } from '@rahat-ui/query';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import CoreBtnComponent from '../../components/core.btn';
import { Plus } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
import { UUID } from 'crypto';
import Swal from 'sweetalert2';
import { useSettingsStore } from '@rahat-ui/query';
import { resolveBackendErrorMessage } from '@rahat-ui/query/utils/i18n/backend-error';
import {
  useAddAdmin,
  useAddManager,
} from '../../hooks/el/contracts/el-contracts';
import { Role, User } from '@rumsan/sdk/types';
import { useUserAssignRole } from './use.user.add.project.role';
import { useUserActiveRoles } from './use.user.active.roles';

type IProps = {
  userDetails: User;
};
export default function AssignRoleDialog({ userDetails }: IProps) {
  const t = useTranslations('USERS_DETAIL');
  const tg = useTranslations('GLOBAL');
  const tb = useTranslations();
  const [open, setOpen] = useState(false);
  const contractSettings = useSettingsStore((state) => state.accessManager);
  const roleSync = useSettingsStore((state) => state.roleOnChainSync);

  const { data: roleList } = useRoleList({ page: 1, perPage: 100 });
  const { data: projectList } = useProjectList();
  const { data: activeRoles } = useUserActiveRoles(
    userDetails?.uuid as UUID,
  );

  const addManager = useAddManager();
  const addAdmin = useAddAdmin();
  const assignRole = useUserAssignRole();

  const FormSchema = z.object({
    roles: z.array(z.string()).length(1, { message: t('PLEASE_SELECT_ROLE') }),
    project: z.string().optional(),
  });

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      roles: [],
      project: '',
    },
  });

  const isRoleAlreadyAssigned = (roleName: string, xrefId: string | null) => {
    return (activeRoles?.data || []).some(
      (activeRole) =>
        activeRole.Role?.name === roleName &&
        (activeRole.xrefId || null) === (xrefId || null),
    );
  };

  const onSubmit = async (data: any) => {
    const roleName = data.roles[0];
    const xrefId = data.project || null;

    if (isRoleAlreadyAssigned(roleName, xrefId)) {
      return Swal.fire(
        'Role Already Assigned',
        xrefId
          ? 'This role is already assigned to the user for the selected project.'
          : 'This role is already assigned to the user.',
        'error',
      );
    }

    try {
      if (data.project) {
        await assignRole.mutateAsync({
          uuid: userDetails?.uuid as UUID,
          xrefId: data.project,
          name: data.roles[0],
        });
        Swal.fire('Role Assigned Successfully', '', 'success');
        form.reset();
        setOpen(false);
      } else if (roleSync === true) {
        if (data.roles.includes('Manager')) {
          await addManager.mutateAsync({
            data: userDetails,
            walletAddress: userDetails?.wallet as `0x${string}`,
            contractAddress: contractSettings as `0x${string}`,
          });
          form.reset();
          setOpen(false);
        } else if (data.roles.includes('Admin')) {
          await addAdmin.mutateAsync({
            data: data,
            walletAddress: userDetails?.wallet as `0x${string}`,
            contractAddress: contractSettings as `0x${string}`,
          });
          form.reset();
          setOpen(false);
        } else {
          await assignRole.mutateAsync({
            uuid: userDetails?.uuid as UUID,
            name: data.roles[0],
          });
          Swal.fire(t('ROLE_ASSIGNED_SUCCESSFULLY'), '', 'success');
          form.reset();
          setOpen(false);
        }
      } else {
        await assignRole.mutateAsync({
          uuid: userDetails?.uuid as UUID,
          name: data.roles[0],
        });
        Swal.fire(t('ROLE_ASSIGNED_SUCCESSFULLY'), '', 'success');
        form.reset();
        setOpen(false);
      }
    } catch (error: unknown) {
      // error.message on an Axios error is a generic HTTP status string,
      // not the backend's actual message -- read it from the response body.
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
        tg('AN_UNEXPECTED_ERROR_OCCURRED');
      const errorMessage = resolveBackendErrorMessage(
        tb,
        e?.response?.data?.code || e?.response?.data?.name,
        e?.response?.data?.params,
        ['USERS'],
        rawMessage,
      );
      Swal.fire(t('ERROR_ASSIGNING_ROLE'), errorMessage, 'error');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <CoreBtnComponent
          className="text-primary hover:text-primary"
          variant="ghost"
          name={t('ASSIGN_ROLE')}
          Icon={Plus}
          handleClick={() => undefined}
        />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="mb-2">
          <DialogTitle>{t('ASSIGN_ROLE')}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogDescription>
              <div className="flex flex-col space-y-4">
                <FormField
                  control={form.control}
                  name="roles"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>{tg('ROLE')}</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange([value]);
                          }}
                          value={field.value[0]}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t('PLEASE_SELECT_ROLE')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectGroup>
                              {Array.isArray(roleList?.data) &&
                                roleList.data.map((role: Role) => (
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
                  name="project"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>{t('PROJECT_OPTIONAL')}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={tg('SELECT_PROJECT')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectGroup>
                              {Array.isArray(projectList?.data) &&
                                projectList.data.map((project) => (
                                  <SelectItem
                                    value={project.uuid as string}
                                    key={project.uuid}
                                  >
                                    {project.name}
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
              </div>
            </DialogDescription>
            <DialogFooter>
              <div className="flex items-center justify-center mt-10 gap-4">
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => form.reset()}
                  >
                    {tg('CANCEL')}
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  disabled={
                    assignRole.isPending ||
                    addManager.isPending ||
                    addAdmin.isPending
                  }
                >
                  {tg('SUBMIT')}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

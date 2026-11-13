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
import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';

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
import { useSettingsStore } from '@rahat-ui/query';
import { resolveBackendErrorMessage } from '@rahat-ui/query/utils/i18n/backend-error';
import {
  useAddAdmin,
  useAddManager,
} from '../../hooks/el/contracts/el-contracts';
import { Role, User } from '@rumsan/sdk/types';
import {
  useAssigToMultipleProjects,
  useUserAssignRole,
} from './use.user.add.project.role';
import { ActiveUserRole, useUserActiveRoles } from './use.user.active.roles';
import { toast } from 'react-toastify';

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
  const { data: activeRoles } = useUserActiveRoles(userDetails?.uuid as UUID);

  const addManager = useAddManager();
  const addAdmin = useAddAdmin();
  const assignRole = useUserAssignRole();
  const newAssignRole = useAssigToMultipleProjects();

  const FormSchema = z.object({
    roles: z.array(z.string()).length(1, { message: t('PLEASE_SELECT_ROLE') }),
    projects: z.array(z.string()),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      roles: [],
      projects: [],
    },
  });

  const isRoleAlreadyAssigned = (roleName: string, xrefId: string | null) => {
    return (activeRoles?.data || []).some(
      (activeRole: ActiveUserRole) =>
        activeRole.Role?.name === roleName &&
        (activeRole.xrefId || null) === (xrefId || null),
    );
  };

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const roleName = data.roles[0];
    const selectedProjects: string[] = data.projects;

    if (
      selectedProjects.length === 0 &&
      isRoleAlreadyAssigned(roleName, null)
    ) {
      return toast.error(t('ROLE_ALREADY_ASSIGNED'));
    }

    try {
      if (selectedProjects.length > 0) {
        const alreadyAssignedProject = selectedProjects.some((projectId) =>
          isRoleAlreadyAssigned(roleName, projectId),
        );
        if (alreadyAssignedProject) {
          return toast.error(t('ROLE_ALREADY_ASSIGNED'));
        }

        await newAssignRole.mutateAsync({
          uuid: userDetails?.uuid as UUID,
          data: {
            roles: selectedProjects.map((xrefId) => ({
              name: roleName,
              xrefId,
            })),
          },
        });
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
            data: userDetails,
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
          form.reset();
          setOpen(false);
        }
      } else {
        await assignRole.mutateAsync({
          uuid: userDetails?.uuid as UUID,
          name: data.roles[0],
        });
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
      return toast.error(errorMessage || t('ERROR_ASSIGNING_ROLE'));
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
                              <SelectValue
                                placeholder={t('PLEASE_SELECT_ROLE')}
                              />
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
                  name="projects"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>{t('PROJECT_OPTIONAL')}</FormLabel>
                        <div className="max-h-48 space-y-2 overflow-y-auto rounded-md border p-3">
                          {Array.isArray(projectList?.data) &&
                            projectList.data.map((project) => {
                              const projectId = project.uuid as string;
                              const checked = field.value.includes(projectId);

                              return (
                                <div
                                  className="flex items-center gap-2"
                                  key={project.uuid}
                                >
                                  <FormControl>
                                    <Checkbox
                                      id={projectId}
                                      checked={checked}
                                      onCheckedChange={(isChecked) =>
                                        field.onChange(
                                          isChecked === true
                                            ? [...field.value, projectId]
                                            : field.value.filter(
                                                (id) => id !== projectId,
                                              ),
                                        )
                                      }
                                    />
                                  </FormControl>
                                  <FormLabel
                                    htmlFor={projectId}
                                    className="mb-0 font-normal"
                                  >
                                    {project.name}
                                  </FormLabel>
                                </div>
                              );
                            })}
                        </div>
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
                    newAssignRole.isPending ||
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

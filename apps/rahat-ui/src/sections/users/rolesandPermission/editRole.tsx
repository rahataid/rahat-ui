'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@rahat-ui/shadcn/components/button';
import { Input } from '@rahat-ui/shadcn/components/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@rahat-ui/shadcn/components/form';
import {
  Accordion,
  AccordionItem,
  AccordionContent,
} from '@rahat-ui/shadcn/src/components/ui/accordion';
import { Switch } from '@rahat-ui/shadcn/src/components/ui/switch';
import { useSecondPanel } from 'apps/rahat-ui/src/providers/second-panel-provider';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import swal from 'sweetalert2';
import PermissionsCard from './PermissionsCard';
import ProjectPermissionsCard from './ProjectPermissionsCard';
import {
  SUBJECT_ACTIONS,
  PROJECT_SUBJECT_ACTIONS,
} from 'apps/rahat-ui/src/constants/user.const';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { useUserRoleEdit } from '@rumsan/react-query';

type Iprops = {
  roleDetail: any;
  currentPerms: any;
};

const splitPermsBySubjectGroup = (perms: any) => {
  const roles: any = {};
  const projectRoles: any = {};
  if (perms) {
    Object.keys(perms).forEach((subject) => {
      if (subject in PROJECT_SUBJECT_ACTIONS) {
        projectRoles[subject] = perms[subject];
      } else {
        roles[subject] = perms[subject];
      }
    });
  }
  return { roles, projectRoles };
};

export default function EditRole({ roleDetail, currentPerms }: Iprops) {
  const { closeSecondPanel } = useSecondPanel();
  const edit = useUserRoleEdit();

  const [selectedSubjectActions, setSeletedSubjectActions] =
    useState<any>(null);
  const [selectedProjectSubjectActions, setSelectedProjectSubjectActions] =
    useState<any>(null);
  const [roleSearch, setRoleSearch] = useState('');
  const [projectRoleSearch, setProjectRoleSearch] = useState('');
  const [openRolesSections, setOpenRolesSections] = useState<string[]>([
    'roles',
  ]);
  const [openProjectRolesSections, setOpenProjectRolesSections] = useState<
    string[]
  >(['project-roles']);
  const rolesSectionRef = useRef<HTMLDivElement>(null);
  const projectRolesSectionRef = useRef<HTMLDivElement>(null);

  const toggleSection = (
    section: string,
    open: string[],
    setOpen: (value: string[]) => void,
    ref: React.RefObject<HTMLDivElement>,
  ) => {
    const isOpening = !open.includes(section);
    if (isOpening) {
      setTimeout(() => {
        ref.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 220);
    }
    setOpen(isOpening ? [...open, section] : open.filter((s) => s !== section));
  };

  const FormSchema = z.object({
    roleName: z.string().min(2, {
      message: 'Role Name must be at least 2 characters.',
    }),
    isSystem: z.boolean().optional(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      roleName: roleDetail?.data?.role?.name || '',
      isSystem: roleDetail?.data?.role?.isSystem || false,
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

  const handleEditRole = async (data: z.infer<typeof FormSchema>) => {
    const validateData = FormSchema.parse(data);
    const sanitizedPerms = filterNonEmptyArrays({
      ...selectedSubjectActions,
      ...selectedProjectSubjectActions,
    });
    const hasPerms = Object.keys(sanitizedPerms).length > 0;
    if (!hasPerms)
      return swal.fire(
        'Error',
        'Please select at least one permission',
        'error',
      );
    const k = {
      name: validateData.roleName,
      isSystem: validateData.isSystem,
      permissions: sanitizedPerms,
    };

    try {
      await edit.mutateAsync({ name: roleDetail?.data?.role?.name, data: k });
      swal.fire('Role Updated Successfully', '', 'success');
      closeSecondPanel();
    } catch (err) {
      const errMsg =
        err instanceof Error ? err.message : 'Something went wrong';
      swal.fire('Error Updating Role', errMsg, 'error');
    }
  };

  const handlePermissionUpdate = (subject: string, action: string) => {
    setSeletedSubjectActions((prevPermissions: any) => {
      const currentActions =
        prevPermissions && prevPermissions[subject]
          ? prevPermissions[subject]
          : [];
      const updatedActions = currentActions.includes(action)
        ? currentActions.filter((a: string) => a !== action)
        : [...currentActions, action];

      return { ...prevPermissions, [subject]: updatedActions };
    });
  };

  const handleProjectPermissionUpdate = (subject: string, action: string) => {
    setSelectedProjectSubjectActions((prevPermissions: any) => {
      const currentActions =
        prevPermissions && prevPermissions[subject]
          ? prevPermissions[subject]
          : [];
      const updatedActions = currentActions.includes(action)
        ? currentActions.filter((a: string) => a !== action)
        : [...currentActions, action];

      return { ...prevPermissions, [subject]: updatedActions };
    });
  };

  const filteredSubjects = Object.keys(SUBJECT_ACTIONS).filter((subject) =>
    subject.toLowerCase().includes(roleSearch.toLowerCase().trim()),
  );

  const filteredProjectSubjects = Object.keys(PROJECT_SUBJECT_ACTIONS).filter(
    (subject) =>
      subject.toLowerCase().includes(projectRoleSearch.toLowerCase().trim()),
  );

  useEffect(() => {
    const { roles, projectRoles } = splitPermsBySubjectGroup(currentPerms);
    setSeletedSubjectActions(roles);
    setSelectedProjectSubjectActions(projectRoles);
  }, [roleDetail?.data?.role?.name, currentPerms]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleEditRole)}
        className="flex flex-col flex-1 min-h-0"
      >
        <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
          <h1 className="text-lg font-semibold">Edit Role & Permissions</h1>

          <FormField
            control={form.control}
            name="roleName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role Name</FormLabel>
                <FormControl>
                  <Input placeholder="Role Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isSystem"
            render={({ field }) => (
              <FormItem>
                <FormLabel>System</FormLabel>
                <FormControl>
                  <div className="flex items-center space-x-2">
                    <Switch
                      {...field}
                      value={field.value ? 'true' : 'false'}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <p className="text-sm text-muted-foreground">
                      This role is part of the system
                    </p>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          <div className="border rounded-md p-3">
            <Accordion
              type="multiple"
              value={openRolesSections}
              onValueChange={setOpenRolesSections}
            >
              <AccordionItem value="roles" ref={rolesSectionRef}>
                <div className="flex items-center justify-between mb-3 mr-2">
                  <h2 className="font-semibold">Select Roles</h2>
                  <button
                    type="button"
                    onClick={() =>
                      toggleSection(
                        'roles',
                        openRolesSections,
                        setOpenRolesSections,
                        rolesSectionRef,
                      )
                    }
                    className="shrink-0 p-1"
                    aria-label="Toggle select roles section"
                  >
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${
                        openRolesSections.includes('roles')
                          ? 'rotate-180'
                          : ''
                      }`}
                    />
                  </button>
                </div>
                <AccordionContent className="pb-0">
                  <Input
                    placeholder="Search roles"
                    value={roleSearch}
                    onChange={(e) => setRoleSearch(e.target.value)}
                    className="mb-3"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <ScrollArea className="h-64 pr-3">
                    {filteredSubjects.length === 0 ? (
                      <p className="text-muted-foreground text-sm py-2">
                        No roles found
                      </p>
                    ) : (
                      filteredSubjects.map((subject) => (
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
                      ))
                    )}
                  </ScrollArea>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="border rounded-md p-3">
            <Accordion
              type="multiple"
              value={openProjectRolesSections}
              onValueChange={setOpenProjectRolesSections}
            >
              <AccordionItem value="project-roles" ref={projectRolesSectionRef}>
                <div className="flex items-center justify-between mb-3 mr-2">
                  <h2 className="font-semibold">Select Project Roles</h2>
                  <button
                    type="button"
                    onClick={() =>
                      toggleSection(
                        'project-roles',
                        openProjectRolesSections,
                        setOpenProjectRolesSections,
                        projectRolesSectionRef,
                      )
                    }
                    className="shrink-0 p-1"
                    aria-label="Toggle select project roles section"
                  >
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${
                        openProjectRolesSections.includes('project-roles')
                          ? 'rotate-180'
                          : ''
                      }`}
                    />
                  </button>
                </div>
                <AccordionContent className="pb-0">
                  <Input
                    placeholder="Search project roles"
                    value={projectRoleSearch}
                    onChange={(e) => setProjectRoleSearch(e.target.value)}
                    className="mb-3"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <ScrollArea className="h-64 pr-3">
                    {filteredProjectSubjects.length === 0 ? (
                      <p className="text-muted-foreground text-sm py-2">
                        No project roles found
                      </p>
                    ) : (
                      filteredProjectSubjects.map((subject) => (
                        <ProjectPermissionsCard
                          key={subject}
                          subject={subject}
                          actions={(PROJECT_SUBJECT_ACTIONS as any)[subject]}
                          existingActions={
                            selectedProjectSubjectActions &&
                            selectedProjectSubjectActions[subject]
                              ? selectedProjectSubjectActions[subject]
                              : []
                          }
                          onUpdate={handleProjectPermissionUpdate}
                        />
                      ))
                    )}
                  </ScrollArea>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
        <div className="flex justify-end space-x-2 p-4 border-t shrink-0">
          <Button
            type="button"
            variant="secondary"
            className="px-10"
            onClick={closeSecondPanel}
          >
            Cancel
          </Button>
          <Button type="submit" className="px-10">
            Update Role
          </Button>
        </div>
      </form>
    </Form>
  );
}

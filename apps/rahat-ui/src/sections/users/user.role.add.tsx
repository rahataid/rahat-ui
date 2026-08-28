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
import { SystemUserAuth } from '@rahat-ui/auth';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import {
  Accordion,
  AccordionItem,
  AccordionContent,
} from '@rahat-ui/shadcn/src/components/ui/accordion';
import { ChevronDown } from 'lucide-react';
import {
  SUBJECT_ACTIONS,
  PROJECT_SUBJECT_ACTIONS,
} from '../../constants/user.const';
import PermissionsCard from './rolesandPermission/PermissionsCard';
import ProjectPermissionsCard from './rolesandPermission/ProjectPermissionsCard';
import React from 'react';
import Swal from 'sweetalert2';
import { useUserRoleCreate } from '@rumsan/react-query';

export default function UserAddRoleView() {
  const router = useRouter();

  const [selectedSubjectActions, setSeletedSubjectActions] =
    React.useState<any>(null);
  const [selectedProjectSubjectActions, setSelectedProjectSubjectActions] =
    React.useState<any>(null);
  const [roleSearch, setRoleSearch] = React.useState('');
  const [projectRoleSearch, setProjectRoleSearch] = React.useState('');
  const [openSections, setOpenSections] = React.useState<string[]>([
    'roles',
    'project-roles',
  ]);
  const rolesSectionRef = React.useRef<HTMLDivElement>(null);
  const projectRolesSectionRef = React.useRef<HTMLDivElement>(null);

  const sectionRefs: Record<string, React.RefObject<HTMLDivElement>> = {
    roles: rolesSectionRef,
    'project-roles': projectRolesSectionRef,
  };

  const toggleSection = (section: string) => {
    setOpenSections((prev) => {
      const isOpening = !prev.includes(section);
      if (isOpening) {
        setTimeout(() => {
          sectionRefs[section]?.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }, 220);
      }
      return isOpening
        ? [...prev, section]
        : prev.filter((s) => s !== section);
    });
  };

  const createRole = useUserRoleCreate();

  const FormSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 4 character' }),
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

  const handleProjectPermissionUpdate = (subject: string, action: string) => {
    setSelectedProjectSubjectActions((prevPermissions: any) => {
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

  const filteredSubjects = Object.keys(SUBJECT_ACTIONS).filter((subject) =>
    subject.toLowerCase().includes(roleSearch.toLowerCase().trim()),
  );

  const filteredProjectSubjects = Object.keys(PROJECT_SUBJECT_ACTIONS).filter(
    (subject) =>
      subject.toLowerCase().includes(projectRoleSearch.toLowerCase().trim()),
  );

  const handleAddRole = async (data: z.infer<typeof FormSchema>) => {
    const validateData = FormSchema.parse(data);
    const sanitizedPerms = filterNonEmptyArrays({
      ...selectedSubjectActions,
      ...selectedProjectSubjectActions,
    });
    const hasPerms = Object.keys(sanitizedPerms).length > 0;
    if (!hasPerms)
      return Swal.fire(
        'Error',
        'Please select at least one permission',
        'error',
      );
    const k = {
      ...validateData,
      permissions: sanitizedPerms,
    };

    try {
      await createRole.mutateAsync(k);
      router.push('/users/roles');
      Swal.fire('Role Created Successfully', '', 'success');
      form.reset();
      setSeletedSubjectActions(null);
      setSelectedProjectSubjectActions(null);
      setRoleSearch('');
      setProjectRoleSearch('');
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : 'Something went wrong';
      Swal.fire('Error', errorMsg, 'error');
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleAddRole)}>
          <div className="p-4">
            <HeaderWithBack
              title="Add Role"
              subtitle="Create a new role detail"
              path="/users/roles"
            />
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="border p-4 rounded-md space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Role Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter role name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <SystemUserAuth hasContent={false}>
                  <FormField
                    control={form.control}
                    name="isSystem"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Is System</FormLabel>
                        <FormControl>
                          <div className="flex items-center space-x-2">
                            <Checkbox
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
                </SystemUserAuth>
              </div>
              <ScrollArea className="h-[calc(100vh-253px)] pr-3">
              <div className="flex flex-col space-y-4">
                <div className="border p-4 rounded-md">
                  <Accordion
                    type="multiple"
                    value={openSections}
                    onValueChange={setOpenSections}
                  >
                    <AccordionItem value="roles" ref={rolesSectionRef}>
                      <div className="flex items-center justify-between mb-4 mr-2">
                        <div>
                          <h1 className="font-medium text-lg">
                            Select Roles
                          </h1>
                          <p className="text-muted-foreground text-sm">
                            Select roles below to assign to the user
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleSection('roles')}
                          className="shrink-0 p-1"
                          aria-label="Toggle select roles section"
                        >
                          <ChevronDown
                            className={`h-4 w-4 transition-transform duration-200 ${
                              openSections.includes('roles')
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
                          className="mb-4"
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

                <div className="border p-4 rounded-md">
                  <Accordion
                    type="multiple"
                    value={openSections}
                    onValueChange={setOpenSections}
                  >
                    <AccordionItem
                      value="project-roles"
                      ref={projectRolesSectionRef}
                    >
                      <div className="flex items-center justify-between mb-4 mr-2">
                        <div>
                          <h1 className="font-medium text-lg">
                            Select Project Roles
                          </h1>
                          <p className="text-muted-foreground text-sm">
                            Select project-level roles below to assign to the
                            user
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleSection('project-roles')}
                          className="shrink-0 p-1"
                          aria-label="Toggle select project roles section"
                        >
                          <ChevronDown
                            className={`h-4 w-4 transition-transform duration-200 ${
                              openSections.includes('project-roles')
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
                          onChange={(e) =>
                            setProjectRoleSearch(e.target.value)
                          }
                          className="mb-4"
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
                                actions={
                                  (PROJECT_SUBJECT_ACTIONS as any)[subject]
                                }
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
              </ScrollArea>
            </div>
          </div>
          <div className="flex justify-end space-x-2 p-4 border-t">
            <Button
              className="px-14"
              type="button"
              variant="secondary"
              onClick={() => {
                form.reset({
                  name: '',
                  isSystem: false,
                });
                setSeletedSubjectActions(null);
                setSelectedProjectSubjectActions(null);
                setRoleSearch('');
                setProjectRoleSearch('');
              }}
            >
              Clear
            </Button>
            <Button type="submit" className="px-10">
              Add
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}

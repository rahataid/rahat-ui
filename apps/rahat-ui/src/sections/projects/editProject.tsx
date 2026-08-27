'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { UUID } from 'crypto';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save } from 'lucide-react';
import { ProjectStatus } from '@rahataid/sdk/enums';
import { SystemUserAuth } from '@rahat-ui/auth';
import { useProject, useProjectEdit } from '@rahat-ui/query';
import { IconLabelBtn } from 'apps/rahat-ui/src/common';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@rahat-ui/shadcn/src/components/ui/alert-dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Textarea } from '@rahat-ui/shadcn/src/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import { Skeleton } from '@rahat-ui/shadcn/src/components/ui/skeleton';

const STATUS_OPTIONS = Object.values(ProjectStatus);

const EditProjectSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  description: z
    .string()
    .min(4, { message: 'Description must be at least 4 characters' }),
  status: z.nativeEnum(ProjectStatus, {
    required_error: 'Please select a status.',
  }),
});

type EditProjectFormValues = z.infer<typeof EditProjectSchema>;

export default function ProjectInfoForm() {
  return (
    <SystemUserAuth>
      <ProjectInfoFormContent />
    </SystemUserAuth>
  );
}

function ProjectInfoFormContent() {
  const { id } = useParams();
  const projectUUID = id as UUID;
  const router = useRouter();

  const { data, isLoading } = useProject(projectUUID);
  const editProject = useProjectEdit();

  const project = data?.data;

  const [pendingValues, setPendingValues] =
    useState<EditProjectFormValues | null>(null);

  const form = useForm<EditProjectFormValues>({
    resolver: zodResolver(EditProjectSchema),
    values: project
      ? {
          name: project.name || '',
          description: project.description || '',
          status: (project.status as ProjectStatus) || ProjectStatus.NOT_READY,
        }
      : undefined,
    defaultValues: {
      name: '',
      description: '',
      status: ProjectStatus.NOT_READY,
    },
  });

  const handleConfirmSave = async () => {
    if (!pendingValues) return;
    try {
      await editProject.mutateAsync({
        uuid: projectUUID,
        data: pendingValues,
      });
      setPendingValues(null);
      router.back();
    } catch {
      // toast is handled by useProjectEdit; keep the dialog open so the
      // user can see the error state and retry or cancel.
    }
  };

  if (isLoading || !project) {
    return (
      <div className="p-4 bg-card">
        <div className="shadow-md p-4 rounded-sm space-y-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(setPendingValues)}>
        <div className="pb-3 flex justify-between items-center space-x-4">
          <div>
            <h2 className="text-lg font-semibold">Project Info</h2>
            <p className="text-xs text-muted-foreground">
              Manage basic project details
            </p>
          </div>
          <IconLabelBtn
            Icon={Save}
            type="submit"
            name={editProject.isPending ? 'Saving...' : 'Save Changes'}
            className="px-3 py-2"
            disabled={editProject.isPending}
          />
        </div>

        <div className="rounded border bg-white p-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    key={field.value}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {STATUS_OPTIONS.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </form>

      <AlertDialog
        open={!!pendingValues}
        onOpenChange={(open) => !open && setPendingValues(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Save changes?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to update this project&apos;s info?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmSave}
              disabled={editProject.isPending}
            >
              {editProject.isPending ? 'Saving...' : 'Confirm'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Form>
  );
}

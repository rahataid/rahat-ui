'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { UUID } from 'crypto';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { Save } from 'lucide-react';
import { ProjectStatus } from '@rahataid/sdk/enums';
import { SystemUserAuth } from '@rahat-ui/auth';
import { useProject, useProjectEdit } from '@rahat-ui/query';
import { IconLabelBtn } from 'apps/rahat-ui/src/common';
import { translateValue } from 'apps/rahat-ui/src/utils/i18n/translateValue';
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

type Translator = (key: string, values?: Record<string, any>) => string;

const buildEditProjectSchema = (t: Translator) =>
  z.object({
    name: z.string().min(2, { message: t('EDIT_PROJECT_NAME_MIN_LENGTH') }),
    description: z
      .string()
      .min(4, { message: t('EDIT_PROJECT_DESCRIPTION_MIN_LENGTH') }),
    status: z.nativeEnum(ProjectStatus, {
      required_error: t('PLEASE_SELECT_A_STATUS'),
    }),
  });

type EditProjectFormValues = z.infer<ReturnType<typeof buildEditProjectSchema>>;

export default function ProjectInfoForm() {
  return (
    <SystemUserAuth>
      <ProjectInfoFormContent />
    </SystemUserAuth>
  );
}

function ProjectInfoFormContent() {
  const t = useTranslations('GLOBAL');
  const { id } = useParams();
  const projectUUID = id as UUID;
  const router = useRouter();

  const { data, isLoading } = useProject(projectUUID);
  const editProject = useProjectEdit();

  const project = data?.data;

  const [pendingValues, setPendingValues] =
    useState<EditProjectFormValues | null>(null);

  const EditProjectSchema = buildEditProjectSchema(t);

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
            <h2 className="text-lg font-semibold">{t('PROJECT_INFO')}</h2>
            <p className="text-xs text-muted-foreground">
              {t('MANAGE_BASIC_PROJECT_DETAILS')}
            </p>
          </div>
          <IconLabelBtn
            Icon={Save}
            type="submit"
            name={editProject.isPending ? t('SAVING') : t('SAVE_CHANGES')}
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
                  <FormLabel>{t('NAME')}</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder={t('NAME')} {...field} />
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
                  <FormLabel>{t('STATUS')}</FormLabel>
                  <Select
                    key={field.value}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('SELECT_STATUS')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {STATUS_OPTIONS.map((status) => (
                        <SelectItem key={status} value={status}>
                          {translateValue(t, status)}
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
                  <FormLabel>{t('DESCRIPTION')}</FormLabel>
                  <FormControl>
                    <Textarea placeholder={t('DESCRIPTION')} {...field} />
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
            <AlertDialogTitle>{t('SAVE_CHANGES_QUESTION')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('ARE_YOU_SURE_YOU_WANT_TO_UPDATE_THIS_PROJECTS_INFO')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('CANCEL')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmSave}
              disabled={editProject.isPending}
            >
              {editProject.isPending ? t('SAVING') : t('CONFIRM')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Form>
  );
}

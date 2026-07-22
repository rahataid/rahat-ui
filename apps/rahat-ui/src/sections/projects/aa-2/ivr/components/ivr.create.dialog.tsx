'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
import { useIvrTemplateCreate } from '@rahat-ui/query';
import { Plus } from 'lucide-react';

const CreateIVRFormSchema = z.object({
  name: z.string().min(1, 'IVR name is required'),
  description: z.string().optional(),
});

interface CreateIVRDialogProps {
  onIVRCreated?: () => void;
}

export default function CreateIVRDialog({
  onIVRCreated,
}: CreateIVRDialogProps) {
  const [open, setOpen] = useState(false);
  const createIvr = useIvrTemplateCreate();

  const form = useForm<z.infer<typeof CreateIVRFormSchema>>({
    resolver: zodResolver(CreateIVRFormSchema),
    defaultValues: { name: '', description: '' },
  });

  const onSubmit = async (values: z.infer<typeof CreateIVRFormSchema>) => {
    try {
      await createIvr.mutateAsync({
        name: values.name,
        description: values.description || undefined,
      });
      form.reset();
      setOpen(false);
      onIVRCreated?.();
    } catch (error) {
      console.error('Failed to create IVR:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2 rounded-sm">
          <Plus className="w-4 h-4" />
          New IVR
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New IVR</DialogTitle>
          <DialogDescription>
            Create a new IVR flow to start building your call menu
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IVR Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Customer Support" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Brief description of this IVR"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-sm"
                disabled={createIvr.isPending}
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="rounded-sm"
                disabled={createIvr.isPending}
              >
                {createIvr.isPending ? 'Creating...' : 'Create'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

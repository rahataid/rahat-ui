'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@rahat-ui/shadcn/src/components/ui/sheet';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
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
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useUpdateInkind } from '@rahat-ui/query';
import { UUID } from 'crypto';
import {
  InkindDetailsSchema,
  InkindDetailsValues,
  InkindType,
  INKIND_TYPES,
  INKIND_TYPE_LABELS,
} from '../schemas/inkind.validation';

interface InkindItem {
  uuid: string;
  name: string;
  description?: string;
  type: InkindType;
  availableStock?: number;
}

interface InkindUpdateSheetProps {
  projectUUID: UUID;
  item: InkindItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function InkindUpdateSheet({
  projectUUID,
  item,
  open,
  onOpenChange,
}: InkindUpdateSheetProps) {
  const updateInkind = useUpdateInkind(projectUUID);

  const form = useForm<InkindDetailsValues>({
    resolver: zodResolver(InkindDetailsSchema),
    defaultValues: {
      name: '',
      description: '',
      type: 'PRE_DEFINED',
    },
  });

  useEffect(() => {
    if (item) {
      form.reset({
        name: item.name,
        description: item.description ?? '',
        type: (item.type as InkindType) ?? 'PRE_DEFINED',
      });
    }
  }, [item, form]);

  const onSubmit = async (values: InkindDetailsValues) => {
    if (!item) return;
    await updateInkind.mutateAsync({
      uuid: item.uuid,
      name: values.name,
      description: values.description,
      type: values.type as InkindType,
    });
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[400px] sm:w-[480px]">
        <SheetHeader className="mb-4">
          <SheetTitle>Update Inkind Item</SheetTitle>
          <SheetDescription>
            Edit the details for this inkind item.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter item name" {...field} />
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter description"
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {INKIND_TYPES.map((t) => (
                        <SelectItem key={t} value={t}>
                          {INKIND_TYPE_LABELS[t]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => onOpenChange(false)}
                disabled={updateInkind.isPending}
              >
                Reset
              </Button>
              <Button
                type="submit"
                className="px-10 rounded-sm"
                disabled={updateInkind.isPending}
              >
                {updateInkind.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}

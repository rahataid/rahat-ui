'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from 'libs/shadcn/src/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from 'libs/shadcn/src/components/ui/form';
import { Input } from 'libs/shadcn/src/components/ui/input';
import { Textarea } from 'libs/shadcn/src/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'libs/shadcn/src/components/ui/select';
import {
  InkindDetailsSchema,
  InkindDetailsValues,
  INKIND_TYPES,
  INKIND_TYPE_LABELS,
  NAME_MAX,
  DESCRIPTION_MAX,
} from '../schemas/inkind.validation';
import type { InkindFormData } from '../schemas/inkind.validation';

const DEFAULT_VALUES: InkindDetailsValues = {
  name: '',
  description: '',
  type: '',
};

interface Props {
  formData: Partial<InkindFormData>;
  onNext: (data: InkindDetailsValues) => void;
  existingNames?: string[];
}

export default function InkindDetailsForm({
  formData,
  onNext,
  existingNames = [],
}: Props) {
  const form = useForm<InkindDetailsValues>({
    resolver: zodResolver(InkindDetailsSchema),
    defaultValues: {
      name: formData.name ?? DEFAULT_VALUES.name,
      description: formData.description ?? DEFAULT_VALUES.description,
      type: formData.type ?? DEFAULT_VALUES.type,
    },
  });

  const { control, handleSubmit, reset, watch, setError } = form;

  const nameValue = watch('name');
  const descriptionValue = watch('description');

  const handleNext = (data: InkindDetailsValues) => {
    const trimmed = data.name.trim().toLowerCase();
    const duplicate = existingNames.some(
      (n) => n.trim().toLowerCase() === trimmed,
    );
    if (duplicate) {
      setError('name', {
        message: 'An inkind item with this name already exists.',
      });
      return;
    }
    onNext(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(handleNext)}>
        <div className="border rounded-sm p-4 flex flex-col space-y-4">
          <p className="text-base font-semibold">Register Inkind</p>
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Inkind Name</FormLabel>
                  <span
                    className={`text-xs ${
                      (nameValue?.length ?? 0) >= NAME_MAX
                        ? 'text-destructive'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {nameValue?.length ?? 0}/{NAME_MAX}
                  </span>
                </div>
                <FormControl>
                  <Input
                    placeholder="e.g. Rice (50kg bags)"
                    maxLength={NAME_MAX}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Description</FormLabel>
                  <span
                    className={`text-xs ${
                      (descriptionValue?.length ?? 0) >= DESCRIPTION_MAX
                        ? 'text-destructive'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {descriptionValue?.length ?? 0}/{DESCRIPTION_MAX}
                  </span>
                </div>
                <FormControl>
                  <Textarea
                    placeholder="Briefly describe this in-kind item..."
                    className="resize-none"
                    rows={3}
                    maxLength={DESCRIPTION_MAX}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                >
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

          <div className="flex justify-end items-center">
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => reset(DEFAULT_VALUES)}
                className="px-10 rounded-sm w-40"
              >
                Clear
              </Button>
              <Button type="submit" className="px-10 rounded-sm w-40">
                Confirm
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}

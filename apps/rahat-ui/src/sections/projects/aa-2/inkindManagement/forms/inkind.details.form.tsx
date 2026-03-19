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
} from '../schemas/inkind.validation';
import type { InkindFormData } from '../schemas/inkind.validation';

const DEFAULT_VALUES: InkindDetailsValues = {
  name: '',
  description: '',
  type: 'PRE_DEFINED',
};

interface Props {
  formData: Partial<InkindFormData>;
  onNext: (data: InkindDetailsValues) => void;
}

export default function InkindDetailsForm({ formData, onNext }: Props) {
  const form = useForm<InkindDetailsValues>({
    resolver: zodResolver(InkindDetailsSchema),
    defaultValues: {
      name: formData.name ?? DEFAULT_VALUES.name,
      description: formData.description ?? DEFAULT_VALUES.description,
      type: formData.type ?? DEFAULT_VALUES.type,
    },
  });

  const { control, handleSubmit, reset } = form;

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onNext)}>
        <div className="border rounded-sm p-4 flex flex-col space-y-4">
          {/* Name */}
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Rice (50kg bags)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Briefly describe this in-kind item..."
                    className="resize-none"
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Type */}
          <FormField
            control={control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="PRE_DEFINED">Pre-Defined</SelectItem>
                    <SelectItem value="WALK_IN">Walk-In</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Actions */}
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

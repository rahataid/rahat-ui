'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@rahat-ui/shadcn/src/components/ui/select';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
// import { useActivitiesFields } from './useActivitiesFields';
import {
  useActivitiesCategories,
  useActivitiesFieldStore,
  useActivitiesHazardTypes,
  useActivitiesPhase,
} from '@rahat-ui/query';

export default function AddActivities() {
  useActivitiesCategories('45606343-e6f5-475f-a2b3-f31d6ab10733');
  const categories = useActivitiesFieldStore((state) => state.categories);
  useActivitiesPhase('45606343-e6f5-475f-a2b3-f31d6ab10733');
  const phases = useActivitiesFieldStore((state) => state.phases);
  useActivitiesHazardTypes('45606343-e6f5-475f-a2b3-f31d6ab10733');
  const hazardTypes = useActivitiesFieldStore((state) => state.hazardTypes);
  // const { hazardType, category, phase } = useActivitiesFields();
  const FormSchema = z.object({
    title: z.string().min(2, { message: 'Title must be at least 4 character' }),
    responsibility: z
      .string()
      .min(2, { message: 'Please enter responsibility' }),
    source: z.string().min(2, { message: 'Please enter source' }),
    phase: z.string({
      required_error: 'Please select phase',
    }),
    category: z.string({
      required_error: 'Please select category',
    }),
    hazardType: z.string({
      required_error: 'Please select hazard type',
    }),
    description: z
      .string()
      .toUpperCase()
      .min(4, { message: 'Must be at least 5 characters' }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: '',
      responsibility: '',
      source: '',
      phase: '',
      category: '',
      hazardType: '',
      description: '',
    },
  });

  const handleCreateActivities = () => {};
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleCreateActivities)}>
        <div className="p-4 h-add bg-white">
          <h1 className="text-lg font-semibold mb-6">Add : Activities</h1>
          <div className="shadow-md p-4 rounded-sm">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormControl>
                        <Input type="text" placeholder="Title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="responsibility"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Responsibility"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="source"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormControl>
                        <Input type="text" placeholder="Source" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="phase"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select phase" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {phases.map((item) => (
                          <SelectItem key={item.id} value={item.uuid}>
                            {item.name}
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
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((item) => (
                          <SelectItem key={item.id} value={item.uuid}>
                            {item.name}
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
                name="hazardType"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select hazard type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {hazardTypes.map((item) => (
                          <SelectItem key={item.id} value={item.uuid}>
                            {item.name}
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
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="textarea"
                          placeholder="Description"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
            <div className="flex justify-end">
              <Button>Create Activities</Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}

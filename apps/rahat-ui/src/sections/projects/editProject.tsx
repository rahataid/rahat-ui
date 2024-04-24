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
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// type IProps = {
//   handleGoBack: (item: string) => void;
// };

export default function EditProject() {
  const FormSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 4 character' }),
    contractAddress: z
      .string()
      .min(42, { message: 'The Ethereum address must be 42 characters long' }),
    projectManager: z
      .string()
      .toUpperCase()
      .min(4, { message: 'Must be at least 4 characters' }),
    description: z
      .string()
      .toUpperCase()
      .min(4, { message: 'Must be at least 4 characters' }),
    location: z
      .string()
      .toUpperCase()
      .min(4, { message: 'Must be at least 4 characters' }),
    startDate: z.date({
      required_error: 'Start date is required.',
    }),
    endDate: z.date({
      required_error: 'End date is required.',
    }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      location: '',
      contractAddress: '',
      projectManager: '',
    },
  });

  const handleUpdateProject = () => {};
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleUpdateProject)}>
        <div className="p-4 h-add bg-card">
          <div className="shadow-md p-4 rounded-sm">
            <h1 className="text-lg font-semibold mb-6">Edit Project</h1>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormControl>
                        <Input type="text" placeholder="Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="text"
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
            <div className="flex justify-between">
              <Button
                variant="ghost"
                className="text-primary"
                type="button"
                // onClick={() => handleGoBack(PROJECT_DETAIL_NAV_ROUTE.DEFAULT)}
              >
                Go Back
              </Button>
              <Button>Update Project</Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}

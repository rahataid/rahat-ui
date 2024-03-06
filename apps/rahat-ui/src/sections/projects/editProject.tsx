'use-client';

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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@rahat-ui/shadcn/components/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@rahat-ui/shadcn/components/calendar';

import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { z } from 'zod';
import { Wallet } from 'lucide-react';
import { PROJECT_DETAIL_NAV_ROUTE } from '../../constants/project.detail.const';

type IProps = {
  handleGoBack: (item: string) => void;
};

export default function EditProject({ handleGoBack }: IProps) {
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
        <div className="p-4 h-add bg-white">
          <h1 className="text-lg font-semibold mb-6">Edit Project</h1>
          <div className="shadow-md p-4 rounded-sm">
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
                name="location"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormControl>
                        <Input type="text" placeholder="Location" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="projectManager"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Project Manager"
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

              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button variant="outline">
                              {field.value ? (
                                format(field.value, 'PPP')
                              ) : (
                                <span>Start Date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date('1900-01-01')
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button variant="outline">
                              {field.value ? (
                                format(field.value, 'PPP')
                              ) : (
                                <span>End Date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date('1900-01-01')
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="contractAddress"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormControl>
                        <div className="relative w-full">
                          <Wallet className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="text"
                            placeholder="Contract Address"
                            {...field}
                          />
                        </div>
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
                onClick={() => handleGoBack(PROJECT_DETAIL_NAV_ROUTE.DEFAULT)}
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

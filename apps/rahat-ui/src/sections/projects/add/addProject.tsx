'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Calendar } from '@rahat-ui/shadcn/components/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@rahat-ui/shadcn/components/popover';
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
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { Wallet } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export default function AddProject() {
  const router = useRouter();
  const handleGoBack = () => {
    router.back();
  };
  const FormSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 4 character' }),
    projectType: z.string({
      required_error: 'Please select project type.',
    }),
    longitude: z.number().optional(),
    latitude: z.number().optional(),
    hazardType: z.string({
      required_error: 'Please select hazard type.',
    }),
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

  const handleCreateProject = () => {};
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleCreateProject)}>
        <div className="p-4 h-add bg-white">
          <h1 className="text-lg font-semibold mb-6">Add Project</h1>
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
                name="projectType"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select project type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="CVA">CVA</SelectItem>
                        <SelectItem value="AA">AA</SelectItem>
                        <SelectItem value="EL">EL</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
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
              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="longitude"
                  render={({ field }) => {
                    return (
                      <FormItem className="w-full">
                        <FormControl>
                          <Input
                            type="float"
                            placeholder="Longitude"
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
                  name="latitude"
                  render={({ field }) => {
                    return (
                      <FormItem className="w-full">
                        <FormControl>
                          <Input
                            type="float"
                            placeholder="Latitude"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
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
              {form.watch('projectType') === 'AA' && (
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
                          <SelectItem value="riverineFlood">
                            Riverine Flood
                          </SelectItem>
                          <SelectItem value="inundation">Inundation</SelectItem>
                          <SelectItem value="flashFlood">
                            Flash Flood
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            <div className="flex justify-between">
              <Button
                variant="ghost"
                className="text-primary"
                type="button"
                onClick={handleGoBack}
              >
                Go Back
              </Button>
              <Button>Create Project</Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}

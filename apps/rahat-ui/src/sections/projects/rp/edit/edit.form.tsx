'use client';

import { cn } from '@rahat-ui/shadcn/src';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Calendar } from '@rahat-ui/shadcn/src/components/ui/calendar';
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
} from '@rahat-ui/shadcn/src/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import { format } from 'date-fns';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  PROJECT_SETTINGS_KEYS,
  useProject,
  useProjectEdit,
  useProjectSettingsStore,
} from '@rahat-ui/query';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { ProjectTypes } from '@rahataid/sdk/enums';
import { enumToObjectArray } from '@rumsan/sdk/utils';
import { UUID } from 'crypto';
import { CalendarIcon } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export default function EditProject() {
  const { id } = useParams() as { id: UUID };
  const projectContract = useProjectSettingsStore(
    (state) =>
      state?.settings?.[id]?.[PROJECT_SETTINGS_KEYS.CONTRACT]?.c2cproject
        ?.address,
  ) as string;

  const { data: project } = useProject(id);
  const projectEdit = useProjectEdit();

  const FormSchema = z.object({
    name: z.string(),
    projectType: z.string(),
    location: z.string(),
    longitude: z.string(),
    latitude: z.string(),
    projectManager: z.string(),
    description: z.string(),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    extras: z.object({
      treasury: z.object({
        network: z.string(),
        multiSigWalletAddress: z.string(),
        contractAddress: z.string().optional(),
        treasurySources: z.array(z.string()).optional(),
      }),
    }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      description: '',
      extras: {
        treasury: {
          treasurySources: [],
          contractAddress: projectContract,
          multiSigWalletAddress: '',
          network: '',
        },
      },
      latitude: '',
      location: '',
      longitude: '',
      name: '',
      projectManager: '',
      projectType: '',
    },
  });

  useEffect(() => {
    form.setValue('extras.treasury.contractAddress', projectContract);
  }, [form, projectContract]);

  useEffect(() => {
    if (project && project?.data) {
      const projectData = JSON.parse(JSON.stringify(project?.data));
      form.reset({
        ...projectData,
        ...(projectData?.extras?.treasury
          ? {
              extras: {
                ...projectData.extras,
              },
            }
          : {
              extras: {
                treasury: {
                  network: '',
                  multiSigWalletAddress: '',
                  contractAddress: projectContract,
                  treasurySources: [],
                },
              },
            }),
      });
    }
  }, [form, project, projectContract]);

  const onAdvancedFormSubmit = async (data: z.infer<typeof FormSchema>) => {
    console.log('Advanced form submitted', data);
    await projectEdit.mutateAsync({
      uuid: id,
      data,
    });
    return;
  };

  return (
    <ScrollArea>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onAdvancedFormSubmit)}>
          <div className="p-4 h-add bg-card">
            <div className="shadow-md p-4 rounded-sm">
              <h1 className="text-lg font-semibold mb-6">Edit Project</h1>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <FormField
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
                          {enumToObjectArray(ProjectTypes).map((item) => {
                            return (
                              <SelectItem
                                key={item.value}
                                value={item.value.toLowerCase()}
                              >
                                {item.label}
                              </SelectItem>
                            );
                          })}
                          {/* // <SelectItem value="RP">RP</SelectItem>
                          // <SelectItem value="AA">AA</SelectItem>
                          // <SelectItem value="EL">EL</SelectItem> */}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="location"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Location"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <div className="grid grid-cols-2 gap-2">
                  <FormField
                    name="longitude"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="text"
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
                    name="latitude"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="text"
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
                <div className="grid grid-cols-2 gap-2">
                  <FormField
                    name="startDate"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={'outline'}
                                  className={cn(
                                    'w-full pl-3 text-left font-normal',
                                    !field.value && 'text-muted-foreground',
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, 'PPP')
                                  ) : (
                                    <span>Start Date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date > new Date() ||
                                  date < new Date('1900-01-01')
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </FormItem>
                      );
                    }}
                  />
                  <FormField
                    name="endDate"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={'outline'}
                                  className={cn(
                                    'w-full pl-3 text-left font-normal',
                                    !field.value && 'text-muted-foreground',
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, 'PPP')
                                  ) : (
                                    <span>End Date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date > new Date() ||
                                  date < new Date('1900-01-01')
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </FormItem>
                      );
                    }}
                  />
                </div>
              </div>
              <div className="flex justify-between mt-4">
                <Button variant="ghost" className="text-primary" type="submit">
                  Go Back
                </Button>
                <Button>Edit Project</Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </ScrollArea>
  );
}

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useAAStationsStore, useCreateDataSource } from '@rahat-ui/query';
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
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { number, z } from 'zod';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';

const WATER_LEVELS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
const TIME_INTERVAL = [
  {
    time: 'Every 5 seconds.',
    seconds: '5000'
  },
  {
    time: 'Every 30 seconds.',
    seconds: '30000'
  },
  {
    time: 'Every 1 minute.',
    seconds: '60000'
  },
  {
    time: 'Every 5 minutes.',
    seconds: '300000'
  },
  {
    time: 'Every 10 minutes.',
    seconds: '600000'
  },
  {
    time: 'Every 30 minutes',
    seconds: '60000'
  }
]

export default function AddDataSource() {
  const params = useParams();
  const createDataSource = useCreateDataSource();
  const projectID = params.id as UUID;
  const dhmStations = useAAStationsStore((state) => state.dhmStations![projectID]);

  const FormSchema = z.object({
    dataSource: z.string({ required_error: 'Required.' }),
    location: z.string().min(1, { message: 'Required.' }),
    repeatEvery: z.string().min(1, { message: 'Required.' }),
    dangerLevel: z.string().min(1, { message: 'Required.' }),
    warningLevel: z.string().min(1, { message: 'Required.' }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      dataSource: 'DHM',
      dangerLevel: '',
      warningLevel: '',
      location: '',
      repeatEvery: ''
    }
  });

  const handleCreateDataSource = async (data: z.infer<typeof FormSchema>) => {
    try {
      const result = await createDataSource.mutateAsync({
        projectUUID: projectID,
        dataSourcePayload: {
          ...data,
          triggerActivity: 'EMAIL'
        }
      });
      if (result) {
        toast.success('Data source added successfully!');
        form.reset();
      }
    } catch (e) {
      toast.error('Failed to add data source.');
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleCreateDataSource)}>
          <div className="p-4 h-add">
            <div className="shadow-md p-4 rounded-sm bg-card">
              <h1 className="text-lg font-semibold mb-6">Add Data Source</h1>
              <h3 className="text-lg font-semibold mb-6"> Trigger Activity: EMAIL</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">

                <FormField
                  control={form.control}
                  name="dataSource"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormControl>
                          <Input type="text" disabled placeholder="Data Source" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Location" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {
                              dhmStations?.results?.map((r: any) => {
                                return (
                                  <SelectItem value={r.title}>
                                    {r.title}
                                  </SelectItem>
                                )
                              })
                            }
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name="dangerLevel"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Danger Level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {
                                WATER_LEVELS.map((d: string) => {
                                  return (
                                    <SelectItem value={d}>
                                      {d}
                                    </SelectItem>
                                  )
                                })
                              }
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </div>
                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name="warningLevel"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Warning Level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {
                                WATER_LEVELS.map((d: string) => {
                                  return (
                                    <SelectItem value={d}>
                                      {d}
                                    </SelectItem>
                                  )
                                })
                              }
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </div>
                <div className="col-span-1">
                  <FormField
                    control={form.control}
                    name="repeatEvery"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Repeat Duration" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {
                                TIME_INTERVAL.map((d: { time: string, seconds: string }) => {
                                  return (
                                    <SelectItem value={d.seconds}>
                                      {d.time}
                                    </SelectItem>
                                  )
                                })
                              }
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button>Add Data Source</Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
}

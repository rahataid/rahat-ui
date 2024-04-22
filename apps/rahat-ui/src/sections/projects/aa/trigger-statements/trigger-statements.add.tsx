'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useAAStationsStore, useActivitiesFieldStore, useActivitiesHazardTypes, useCreateTriggerStatement } from '@rahat-ui/query';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';

const WATER_LEVELS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']

export default function AddTriggerStatement() {
  const params = useParams();
  const createTriggerStatement = useCreateTriggerStatement();
  const projectID = params.id as UUID;
  const dhmStations = useAAStationsStore((state) => state.dhmStations![projectID]);

  useActivitiesHazardTypes(projectID);
  const hazardTypes = useActivitiesFieldStore((state) => state.hazardTypes);

  const FormSchema = z.object({
    dataSource: z.string().min(1, { message: 'Required.' }),
    location: z.string().min(1, { message: 'Required.' }),
    dangerLevel: z.string().min(1, { message: 'Required.' }),
    warningLevel: z.string().min(1, { message: 'Required.' }),
    hazardTypeId: z.string().min(1, { message: 'Required.' })
  })
    .refine((data) => Number(data.dangerLevel) > Number(data.warningLevel), {
      message: "Danger level must me higher than warning level.",
      path: ["dangerLevel"],
    });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      dataSource: '',
      dangerLevel: '',
      warningLevel: '',
      location: '',
      hazardTypeId: ''
    }
  });

  const handleCreateTriggerStatement = async (data: z.infer<typeof FormSchema>) => {
    try {
      let payload;
      if (data.dataSource === 'DHM') {
        payload = {
          dataSource: data.dataSource,
          location: data.location,
          hazardTypeId: data.hazardTypeId,
          triggerStatement: {
            dangerLevel: data.dangerLevel,
            warningLevel: data.warningLevel
          }
        }
      }

      await createTriggerStatement.mutateAsync({
        projectUUID: projectID,
        triggerStatementPayload: {
          ...payload,
          triggerActivity: ['EMAIL'],
          repeatEvery: 300000 //5 minutes
        }
      });
    } catch (e) {
      toast.error('Failed to add trigger statement.');
    }
  };


  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleCreateTriggerStatement)}>
          <div className="p-4 h-add">
            <div className="shadow-md p-4 rounded-sm bg-card">
              <h1 className="text-lg font-semibold mb-6">Add Trigger Statement</h1>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <FormField
                  control={form.control}
                  name="dataSource"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Data Source" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={'DHM'}>
                              Department of Hydrology and Meteorology (DHM)
                            </SelectItem>
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
                                <SelectValue placeholder="River Basin" />
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
                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name="hazardTypeId"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Hazard Type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {
                                hazardTypes?.map((d: any) => {
                                  return (
                                    <SelectItem value={d.uuid}>
                                      {d.name}
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
              </div>

              <div className="flex justify-end">
                <Button>Add Trigger Statement</Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
}

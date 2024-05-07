'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  useAAStationsStore,
  useActivitiesStore,
  useActivitiesHazardTypes,
  useCreateTriggerStatement,
} from '@rahat-ui/query';
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
import { z } from 'zod';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import { Textarea } from '@rahat-ui/shadcn/src/components/ui/textarea';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';

const WATER_LEVELS = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
];

export default function AddTriggerStatement() {
  const params = useParams();
  const createTriggerStatement = useCreateTriggerStatement();
  const projectID = params.id as UUID;
  const dhmStations = useAAStationsStore(
    (state) => state.dhmStations![projectID],
  );

  // TODO: refactor to searchable select
  const stations = [...dhmStations.results.slice(0, 5), { title: 'Karnali at Chisapani' }]

  useActivitiesHazardTypes(projectID);
  const hazardTypes = useActivitiesStore((state) => state.hazardTypes);

  // const FormSchema = z.object({
  //   dataSource: z.string().min(1, { message: 'Required.' }),
  //   location: z.string().min(1, { message: 'Required.' }),
  //   activationLevel: z.string().min(1, { message: 'Required.' }),
  //   readinessLevel: z.string().min(1, { message: 'Required.' }),
  //   hazardTypeId: z.string().min(1, { message: 'Required.' })
  // })
  //   .refine((data) => Number(data.activationLevel) > Number(data.readinessLevel), {
  //     message: "Activation level must be higher than readiness level.",
  //     path: ["activationLevel"],
  //   });

  const FormSchema = z.object({
    dataSource: z.string().min(1, { message: 'Required.' }),
    location: z.string().optional(),
    activationLevel: z.string().optional(),
    readinessLevel: z.string().optional(),
    hazardTypeId: z.string().optional(),
    title: z.string().optional(),
    notes: z.string().optional(),
  }).superRefine((data, ctx) => {
    if (data.dataSource !== 'MANUAL') {
         if (!data.title) ctx.addIssue({
        path: ['title'],
        message: 'Required.',
        code: 'custom'
      });


      if (!data.location) ctx.addIssue({
        path: ['location'],
        message: 'Required.',
        code: 'custom'
      });

      if (!data.activationLevel) ctx.addIssue({
        path: ['activationLevel'],
        message: 'Required.',
        code: 'custom'

      });
      if (!data.readinessLevel) ctx.addIssue({
        path: ['readinessLevel'],
        message: 'Required.',
        code: 'custom'

      });
      if (!data.hazardTypeId) ctx.addIssue({
        path: ['hazardTypeId'],
        message: 'Required.',
        code: 'custom'

      });

      if (Number(data.activationLevel) <= Number(data.readinessLevel)) {
        ctx.addIssue({
          path: ['activationLevel'],
          message: "Activation level must be higher than readiness level.",
          code: 'custom'
        });
      }
    }
    if (data.dataSource === 'MANUAL') {
      if (!data.title) ctx.addIssue({
        path: ['title'],
        message: 'Required.',
        code: 'custom'
      });

      if (!data.notes) ctx.addIssue({
        path: ['notes'],
        message: 'Required.',
        code: 'custom'

      });

    }
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: '',
      dataSource: '',
      readinessLevel: '',
      activationLevel: '',
      location: '',
      hazardTypeId: '',
    },
  });

  const handleCreateTriggerStatement = async (data: z.infer<typeof FormSchema>) => {
    let payload;
    if (data.dataSource === 'DHM') {
      payload = {
        title: data.title,
        dataSource: data.dataSource,
        location: data.location,
        hazardTypeId: data.hazardTypeId,
        triggerStatement: {
          readinessLevel: data.readinessLevel,
          activationLevel: data.activationLevel
        }
      }
    }

    if (data.dataSource === 'MANUAL') {
      payload = {
        dataSource: data.dataSource,
        title: data.title,
        notes: data.notes
      }
    }

    await createTriggerStatement.mutateAsync({
      projectUUID: projectID,
      triggerStatementPayload: payload
    });

    form.reset();
  };

  const dataSource = form.watch('dataSource');

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleCreateTriggerStatement)}>
          <div className="p-4 h-add">
            <div className="shadow-md p-4 rounded-sm bg-card">
              <h1 className="text-lg font-semibold mb-6">
                Add Trigger Statement
              </h1>

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
                            <SelectItem value={'MANUAL'}>
                              Manual
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <div className="">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormControl>
                            <Input type="text" placeholder="Trigger title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </div>
              </div>



              {
                dataSource !== 'MANUAL' && (
                  <>
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
                                    {stations?.map((r: any) => {
                                      return (
                                        <SelectItem value={r.title}>
                                          {r.title}
                                        </SelectItem>
                                      );
                                    })}
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
                                    {hazardTypes?.map((d: any) => {
                                      return (
                                        <SelectItem value={d.uuid}>
                                          {d.name}
                                        </SelectItem>
                                      );
                                    })}
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
                          name="readinessLevel"
                          render={({ field }) => {
                            return (
                              <FormItem>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Readiness Level" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {WATER_LEVELS.map((d: string) => {
                                      return <SelectItem value={d}>{d}</SelectItem>;
                                    })}
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
                          name="activationLevel"
                          render={({ field }) => {
                            return (
                              <FormItem>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Activation Level" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {WATER_LEVELS.map((d: string) => {
                                      return <SelectItem value={d}>{d}</SelectItem>;
                                    })}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            );
                          }}
                        />
                      </div>
                    </div>
                  </>
                )
              }


              {
                dataSource === 'MANUAL' && (
                  <>

                    <div className="my-2">
                      <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => {
                          return (
                            <FormItem>
                              <FormControl>
                                <Textarea
                                  {...field}
                                  placeholder="Trigger notes."
                                  className="rounded"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />
                    </div>
                  </>
                )
              }


              <div className="flex justify-end">
                <Button>Add Trigger Statement</Button>
              </div>
            </div>
          </div>

        </form>
      </Form >
    </>
  );
}

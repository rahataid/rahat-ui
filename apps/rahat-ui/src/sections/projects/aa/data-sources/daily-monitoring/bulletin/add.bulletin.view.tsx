import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@rahat-ui/shadcn/src/components/ui/select';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';
import { UUID } from 'crypto';
import { useCreateDailyMonitoring } from '@rahat-ui/query';

export default function AddBulletin() {
  const params = useParams();
  const projectId = params.id as UUID;
  const router = useRouter();

  const createDailyMonitoring = useCreateDailyMonitoring();

  const FormSchema = z
    .object({
      dataEntryBy: z.string().min(2, { message: 'Please enter name.' }),
      riverBasin: z
        .string()
        .min(1, { message: 'Please select a river basin.' }),
      source: z.string().min(1, { message: 'Please select a source.' }),
      forecast: z.string().min(1, { message: 'Please select a forecast.' }),
      todayStatus: z.string().optional(),
      tomorrowStatus: z.string().optional(),
      dayAfterTommorrowStatus: z.string().optional(),
      hours24: z.string().optional(),
      hours48: z.string().optional(),
      hours72: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      if (data.source === 'x') {
        if (!data.todayStatus) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['todayStatus'],
            message: "Please select today's status.",
          });
        }
        if (!data.tomorrowStatus) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['tomorrowStatus'],
            message: "Please select tomorrow's status.",
          });
        }
        if (!data.dayAfterTommorrowStatus) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['dayAfterTommorrowStatus'],
            message: "Please select the day after tomorrow's status.",
          });
        }
      } else if (data.source === 'y') {
        if (!data.hours24) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['hours24'],
            message: 'Please select 24 hours status.',
          });
        }
        if (!data.hours48) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['hours48'],
            message: 'Please select 48 hours status.',
          });
        }
        if (!data.hours72) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['hours72'],
            message: 'Please select 72 hours status.',
          });
        }
      }
    });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      dataEntryBy: '',
      riverBasin: '',
      source: '',
      forecast: '',
    },
  });

  type ISelectFormField = {
    name:
      | 'todayStatus'
      | 'tomorrowStatus'
      | 'dayAfterTommorrowStatus'
      | 'hours24'
      | 'hours48'
      | 'hours72';
    label: string;
  };

  const SelectFormField = ({ name, label }: ISelectFormField) => {
    return (
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="demo">Demo</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  const renderConditionalFields = () => {
    const selectedSource = form.watch('source');
    let fields;
    switch (selectedSource) {
      case 'x':
        fields = (
          <>
            <SelectFormField name="todayStatus" label="Today's status" />
            <SelectFormField name="tomorrowStatus" label="Tomorrow's status" />
            <SelectFormField
              name="dayAfterTommorrowStatus"
              label="The day after tomorrow's status"
            />
          </>
        );
        break;
      case 'y':
        fields = (
          <>
            <SelectFormField name="hours24" label="24 hours" />
            <SelectFormField name="hours48" label="48 hours" />
            <SelectFormField name="hours72" label="72 hours" />
          </>
        );
        break;
      default:
        break;
    }
    return fields;
  };

  const handleCreateBulletin = async (data: z.infer<typeof FormSchema>) => {
    console.log('data::', data);
    try {
      await createDailyMonitoring.mutateAsync({
        projectUUID: projectId,
        monitoringPayload: data,
      });
    } catch (e) {
      console.error('Create Bulletin Error::', e);
    } finally {
      form.reset();
    }
  };

  React.useEffect(() => {
    if (createDailyMonitoring.isSuccess) {
      form.reset();
      router.back();
    }
  }, [createDailyMonitoring.isSuccess]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleCreateBulletin)}>
        <div className="h-add p-4 bg-secondary">
          <Card className="rounded-sm">
            <CardHeader>
              <CardTitle className="text-lg">Add Bulletin</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="dataEntryBy"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Data Entry By</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter Data Entry Personal"
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
                  name="riverBasin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>River Basin</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select River Basin" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="demo">Demo</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="source"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Source</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Data Source" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="x">X</SelectItem>
                          <SelectItem value="y">Y</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="forecast"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Forecast</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Forecast" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="demo">Demo</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {renderConditionalFields()}
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex justify-end w-full gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  className="bg-red-100 text-red-600 w-36"
                  onClick={() => {
                    form.reset();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">Create Bulletin</Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </form>
    </Form>
  );
}

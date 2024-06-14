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
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';

import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';
import { UUID } from 'crypto';
import {
  PROJECT_SETTINGS_KEYS,
  useProjectSettingsStore,
  useCreateDailyMonitoring,
} from '@rahat-ui/query';
import { Plus } from 'lucide-react';
import AddAnotherDataSource from './add.another.data.source';
import SelectFormField from './select.form.field';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';

export default function AddBulletin() {
  const params = useParams();
  const projectId = params.id as UUID;
  const router = useRouter();

  const dataSources = useProjectSettingsStore(
    (s) => s.settings?.[projectId]?.[PROJECT_SETTINGS_KEYS.DATASOURCE],
  );

  const createDailyMonitoring = useCreateDailyMonitoring();

  const anotherDataSourceSchema = {
    source: '',
    forecast: '',
  };

  const FormSchema = z.object({
    dataEntryBy: z.string().min(2, { message: 'Please enter name.' }),
    dataSource: z.array(
      z.object({
        source: z.string().min(1, { message: 'Please select a source.' }),
        forecast: z.string().min(1, { message: 'Please select a forecast.' }),
        todayStatus: z.string().optional(),
        tomorrowStatus: z.string().optional(),
        dayAfterTomorrowStatus: z.string().optional(),
        hours24Status: z.string().optional(),
        hours48Status: z.string().optional(),
        hours72Status: z.string().optional(),
      }),
    ),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      dataEntryBy: '',
      dataSource: [],
    },
  });

  const {
    fields: anotherDataSourceFields,
    append: anotherDataSourceAppend,
    remove: anotherDataSourceRemove,
  } = useFieldArray({
    control: form.control,
    name: 'dataSource',
  });

  const selectedRiverBasin =
    form.watch('dataSource.0.source') === 'DHM'
      ? dataSources?.dhm?.location
      : form.watch('dataSource.0.source') === 'NCMWRF'
      ? dataSources?.ncmwrf?.location ?? 'Karnali at Chisapani'
      : '';

  const renderConditionalFields = () => {
    const selectedSource = form.watch(`dataSource.0.source`);
    let fields;
    switch (selectedSource) {
      case 'DHM':
        fields = (
          <>
            <SelectFormField
              form={form}
              name="dataSource.0.todayStatus"
              label="Today's status"
              placeholder="Select status"
              selectItems={[{ value: 'status1', label: 'Status 1' }]}
            />
            <SelectFormField
              form={form}
              name="dataSource.0.tomorrowStatus"
              label="Tomorrow's status"
              placeholder="Select status"
              selectItems={[{ value: 'status1', label: 'Status 1' }]}
            />
            <SelectFormField
              form={form}
              name="dataSource.0.dayAfterTomorrowStatus"
              label="The day after tomorrow's status"
              placeholder="Select status"
              selectItems={[{ value: 'status1', label: 'Status 1' }]}
            />
          </>
        );
        break;
      case 'NCMWRF':
        fields = (
          <>
            <SelectFormField
              form={form}
              name="dataSource.0.hours24Status"
              label="24 hours"
              placeholder="Select status"
              selectItems={[{ value: 'status1', label: 'Status 1' }]}
            />
            <SelectFormField
              form={form}
              name="dataSource.0.hours48Status"
              label="48 hours"
              placeholder="Select status"
              selectItems={[{ value: 'status1', label: 'Status 1' }]}
            />
            <SelectFormField
              form={form}
              name="dataSource.0.hours72Status"
              label="72 hours"
              placeholder="Select status"
              selectItems={[{ value: 'status1', label: 'Status 1' }]}
            />
          </>
        );
        break;
      default:
        break;
    }
    return fields;
  };

  const handleCreateBulletin = async (data: z.infer<typeof FormSchema>) => {
    const payload = {
      dataEntryBy: data.dataEntryBy,
      location: selectedRiverBasin,
      data: data.dataSource,
    };
    try {
      await createDailyMonitoring.mutateAsync({
        projectUUID: projectId,
        monitoringPayload: payload,
      });
    } catch (e) {
      console.error('Create Bulletin Error::', e);
    }
  };

  React.useEffect(() => {
    if (createDailyMonitoring.isSuccess) {
      form.reset();
      router.push(`/projects/aa/${projectId}/data-sources/#monitoring`);
    }
  }, [createDailyMonitoring.isSuccess]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleCreateBulletin)}>
        <div className="h-add p-4 bg-secondary">
          <Card className="rounded-sm">
            <CardHeader>
              <CardTitle className="text-lg">Add Daily Monitoring</CardTitle>
            </CardHeader>
            <ScrollArea className="h-[calc(100vh-238px)]">
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
                  <FormItem>
                    <FormLabel>River Basin</FormLabel>
                    <Input
                      value={selectedRiverBasin}
                      placeholder="Select data source to display river basin"
                      disabled
                    />
                  </FormItem>
                  <SelectFormField
                    form={form}
                    name="dataSource.0.source"
                    label="Source"
                    placeholder="Select Data Source"
                    selectItems={[
                      { value: 'DHM', label: 'DHM' },
                      { value: 'NCMWRF', label: 'NCMWRF' },
                    ]}
                  />
                  <SelectFormField
                    form={form}
                    name="dataSource.0.forecast"
                    label="Forecast"
                    placeholder="Select Forecast"
                    selectItems={[
                      { value: 'forecast1', label: 'Forecast 1' },
                      { value: 'forecast2', label: 'Forecast 2' },
                    ]}
                  />
                  {renderConditionalFields()}
                </div>
                {anotherDataSourceFields
                  .filter((_, index) => index !== 0)
                  .map((_, index) => (
                    <AddAnotherDataSource
                      key={index}
                      form={form}
                      index={index + 1}
                      onClose={() => {
                        anotherDataSourceRemove(index);
                      }}
                    />
                  ))}

                <Button
                  type="button"
                  variant="outline"
                  className="border-dashed border-primary text-primary text-sm w-full mt-4"
                  onClick={() =>
                    anotherDataSourceAppend(anotherDataSourceSchema)
                  }
                >
                  Add Another Data Source
                  <Plus className="ml-2" size={16} strokeWidth={3} />
                </Button>
              </CardContent>
            </ScrollArea>

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
                <Button type="submit" className="w-32">
                  Update
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </form>
    </Form>
  );
}

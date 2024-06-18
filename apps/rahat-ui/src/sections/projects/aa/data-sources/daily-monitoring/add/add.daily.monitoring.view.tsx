import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Form,
  FormItem,
  FormLabel,
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
  // PROJECT_SETTINGS_KEYS,
  // useProjectSettingsStore,
  useCreateDailyMonitoring,
} from '@rahat-ui/query';
import { Plus } from 'lucide-react';
import AddAnotherDataSource from './add.another.data.source';
import SelectFormField from '../../../../../../components/select.form.field';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import InputFormField from '../../../../../../components/input.form.field';
import { useSelectItems } from '../useSelectItems';

export default function AddDailyMonitoring() {
  const params = useParams();
  const projectId = params.id as UUID;
  const router = useRouter();

  // const dataSources = useProjectSettingsStore(
  //   (s) => s.settings?.[projectId]?.[PROJECT_SETTINGS_KEYS.DATASOURCE],
  // );

  const {
    dataSourceSelectItems,
    dhmForecastSelectItems,
    flashFloodRiskSelectItems,
    rainfallSelectItems,
    rainfallForecastSelectItems,
    floodForecastSelectItems,
  } = useSelectItems();

  const createDailyMonitoring = useCreateDailyMonitoring();

  const anotherDataSourceSchema = {
    source: '',
  };

  const FormSchema = z.object({
    dataEntryBy: z.string().min(2, { message: 'Please enter name.' }),
    dataSource: z.array(
      z.object({
        source: z.string().min(1, { message: 'Please select a source.' }),
        //DHM
        forecast: z.string().optional(),
        //DHM - 3 Days Flood forecast Bulletin
        today: z.string().optional(),
        tomorrow: z.string().optional(),
        dayAfterTomorrow: z.string().optional(),
        //DHM - 3 Days Rainfall forecast Bulletin
        todayAfternoon: z.string().optional(),
        todayNight: z.string().optional(),
        tomorrowAfternoon: z.string().optional(),
        tomorrowNight: z.string().optional(),
        dayAfterTomorrowAfternoon: z.string().optional(),
        dayAfterTomorrowNight: z.string().optional(),
        //DHM - Real time Monitoring(River Watch)
        waterLevel: z.string().optional(),
        //DHM - NWP
        hours24NWP: z.string().optional(),
        hours48: z.string().optional(),
        hours72NWP: z.string().optional(),
        // NCMWRF Accumulated
        heavyRainfallForecastInKarnaliBasin: z.string().optional(),
        hours24: z.string().optional(),
        hours72: z.string().optional(),
        hours168: z.string().optional(),
        // NCMWRF Deterministic & Probabilistic
        extremeWeatherOutlook: z.string().optional(),
        deterministicsPredictionSystem: z.string().optional(),
        probabilisticPredictionSystem: z.string().optional(),
        // GLOFAS
        todayGLOFAS: z.string().optional(),
        days3: z.string().optional(),
        days5: z.string().optional(),
        inBetweenTodayUntil7DaysIsThereAnyPossibilityOfPeak: z
          .string()
          .optional(),
        //Flash Flood Risk Monitoring
        status: z.string().optional(),
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

  // const selectedRiverBasin =
  //   form.watch('dataSource.0.source') === 'DHM'
  //     ? dataSources?.dhm?.location
  //     : form.watch('dataSource.0.source') === 'NCMWRF'
  //     ? dataSources?.ncmwrf?.location ?? 'Karnali at Chisapani'
  //     : '';

  const selectedRiverBasin = 'Karnali at Chisapani';

  const selectedSource = form.watch(`dataSource.0.source`);

  const renderFieldsBasedOnSource = () => {
    let fields;
    switch (selectedSource) {
      case 'DHM':
        fields = (
          <>
            <SelectFormField
              form={form}
              name="dataSource.0.forecast"
              label="Forecast"
              placeholder="Select forecast"
              selectItems={dhmForecastSelectItems}
            />
            {renderFieldsBasedOnDHMForecast()}
          </>
        );
        break;
      case 'GLOFAS':
        fields = (
          <>
            <InputFormField
              form={form}
              name="dataSource.0.todayGLOFAS"
              label="Today"
              placeholder="Enter today's status"
            />
            <InputFormField
              form={form}
              name="dataSource.0.days3"
              label="3 days"
              placeholder="Enter 3 day's status"
            />
            <InputFormField
              form={form}
              name="dataSource.0.days5"
              label="5 days"
              placeholder="Enter 5 day's status"
            />
            <InputFormField
              form={form}
              name="dataSource.0.inBetweenTodayUntil7DaysIsThereAnyPossibilityOfPeak"
              label="In between today until 7 Days is there any possibility of peak"
              placeholder="Enter possibility"
            />
          </>
        );
        break;
      case 'Flash Flood Risk Monitoring':
        fields = (
          <SelectFormField
            form={form}
            name="dataSource.0.status"
            label="Status"
            placeholder="Select status"
            selectItems={flashFloodRiskSelectItems}
          />
        );
        break;
      case 'NCMWRF Accumulated':
        fields = (
          <>
            <SelectFormField
              form={form}
              name="dataSource.0.heavyRainfallForecastInKarnaliBasin"
              label="Heavy Rainfall Forecast in Karnali Basin (upstream areas)"
              subLabel="(more than 100mm in consecutive 2-3 days)"
              placeholder="Select status"
              selectItems={[
                { value: 'Yes', label: 'Yes' },
                { value: 'No', label: 'No' },
              ]}
            />
            <SelectFormField
              form={form}
              name="dataSource.0.hours24"
              label="24 hours"
              placeholder="Select status"
              selectItems={rainfallSelectItems}
            />
            <SelectFormField
              form={form}
              name="dataSource.0.hours72"
              label="72 hours"
              placeholder="Select status"
              selectItems={rainfallSelectItems}
            />
            <SelectFormField
              form={form}
              name="dataSource.0.hours168"
              label="168 hours"
              placeholder="Select status"
              selectItems={rainfallSelectItems}
            />
          </>
        );
        break;
      case 'NCMWRF Deterministic & Probabilistic':
        fields = (
          <>
            <InputFormField
              form={form}
              name="dataSource.0.extremeWeatherOutlook"
              label="Extreme Weather Outlook"
              subLabel="Severe Weather Event -Extreme Rainfall >95 Percentile purple dots over Karnali Watershed"
              placeholder="Enter status"
            />
            <InputFormField
              form={form}
              name="dataSource.0.deterministicsPredictionSystem"
              label="Deterministics Prediction System"
              subLabel="Predicts commulative rainfall more than 300 MM in next 3 to 5 Days"
              placeholder="Enter status"
            />
            <InputFormField
              form={form}
              name="dataSource.0.probabilisticPredictionSystem"
              label="Probabilistic Prediction System"
              subLabel="Heavy Rainfall 115 MM per day 80 percent probablity in next 3 to 5 days"
              placeholder="Enter status"
            />
          </>
        );
        break;
      default:
        break;
    }
    return fields;
  };

  const renderFieldsBasedOnDHMForecast = () => {
    const selectedForecast = form.watch('dataSource.0.forecast');
    let fields;
    switch (selectedForecast) {
      case '3 Days Flood forecast Bulletin':
        fields = (
          <>
            <SelectFormField
              form={form}
              name="dataSource.0.today"
              label="Today"
              placeholder="Select status"
              selectItems={floodForecastSelectItems}
            />
            <SelectFormField
              form={form}
              name="dataSource.0.tomorrow"
              label="Tomorrow"
              placeholder="Select status"
              selectItems={floodForecastSelectItems}
            />
            <SelectFormField
              form={form}
              name="dataSource.0.dayAfterTomorrow"
              label="Day After Tomorrow"
              placeholder="Select status"
              selectItems={floodForecastSelectItems}
            />
          </>
        );
        break;
      case '3 Days Rainfall forecast Bulletin':
        fields = (
          <>
            <SelectFormField
              form={form}
              name="dataSource.0.todayAfternoon"
              label="Today Afternoon"
              placeholder="Select status"
              selectItems={rainfallForecastSelectItems}
            />
            <SelectFormField
              form={form}
              name="dataSource.0.todayNight"
              label="Today Night"
              placeholder="Select status"
              selectItems={rainfallForecastSelectItems}
            />
            <SelectFormField
              form={form}
              name="dataSource.0.tomorrowAfternoon"
              label="Tomorrow Afternoon"
              placeholder="Select status"
              selectItems={rainfallForecastSelectItems}
            />
            <SelectFormField
              form={form}
              name="dataSource.0.tomorrowNight"
              label="Tomorrow Night"
              placeholder="Select status"
              selectItems={rainfallForecastSelectItems}
            />
            <SelectFormField
              form={form}
              name="dataSource.0.dayAfterTomorrowAfternoon"
              label="Day After Tomorrow Afternoon"
              placeholder="Select status"
              selectItems={rainfallForecastSelectItems}
            />
            <SelectFormField
              form={form}
              name="dataSource.0.dayAfterTomorrowNight"
              label="Day After Tomorrow Night"
              placeholder="Select status"
              selectItems={rainfallForecastSelectItems}
            />
          </>
        );
        break;
      case 'Real time Monitoring(River Watch)':
        fields = (
          <InputFormField
            form={form}
            name="dataSource.0.waterLevel"
            label="Water Level(Meter)"
            subLabel="Danger Level 10.8m"
            placeholder="Enter Water Level"
          />
        );
        break;
      case 'NWP':
        fields = (
          <>
            <SelectFormField
              form={form}
              name="dataSource.0.hours24NWP"
              label="24 hours"
              placeholder="Select status"
              selectItems={rainfallSelectItems}
            />
            <SelectFormField
              form={form}
              name="dataSource.0.hours48"
              label="48 hours"
              placeholder="Select status"
              selectItems={rainfallSelectItems}
            />
            <SelectFormField
              form={form}
              name="dataSource.0.hours72NWP"
              label="72 hours"
              placeholder="Select status"
              selectItems={rainfallSelectItems}
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
    const dataPayload = [];
    for (const item of data.dataSource) {
      switch (item.source) {
        case 'DHM':
          switch (item?.forecast) {
            case '3 Days Flood forecast Bulletin':
              dataPayload.push({
                source: item.source,
                forecast: item?.forecast,
                today: item?.today,
                tomorrow: item?.tomorrow,
                dayAfterTomorrow: item?.dayAfterTomorrow,
              });
              break;
            case '3 Days Rainfall forecast Bulletin':
              dataPayload.push({
                source: item.source,
                forecast: item?.forecast,
                todayAfternoon: item?.todayAfternoon,
                todayNight: item?.todayNight,
                tomorrowAfternoon: item?.tomorrowAfternoon,
                tomorrowNight: item?.tomorrowNight,
                dayAfterTomorrowAfternoon: item?.dayAfterTomorrowAfternoon,
                dayAfterTomorrowNight: item?.dayAfterTomorrowNight,
              });
              break;
            case 'Real time Monitoring(River Watch)':
              dataPayload.push({
                source: item.source,
                forecast: item?.forecast,
                waterLevel: item?.waterLevel,
              });
              break;
            case 'NWP':
              dataPayload.push({
                source: item.source,
                forecast: item?.forecast,
                hours24NWP: item?.hours24NWP,
                hours48: item?.hours48,
                hours72NWP: item?.hours72NWP,
              });
              break;
            default:
              break;
          }
          break;
        case 'NCMWRF Accumulated':
          dataPayload.push({
            source: item.source,
            heavyRainfallForecastInKarnaliBasin:
              item?.heavyRainfallForecastInKarnaliBasin,
            hours24: item?.hours24,
            hours72: item?.hours72,
            hours168: item?.hours168,
          });
          break;
        case 'NCMWRF Deterministic & Probabilistic':
          dataPayload.push({
            source: item.source,
            extremeWeatherOutlook: item?.extremeWeatherOutlook,
            deterministicsPredictionSystem:
              item?.deterministicsPredictionSystem,
            probabilisticPredictionSystem: item?.probabilisticPredictionSystem,
          });
          break;
        case 'GLOFAS':
          dataPayload.push({
            source: item.source,
            todayGLOFAS: item?.todayGLOFAS,
            days3: item?.days3,
            days5: item?.days5,
            inBetweenTodayUntil7DaysIsThereAnyPossibilityOfPeak:
              item?.inBetweenTodayUntil7DaysIsThereAnyPossibilityOfPeak,
          });
          break;
        case 'Flash Flood Risk Monitoring':
          dataPayload.push({
            source: item.source,
            status: item?.status,
          });
        default:
          break;
      }
    }
    const payload = {
      dataEntryBy: data.dataEntryBy,
      location: selectedRiverBasin,
      data: dataPayload,
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
                  <InputFormField
                    form={form}
                    name="dataEntryBy"
                    label="Data Entry By"
                    placeholder="Enter Data Entry Personal"
                  />
                  <FormItem>
                    <FormLabel>River Basin</FormLabel>
                    <Input
                      value={selectedRiverBasin}
                      placeholder="Select data source to display river basin"
                      disabled
                    />
                  </FormItem>
                  <div className={selectedSource !== 'DHM' ? 'col-span-2' : ''}>
                    <SelectFormField
                      form={form}
                      name="dataSource.0.source"
                      className={selectedSource !== 'DHM' ? 'w-1/2' : ''}
                      label="Source"
                      placeholder="Select Data Source"
                      selectItems={dataSourceSelectItems}
                    />
                  </div>
                  {renderFieldsBasedOnSource()}
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

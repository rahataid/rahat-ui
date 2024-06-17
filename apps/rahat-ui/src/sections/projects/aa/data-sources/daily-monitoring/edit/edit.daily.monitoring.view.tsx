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
import { useSingleMonitoring, useUpdateMonitoring } from '@rahat-ui/query';
import SelectFormField from '../../../../../../components/select.form.field';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import InputFormField from '../../../../../../components/input.form.field';
import { useSelectItems } from '../useSelectItems';
import Loader from 'apps/rahat-ui/src/components/table.loader';

export default function EditDailyMonitoring() {
  const params = useParams();
  const projectId = params.id as UUID;
  const monitoringId = params.monitoringId as UUID;
  const router = useRouter();

  const { data, isLoading } = useSingleMonitoring(projectId, monitoringId);
  const details = data?.data;

  const updateDailyMonitoring = useUpdateMonitoring();

  const {
    dataSourceSelectItems,
    dhmForecastSelectItems,
    flashFloodRiskSelectItems,
    rainfallSelectItems,
    rainfallForecastSelectItems,
    floodForecastSelectItems,
  } = useSelectItems();

  const FormSchema = z.object({
    dataEntryBy: z.string().min(2, { message: 'Please enter name.' }),
    dataSource: z.object({
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
      // NCMRWF Accumulated
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
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      dataEntryBy: details?.dataEntryBy || '',
      dataSource: {
        source: details?.source || '',
        //DHM
        forecast: details?.forecast || undefined,
        //DHM - 3 Days Flood forecast Bulletin
        today: details?.today || undefined,
        tomorrow: details?.tomorrow || undefined,
        dayAfterTomorrow: details?.dayAfterTomorrow || undefined,
        //DHM - 3 Days Rainfall forecast Bulletin
        todayAfternoon: details?.todayAfternoon || undefined,
        todayNight: details?.todayNight || undefined,
        tomorrowAfternoon: details?.tomorrowAfternoon || undefined,
        tomorrowNight: details?.tomorrowNight || undefined,
        dayAfterTomorrowAfternoon:
          details?.dayAfterTomorrowAfternoon || undefined,
        dayAfterTomorrowNight: details?.dayAfterTomorrowNight || undefined,
        //DHM - Real time Monitoring(River Watch)
        waterLevel: details?.waterLevel || undefined,
        //DHM - NWP
        hours24NWP: details?.hours24NWP || undefined,
        hours48: details?.hours48 || undefined,
        hours72NWP: details?.hours72NWP || undefined,
        // NCMRWF Accumulated
        heavyRainfallForecastInKarnaliBasin:
          details?.heavyRainfallForecastInKarnaliBasin || undefined,
        hours24: details?.hours24 || undefined,
        hours72: details?.hours72 || undefined,
        hours168: details?.hours168 || undefined,
        // NCMWRF Deterministic & Probabilistic
        extremeWeatherOutlook: details?.extremeWeatherOutlook || undefined,
        deterministicsPredictionSystem:
          details?.deterministicsPredictionSystem || undefined,
        probabilisticPredictionSystem:
          details?.probabilisticPredictionSystem || undefined,
        // GLOFAS
        todayGLOFAS: details?.todayGLOFAS || undefined,
        days3: details?.days3 || undefined,
        days5: details?.days5 || undefined,
        inBetweenTodayUntil7DaysIsThereAnyPossibilityOfPeak:
          details?.inBetweenTodayUntil7DaysIsThereAnyPossibilityOfPeak ||
          undefined,
        //Flash Flood Risk Monitoring
        status: details?.status || undefined,
      },
    },
  });

  const selectedSource = form.watch('dataSource.source');

  const renderFieldsBasedOnSource = () => {
    let fields;
    switch (selectedSource) {
      case 'DHM':
        fields = (
          <>
            <SelectFormField
              form={form}
              name="dataSource.forecast"
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
              name="dataSource.todayGLOFAS"
              label="Today"
              placeholder="Enter today's status"
            />
            <InputFormField
              form={form}
              name="dataSource.days3"
              label="3 days"
              placeholder="Enter 3 day's status"
            />
            <InputFormField
              form={form}
              name="dataSource.days5"
              label="5 days"
              placeholder="Enter 5 day's status"
            />
            <InputFormField
              form={form}
              name="dataSource.inBetweenTodayUntil7DaysIsThereAnyPossibilityOfPeak"
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
            name="dataSource.status"
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
              name="dataSource.heavyRainfallForecastInKarnaliBasin"
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
              name="dataSource.hours24"
              label="24 hours"
              placeholder="Select status"
              selectItems={rainfallSelectItems}
            />
            <SelectFormField
              form={form}
              name="dataSource.hours72"
              label="72 hours"
              placeholder="Select status"
              selectItems={rainfallSelectItems}
            />
            <SelectFormField
              form={form}
              name="dataSource.hours168"
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
              name="dataSource.extremeWeatherOutlook"
              label="Extreme Weather Outlook"
              subLabel="Severe Weather Event -Extreme Rainfall >95 Percentile purple dots over Karnali Watershed"
              placeholder="Enter status"
            />
            <InputFormField
              form={form}
              name="dataSource.deterministicsPredictionSystem"
              label="Deterministics Prediction System"
              subLabel="Predicts commulative rainfall more than 300 MM in next 3 to 5 Days"
              placeholder="Enter status"
            />
            <InputFormField
              form={form}
              name="dataSource.probabilisticPredictionSystem"
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
    const selectedForecast = form.watch('dataSource.forecast');
    let fields;
    switch (selectedForecast) {
      case '3 Days Flood forecast Bulletin':
        fields = (
          <>
            <SelectFormField
              form={form}
              name="dataSource.today"
              label="Today"
              placeholder="Select status"
              selectItems={floodForecastSelectItems}
            />
            <SelectFormField
              form={form}
              name="dataSource.tomorrow"
              label="Tomorrow"
              placeholder="Select status"
              selectItems={floodForecastSelectItems}
            />
            <SelectFormField
              form={form}
              name="dataSource.dayAfterTomorrow"
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
              name="dataSource.todayAfternoon"
              label="Today Afternoon"
              placeholder="Select status"
              selectItems={rainfallForecastSelectItems}
            />
            <SelectFormField
              form={form}
              name="dataSource.todayNight"
              label="Today Night"
              placeholder="Select status"
              selectItems={rainfallForecastSelectItems}
            />
            <SelectFormField
              form={form}
              name="dataSource.tomorrowAfternoon"
              label="Tomorrow Afternoon"
              placeholder="Select status"
              selectItems={rainfallForecastSelectItems}
            />
            <SelectFormField
              form={form}
              name="dataSource.tomorrowNight"
              label="Tomorrow Night"
              placeholder="Select status"
              selectItems={rainfallForecastSelectItems}
            />
            <SelectFormField
              form={form}
              name="dataSource.dayAfterTomorrowAfternoon"
              label="Day After Tomorrow Afternoon"
              placeholder="Select status"
              selectItems={rainfallForecastSelectItems}
            />
            <SelectFormField
              form={form}
              name="dataSource.dayAfterTomorrowNight"
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
            name="dataSource.waterLevel"
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
              name="dataSource.hours24NWP"
              label="24 hours"
              placeholder="Select status"
              selectItems={rainfallSelectItems}
            />
            <SelectFormField
              form={form}
              name="dataSource.hours48"
              label="48 hours"
              placeholder="Select status"
              selectItems={rainfallSelectItems}
            />
            <SelectFormField
              form={form}
              name="dataSource.hours72NWP"
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

  const handleEditDailyMonitoring = async (
    data: z.infer<typeof FormSchema>,
  ) => {
    let dataPayload = {};
    const item = data?.dataSource;
    switch (item.source) {
      case 'DHM':
        switch (item?.forecast) {
          case '3 Days Flood forecast Bulletin':
            dataPayload = {
              source: item.source,
              forecast: item?.forecast,
              today: item?.today,
              tomorrow: item?.tomorrow,
              dayAfterTomorrow: item?.dayAfterTomorrow,
            };
            break;
          case '3 Days Rainfall forecast Bulletin':
            dataPayload = {
              source: item.source,
              forecast: item?.forecast,
              todayAfternoon: item?.todayAfternoon,
              todayNight: item?.todayNight,
              tomorrowAfternoon: item?.tomorrowAfternoon,
              tomorrowNight: item?.tomorrowNight,
              dayAfterTomorrowAfternoon: item?.dayAfterTomorrowAfternoon,
              dayAfterTomorrowNight: item?.dayAfterTomorrowNight,
            };
            break;
          case 'Real time Monitoring(River Watch)':
            dataPayload = {
              source: item.source,
              forecast: item?.forecast,
              waterLevel: item?.waterLevel,
            };
            break;
          case 'NWP':
            dataPayload = {
              source: item.source,
              forecast: item?.forecast,
              hours24NWP: item?.hours24NWP,
              hours48: item?.hours48,
              hours72NWP: item?.hours72NWP,
            };
            break;
          default:
            break;
        }
        break;
      case 'NCMWRF Accumulated':
        dataPayload = {
          source: item.source,
          heavyRainfallForecastInKarnaliBasin:
            item?.heavyRainfallForecastInKarnaliBasin,
          hours24: item?.hours24,
          hours72: item?.hours72,
          hours168: item?.hours168,
        };
        break;
      case 'NCMWRF Deterministic & Probabilistic':
        dataPayload = {
          source: item.source,
          extremeWeatherOutlook: item?.extremeWeatherOutlook,
          deterministicsPredictionSystem: item?.deterministicsPredictionSystem,
          probabilisticPredictionSystem: item?.probabilisticPredictionSystem,
        };
        break;
      case 'GLOFAS':
        dataPayload = {
          source: item.source,
          todayGLOFAS: item?.todayGLOFAS,
          days3: item?.days3,
          days5: item?.days5,
          inBetweenTodayUntil7DaysIsThereAnyPossibilityOfPeak:
            item?.inBetweenTodayUntil7DaysIsThereAnyPossibilityOfPeak,
        };
        break;
      case 'Flash Flood Risk Monitoring':
        dataPayload = {
          source: item.source,
          status: item?.status,
        };
      default:
        break;
    }
    const payload = {
      dataEntryBy: data.dataEntryBy,
      location: details?.location,
      data: dataPayload,
    };
    try {
      await updateDailyMonitoring.mutateAsync({
        projectUUID: projectId,
        monitoringPayload: { uuid: monitoringId, ...payload },
      });
    } catch (e) {
      console.error('Edit Daily Monitoring Error::', e);
    }
  };

  React.useEffect(() => {
    if (updateDailyMonitoring.isSuccess) {
      form.reset();
      router.push(`/projects/aa/${projectId}/data-sources/#monitoring`);
    }
  }, [updateDailyMonitoring.isSuccess]);

  return isLoading ? (
    <Loader />
  ) : (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleEditDailyMonitoring)}>
        <div className="h-add p-4 bg-secondary">
          <Card className="rounded-sm">
            <CardHeader>
              <CardTitle className="text-lg">Edit Daily Monitoring</CardTitle>
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
                      value={details?.location}
                      placeholder="Select data source to display river basin"
                      disabled
                    />
                  </FormItem>
                  <div className={selectedSource !== 'DHM' ? 'col-span-2' : ''}>
                    <SelectFormField
                      form={form}
                      name="dataSource.source"
                      className={selectedSource !== 'DHM' ? 'w-1/2' : ''}
                      label="Source"
                      placeholder="Select Data Source"
                      selectItems={dataSourceSelectItems}
                    />
                  </div>
                  {renderFieldsBasedOnSource()}
                </div>
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

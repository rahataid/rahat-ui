
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Form } from '@rahat-ui/shadcn/src/components/ui/form';
import { useParams, useRouter } from 'next/navigation';
import * as React from 'react';


import {
  useRemoveMonitoringWhileUpdating,
  useSingleMonitoring,
  useUpdateMonitoring,
} from '@rahat-ui/query';

import { UUID } from 'crypto';
import { Plus } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import AddAnotherDataSource from '../add/add.another.data.source';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { HeaderWithBack } from 'apps/rahat-ui/src/common';
import Loader from 'apps/rahat-ui/src/components/table.loader';
import InputFormField from '../input.form.field';
import SelectFormField from '../select.form.field';
import { useSelectItems } from '../useSelectItems';


export default function EditDailyMonitoring() {
  const params = useParams();
  const projectId = params.id as UUID;
  const monitoringId = params.monitoringId as UUID;

  const route = useRouter();

  const { riverBasins } = useSelectItems();
  const { data, isLoading } = useSingleMonitoring(projectId, monitoringId);
  const details = React.useMemo(() => {
    return data?.data;
  }, [data]);

  const updateDailyMonitoring = useUpdateMonitoring();
  const removeDailyMonitoringWhileUpdating = useRemoveMonitoringWhileUpdating();
  const anotherDataSourceSchema = {
    source: '',
  };
  const normalizedDataSource = React.useMemo(() => {
    return (
      details?.[0].data?.map((item: any) => {
        switch (item.source) {
          case 'DHM':
            switch (item.forecast) {
              case '3 Days Flood Forecast Bulletin':
                return {
                  source: item.source,
                  forecast: item.forecast,
                  today: item.today || '',
                  tomorrow: item.tomorrow || '',
                  dayAfterTomorrow: item.dayAfterTomorrow || '',
                  id: item.id,
                };
              case '3 Days Rainfall Forecast Bulletin':
                return {
                  source: item.source,
                  forecast: item.forecast,
                  todayAfternoon: item.todayAfternoon || '',
                  todayNight: item.todayNight || '',
                  tomorrowAfternoon: item.tomorrowAfternoon || '',
                  tomorrowNight: item.tomorrowNight || '',
                  dayAfterTomorrowAfternoon:
                    item.dayAfterTomorrowAfternoon || '',
                  dayAfterTomorrowNight: item.dayAfterTomorrowNight || '',
                  id: item.id,
                };
              case 'Realtime Monitoring (River Watch)':
                return {
                  source: item.source,
                  forecast: item.forecast,
                  waterLevel: item.waterLevel || '',
                  id: item.id,
                };

              case 'NWP':
                return {
                  source: item.source,
                  forecast: item.forecast,
                  hours24NWP: item.hours24NWP || '',
                  hours48: item.hours48 || '',
                  hours72NWP: item.hours72NWP || '',
                  id: item.id,
                };
              default:
                return {
                  source: item.source,
                  forecast: item.forecast || '',
                  id: item.id,
                };
            }
          case 'NCMRWF Accumulated':
            return {
              source: item.source,
              heavyRainfallForecastInKarnaliBasin:
                item.heavyRainfallForecastInKarnaliBasin || '',
              hours24: item.hours24 || '',
              hours72: item.hours72 || '',
              hours168: item.hours168 || '',
              id: item.id,
            };
          case 'NCMRWF Deterministic & Probabilistic':
            return {
              source: item.source,
              extremeWeatherOutlook: item.extremeWeatherOutlook || '',
              deterministicsPredictionSystem:
                item.deterministicsPredictionSystem || '',
              probabilisticPredictionSystem:
                item.probabilisticPredictionSystem || '',
              id: item.id,
            };
          case 'GLOFAS':
            return {
              source: item.source,
              todayGLOFAS: item.todayGLOFAS || '',
              days3: item.days3 || '',
              days5: item.days5 || '',
              inBetweenTodayUntil7DaysIsThereAnyPossibilityOfPeak:
                item.inBetweenTodayUntil7DaysIsThereAnyPossibilityOfPeak || '',
              id: item.id,
            };
          case 'Flash Flood Risk Monitoring':
            return {
              source: item.source,
              status: item.status || '',
              id: item.id,
            };
          case 'Gauge Reading':
            return {
              source: item.source,
              gaugeReading: item.gaugeReading || '',
              station: item.station,
              id: item.id,
            };
          default:
            return {
              source: item.source,
              id: item.id,
            };
        }
      }) || []
    );
  }, [details]);

  const FormSchema = z.object({
    dataEntryBy: z.string().min(2, { message: 'Please enter name.' }),
    riverBasin: z.string().min(1, { message: 'Please select a river basin.' }),
    dataSource: z.array(
      z.object({
        id: z.number().optional(),
        source: z.string().min(1, { message: 'Please select a source.' }),
        //DHM
        forecast: z.string().optional(),
        //DHM - 3 Days Flood Forecast Bulletin
        today: z.string().optional(),
        tomorrow: z.string().optional(),
        dayAfterTomorrow: z.string().optional(),
        //DHM - 3 Days Rainfall Forecast Bulletin
        todayAfternoon: z.string().optional(),
        todayNight: z.string().optional(),
        tomorrowAfternoon: z.string().optional(),
        tomorrowNight: z.string().optional(),
        dayAfterTomorrowAfternoon: z.string().optional(),
        dayAfterTomorrowNight: z.string().optional(),
        //DHM - Realtime Monitoring (River Watch)
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
        // NCMRWF Deterministic & Probabilistic
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

        //gauge Reading
        gaugeReading: z.string().optional(),


        station: z.string().optional(),

      }),
    ),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      dataEntryBy: '',
      riverBasin: data?.data?.[0].riverBasin || '',
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

  const handleEditDailyMonitoring = async (
    data: z.infer<typeof FormSchema>,
  ) => {
    const dataPayload = [];
    for (const item of data.dataSource) {
      switch (item.source) {
        case 'DHM':
          switch (item?.forecast) {
            case '3 Days Flood Forecast Bulletin':
              dataPayload.push({
                source: item.source,
                forecast: item?.forecast,
                today: item?.today,
                tomorrow: item?.tomorrow,
                dayAfterTomorrow: item?.dayAfterTomorrow,
                id: item?.id,
              });
              break;
            case '3 Days Rainfall Forecast Bulletin':
              dataPayload.push({
                source: item.source,
                forecast: item?.forecast,
                todayAfternoon: item?.todayAfternoon,
                todayNight: item?.todayNight,
                tomorrowAfternoon: item?.tomorrowAfternoon,
                tomorrowNight: item?.tomorrowNight,
                dayAfterTomorrowAfternoon: item?.dayAfterTomorrowAfternoon,
                dayAfterTomorrowNight: item?.dayAfterTomorrowNight,
                id: item?.id,
              });
              break;
            case 'Realtime Monitoring (River Watch)':
              dataPayload.push({
                source: item.source,
                forecast: item?.forecast,
                waterLevel: item?.waterLevel,
                id: item?.id,
              });
              break;

            case 'NWP':
              dataPayload.push({
                source: item.source,
                forecast: item?.forecast,
                hours24NWP: item?.hours24NWP,
                hours48: item?.hours48,
                hours72NWP: item?.hours72NWP,
                id: item?.id,
              });
              break;
            default:
              break;
          }
          break;
        case 'NCMRWF Accumulated':
          dataPayload.push({
            source: item.source,
            heavyRainfallForecastInKarnaliBasin:
              item?.heavyRainfallForecastInKarnaliBasin,
            hours24: item?.hours24,
            hours72: item?.hours72,
            hours168: item?.hours168,
            id: item?.id,
          });
          break;
        case 'NCMRWF Deterministic & Probabilistic':
          dataPayload.push({
            source: item.source,
            extremeWeatherOutlook: item?.extremeWeatherOutlook,
            deterministicsPredictionSystem:
              item?.deterministicsPredictionSystem,
            probabilisticPredictionSystem: item?.probabilisticPredictionSystem,
            id: item?.id,
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
            id: item?.id,
          });
          break;
        case 'Flash Flood Risk Monitoring':
          dataPayload.push({
            source: item.source,
            status: item?.status,
            id: item?.id,
          });
          break;

        case 'Gauge Reading':
          dataPayload.push({
            source: item.source,
            gaugeReading: item?.gaugeReading,
            station: item?.station,
            id: item?.id,
          });
          break;
        default:
          break;
      }
    }
    const payload = {
      uuid: monitoringId,
      dataEntryBy: data.dataEntryBy,
      riverBasin: data.riverBasin,
      data: dataPayload,
    };
    try {

      await updateDailyMonitoring.mutateAsync({
        projectUUID: projectId,
        monitoringPayload: payload,
      });



      route.push(`/projects/aa/${projectId}/data-sources?tab=dailyMonitoring`);



    } catch (e) {
      console.error('Edit Daily Monitoring Error::', e);
    }
  };

  React.useEffect(() => {
    if (data?.data?.length > 0) {
      form.reset({
        dataEntryBy: data?.data?.[0].dataEntryBy,
        riverBasin: data?.data?.[0]?.riverBasin,
        dataSource: normalizedDataSource,
      });
    }
  }, [data?.data]);

  const handleRemove = (data: any) => {
    console.log('Closing item:', data);
    removeDailyMonitoringWhileUpdating.mutate({
      projectUUID: projectId,
      removePayload: {
        uuid: monitoringId,
        id: data.id,
      },
    });
  };
  return isLoading ? (
    <Loader />
  ) : (
    <div className="px-4 py-2">
      <HeaderWithBack
        title={'Edit Daily Monitoring'}
        subtitle="Edit the form below  to update daily monitoring"


        path={`/projects/aa/${projectId}/data-sources?tab=dailyMonitoring`}

      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleEditDailyMonitoring)}>
          <ScrollArea className="h-[calc(100vh-240px)]">
            <div className="grid grid-cols-2 gap-4">
              <InputFormField
                form={form}
                name="dataEntryBy"
                label="Created By"
                placeholder="Enter Data Entry Personnel"
              />
              <SelectFormField
                key={form.watch('riverBasin')}
                form={form}
                name="riverBasin"
                label="River Basin"
                placeholder="Select river basin"
                selectItems={riverBasins}
              />
            </div>
            {anotherDataSourceFields.map((k, index) => (
              <AddAnotherDataSource
                key={index}
                form={form}
                index={index}
                onClose={() => {
                  handleRemove(form.getValues(`dataSource.${index}`));
                  anotherDataSourceRemove(index);
                }}
              />
            ))}

            <Button
              type="button"
              variant="outline"
              className="border-dashed border-primary text-primary text-sm w-full mt-4"
              onClick={() => anotherDataSourceAppend(anotherDataSourceSchema)}
            >
              Add Data Source
              <Plus className="ml-2" size={16} strokeWidth={3} />
            </Button>
          </ScrollArea>

          <div className="flex justify-end w-full gap-2 mt-0">
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
        </form>
      </Form>
    </div>
  );
}

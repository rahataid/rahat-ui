import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Form } from '@rahat-ui/shadcn/src/components/ui/form';
import { useParams, useRouter } from 'next/navigation';
import * as React from 'react';

import { useCreateDailyMonitoring } from '@rahat-ui/query';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { HeaderWithBack } from 'apps/rahat-ui/src/common';
import { UUID } from 'crypto';
import { Plus } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import SelectFormField from '../select.form.field';
import { useSelectItems } from '../useSelectItems';
import AddAnotherDataSource from './add.another.data.source';

export default function AddDailyMonitoring() {
  const params = useParams();
  const projectId = params.id as UUID;
  const router = useRouter();

  const dailyMonitoringListPath = `/projects/aa/${projectId}/data-sources?tab=dailyMonitoring`;

  const { riverBasins } = useSelectItems();

  const createDailyMonitoring = useCreateDailyMonitoring();

  const anotherDataSourceSchema = {
    source: '',
  };

  const FormSchema = z.object({
    riverBasin: z.string().min(1, { message: 'Please select river basin.' }),
    dataSource: z.array(
      z.object({
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
      riverBasin: '',
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

  const handleCreateBulletin = async (data: z.infer<typeof FormSchema>) => {
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
              });
              break;
            case 'Realtime Monitoring (River Watch)':
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
        case 'NCMRWF Accumulated':
          dataPayload.push({
            source: item.source,
            heavyRainfallForecastInKarnaliBasin:
              item?.heavyRainfallForecastInKarnaliBasin,
            hours24: item?.hours24,
            hours72: item?.hours72,
            hours168: item?.hours168,
          });
          break;
        case 'NCMRWF Deterministic & Probabilistic':
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
          break;
        case 'Gauge Reading':
          dataPayload.push({
            source: item.source,
            gaugeReading: item?.gaugeReading,
            station: item?.station,
          });
          break;
        default:
          break;
      }
    }
    const payload = {
      riverBasin: data.riverBasin,
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
      router.push(dailyMonitoringListPath);
    }
  }, [createDailyMonitoring.isSuccess]);

  return (
    <div className="px-4 py-2">
      <HeaderWithBack
        title={'Add Daily Monitoring'}
        subtitle="Fill the form below  to add daily monitoring"
        path={`/projects/aa/${projectId}/data-sources?tab=dailyMonitoring`}
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleCreateBulletin)}>
          <ScrollArea className="h-[calc(100vh-240px)]">
            <div className="grid grid-cols-2 gap-4">
              <SelectFormField
                form={form}
                name="riverBasin"
                label="River Basin"
                placeholder="Select river basin"
                selectItems={riverBasins}
                className="mx-2"
              />
            </div>
            {anotherDataSourceFields.map((_, index) => (
              <AddAnotherDataSource
                key={index}
                form={form}
                index={index}
                onClose={() => {
                  anotherDataSourceRemove(index);
                }}
              />
            ))}
            <Button
              type="button"
              variant="outline"
              className="border-dashed border-primary text-primary text-sm w-full mt-2"
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
                router.push(dailyMonitoringListPath);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" className="w-32">
              Add
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

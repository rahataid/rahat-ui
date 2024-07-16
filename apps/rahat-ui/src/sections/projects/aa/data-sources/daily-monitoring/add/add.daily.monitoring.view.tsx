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
  PROJECT_SETTINGS_KEYS,
  // PROJECT_SETTINGS_KEYS,
  // useProjectSettingsStore,
  useCreateDailyMonitoring,
  useProjectSettingsStore,
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

  const dailyMonitoringListPath = `/projects/aa/${projectId}/data-sources/#monitoring`;

  const dataSourceSettings = useProjectSettingsStore(
    (s) => s.settings?.[projectId]?.[PROJECT_SETTINGS_KEYS.DATASOURCE],
  );
  const selectedRiverBasin = dataSourceSettings?.dhm?.location;

  const { riverBasins } = useSelectItems();

  const createDailyMonitoring = useCreateDailyMonitoring();

  const anotherDataSourceSchema = {
    source: '',
  };

  const FormSchema = z.object({
    dataEntryBy: z.string().min(2, { message: 'Please enter name.' }),
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
        //DHM - Realtime Rainfall
        chisapaniKarnali: z.string().optional(),
        daulatpurStation: z.string().optional(),
        bachilaStation: z.string().optional(),
        gurbaDurbar: z.string().optional(),
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
      }),
    ),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      dataEntryBy: '',
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
            case 'Realtime Rainfall':
              dataPayload.push({
                chisapaniKarnali: item.chisapaniKarnali,
                daulatpurStation: item.daulatpurStation,
                bachilaStation: item.bachilaStation,
                gurbaDurbar: item.gurbaDurbar,
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
        default:
          break;
      }
    }
    const payload = {
      dataEntryBy: data.dataEntryBy,
      // location: selectedRiverBasin,
      location: data.riverBasin,
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
                    placeholder="Enter Data Entry Personnel"
                  />
                  {/* <FormItem>
                    <FormLabel>River Basin</FormLabel>
                    <Input
                      value={selectedRiverBasin}
                      placeholder="Select data source to display river basin"
                      disabled
                    />
                  </FormItem> */}
                  <SelectFormField
                    form={form}
                    name="riverBasin"
                    label="River Basin"
                    placeholder="Select river basin"
                    selectItems={riverBasins}
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
                  className="border-dashed border-primary text-primary text-sm w-full mt-4"
                  onClick={() =>
                    anotherDataSourceAppend(anotherDataSourceSchema)
                  }
                >
                  Add Data Source
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
                    router.push(dailyMonitoringListPath);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" className="w-32">
                  Add
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </form>
    </Form>
  );
}

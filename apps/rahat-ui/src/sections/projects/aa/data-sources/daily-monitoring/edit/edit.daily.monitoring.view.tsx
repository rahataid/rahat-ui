import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Form } from '@rahat-ui/shadcn/src/components/ui/form';
import { useTranslations } from 'next-intl';

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
import { useSingleMonitoring, useUpdateMonitoring } from '@rahat-ui/query';
import { Plus } from 'lucide-react';
import AddAnotherDataSource from '../add/add.another.data.source';
import SelectFormField from '../../../../../../components/select.form.field';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import InputFormField from '../../../../../../components/input.form.field';
import { useSelectItems } from '../useSelectItems';
import Loader from 'apps/rahat-ui/src/components/table.loader';
import { normalizeNumeralsPreprocessor } from 'apps/rahat-ui/src/utils/i18n/numeral';

const numeralString = () =>
  z.preprocess(normalizeNumeralsPreprocessor, z.string().optional());

export default function EditDailyMonitoring() {
  const t = useTranslations('AA_PROJECT');
  const tg = useTranslations('GLOBAL');
  const params = useParams();
  const projectId = params.id as UUID;
  const monitoringId = params.monitoringId as UUID;
  const router = useRouter();

  const { riverBasins } = useSelectItems();
  const { data, isLoading } = useSingleMonitoring(projectId, monitoringId);
  const details = React.useMemo(() => {
    return data?.data?.singleData;
  }, [data]);

  const updateDailyMonitoring = useUpdateMonitoring();

  const anotherDataSourceSchema = {
    source: '',
  };

  const FormSchema = z.object({
    dataEntryBy: z.string().min(2, { message: t('PLEASE_ENTER_NAME') }),
    riverBasin: z.string().min(1, { message: t('PLEASE_SELECT_RIVER_BASIN') }),
    dataSource: z.array(
      z.object({
        source: z.string().min(1, { message: t('PLEASE_SELECT_A_SOURCE') }),
        //DHM
        forecast: z.string().optional(),
        //DHM - 3 Days Flood Forecast Bulletin
        today: numeralString(),
        tomorrow: numeralString(),
        dayAfterTomorrow: numeralString(),
        //DHM - 3 Days Rainfall Forecast Bulletin
        todayAfternoon: numeralString(),
        todayNight: numeralString(),
        tomorrowAfternoon: numeralString(),
        tomorrowNight: numeralString(),
        dayAfterTomorrowAfternoon: numeralString(),
        dayAfterTomorrowNight: numeralString(),
        //DHM - Realtime Monitoring (River Watch)
        waterLevel: numeralString(),
        //DHM - Realtime Rainfall
        chisapaniKarnali: numeralString(),
        daulatpurStation: numeralString(),
        bachilaStation: numeralString(),
        gurbaDurbar: numeralString(),
        //DHM - NWP
        hours24NWP: numeralString(),
        hours48: numeralString(),
        hours72NWP: numeralString(),
        // NCMRWF Accumulated
        heavyRainfallForecastInKarnaliBasin: numeralString(),
        hours24: numeralString(),
        hours72: numeralString(),
        hours168: numeralString(),
        // NCMRWF Deterministic & Probabilistic
        extremeWeatherOutlook: numeralString(),
        deterministicsPredictionSystem: numeralString(),
        probabilisticPredictionSystem: numeralString(),
        // GLOFAS
        todayGLOFAS: numeralString(),
        days3: numeralString(),
        days5: numeralString(),
        inBetweenTodayUntil7DaysIsThereAnyPossibilityOfPeak: numeralString(),
        //Flash Flood Risk Monitoring
        status: z.string().optional(),
      }),
    ),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      dataEntryBy: details?.dataEntryBy || '',
      riverBasin: details?.location || '',
      dataSource: details?.monitoringData || [],
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
      uuid: monitoringId,
      dataEntryBy: data.dataEntryBy,
      location: data.riverBasin,
      data: dataPayload,
    };
    try {
      await updateDailyMonitoring.mutateAsync({
        projectUUID: projectId,
        monitoringPayload: payload,
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
              <CardTitle className="text-lg">{t('EDIT_DAILY_MONITORING')}</CardTitle>
            </CardHeader>
            <ScrollArea className="h-[calc(100vh-238px)]">
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <InputFormField
                    form={form}
                    name="dataEntryBy"
                    label={tg('CREATED_BY')}
                    placeholder={t('ENTER_DATA_ENTRY_PERSONNEL')}
                  />
                  <SelectFormField
                    form={form}
                    name="riverBasin"
                    label={t('RIVER_BASIN')}
                    placeholder={t('SELECT_RIVER_BASIN2')}
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

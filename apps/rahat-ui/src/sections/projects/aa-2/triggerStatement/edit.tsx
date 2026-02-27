import React from 'react';
import { Back, Heading, TableLoader } from 'apps/rahat-ui/src/common';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { AutomatedTriggerAddForm, ManualTriggerAddForm } from './components';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  useSingleTriggerStatement,
  useUpdateTriggerStatement,
  useGetDataSourceTypes,
} from '@rahat-ui/query';
import { useParams, useRouter } from 'next/navigation';
import { UUID } from 'crypto';
import { capitalizeFirstLetter } from 'apps/rahat-ui/src/utils';
import LoaderRahat from 'apps/rahat-ui/src/components/LoaderRahat';
import { buildSourceOptions, buildSubtypeOptions, SourceConfig } from './utils';

export default function EditTrigger() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as UUID;
  const pathSegments = new URL(window.location.href).pathname.split('/');
  const triggerIndex = pathSegments.indexOf('trigger-statements');
  const triggerRepeatKey = pathSegments[triggerIndex + 1];

  const triggerDetailPage = `/projects/aa/${projectId}/trigger-statements/${triggerRepeatKey}`;
  const { data: trigger, isLoading } = useSingleTriggerStatement(
    projectId,
    triggerRepeatKey,
  );

  const { data: dataSourceTypes, isLoading: isLoadingDataSourceTypes } =
    useGetDataSourceTypes(projectId);
  const SOURCES =
    dataSourceTypes?.value || ({} as Record<string, SourceConfig>);
  const sourceOptions = buildSourceOptions(SOURCES);
  const subTypeOptions = buildSubtypeOptions(SOURCES);

  const triggerType = trigger?.source === 'MANUAL' ? 'manual' : 'automated';

  const updateTrigger = useUpdateTriggerStatement();

  const ManualFormSchema = z.object({
    title: z.string().min(2, { message: 'Please enter trigger title' }),
    isMandatory: z.boolean().optional(),
    description: z.string().optional(),
  });

  const manualForm = useForm<z.infer<typeof ManualFormSchema>>({
    resolver: zodResolver(ManualFormSchema),
    defaultValues: {
      title: '',
      isMandatory: false,
      description: '',
    },
  });

  const AutomatedFormSchema = z
    .object({
      title: z.string().min(2, { message: 'Please enter trigger title' }),
      description: z.string().optional(),
      source: z.string().min(1, { message: 'Please select data source' }),
      isMandatory: z.boolean().optional(),
      triggerStatement: z
        .object({
          source: z.string().optional(),
          sourceSubType: z.string().optional(),
          stationId: z.string().optional(),
          stationName: z.string().optional(),
          operator: z.string().optional(),
          value: z.coerce.number().optional(),
          expression: z.string().optional(),
        })
        .optional(),
      minLeadTimeDays: z.string().optional(),
      maxLeadTimeDays: z.string().optional(),
      probability: z.string().optional(),
      warningLevel: z.string().optional(),
      dangerLevel: z.string().optional(),
      forecast: z.string().optional(),
      daysToConsiderPrior: z.string().optional(),
      forecastStatus: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      if (data.source === 'DHM' && trigger?.phase?.name === 'ACTIVATION') {
        if (!data.dangerLevel || data.dangerLevel.trim() === '') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['dangerLevel'],
            message: 'Danger Level is required',
          });
        } else if (
          isNaN(Number(data.dangerLevel)) ||
          Number(data.dangerLevel) <= 0
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['dangerLevel'],
            message: 'Danger Level must be a positive number',
          });
        }
      }
      if (data.source === 'DHM' && trigger?.phase?.name === 'READINESS') {
        if (!data.warningLevel || data.warningLevel.trim() === '') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['warningLevel'],
            message: 'Warning Level is required',
          });
        } else if (
          isNaN(Number(data.warningLevel)) ||
          Number(data.warningLevel) <= 0
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['warningLevel'],
            message: 'Warning Level must be a positive number',
          });
        }
      }

      if (
        data.source === 'DAILY_MONITORING' &&
        (trigger?.phase?.name === 'ACTIVATION' ||
          trigger?.phase?.name === 'READINESS')
      ) {
        if (!data.forecast || data.forecast.toString().trim() === '') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['forecast'],
            message: 'Forecast is required',
          });
        }

        if (
          !data.daysToConsiderPrior ||
          data.daysToConsiderPrior.toString().trim() === ''
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['daysToConsiderPrior'],
            message: 'Days To Consider Prior is required',
          });
        } else if (
          isNaN(Number(data.daysToConsiderPrior)) ||
          Number(data.daysToConsiderPrior) <= 0
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['daysToConsiderPrior'],
            message: 'Days To Consider Prior must be a positive number',
          });
        }

        if (
          !data.forecastStatus ||
          data.forecastStatus.toString().trim() === ''
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['forecastStatus'],
            message: 'forecast Status is required',
          });
        }
      }

      if (
        data.source === 'GLOFAS' &&
        (trigger?.phase?.name === 'ACTIVATION' ||
          trigger?.phase?.name === 'READINESS')
      ) {
        if (
          !data.maxLeadTimeDays ||
          data.maxLeadTimeDays.toString().trim() === ''
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['maxLeadTimeDays'],
            message: 'Max Lead TimeDays is required',
          });
        } else if (
          isNaN(Number(data.maxLeadTimeDays)) ||
          Number(data.maxLeadTimeDays) <= 0
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['maxLeadTimeDays'],
            message: 'Max Lead Time Days must be a positive number',
          });
        }

        if (
          !data.minLeadTimeDays ||
          data.minLeadTimeDays.toString().trim() === ''
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['minLeadTimeDays'],
            message: 'Min Lead Time Days is required',
          });
        } else if (
          isNaN(Number(data.minLeadTimeDays)) ||
          Number(data.minLeadTimeDays) <= 0
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['minLeadTimeDays'],
            message: 'Min Lead Time Days must be a positive number',
          });
        }

        if (!data.probability || data.probability.toString().trim() === '') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['probability'],
            message: 'Forecast probability is required',
          });
        } else if (
          isNaN(Number(data.probability)) ||
          Number(data.probability) <= 0
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['probability'],
            message: 'Forecast probability must be a positive number',
          });
        }
      }
    });

  const automatedForm = useForm<z.infer<typeof AutomatedFormSchema>>({
    resolver: zodResolver(AutomatedFormSchema),
    defaultValues: {
      title: '',
      description: '',
      source: '',
      isMandatory: false,
      triggerStatement: {
        source: '',
        sourceSubType: '',
        stationId: '',
        stationName: '',
        operator: undefined,
        value: undefined,
        expression: '',
      },
      maxLeadTimeDays: '',
      minLeadTimeDays: '',
      probability: '',
      warningLevel: '',
      dangerLevel: '',
      forecast: '',
      daysToConsiderPrior: '',
      forecastStatus: '',
    },
  });

  const handleSubmitManualTrigger = async (
    data: z.infer<typeof ManualFormSchema>,
  ) => {
    handleUpdate(data);
  };

  const handleSubmitAutomatedTrigger = async (
    data: z.infer<typeof AutomatedFormSchema>,
  ) => {
    handleUpdate(data);
  };

  const handleUpdate = async (data: any) => {
    const payload = {
      title: data.title,
      source: data?.source.split(':')[0].toUpperCase(),
      description: data.description,
      triggerStatement: data.triggerStatement,
      phaseId: trigger?.phaseId,
      uuid: trigger?.uuid,
      isMandatory: !data?.isMandatory,
    };
    await updateTrigger.mutateAsync({
      projectUUID: projectId,
      triggerUpdatePayload: payload,
    });
    router.push(triggerDetailPage);
  };

  const handleEditTriggers = () => {
    const formHandlers: { [key in 'manual' | 'automated']: () => void } = {
      manual: () => {
        manualForm.handleSubmit(handleSubmitManualTrigger)();
      },
      automated: () => {
        automatedForm.handleSubmit(handleSubmitAutomatedTrigger)();
      },
    };

    formHandlers[triggerType as 'manual' | 'automated']?.();
  };
  React.useEffect(() => {
    if (triggerType === 'manual') {
      manualForm.reset({
        title: trigger?.title,
        description: trigger?.description,
        isMandatory: !trigger?.isMandatory,
      });
    } else if (triggerType === 'automated') {
      const triggerSource = trigger?.triggerStatement?.source;
      const REVERSE_SOURCE_MAPPING: Record<string, string> = {
        water_level_m: 'dhm:waterlevel',
        rainfall_mm: 'dhm:rainfall',
        prob_flood: 'glofas',
        discharge_m3s: 'gfh',
      };
      const formSource =
        REVERSE_SOURCE_MAPPING[triggerSource] ||
        trigger?.source?.toLowerCase() ||
        '';

      automatedForm.reset({
        title: trigger?.title,
        source: formSource,
        isMandatory: !trigger?.isMandatory,
        description: trigger?.description || '',
        triggerStatement: {
          source: trigger?.triggerStatement?.source || '',
          sourceSubType: trigger?.triggerStatement?.sourceSubType || '',
          stationId: trigger?.triggerStatement?.stationId?.toString() || '',
          stationName: trigger?.triggerStatement?.stationName || '',
          operator: trigger?.triggerStatement?.operator || undefined,
          value: trigger?.triggerStatement?.value || undefined,
          expression: trigger?.triggerStatement?.expression || '',
        },
        maxLeadTimeDays: trigger?.triggerStatement?.maxLeadTimeDays,
        minLeadTimeDays: trigger?.triggerStatement?.minLeadTimeDays,
        probability: trigger?.triggerStatement?.probability,
        warningLevel: trigger?.triggerStatement?.warningLevel,
        dangerLevel: trigger?.triggerStatement?.dangerLevel,
        forecast: trigger?.triggerStatement?.forecast,
        daysToConsiderPrior: trigger?.triggerStatement?.daysToConsiderPrior,
        forecastStatus: trigger?.triggerStatement?.forecastStatus,
      });
    }
  }, [trigger, triggerType, manualForm, automatedForm]);

  if (isLoading || isLoadingDataSourceTypes) {
    return <LoaderRahat />;
  }

  return (
    <>
      <div className={'p-4'}>
        <Back />
        <Heading
          title={`Edit ${capitalizeFirstLetter(triggerType || '')} Trigger`}
          description=""
        />
        <div className="px-4 pb-4 border rounded shadow">
          {triggerType === 'automated' ? (
            <AutomatedTriggerAddForm
              form={automatedForm}
              phase={{
                name: trigger?.phase?.name,
                riverBasin: trigger?.phase?.source?.riverBasin,
              }}
              isEditing={true}
              sourceOptions={sourceOptions}
              subTypeOptions={subTypeOptions}
            />
          ) : (
            <ManualTriggerAddForm
              form={manualForm}
              phase={{
                name: trigger?.phase?.name,
                riverBasin: trigger?.phase?.source?.riverBasin,
              }}
            />
          )}
          <div className="flex justify-end mt-4">
            <Button
              type="button"
              variant="outline"
              className="w-40 mr-2"
              onClick={() => {
                if (triggerType === 'automated') {
                  automatedForm.reset();
                } else {
                  manualForm.reset();
                }

                // router.push(triggerDetailPage);
              }}
            >
              Reset
            </Button>
            <Button
              type="submit"
              className="w-40 mr-2"
              onClick={handleEditTriggers}
              disabled={updateTrigger?.isPending}
            >
              Update
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

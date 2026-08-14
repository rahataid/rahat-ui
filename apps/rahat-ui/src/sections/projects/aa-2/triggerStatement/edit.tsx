import React from 'react';
import { Back, Heading } from 'apps/rahat-ui/src/common';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { AutomatedTriggerAddForm, ManualTriggerAddForm } from './components';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  useSingleTriggerStatement,
  useUpdateTriggerStatement,
  useGetDataSourceTypes,
  useProjectInfo,
} from '@rahat-ui/query';
import { useParams, useRouter } from 'next/navigation';
import { UUID } from 'crypto';
import { capitalizeFirstLetter } from 'apps/rahat-ui/src/utils';
import LoaderRahat from 'apps/rahat-ui/src/components/LoaderRahat';
import {
  buildSourceOptions,
  buildSubtypeOptions,
  SourceConfig,
  REVERSE_SOURCE_MAPPING,
  GLOFAS_LEGACY_MAPPING,
} from './utils';
import { buildTriggerStatementSchema } from './trigger.statement.schema';
import { getStationTitle } from 'apps/rahat-ui/src/utils/getStationTitle';
import { useTranslations } from 'next-intl';
import { normalizeNumeralsPreprocessor } from 'apps/rahat-ui/src/utils/i18n/numeral';

const numeralString = () =>
  z.preprocess(normalizeNumeralsPreprocessor, z.string().optional());

export default function EditTrigger() {
  const t = useTranslations('AA_PROJECT');
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

  const { data: projectInfo } = useProjectInfo(projectId as UUID);
  const stationHeading = getStationTitle(
    projectInfo?.value?.project_type || '',
    t,
  );

  const { data: dataSourceTypes, isLoading: isLoadingDataSourceTypes } =
    useGetDataSourceTypes(projectId);
  const SOURCES =
    dataSourceTypes?.value || ({} as Record<string, SourceConfig>);
  const sourceOptions = buildSourceOptions(SOURCES, t);
  const subTypeOptions = buildSubtypeOptions(SOURCES);

  const triggerType = trigger?.source === 'MANUAL' ? 'manual' : 'automated';

  const updateTrigger = useUpdateTriggerStatement();

  const ManualFormSchema = z.object({
    title: z.string().min(2, { message: t('PLEASE_ENTER_TRIGGER_TITLE') }),
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
      title: z.string().min(2, { message: t('PLEASE_ENTER_TRIGGER_TITLE') }),
      description: z.string().optional(),
      source: z.string().min(1, { message: t('PLEASE_SELECT_DATA_SOURCE') }),
      isMandatory: z.boolean().optional(),
      triggerStatement: buildTriggerStatementSchema(t),
      minLeadTimeDays: numeralString(),
      maxLeadTimeDays: numeralString(),
      probability: numeralString(),
      warningLevel: numeralString(),
      dangerLevel: numeralString(),
      forecast: z.string().optional(),
      daysToConsiderPrior: numeralString(),
      forecastStatus: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      if (data.source === 'DHM' && trigger?.phase?.name === 'ACTIVATION') {
        if (!data.dangerLevel || data.dangerLevel.trim() === '') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['dangerLevel'],
            message: t('DANGER_LEVEL_IS_REQUIRED'),
          });
        } else if (
          isNaN(Number(data.dangerLevel)) ||
          Number(data.dangerLevel) <= 0
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['dangerLevel'],
            message: t('DANGER_LEVEL_POSITIVE_NUMBER'),
          });
        }
      }
      if (data.source === 'DHM' && trigger?.phase?.name === 'READINESS') {
        if (!data.warningLevel || data.warningLevel.trim() === '') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['warningLevel'],
            message: t('WARNING_LEVEL_IS_REQUIRED'),
          });
        } else if (
          isNaN(Number(data.warningLevel)) ||
          Number(data.warningLevel) <= 0
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['warningLevel'],
            message: t('WARNING_LEVEL_POSITIVE_NUMBER'),
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
            message: t('FORECAST_IS_REQUIRED'),
          });
        }

        if (
          !data.daysToConsiderPrior ||
          data.daysToConsiderPrior.toString().trim() === ''
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['daysToConsiderPrior'],
            message: t('DAYS_TO_CONSIDER_PRIOR_IS_REQUIRED'),
          });
        } else if (
          isNaN(Number(data.daysToConsiderPrior)) ||
          Number(data.daysToConsiderPrior) <= 0
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['daysToConsiderPrior'],
            message: t('DAYS_TO_CONSIDER_PRIOR_POSITIVE_NUMBER'),
          });
        }

        if (
          !data.forecastStatus ||
          data.forecastStatus.toString().trim() === ''
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['forecastStatus'],
            message: t('FORECAST_STATUS_IS_REQUIRED'),
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
            message: t('MAX_LEAD_TIME_DAYS_IS_REQUIRED'),
          });
        } else if (
          isNaN(Number(data.maxLeadTimeDays)) ||
          Number(data.maxLeadTimeDays) <= 0
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['maxLeadTimeDays'],
            message: t('MAX_LEAD_TIME_DAYS_POSITIVE_NUMBER'),
          });
        }

        if (
          !data.minLeadTimeDays ||
          data.minLeadTimeDays.toString().trim() === ''
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['minLeadTimeDays'],
            message: t('MIN_LEAD_TIME_DAYS_IS_REQUIRED'),
          });
        } else if (
          isNaN(Number(data.minLeadTimeDays)) ||
          Number(data.minLeadTimeDays) <= 0
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['minLeadTimeDays'],
            message: t('MIN_LEAD_TIME_DAYS_POSITIVE_NUMBER'),
          });
        }

        if (!data.probability || data.probability.toString().trim() === '') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['probability'],
            message: t('FORECAST_PROBABILITY_IS_REQUIRED'),
          });
        } else if (
          isNaN(Number(data.probability)) ||
          Number(data.probability) <= 0
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['probability'],
            message: t('FORECAST_PROBABILITY_POSITIVE_NUMBER'),
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
        source: undefined,
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

  type ManualFormValues = z.infer<typeof ManualFormSchema>;
  type AutomatedFormValues = z.infer<typeof AutomatedFormSchema>;
  type TriggerFormValues = ManualFormValues | AutomatedFormValues;

  const isAutomatedFormData = (
    data: TriggerFormValues,
  ): data is AutomatedFormValues =>
    'source' in data && 'triggerStatement' in data;

  const buildUpdatePayload = (data: TriggerFormValues) => {
    const basePayload = {
      title: data.title,
      description: data.description,
      phaseId: trigger?.phaseId,
      uuid: trigger?.uuid,
      isMandatory: !data?.isMandatory,
    };

    if (!isAutomatedFormData(data)) {
      return basePayload;
    }

    return {
      ...basePayload,
      source: data.source.split(':')[0].toUpperCase(),
      triggerStatement: data.triggerStatement,
    };
  };

  const handleUpdate = async (data: TriggerFormValues) => {
    const payload = buildUpdatePayload(data);

    await updateTrigger.mutateAsync({
      projectUUID: projectId,
      triggerUpdatePayload: payload,
    });

    router.back();
  };

  const handleEditTriggers = () => {
    const submit =
      triggerType === 'automated'
        ? automatedForm.handleSubmit(handleUpdate)
        : manualForm.handleSubmit(handleUpdate);

    submit();
  };

  const getOriginalFormData = () => {
    if (triggerType === 'manual') {
      return {
        title: trigger?.title,
        description: trigger?.description,
        isMandatory: !trigger?.isMandatory,
      };
    } else {
      const triggerSource = trigger?.triggerStatement?.source;
      const formSource =
        REVERSE_SOURCE_MAPPING[triggerSource] ||
        trigger?.source?.toLowerCase() ||
        '';

      const rawSourceSubType = trigger?.triggerStatement?.sourceSubType || '';
      const correctedSourceSubType =
        triggerSource === 'prob_flood' &&
        rawSourceSubType in GLOFAS_LEGACY_MAPPING
          ? GLOFAS_LEGACY_MAPPING[rawSourceSubType]
          : rawSourceSubType;

      return {
        title: trigger?.title,
        source: formSource,
        isMandatory: !trigger?.isMandatory,
        description: trigger?.description || '',
        triggerStatement: {
          source: trigger?.triggerStatement?.source || '',
          sourceSubType: correctedSourceSubType,
          stationId: trigger?.triggerStatement?.stationId?.toString() || '',
          stationName: trigger?.triggerStatement?.stationName || '',
          operator: trigger?.triggerStatement?.operator || '',
          value: trigger?.triggerStatement?.value || '',
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
      };
    }
  };

  const handleReset = () => {
    const originalData = getOriginalFormData();
    if (triggerType === 'automated') {
      automatedForm.reset(originalData);
    } else {
      manualForm.reset(originalData);
    }
  };

  React.useEffect(() => {
    const originalData = getOriginalFormData();
    if (triggerType === 'manual') {
      manualForm.reset(originalData);
    } else if (triggerType === 'automated') {
      automatedForm.reset(originalData);
    }
  }, [trigger, triggerType]);

  if (isLoading || isLoadingDataSourceTypes) {
    return <LoaderRahat />;
  }

  return (
    <>
      <div className={'p-4'}>
        <Back />
        <Heading
          title={t('EDIT_TRIGGER', { type: capitalizeFirstLetter(triggerType || '') })}
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
              stationHeading={stationHeading}
              projectType={projectInfo?.value?.project_type}
            />
          ) : (
            <ManualTriggerAddForm
              form={manualForm}
              phase={{
                name: trigger?.phase?.name,
                riverBasin: trigger?.phase?.source?.riverBasin,
              }}
              stationHeading={stationHeading}
            />
          )}
          <div className="flex justify-end mt-4">
            <Button
              type="button"
              variant="outline"
              className="w-40 mr-2"
              onClick={handleReset}
            >
              {t('RESET')}
            </Button>
            <Button
              type="submit"
              className="w-40 mr-2"
              onClick={handleEditTriggers}
              disabled={updateTrigger?.isPending}
            >
              {t('UPDATE')}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
